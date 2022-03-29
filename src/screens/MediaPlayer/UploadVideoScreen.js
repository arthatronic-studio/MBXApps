import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TextInput, Modal, Image, Keyboard, BackHandler, useWindowDimensions } from 'react-native';
import Styled from 'styled-components';
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import { RNFFmpeg, RNFFprobe, RNFFmpegConfig } from 'react-native-ffmpeg';
// import ImageCropPicker from 'react-native-image-crop-picker';

import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import Header from '@src/components/Header';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
// import VideoViewScreen from '../VideoViewScreen';
import { Submit } from '@src/components/Button';
import validate from './ValidateUpload';
// import GalleryPicker from '../GalleryPicker/GalleryPicker';
import Loading, { useLoading } from '@src/components/Modal/Loading';
import Popup, { usePopup } from '@src/components/Modal/Popup';
import { TouchSelect } from '@src/components/Form';
import ModalSelectStatus from '@src/components/Modal/ModalSelectStatus';

// import { getObjSubCategoryByCode } from '../../utils/rawSubCategory';
import { removeFilePath, uploadChunkActionsNoStateSave } from '@src/state/actions/upload';
// import { resizeRatio } from '../GalleryPicker/resize-ratio';

import Client from '@src/lib/apollo';
import { queryProductManage } from '@src/lib/query';
import { outputVideoCache, outputImageCache, getRawCodec } from '@src/utils/rawFFMPEG';
import { accessClient } from 'src/utils/access_client';
import { Scaffold } from 'src/components';
import { launchImageLibrary } from 'react-native-image-picker';

const MainView = Styled(View)`
    flex: 1;
`;

const LabelInput = Styled(View)`
  width: 100%;
  justifyContent: flex-start;
  alignItems: flex-start;
`;

const EmailRoundedView = Styled(View)`
  width: 100%;
  height: 40px;
  alignItems: flex-start;
  justifyContent: center;
  flexDirection: column;
`;

const CustomTextInput = Styled(TextInput)`
  width: 100%;
  height: 100%;
  fontFamily: Inter-Regular;
  backgroundColor: transparent;
  borderBottomWidth: 1px;
  borderColor: #666666;
  fontSize: 14px;
`;

const ErrorView = Styled(View)`
  width: 100%;
  paddingVertical: 4px;
  alignItems: flex-start;
`;

const UploadVideoScreen = ({ navigation, route }) => {
    const { width, height } = useWindowDimensions();
    const { Color } = useColor();

    const [userData, setUserData] = useState({
        code: '',
        name: '',
        image: '',
        price: 0,
        status: 'PUBLISH', // PUBLISH | DRAFT | PRIVATE | REMOVE
        method: 'INSERT', // UPDATE | DELETE
        type: accessClient.InitialCode,
        category: 'NEWEST_VIDEO', // route.params ? getObjSubCategoryByCode(route.params.uploadParams.subCategory).name : 'Semua',
        stream: '',
        description: '',
    });
    const [error, setError] = useState({
        name: null,
        image: null,
        stram: null,
        description: null,
    });
    const [modalVideoPicker, setModalVideoPicker] = useState(true);
    const [modalImagePicker, setModalImagePicker] = useState(false);
    const [uriVideo, setUriVideo] = useState('');
    const [sizeVideo, setSizeVideo] = useState({width, height: width * 0.6});
    const [thumbImage, setThumbImage] = useState('');
    const [mimeImage, setMimeImage] = useState('image/jpeg');
    const [processingVideo, setProcessingVideo] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState({
        label: 'Publik', value: 'PUBLISH', iconName: 'globe'
    });
    const [compressPercentage, setCompressPercentage] = useState(0);
    
    // ref
    const totalDuration = useRef(0);
    const modalSelectStatusRef = useRef();

    // hooks
    const [loadingProps, showLoading, hideLoading] = useLoading();
    const [popupProps, showPopup] = usePopup();

    const dispatch = useDispatch();
    const uploadChunkState = useSelector(state => state.uploadChunkState);

    useEffect(() => {
        if (uploadChunkState.endUpload === true) {
            showLoading();

            let variables = {
                products: [{
                    name: userData.name,
                    price: userData.price,
                    status: userData.status,
                    method: 'COMPLETE_UPLOAD',
                    type: userData.type,
                    description: userData.description,
                    category: route.params.uploadParams.subCategory,
                    image: thumbImage,
                }],
            };

            if (route.params && route.params.item) {
                variables.products[0].parentProductId = route.params.item.id;
            }

            Client.query({
                query: queryProductManage,
                variables,
            })
            .then((res) => {
                resetManage();
    
                showLoading(
                    'success',
                    'Berhasil Mengupload',
                    () => {}
                );
                // navigation.navigate('ShowAllScreen', {
                //         title: 'Terbaru',
                //         subTitle: 'Semua Video',
                //         componentType: 'SHOW_ALL_VIDEO', //tergantung file
                //         productType: 'COACHING',
                //         popToTop: true
                //     }
                // )
            })
            .catch((err) => {
                console.log(err, 'errrrr');
                showLoading('error', 'Gagal Upload, Harap ulangi kembali');
            })
        } else if (uploadChunkState.errorUpload) {
            showLoading('error', 'Gagal Upload, Harap ulangi kembali');
            store.dispatch({ type: 'UPLOAD_CHUNK_STATE.SET_ERROR_UPLOAD', data: false });
        }
    }, [uploadChunkState]);

    useEffect(() => {
        if (uploadChunkState.onUpload) {
            hideLoading();
        }
    }, [uploadChunkState.onUpload]);

    useEffect(() => {
        resetManage();
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
  
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        }
    }, []);
  
    const handleBackPress = () => {
        backToSelectVideo();
        return true;
    }

    const resetManage = () => {
        dispatch(removeFilePath(outputVideoCache));
        dispatch(removeFilePath(outputImageCache));
        dispatch({ type: 'UPLOAD_CHUNK_STATE.RESET' });
    }

    const backToSelectVideo = () => {
        resetManage();
        setUriVideo('');
        setThumbImage('');
        setMimeImage('image/jpeg');
        setModalVideoPicker(true);
        setCompressPercentage(0);
        setSizeVideo({width, height: width * 0.6});
    }

    const isValueError = (name) => {
        const newError = validate(name, userData[name]);
        setError({ ...error, [name]: newError });
    }

    const onChangeUserData = (key, val) => {
        setUserData({ ...userData, [key]: val });
    }

    const onSubmit = () => {
        Keyboard.dismiss();

        if (uriVideo === '') {
            showPopup('Silahkan pilih video terlebih dulu', 'warning');
            return;
        }

        if (userData.name === '') {
            showPopup('Silahkan isi judul terlebih dulu', 'warning');
            return;
        }

        if (userData.description === '') {
            showPopup('Silahkan isi deskripsi terlebih dulu', 'warning');
            return;
        }

        showLoading();

        let variables = {
            products: [{
                name: userData.name,
                price: userData.price,
                status: userData.status,
                method: 'START_UPLOAD',
                type: userData.type,
                description: userData.description,
                category: route.params.uploadParams.subCategory,
            }],
        };

        Client.query({
            query: queryProductManage,
            variables,
        })
        .then((res) => {
            console.log(res, '=== START_UPLOAD ===');

            let dataVariables = {
                products: [{
                    name: userData.name,
                    price: userData.price,
                    status: userData.status,
                    method: userData.method,
                    type: userData.type,
                    description: userData.description,
                    category: route.params.uploadParams.subCategory,
                }],
            };
    
            dispatch(uploadChunkActionsNoStateSave(uriVideo, dataVariables));
        })
        .catch((err) => {
            console.log(err, 'errrrr');
            showLoading('error', 'Gagal Upload, Harap ulangi kembali');
        });
    }

    useEffect(() => {
        const unsubListener = navigation.addListener('focus', (_) => {
            RNFFmpegConfig.enableLogCallback((log) => {});
            RNFFmpegConfig.enableStatisticsCallback(statisticsCallback);
        });

        return () => {
            unsubListener;
        }
    }, []);
    
    const statisticsCallback = (statistics) => {
        if (!statistics) {
            return;
        }

        let timeInMilliseconds = statistics.time / 1000;
        if (timeInMilliseconds > 0) {
            let totalVideoDuration = totalDuration.current;
            let completePercentage = Math.round((timeInMilliseconds * 100) / totalVideoDuration);
            setCompressPercentage(completePercentage);
        }
    }

    const onEndCompress = () => {
        setProcessingVideo(false);
        setModalVideoPicker(false);
    }

    const onNextVideo = async(param) => {
        setProcessingVideo(true);
        setCompressPercentage(0);
        RNFFmpegConfig.resetStatistics();

        const result = await getRawCodec(param, totalDuration);
        
        if (result) {
            if (result.messageText !== '') {
                onEndCompress();
                showLoading('warning', result.messageText);
            } else if (result.uri !== '') {
                onEndCompress();
                setUriVideo(result.uri);
                getThumbnailFromVideo(result.imageCodec);
            } else {
                onCompressVideo(result.videoCodec);
                getThumbnailFromVideo(result.imageCodec);
            }
        }
    }

    const onCompressVideo = (videoCodec) => {
        RNFFmpeg.executeAsyncWithArguments(videoCodec, callback => {
            if (callback.returnCode === 0) {
                onEndCompress();
                setUriVideo(outputVideoCache);
            } else {
                showLoading('error', 'Gagal mengkompres file, Harap ulangi kembali');
                onEndCompress();
            }
        });
    }

    const getThumbnailFromVideo = (imageCodec) => {
        // RNFFmpeg.executeAsyncWithArguments(imageCodec, callback => {
        //     if (callback.returnCode === 0) {
        //         ImageCropPicker.openCropper({
        //             path: outputImageCache,
        //             width: 320,
        //             height: 320,
        //             includeBase64: true,
        //         })
        //         .then((imgCropRes) => {
        //             setThumbImage(imgCropRes.data);
        //             setMimeImage(imgCropRes.mime);
        //         });
        //     }
        // });
    }
    
    const onNextImage = async(param) => {
        if (param.photos.length === 0) {
            setModalImagePicker(false);
            return;
        }

        const idx = param.selected[0];
        const resultCrop = await ImageCropPicker.openCropper({
            path: param.photos[idx].node.image.uri,
            width: 320,
            height: 320,
            includeBase64: true,
        });
        
        setThumbImage(resultCrop.data);
        setMimeImage(resultCrop.mime);
        setModalImagePicker(false);
    }
    
    return (
        <Scaffold
            header={
                <Header
                    title='Upload'
                    onPressLeftButton={() => {
                        // backToSelectVideo();
                        navigation.pop();
                    }}
                />
            }
            loadingProps={loadingProps}
            popupProps={popupProps}
        >
            <ScrollView>
                {/* {uriVideo !== '' && <VideoViewScreen
                    source={uriVideo}
                    onLoad={(e) => {
                        const size = e.naturalSize;
                        const result = resizeRatio(
                            size.width,
                            size.height,
                            width,
                        );
                        
                        setSizeVideo({
                            height: result.height,
                            width: result.width,
                        });
                    }}
                    style={{
                        height: sizeVideo.height,
                        width: sizeVideo.width,
                        borderRadius: 4,
                        alignItems: 'center',
                        alignSelf: 'center',
                        justifyContent: 'center',
                    }}
                />} */}

                <View style={{paddingHorizontal: 16, paddingTop: 24}}>
                    <LabelInput>
                        <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Thumbnail</Text>
                    </LabelInput>
                    <View style={{width: '100%', height: 128, marginTop: 4, flexDirection: 'row', paddingVertical: 12, borderRadius: 4, backgroundColor: Color.theme, alignItems: 'center', justifyContent: 'center'}}>
                        {thumbImage !== '' && <TouchableOpacity
                            onPress={() => {}}
                            style={{height: '100%', aspectRatio: 1, backgroundColor: '#4E4E4E', borderRadius: 4, marginRight: 8}}
                        >
                            <Image
                                style={{width: '100%', height: '100%', borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                                source={{ uri: `data:${mimeImage};base64,${thumbImage}` }}
                            />
                        </TouchableOpacity>}

                        <TouchableOpacity
                            onPress={() => {
                                // setModalImagePicker(true);

                                // sementara
                                const options = {
                                    mediaType: 'photo',
                                    maxWidth: 640,
                                    maxHeight: 640,
                                    quality: 1,
                                    includeBase64: true,
                                }
    
                                launchImageLibrary(options, (callback) => {
                                    if (callback.base64) {
                                        setThumbImage(callback.base64);
                                        setMimeImage(callback.type);
                                    }
                                })
                            }}
                            style={{height: '100%', aspectRatio: 1, backgroundColor: '#4E4E4E', borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                        >
                            <Entypo name='folder-images' color={Color.text} size={22} style={{marginBottom: 4}} />
                            <Text size={10}>Pilih gambar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{paddingHorizontal: 16, paddingTop: 24}}>
                    <LabelInput>
                        <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Judul</Text>
                    </LabelInput>
                    <EmailRoundedView>
                        <CustomTextInput
                            placeholder=''
                            keyboardType='default'
                            placeholderTextColor='#CCCCCC'
                            underlineColorAndroid='transparent'
                            autoCorrect={false}
                            onChangeText={(text) => onChangeUserData('name', text)}
                            selectionColor={Color.text}
                            value={userData.name}
                            onBlur={() => isValueError('name')}
                        />
                    </EmailRoundedView>
                    <ErrorView>
                        {/* <Text type='medium' color={Color.error}>error</Text> */}
                    </ErrorView>
                </View>

                <View style={{paddingHorizontal: 16, paddingTop: 24}}>
                    <LabelInput>
                        <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Deskripsi</Text>
                    </LabelInput>
                    <EmailRoundedView>
                        <CustomTextInput
                            placeholder=''
                            keyboardType='default'
                            placeholderTextColor='#CCCCCC'
                            underlineColorAndroid='transparent'
                            autoCorrect={false}
                            onChangeText={(text) => onChangeUserData('description', text)}
                            selectionColor={Color.text}
                            value={userData.description}
                            onBlur={() => isValueError('description')}
                        />
                    </EmailRoundedView>
                    <ErrorView>
                        {/* <Text type='medium' color={Color.error}>error</Text> */}
                    </ErrorView>
                </View>

                <View style={{paddingHorizontal: 16, paddingTop: 24}}>
                    <LabelInput>
                        <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Kategori</Text>
                    </LabelInput>
                    <EmailRoundedView>
                        <CustomTextInput
                            placeholder=''
                            keyboardType='default'
                            placeholderTextColor='#CCCCCC'
                            underlineColorAndroid='transparent'
                            autoCorrect={false}
                            onChangeText={(text) => onChangeUserData('category', text)}
                            selectionColor={Color.text}
                            value={userData.category}
                            onBlur={() => isValueError('category')}
                            editable={false}
                        />
                    </EmailRoundedView>
                    <ErrorView>
                        {/* <Text type='medium' color={Color.error}>error</Text> */}
                    </ErrorView>
                </View>

                <TouchSelect
                    title='Siapa yang dapat melihat ini?'
                    value={userData.status}
                    iconName={selectedStatus.iconName}
                    onPress={() => modalSelectStatusRef.current.open()}
                />
            </ScrollView>

            <Submit
                buttonLabel='Upload'
                buttonColor={Color.primary}
                type='bottomSingleButton'
                buttonBorderTopWidth={0}
                onPress={() => {
                    onSubmit();
                }}
            />

            <Loading
                visible={uploadChunkState.onUpload}
                message={uploadChunkState.isProses ?
                    `Memproses Video ${uploadChunkState.countProses}/${uploadChunkState.totalProses}` :
                    `Mengupload Video ${uploadChunkState.progress}/${uploadChunkState.total}`}
                usingPercentage
                percentage={uploadChunkState.progress * 100 / uploadChunkState.total}
            />

            <ModalSelectStatus
                ref={modalSelectStatusRef}
                selected={selectedStatus}
                onPress={(e) => {
                    onChangeUserData('status', e.value);
                    setSelectedStatus(e);
                    modalSelectStatusRef.current.close();
                }}
            />

            {/* {(modalVideoPicker || modalImagePicker) && (
                <Modal
                    visible
                    onRequestClose={() => {
                        setCompressPercentage(0);
                        navigation.pop();
                    }}
                >
                    <GalleryPicker
                        onCancel={() => {
                            if (modalVideoPicker) navigation.pop();
                            else setModalImagePicker(false);
                        }}
                        onNext={async (param) => {
                            if (modalVideoPicker) {
                                onNextVideo(param);
                            }

                            if (modalImagePicker) {
                                onNextImage(param);
                            }
                        }}
                        cropSize={{ width: 200, height: 200 }}
                        maxScale={10}  
                        max={1}
                        style={{backgroundColor: Color.theme}}
                        cameraConfig = {{
                            camerPhotoTile: "Photo",
                            cameraVideoTitle: "Video",
                            maxVideoLen: 60 * 3,
                            videoQuality: "480p"
                        }}
                        assetType={modalVideoPicker ? 'Videos' : 'Photos'}
                        showChangeAssetType={false}
                        loading={processingVideo}
                        usingPercentage
                        percentage={compressPercentage}
                        total={totalDuration.current}
                    />
                </Modal>
            )} */}
        </Scaffold>
    )
}

export default UploadVideoScreen;