import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, useWindowDimensions, Image, Platform } from 'react-native';
import Styled from 'styled-components';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RNFetchBlob from 'react-native-blob-util';
import RNFS from 'react-native-fs';

import {
    Button,
    Header,
    Loading, useLoading,
    ModalListAction,
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
// import HtmlView from 'src/components/HtmlView';

const GalleryDetailScreen = ({ navigation, route }) => {
    const { params } = route;

    const [listing, setListing] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const splitImg = params.image.split('/');
    const [imgName, setImgName] = useState(splitImg[splitImg.length - 1]);

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading] = useLoading();
    const { Color } = useColor();
    const { width, height } = useWindowDimensions();

    const ref = useRef();

    useEffect(() => {
        // fetchGetListing(params.id);
    }, []);

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
        
        config(options).fetch('GET', params.image).then((res) => {
            console.log('res download', res);
            RNFetchBlob.ios.openDocument(res.data);
            RNFetchBlob.android.actionViewIntent(res.path());
        })
        .catch((err) => {
            console.log('err download', err);
        });
    }

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
                        >
                            <AntDesign
                                name='save'
                                size={24}
                                // onPress={() => navigation.navigate('CardDetailForum')}
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
                    style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                    source={{ uri: params.image }}
                />
            </ReactNativeZoomableView>

            {/* <FlatList
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={
                    <Container marginBottom={16}>
                        {params.image !== null && <Image
                            source={{uri: params.image}}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                aspectRatio: 3/1,
                                backgroundColor: Color.border,
                            }}
                        />}

                        <Container
                            width='100%'
                            color={Color.primaryDark}
                            style={{position: 'absolute', aspectRatio: 3/1, opacity: 0.7}}
                        />

                        <Container
                            width='100%'
                            style={{aspectRatio: 3/1}}
                            justify='center'
                        >
                            <Text color={Color.textInput} size={30} type='bold'>
                                Banner
                            </Text>
                        </Container>

                        {listing.length === 0 &&
                            <Container height={height / 2}>
                                <ScreenEmptyData transparent message='Data belum tersedia' />
                            </Container>
                        }
                    </Container>
                }
                data={listing}
                renderItem={({ item, index }) => {
                    return (
                        <Container width={width} padding={16}>
                            <Image
                                source={{uri: item.image}}
                                style={{
                                    width: '100%',
                                    aspectRatio: 3/2,
                                    borderRadius: 20,
                                    backgroundColor: Color.primaryDark,
                                }}
                            />
                            
                            <Divider height={8} />

                            <Text align='left' type='bold' size={16} color={Color.textInput}>
                                {item.productName}
                            </Text>

                            <Divider height={8} />
                        </Container>
                    )
                }}
            /> */}
        </Scaffold>
    )
}

export default GalleryDetailScreen;