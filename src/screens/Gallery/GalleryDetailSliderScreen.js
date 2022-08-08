import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, useWindowDimensions, Image, Platform, ActivityIndicator } from 'react-native';
import Styled from 'styled-components';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RNFetchBlob from 'react-native-blob-util';
import RNFS from 'react-native-fs';
import Modal from 'react-native-modal';

import {
    Button,
    Header,
    Loading, useLoading,
    Popup, usePopup,
    Scaffold,
    Submit,
    Text,
    TouchableOpacity,
    useColor,
    ScreenEmptyData
} from '@src/components';
import { ScrollView } from 'react-native-gesture-handler';
import { Container, Divider, Row } from 'src/styled';
import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import PagerView from 'react-native-pager-view';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const Item = ({
    title,
    subTitle,
    index,
    image,
    scrollOffsetAnimatedValue,
}) => {
    const { Color } = useColor();
    const {height, width} = useWindowDimensions();

    const inputRange = [0, 0.5, 0.99];
    const inputRangeOpacity = [0, 0.5, 0.99];
    const scale = scrollOffsetAnimatedValue.interpolate({
        inputRange,
        outputRange: [1, 0, 1],
    });

    const opacity = scrollOffsetAnimatedValue.interpolate({
        inputRange: inputRangeOpacity,
        outputRange: [1, 0, 1],
    });

    const [imageLoading, setImageLoading] = useState(true);

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 16,
        }}>
            <ReactNativeZoomableView
                maxZoom={2.5}
                minZoom={0.5}
                zoomStep={0.5}
                initialZoom={1}
                bindToBorders={true}
                onZoomAfter={() => {}}
                style={{}}
            >
                <Image
                    style={{ width, height, resizeMode: 'contain' }}
                    source={{ uri: image }}
                    onLoadEnd={() => setImageLoading(false)}
                />
                {imageLoading && <View
                    style={{ width, height, position: 'absolute', justifyContent: 'center', alignItems: 'center' }}
                >
                    <ActivityIndicator color={Color.primary} size='large' />
                    <Divider height={8} />
                    <Text>Memuat Gambar</Text>
                </View>}
                {/* <Animated.Image
                    source={{ uri: image }}
                    style={[
                        {
                            width,
                            height,
                            resizeMode: 'contain',
                        },
                        {
                            transform: [{ scale }],
                        },
                    ]}
                    onLoadEnd={() => setImageLoading(false)}
                /> */}
            </ReactNativeZoomableView>
        </View>
    );
};

const GalleryDetailSliderScreen = ({ navigation, route }) => {
    const { data, selectedIndex } = route.params;

    const [listing, setListing] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [indexPosition, setIndexPosition] = useState(selectedIndex);

    useEffect(() => {
        setIndexPosition(selectedIndex);
        if (pagerViewRef.current) pagerViewRef.current.setPage(selectedIndex + 1);
    }, [selectedIndex]);

    console.log('selectedIndex', selectedIndex);

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading] = useLoading();
    const { Color } = useColor();
    const { width, height } = useWindowDimensions();

    const pagerViewRef = useRef();

    const fetchGetListing = (id) => {
        const variables = {
            // productType: '',
            // productCategory: '',
            // productSubCategory: '',
            parentProductId: id,
        };

        Client.query({
            query: queryContentProduct,
            variables,
        })
        .then((res) => {
            console.log('res listing gallery', res);
            const data = res.data.contentProduct;
            if (Array.isArray(data)) {
                setListing(data);
            }

            setIsLoading(false);
        })
        .catch((err) => {
            console.log('err listing gallery', err);
            setIsLoading(false);
        })
    }

    const onSaveToGallery = async() => {
        const imageName = data[indexPosition].image;
        const splitImg = imageName.split('/');
        const imgName = splitImg[splitImg.length - 1];

        const { config, fs } = RNFetchBlob;
        let { PictureDir, DownloadDir } = fs.dirs;

        const path = (Platform.OS === 'ios' ? DownloadDir : PictureDir) + "/" + imgName;
        
        const isExist = await RNFS.exists(path);

        console.log('isExist', isExist);

        if (isExist) {
            RNFetchBlob.ios.openDocument(path);
            RNFetchBlob.android.actionViewIntent(path);
            return;
        }
        
        let options = {
            fileCache: true,
            addAndroidDownloads: {
              useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
              path,
              notification: true,
              description: 'Downloading image',
            },
            path,
            notification: true,
        }
        
        config(options).fetch('GET', imageName).then((res) => {
            console.log('res download', res);
            RNFetchBlob.ios.openDocument(res.data);
            RNFetchBlob.android.actionViewIntent(res.path());
        })
        .catch((err) => {
            console.log('err download', err);
        });
    }

    const scrollOffsetAnimatedValue = useRef(new Animated.Value(0)).current;
    const positionAnimatedValue = useRef(new Animated.Value(0)).current;

    return (
        <Scaffold
            header={
                <Header
                    title=''
                    actions={
                        <TouchableOpacity
                            onPress={() => {
                                onSaveToGallery();
                            }}
                            style={{alignItems: 'flex-end'}}
                        >
                            <AntDesign
                                name='save'
                                size={24}
                            />
                        </TouchableOpacity>
                    }
                />
            }
            fallback={isLoading}
            empty={false}
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
            <AnimatedPagerView
                ref={pagerViewRef}
                initialPage={selectedIndex}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPageScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                offset: scrollOffsetAnimatedValue,
                                position: positionAnimatedValue,
                            },
                        },
                    ],
                    {
                        listener: ({ nativeEvent: { offset, position } }) => {
                            setIndexPosition(position);
                        },
                        useNativeDriver: true,
                    }
                )}
            >
                {data.map((item, index) => (
                    <View
                        key={index}
                        collapsable={false}
                        style={{
                            flex: 1,
                        }}
                    >
                        <Item
                            index={index}
                            {...item}
                            scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
                            positionAnimatedValue={positionAnimatedValue}
                        />
                    </View>
                ))}
            </AnimatedPagerView>

            <Text>{indexPosition + 1} / {data.length}</Text>
        </Scaffold>
    )
}

export default GalleryDetailSliderScreen;