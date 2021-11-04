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
  
import ModalSelectChapter from 'src/screens/MainProfile/JoinKomunitas/ModalSelectChapter'
import validate from '@src/lib/validate';

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
  fontFamily: OpenSans-Regular;
  backgroundColor: transparent;
  fontSize: 14px;
`;

const CustomTouch = Styled(TouchableOpacity)`
    backgroundColor: transparent;
`;


const Join = () => {
    const { height } = useWindowDimensions();
    const { Color } = useColor();

    const modalSelectChapterRef = useRef();

    const [loadingProps, showLoading, hideLoading] = useLoading();
    const [popupProps, showPopup] = usePopup();

    const [userData, setUserData] = useState({
        code: '',
        tipeMobil: '',
        warnaMobil: '',
        tahunMobil: 0,
        platNomor: '',
        alasanGabung: '',
        chapter: 'Chapter 1',
        image: '',
    });

    const [error, setError] = useState({
        tipeMobil: null,
        warnaMobil: null,
        tahunMobil: null,
        platNomor: null,
        alasanGabung: null,
        image: null,
    });

    const isValueError = (name) => {
        const newError = validate(name, userData[name]);
        setError({ ...error, [name]: newError });
    }

    const onChangeUserData = (key, val) => {
        setUserData({ ...userData, [key]: val });
    };

    const [selectedChapter, setSelectedChapter] = useState({
        id: 1, value: 'Chapter 1'
    });

    const [thumbImage, setThumbImage] = useState('');
    const [mimeImage, setMimeImage] = useState('image/jpeg');

    const handleBackPress = () => {
        backToSelectVideo();
        return true;
    }

    const backToSelectVideo = () => {
        setThumbImage('');
        setMimeImage('image/jpeg');
    }


    return (
        <MainView style={{backgroundColor: Color.theme}}>
            <Header
                title="Gabung Komunitas"
            />    
            <ScrollView>
                <View style={{backgroundColor: '#ffffff', marginBottom: 106, paddingBottom: 28}}>
                    <View style={{paddingHorizontal: 16, paddingTop: 35}}>
                        <CustomTouch onPress={() => modalSelectChapterRef.current.open()}>
                            <View style={{marginTop: 6, paddingHorizontal: 12, borderWidth: 1, borderRadius: 4, borderColor: Color.border}}>
                                <LabelInput>
                                    <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Pilih Chapter</Text>
                                </LabelInput>
                                <View style={{height: 34, paddingRight: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Text size={14} style={{marginTop: 2}}>{userData.chapter}</Text>
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
                                    placeholder=''
                                    keyboardType='default'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    onChangeText={(text) => onChangeUserData('tipeMobil', text)}
                                    selectionColor={Color.text}
                                    value={userData.tipeMobil}
                                    onBlur={() => isValueError('tipeMobil')}
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
                                    placeholder=''
                                    keyboardType='default'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    onChangeText={(text) => onChangeUserData('warnaMobil', text)}
                                    selectionColor={Color.text}
                                    value={userData.warnaMobil}
                                    onBlur={() => isValueError('warnaMobil')}
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
                                    placeholder=''
                                    keyboardType='default'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    onChangeText={(text) => onChangeUserData('tahunMobil', text)}
                                    selectionColor={Color.text}
                                    value={userData.tahunMobil}
                                    onBlur={() => isValueError('tahunMobil')}
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
                                    placeholder=''
                                    keyboardType='default'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    onChangeText={(text) => onChangeUserData('platNomor', text)}
                                    selectionColor={Color.text}
                                    value={userData.platNomor}
                                    onBlur={() => isValueError('platNomor')}
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
                                    placeholder=''
                                    keyboardType='default'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    onChangeText={(text) => onChangeUserData('alasanGabung', text)}
                                    selectionColor={Color.text}
                                    value={userData.alasanGabung}
                                    onBlur={() => isValueError('alasanGabung')}
                                />
                            </EmailRoundedView>
                        </View>
                    </View>

                    <View style={{paddingHorizontal: 16, paddingBottom: 12}}>
                        <TouchableOpacity
                            onPress={() => {
                                const options = {
                                    mediaType: 'photo',
                                    maxWidth: 320,
                                    maxHeight: 320,
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
                            <Feather name='camera' size={22} style={{marginBottom: 4}}/>
                            <Text size={14}>Upload Foto Mobil</Text>
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
                </View>

            </ScrollView>

            <Submit
                buttonLabel='Gabung'
                buttonColor={'#a1a1a1'}
                type='bottomSingleButton'
                buttonBorderTopWidth={0}
                style={{backgroundColor: '#ffffff', paddingTop: 25, paddingBottom: 25}}
            />

            <Loading {...loadingProps} />

            <Popup {...popupProps} />

            <ModalSelectChapter
                ref={modalSelectChapterRef}
                selected={selectedChapter}
                onPress={(e) => {
                    onChangeUserData('chapter', e.value);
                    setSelectedChapter(e);
                    modalSelectChapterRef.current.close();
                }}
            />

            

        </MainView>
    )
}

export default Join