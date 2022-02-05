import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TextInput, SafeAreaView, TouchableOpacity, Image, Keyboard, BackHandler, useWindowDimensions } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { launchImageLibrary } from 'react-native-image-picker';
import {
    Header,
    Text,
    Popup, usePopup,
    Loading, useLoading,
    Submit,
    useColor
} from '@src/components';

import { queryJoinCommunity } from 'src/lib/query';
import ModalSelectChapter from 'src/components/Modal/ModalSelectChapter'
import validate from '@src/lib/validate';
import Client from '@src/lib/apollo';

const MainView = Styled(SafeAreaView)`
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
  fontSize: 14px;
`;

const CustomTouch = Styled(TouchableOpacity)`
    backgroundColor: transparent;
`;


const JoinCommunity = ({ navigation, route }) => {
    const { height } = useWindowDimensions();
    const { Color } = useColor();

    const modalSelectChapterRef = useRef();

    const [loadingProps, showLoading, hideLoading] = useLoading();
    const [popupProps, showPopup] = usePopup();

    const [userData, setUserData] = useState({
        carType: '',
        carColor: '',
        carYear: "",
        carIdentity: '',
        reason: '',
        note: '',
        chapterId: "",
        carPhotoMain: '',
        carPhotoFront: '',
        carPhotoSide: '',
        carPhotoBack: '',
        transactionProof: '',
    });

    const [error, setError] = useState({
        carType: null,
        carColor: null,
        carYear: null,
        carIdentity: null,
        reason: null,
        note: null,
        carPhotoMain: '',
        carPhotoFront: '',
        carPhotoSide: '',
        carPhotoBack: '',
        transactionProof: '',
    });

    const isValueError = (name) => {
        const newError = validate(name, userData[name]);
        setError({ ...error, [name]: newError });
    }

    const onChangeUserData = (key, val) => {
        setUserData({ ...userData, [key]: val });
    };

    const [selectedChapter, setSelectedChapter] = useState();

    const [thumbImage, setThumbImage] = useState('');
    const [mimeImage, setMimeImage] = useState('image/jpeg');
    
    const [thumbImage2, setThumbImage2] = useState('');
    const [mimeImage2, setMimeImage2] = useState('image/jpeg');

    const [thumbImage3, setThumbImage3] = useState('');
    const [mimeImage3, setMimeImage3] = useState('image/jpeg');
    
    const [thumbImage4, setThumbImage4] = useState('');
    const [mimeImage4, setMimeImage4] = useState('image/jpeg');

    const [thumbImage5, setThumbImage5] = useState('');
    const [mimeImage5, setMimeImage5] = useState('image/jpeg');

    const onSubmit = () => {
        Keyboard.dismiss();

        if (userData.chapterId === '') {
            showPopup('Silahkan isi chapter terlebih dulu', 'warning');
            return;
        }

        if (userData.carType === '') {
            showPopup('Silahkan isi tipe mobil terlebih dulu', 'warning');
            return;
        }

        if (userData.carColor === '') {
            showPopup('Silahkan isi warna mobil terlebih dulu', 'warning');
            return;
        }

        if (userData.carYear === '') {
            showPopup('Silahkan isi tahun mobil terlebih dulu', 'warning');
            return;
        }

        if (userData.carIdentity === '') {
            showPopup('Silahkan isi plat nomor terlebih dulu', 'warning');
            return;
        }

        if (userData.reason === '') {
            showPopup('Silahkan isi alasan gabung terlebih dulu', 'warning');
            return;
        }

        if (userData.note === '') {
            showPopup('Silahkan isi deskripsi terlebih dulu', 'warning');
            return;
        }

        if (thumbImage === '' || thumbImage2 === '' || thumbImage3 === '' || thumbImage4 === '' || thumbImage5 === '' ) {
            showPopup('Silahkan pilih gambar terlebih dulu', 'warning');
            return;
        }

        showLoading();

        let variables = {
            body: {
                carType: userData.carType,
                carColor: userData.carColor,
                carYear: userData.carYear,
                carIdentity: userData.carIdentity,
                reason: userData.reason,
                chapterId: selectedChapter.community_id,
                carPhotoMain: 'data:image/png;base64,' + thumbImage,
                carPhotoFront: 'data:image/png;base64,' + thumbImage2,
                carPhotoSide: 'data:image/png;base64,' + thumbImage3,
                carPhotoBack: 'data:image/png;base64,' + thumbImage4,
                transactionProof: 'data:image/png;base64,' + thumbImage5,
                note: userData.note,
            },
        };

        console.log('variables', variables);

        Client.query({
            query: queryJoinCommunity,
            variables,
        })
        .then((res) => {
            console.log(res, '=== Berhsail ===');

            const data = res.data.joinCommunity;

            if (data) {
                showLoading('success', 'Berhasil Join Komunitas');
                
                setTimeout(() => {
                    navigation.popToTop();
                }, 2500);
            } else {
                showLoading('error', 'Gagal Join Komunitas');
            }
        })
        .catch((err) => {
            console.log(err, 'errrrr');
            showLoading('error', 'Gagal join komunitas, Harap ulangi kembali');
        });
    }

    return (
        <MainView style={{backgroundColor: Color.theme}}>
            <Header
                title="Gabung Komunitas"
            />    
            <ScrollView>
                <View style={{backgroundColor: Color.theme, paddingBottom: 16}}>
                    <View style={{paddingHorizontal: 16, paddingTop: 35}}>
                        <CustomTouch onPress={() => modalSelectChapterRef.current.open()}>
                            <View style={{marginTop: 6, paddingHorizontal: 12, borderWidth: 1, borderRadius: 4, borderColor: Color.border}}>
                                <LabelInput>
                                    <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Pilih Chapter</Text>
                                </LabelInput>
                                <View style={{height: 34, paddingRight: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Text size={14} style={{marginTop: 2}}>{userData.chapterId || 'Pilih'}</Text>
                                    <Ionicons name='chevron-down-outline' color={Color.text} />
                                </View>
                            </View>
                        </CustomTouch>
                    </View>

                     <View style={{paddingHorizontal: 16, paddingTop: 28}}>
                        <View style={{marginTop: 6, paddingHorizontal: 12, borderWidth: 1, borderRadius: 4, borderColor: Color.border}}>
                            <LabelInput>
                                <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Tipe Mobil</Text>
                            </LabelInput>
                            <EmailRoundedView>
                                <CustomTextInput 
                                    placeholder='Sedan'
                                    keyboardType='default'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    onChangeText={(text) => onChangeUserData('carType', text)}
                                    selectionColor={Color.text}
                                    value={userData.carType}
                                    onBlur={() => isValueError('carType')}
                                    style={{color: Color.text}}
                                />
                            </EmailRoundedView>
                        </View>
                    </View>

                    <View style={{paddingHorizontal: 16, paddingTop: 28}}>
                        <View style={{marginTop: 6, paddingHorizontal: 12, borderWidth: 1, borderRadius: 4, borderColor: Color.border}}>
                            <LabelInput>
                                <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Warna Mobil</Text>
                            </LabelInput>
                            <EmailRoundedView>
                                <CustomTextInput 
                                    placeholder='Merah'
                                    keyboardType='default'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    onChangeText={(text) => onChangeUserData('carColor', text)}
                                    selectionColor={Color.text}
                                    value={userData.carColor}
                                    onBlur={() => isValueError('carColor')}
                                    style={{color: Color.text}}
                                />
                            </EmailRoundedView>
                        </View>
                    </View>

                    <View style={{paddingHorizontal: 16, paddingTop: 28}}>
                        <View style={{marginTop: 6, paddingHorizontal: 12, borderWidth: 1, borderRadius: 4, borderColor: Color.border}}>
                            <LabelInput>
                                <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Tahun Mobil</Text>
                            </LabelInput>
                            <EmailRoundedView>
                                <CustomTextInput 
                                    placeholder='1992'
                                    keyboardType='default'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    onChangeText={(text) => onChangeUserData('carYear', text)}
                                    selectionColor={Color.text}
                                    value={userData.carYear}
                                    onBlur={() => isValueError('carYear')}
                                    keyboardType='numeric'
                                    style={{color: Color.text}}
                                />
                            </EmailRoundedView>
                        </View>
                    </View>

                    <View style={{paddingHorizontal: 16, paddingTop: 28}}>
                        <View style={{marginTop: 6, paddingHorizontal: 12, borderWidth: 1, borderRadius: 4, borderColor: Color.border}}>
                            <LabelInput>
                                <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Plat Nomor</Text>
                            </LabelInput>
                            <EmailRoundedView>
                                <CustomTextInput 
                                    placeholder='B 1234 ABC'
                                    keyboardType='default'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    onChangeText={(text) => onChangeUserData('carIdentity', text)}
                                    selectionColor={Color.text}
                                    value={userData.carIdentity}
                                    onBlur={() => isValueError('carIdentity')}
                                    style={{color: Color.text}}
                                />
                            </EmailRoundedView>
                        </View>
                    </View>

                    <View style={{paddingHorizontal: 16, paddingTop: 28}}>
                        <View style={{marginTop: 6, paddingHorizontal: 12, borderWidth: 1, borderRadius: 4, borderColor: Color.border, height: 90}}>
                            <LabelInput>
                                <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Alasan Gabung</Text>
                            </LabelInput>
                            <EmailRoundedView>
                                <CustomTextInput
                                    placeholder='Tuliskan alasan...'
                                    keyboardType='default'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    onChangeText={(text) => onChangeUserData('reason', text)}
                                    selectionColor={Color.text}
                                    value={userData.reason}
                                    onBlur={() => isValueError('reason')}
                                    style={{color: Color.text}}
                                />
                            </EmailRoundedView>
                        </View>
                    </View>

                    <View style={{paddingHorizontal: 16, paddingTop: 28}}>
                        <View style={{marginTop: 6, paddingHorizontal: 12, borderWidth: 1, borderRadius: 4, borderColor: Color.border, height: 90}}>
                            <LabelInput>
                                <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Deskripsi</Text>
                            </LabelInput>
                            <EmailRoundedView>
                                <CustomTextInput
                                    placeholder='Deskripsi...'
                                    keyboardType='default'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    onChangeText={(text) => onChangeUserData('note', text)}
                                    selectionColor={Color.text}
                                    value={userData.note}
                                    onBlur={() => isValueError('note')}
                                    style={{color: Color.text}}
                                />
                            </EmailRoundedView>
                        </View>
                    </View>

                    <View style={{paddingHorizontal: 16, paddingBottom: 12}}>
                        <TouchableOpacity
                            onPress={() => {
                                const options = {
                                    mediaType: 'photo',
                                    maxWidth: 640,
                                    maxHeight: 640,
                                    quality: 1,
                                    includeBase64: true,
                                }

                                launchImageLibrary(options, (callback) => {
                                    setThumbImage(callback.base64);
                                    setMimeImage(callback.type);
                                })
                            }}
                            style={{width: '100%', height: 120, borderRadius: 4, marginTop: 28, borderWidth: 3, borderStyle: "dashed", borderColor: Color.border, alignItems: 'center', justifyContent: 'center'}}
                        >
                            <Feather name='camera' size={22} style={{marginBottom: 4}} color={Color.text} />
                            <Text size={14}>Upload Car Photo Main</Text>
                        </TouchableOpacity>
                    </View>

                    {thumbImage !== '' && <TouchableOpacity
                        onPress={() => {}}
                        style={{width: '100%', height: height / 3, borderRadius: 4, alignItems: 'center'}}
                    >
                        <Image
                            style={{height: '100%', aspectRatio: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                            source={{ uri: `data:${mimeImage};base64,${thumbImage}` }}
                        />
                    </TouchableOpacity>}

                    <View style={{paddingHorizontal: 16, paddingBottom: 12}}>
                        <TouchableOpacity
                            onPress={() => {
                                const options = {
                                    mediaType: 'photo',
                                    maxWidth: 640,
                                    maxHeight: 640,
                                    quality: 1,
                                    includeBase64: true,
                                }

                                launchImageLibrary(options, (callback) => {
                                    setThumbImage2(callback.base64);
                                    setMimeImage2(callback.type);
                                })
                            }}
                            style={{width: '100%', height: 120, borderRadius: 4, marginTop: 28, borderWidth: 3, borderStyle: "dashed", borderColor: Color.border, alignItems: 'center', justifyContent: 'center'}}
                        >
                            <Feather name='camera' size={22} style={{marginBottom: 4}} color={Color.text} />
                            <Text size={14}>Upload Car Photo Front</Text>
                        </TouchableOpacity>
                    </View>

                    {thumbImage2 !== '' && <TouchableOpacity
                        onPress={() => {}}
                        style={{width: '100%', height: height / 3, borderRadius: 4, alignItems: 'center'}}
                    >
                        <Image
                            style={{height: '100%', aspectRatio: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                            source={{ uri: `data:${mimeImage2};base64,${thumbImage2}` }}
                        />
                    </TouchableOpacity>}

                    <View style={{paddingHorizontal: 16, paddingBottom: 12}}>
                        <TouchableOpacity
                            onPress={() => {
                                const options = {
                                    mediaType: 'photo',
                                    maxWidth: 640,
                                    maxHeight: 640,
                                    quality: 1,
                                    includeBase64: true,
                                }

                                launchImageLibrary(options, (callback) => {
                                    setThumbImage3(callback.base64);
                                    setMimeImage3(callback.type);
                                })
                            }}
                            style={{width: '100%', height: 120, borderRadius: 4, marginTop: 28, borderWidth: 3, borderStyle: "dashed", borderColor: Color.border, alignItems: 'center', justifyContent: 'center'}}
                        >
                            <Feather name='camera' size={22} style={{marginBottom: 4}} color={Color.text} />
                            <Text size={14}>Upload Car Photo Side</Text>
                        </TouchableOpacity>
                    </View>

                    {thumbImage3 !== '' && <TouchableOpacity
                        onPress={() => {}}
                        style={{width: '100%', height: height / 3, borderRadius: 4, alignItems: 'center'}}
                    >
                        <Image
                            style={{height: '100%', aspectRatio: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                            source={{ uri: `data:${mimeImage3};base64,${thumbImage3}` }}
                        />
                    </TouchableOpacity>}

                    <View style={{paddingHorizontal: 16, paddingBottom: 12}}>
                        <TouchableOpacity
                            onPress={() => {
                                const options = {
                                    mediaType: 'photo',
                                    maxWidth: 640,
                                    maxHeight: 640,
                                    quality: 1,
                                    includeBase64: true,
                                }

                                launchImageLibrary(options, (callback) => {
                                    setThumbImage4(callback.base64);
                                    setMimeImage4(callback.type);
                                })
                            }}
                            style={{width: '100%', height: 120, borderRadius: 4, marginTop: 28, borderWidth: 3, borderStyle: "dashed", borderColor: Color.border, alignItems: 'center', justifyContent: 'center'}}
                        >
                            <Feather name='camera' size={22} style={{marginBottom: 4}} color={Color.text} />
                            <Text size={14}>Upload Car Photo Back</Text>
                        </TouchableOpacity>
                    </View>

                    {thumbImage4 !== '' && <TouchableOpacity
                        onPress={() => {}}
                        style={{width: '100%', height: height / 3, borderRadius: 4, alignItems: 'center'}}
                    >
                        <Image
                            style={{height: '100%', aspectRatio: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                            source={{ uri: `data:${mimeImage4};base64,${thumbImage4}` }}
                        />
                    </TouchableOpacity>}

                    <View style={{paddingHorizontal: 16, paddingBottom: 12}}>
                        <TouchableOpacity
                            onPress={() => {
                                const options = {
                                    mediaType: 'photo',
                                    maxWidth: 640,
                                    maxHeight: 640,
                                    quality: 1,
                                    includeBase64: true,
                                }

                                launchImageLibrary(options, (callback) => {
                                    setThumbImage5(callback.base64);
                                    setMimeImage5(callback.type);
                                })
                            }}
                            style={{width: '100%', height: 120, borderRadius: 4, marginTop: 28, borderWidth: 3, borderStyle: "dashed", borderColor: Color.border, alignItems: 'center', justifyContent: 'center'}}
                        >
                            <Feather name='camera' size={22} style={{marginBottom: 4}} color={Color.text} />
                            <Text size={14}>Upload Payment Receipt</Text>
                        </TouchableOpacity>
                    </View>

                    {thumbImage5 !== '' && <TouchableOpacity
                        onPress={() => {}}
                        style={{width: '100%', height: height / 3, borderRadius: 4, alignItems: 'center'}}
                    >
                        <Image
                            style={{height: '100%', aspectRatio: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                            source={{ uri: `data:${mimeImage5};base64,${thumbImage5}` }}
                        />
                    </TouchableOpacity>}
                </View>
            </ScrollView>

            <Submit
                buttonLabel='Gabung'
                buttonColor={Color.primary}
                type='bottomSingleButton'
                buttonBorderTopWidth={0}
                style={{backgroundColor: Color.theme, paddingTop: 25, paddingBottom: 25}}
                onPress={()=>{
                    onSubmit()
                }}
            />

            <Loading {...loadingProps} />

            <Popup {...popupProps} />

            <ModalSelectChapter
                ref={modalSelectChapterRef}
                selected={selectedChapter}
                onPress={(e) => {
                    onChangeUserData('chapterId', e.name);
                    setSelectedChapter(e);
                    modalSelectChapterRef.current.close();
                }}
            />
        </MainView>
    )
}

export default JoinCommunity;