import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, useWindowDimensions, Image, Platform, ActivityIndicator } from 'react-native';
import Styled from 'styled-components';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RNFetchBlob from 'react-native-blob-util';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';

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
import { NewVideoPlayerAndroid } from 'src/components/NewVideoPlayerAndroid';

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
                    // actions={
                    //     <TouchableOpacity
                    //         onPress={() => {
                    //             onSaveToGallery();
                    //         }}
                    //     >
                    //         <AntDesign
                    //             name='save'
                    //             size={24}
                    //             // onPress={() => navigation.navigate('CardDetailForum')}
                    //         />
                    //     </TouchableOpacity>
                    // }
                />
            }
            fallback={isLoading}
            empty={false}
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
            <View
                collapsable={false}
                style={{
                    flex: 1,
                }}>
                    {params.type == 'video' ? (
                      <NewVideoPlayerAndroid
                        item={{
                          videoFileName: params.video,
                          image: params.image,
                          widthVideo: width,
                          heightVideo: height - width * 0.128 - 24,
                        }}
                        hideOnError
                        autoplay={true}
                      />
                    ) : (
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
                    )}
            </View>
        </Scaffold>
    )
}

export default GalleryDetailScreen;