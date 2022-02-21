import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TextInput, Modal, Image, Keyboard, BackHandler, Platform } from 'react-native';
import Styled from 'styled-components';
import RNFS from 'react-native-fs';
import Entypo from 'react-native-vector-icons/Entypo';
import DocumentPicker from 'react-native-document-picker';
// import ImageCropPicker from 'react-native-image-crop-picker';
import TrackPlayer from 'react-native-track-player';
import { RNFFmpeg, RNFFmpegConfig } from 'react-native-ffmpeg';

import Text from '@src/components/Text';
import Color from '@src/components/Color';
import Header from '@src/components/Header';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import { Submit } from '@src/components/Button';
import validate from './ValidateUpload';
// import GalleryPicker from '../GalleryPicker/GalleryPicker';
import Loading, { useLoading } from '@src/components/Modal/Loading';
import Popup, { usePopup } from '@src/components/Modal/Popup';
import { TouchSelect } from '@src/components/Form';
import ModalSelectStatus from '@src/components/Modal/ModalSelectStatus';
// import MiniMusicSlider from './MiniMusicSlider';

// import { getObjSubCategoryByCode } from '../../utils/rawSubCategory';

import Client from '@src/lib/apollo';
import { queryMaudiProductManage } from '@src/lib/query';
import { accessClient } from 'src/utils/access_client';

const MainView = Styled(View)`
    flex: 1;
    backgroundColor: ${Color.dark};
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
  fontFamily: Poppins-Regular;
  color: ${Color.white};
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

const UploadMusicScreen = (props) => {
    const { navigation, route } = props;

    const [userData, setUserData] = useState({
        code: '',
        name: '',
        image: '',
        price: 0,
        status: 'PUBLISH',
        method: 'INSERT',
        type: accessClient.InitialCode, // route.params ? route.params.uploadParams.type : 'MUSIC',
        category: 'NEWEST_MUSIC', // route.params ? getObjSubCategoryByCode(route.params.uploadParams.subCategory).name : 'ALL',
        stream: '',
        description: '',
    });
    const [error, setError] = useState({
        name: null,
        image: null,
        stram: null,
        description: null,
    });
    const [modalImagePicker, setModalImagePicker] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState({
        label: 'Publik', value: 'PUBLISH', iconName: 'globe'
    });
    const [originDocument, setOriginDocument] = useState();
    const [encodedDocument, setEncodedDocument] = useState('');
    const [thumbImage, setThumbImage] = useState('');
    const [mimeImage, setMimeImage] = useState('image/jpeg');

    // hooks
    const [loadingProps, showLoading, hideLoading] = useLoading();
    const [popupProps, showPopup] = usePopup();

    // ref
    const modalSelectStatusRef = useRef();
    
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
  
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        }
    }, []);
  
    const handleBackPress = () => {
        navigation.pop();
        return true;
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

        if (encodedDocument === '') {
            showPopup('Silahkan pilih konten terlebih dulu', 'warning');
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
                ...userData,
                image: thumbImage,
                category: route.params.uploadParams.subCategory,
                stream: encodedDocument,
            }]
        };

        if (route.params && route.params.item) {
            variables.products[0].parentProductId = route.params.item.id;
        }

        // console.log(variables, 'variables');

        Client.query({
            query: queryMaudiProductManage,
            variables,
        })
        .then((res) => {
            // console.log(res, 'ressss');

            showLoading(
                'success',
                'Berhasil Mengupload',
                () => {}
            );

            // navigation.navigate('ShowAllScreen', {
            //         title: 'Terbaru',
            //         subTitle: 'Semua',
            //         componentType: 'SHOW_ALL_MUSIC',
            //         productType: 'MUSIC',
            //         popToTop: true
            //     }
            // )
        })
        .catch((err) => {
            // console.log(err, 'errrrr');
            showLoading('error', 'Gagal Upload, Harap ulangi kembali');
        })
    }

    useEffect(() => {
        const unsubListener = navigation.addListener('focus', (_) => {
            RNFFmpegConfig.enableLogCallback((log) => {});
            RNFFmpegConfig.enableStatisticsCallback(() => {});
        });

        return () => {
            unsubListener;
        }
    }, []);

    const getDocument = async() => {
        const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.audio],
        });

        let objOrigin = {
            id: res.type,
            path: res.uri,
            title: res.name,
            album: "",
            artist: "",
            cover: "",
        };

        showLoading();

        let uri = res.uri;

        if (Platform.OS === 'ios') {
            const split = res.uri.split('/');
            const name = split.pop();
            const path = split.pop();
            const ext = name.split('.').pop();

            uri = `${RNFS.TemporaryDirectoryPath}${decodeURIComponent(path)}/${decodeURIComponent(name)}`;
            
            if (ext === 'mp3') {
                encodeDocument(uri);
                setOriginDocument(objOrigin);
            } else {
                const inputMusicPath = 'file://' + uri;
                const outputMusicCache = `file://${RNFS.CachesDirectoryPath}/music.mp3`;
                const musicCodec = ['-y', '-i', inputMusicPath, '-c:a', 'libmp3lame', outputMusicCache];
                onCompressMusic(musicCodec, outputMusicCache, objOrigin);
            }
        } else {
            encodeDocument(uri);
            setOriginDocument(objOrigin);
        }
    }

    const onCompressMusic = (musicCodec, outputMusicCache, objOrigin) => {
        RNFFmpeg.executeAsyncWithArguments(musicCodec, callback => {
            if (callback.returnCode === 0) {
                encodeDocument(outputMusicCache);
                setOriginDocument({ ...objOrigin, path: outputMusicCache });
            } else {
                showLoading('error', 'Gagal mengkompres file, Harap ulangi kembali');
            }
        });
    }

    const encodeDocument = async(uri) => {
        const uriBase64 = await RNFS.readFile(uri, 'base64');

        await TrackPlayer.reset();
        
        setEncodedDocument(uriBase64);
        hideLoading();
    }

    const onNextImage = async(param) => {
        if (param.photos.length === 0) {
            setModalImagePicker(false);
            return;
        }

        const idx = param.selected[0];
        // const resultCrop = await ImageCropPicker.openCropper({
        //     path: param.photos[idx].node.image.uri,
        //     width: 320,
        //     height: 320,
        //     includeBase64: true,
        // });
        
        // setThumbImage(resultCrop.data);
        // setMimeImage(resultCrop.mime);
        setModalImagePicker(false);
    }

    return (
        <MainView>
            <Header
                title='Upload'
                color={Color.white}
            />
            <ScrollView>
                <View style={{paddingHorizontal: 16, paddingTop: 24}}>
                    <LabelInput>
                        <Text size={12} letterSpacing={0.08} color={Color.white} style={{opacity: 0.6}}>Music</Text>
                    </LabelInput>
                    <View style={{width: '100%', height: 128, marginTop: 4, flexDirection: 'row', paddingVertical: 12, borderRadius: 4, backgroundColor: Color.menu, alignItems: 'center', justifyContent: 'center'}}>
                        <TouchableOpacity
                            onPress={() => {
                                getDocument();
                            }}
                            style={{height: '100%', aspectRatio: 1, backgroundColor: '#4E4E4E', borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                        >
                            <Entypo name='folder-music' color={Color.white} size={22} style={{marginBottom: 4}} />
                            <Text size={10} color={Color.white}>Pilih musik</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* {originDocument &&
                    <MiniMusicSlider
                        item={originDocument}
                    />
                } */}

                <View style={{paddingHorizontal: 16, paddingTop: 24}}>
                    <LabelInput>
                        <Text size={12} letterSpacing={0.08} color={Color.white} style={{opacity: 0.6}}>Cover</Text>
                    </LabelInput>
                    <View style={{width: '100%', height: 128, marginTop: 4, flexDirection: 'row', paddingVertical: 12, borderRadius: 4, backgroundColor: Color.menu, alignItems: 'center', justifyContent: 'center'}}>
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
                                setModalImagePicker(true);
                            }}
                            style={{height: '100%', aspectRatio: 1, backgroundColor: '#4E4E4E', borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                        >
                            <Entypo name='folder-images' color={Color.white} size={22} style={{marginBottom: 4}} />
                            <Text size={10} color={Color.white}>Pilih gambar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{paddingHorizontal: 16, paddingTop: 24}}>
                    <LabelInput>
                        <Text size={12} letterSpacing={0.08} color={Color.white} style={{opacity: 0.6}}>Judul</Text>
                    </LabelInput>
                    <EmailRoundedView>
                        <CustomTextInput
                            placeholder=''
                            keyboardType='default'
                            placeholderTextColor='#CCCCCC'
                            underlineColorAndroid='transparent'
                            autoCorrect={false}
                            onChangeText={(text) => onChangeUserData('name', text)}
                            selectionColor={Color.white}
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
                        <Text size={12} letterSpacing={0.08} color={Color.white} style={{opacity: 0.6}}>Artis / Penyanyi</Text>
                    </LabelInput>
                    <EmailRoundedView>
                        <CustomTextInput
                            placeholder=''
                            keyboardType='default'
                            placeholderTextColor='#CCCCCC'
                            underlineColorAndroid='transparent'
                            autoCorrect={false}
                            onChangeText={(text) => onChangeUserData('description', text)}
                            selectionColor={Color.white}
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
                        <Text size={12} letterSpacing={0.08} color={Color.white} style={{opacity: 0.6}}>Genre</Text>
                    </LabelInput>
                    <EmailRoundedView>
                        <CustomTextInput
                            placeholder=''
                            keyboardType='default'
                            placeholderTextColor='#CCCCCC'
                            underlineColorAndroid='transparent'
                            autoCorrect={false}
                            onChangeText={(text) => onChangeUserData('category', text)}
                            selectionColor={Color.white}
                            value={userData.category}
                            onBlur={() => isValueError('category')}
                            editable={false}
                        />
                    </EmailRoundedView>
                    <ErrorView>
                        {/* <Text type='medium' color={Color.error}>error</Text> */}
                    </ErrorView>
                </View>

                {/* <View style={{paddingHorizontal: 16, paddingTop: 24}}>
                    <LabelInput>
                        <Text size={12} letterSpacing={0.08} color={Color.white} style={{opacity: 0.6}}>Tags</Text>
                    </LabelInput>
                    <EmailRoundedView>
                        <CustomTextInput
                            placeholder=''
                            keyboardType='default'
                            placeholderTextColor='#CCCCCC'
                            underlineColorAndroid='transparent'
                            autoCorrect={false}
                            onChangeText={(text) => onChangeUserData('tags', text)}
                            selectionColor={Color.white}
                            value={userData.tags}
                            onBlur={() => isValueError('tags')}
                        />
                    </EmailRoundedView>
                    <ErrorView>
                        <Text type='medium' color={Color.error}>error</Text>
                    </ErrorView>
                </View> */}

                <TouchSelect
                    title='Siapa yang dapat melihat ini?'
                    value={userData.status}
                    iconName={selectedStatus.iconName}
                    onPress={() => modalSelectStatusRef.current.open()}
                />
            </ScrollView>

            <Submit
                buttonLabel='Kirim'
                buttonColor={Color.primary}
                type='bottomSingleButton'
                buttonBorderTopWidth={0}
                onPress={async() => {
                    onSubmit();
                    await TrackPlayer.reset();
                }}
            />

            <Loading {...loadingProps} />

            <Popup {...popupProps} />

            <ModalSelectStatus
                ref={modalSelectStatusRef}
                selected={selectedStatus}
                onPress={(e) => {
                    onChangeUserData('status', e.value);
                    setSelectedStatus(e);
                    modalSelectStatusRef.current.close();
                }}
            />

            {modalImagePicker && (
                <Modal
                    visible
                    onRequestClose={() => {
                        setModalImagePicker(false);
                    }}
                >
                    {/* <GalleryPicker
                        onCancel={() => {
                            setModalImagePicker(false);
                        }}
                        onNext={(param) => {
                            onNextImage(param);
                        }}
                        cropSize={{ width: 200, height: 200 }}
                        maxScale={10}  
                        max={1}
                        style={{backgroundColor: Color.dark}}
                        cameraConfig={{
                            camerPhotoTile: "Photo",
                            cameraVideoTitle: "Video",
                            maxVideoLen: 60 * 3,
                            videoQuality: "480p"
                        }}
                        assetType={'Photos'}
                        showChangeAssetType={false}
                    /> */}
                </Modal>
            )}
        </MainView>
    )
}

export default UploadMusicScreen;