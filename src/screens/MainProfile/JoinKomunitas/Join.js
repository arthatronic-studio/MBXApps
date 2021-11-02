import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TextInput, SafeAreaView, TouchableOpacity, Image, Keyboard, BackHandler, useWindowDimensions } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  borderBottomWidth: 1px;
  borderColor: #666666;
  fontSize: 14px;
`;

const CustomTouch = Styled(TouchableOpacity)`
    width: 33.33%;
    height: 100%;
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
                <View style={{paddingHorizontal: 16, paddingTop: 35}}>
                    <LabelInput>
                        <Text size={14} letterSpacing={0.08} style={{opacity: 0.6}}>Tipe Mobil</Text>
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

                

                <View style={{paddingHorizontal: 16, paddingTop: 25}}>
                    <LabelInput>
                        <Text size={14} letterSpacing={0.08} style={{opacity: 0.6}}>Warna Mobil</Text>
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

                <View style={{paddingHorizontal: 16, paddingTop: 25}}>
                    <LabelInput>
                        <Text size={14} letterSpacing={0.08} style={{opacity: 0.6}}>Tahun Mobil</Text>
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

                <View style={{paddingHorizontal: 16, paddingTop: 25}}>
                    <LabelInput>
                        <Text size={14} letterSpacing={0.08} style={{opacity: 0.6}}>Plat Nomor</Text>
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

                <View style={{paddingHorizontal: 16, paddingTop: 25}}>
                    <LabelInput>
                        <Text size={14} letterSpacing={0.08} style={{opacity: 0.6}}>Alasan Gabung</Text>
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

                <View style={{paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12}}>
                    <LabelInput>
                        <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Foto Mobil</Text>
                    </LabelInput>
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
                        style={{width: '100%', height: 70, borderRadius: 4, marginTop: 16, backgroundColor: Color.border, alignItems: 'center', justifyContent: 'center'}}
                    >
                        <Entypo name='folder-images' size={22} style={{marginBottom: 4}} />
                        <Text size={10}>Pilih gambar</Text>
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

                <View style={{paddingHorizontal: 16, paddingTop: 25}}>
                    <LabelInput>
                        <Text size={14} letterSpacing={0.08} style={{opacity: 0.6}}>Pilih Chapter</Text>
                    </LabelInput>
                    <CustomTouch onPress={() => modalSelectChapterRef.current.open()}>
                        <View style={{width: 175, height: 34, marginTop: 6, paddingHorizontal: 12, borderRadius: 18, borderWidth: 1, borderColor: Color.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <View style={{height: 34, paddingRight: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Text size={12} style={{marginTop: 2, marginLeft: 4}}>{userData.chapter}</Text>
                            </View>
                            <Ionicons name='chevron-down-outline' color={Color.text} />
                        </View>
                    </CustomTouch>
                </View>

            </ScrollView>
            

            <Submit
                buttonLabel='Daftar'
                buttonColor={Color.green}
                type='bottomSingleButton'
                buttonBorderTopWidth={0.5}
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