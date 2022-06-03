import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TextInput, SafeAreaView, Image, Keyboard, BackHandler, useWindowDimensions } from 'react-native';
import Styled from 'styled-components';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';

import {
    Header,
    Text,
    Popup, usePopup,
    Loading, useLoading,
    Submit,
    TouchableOpacity,
    useColor,
    Row,
    Scaffold
  } from '@src/components';
import { TouchSelect } from '@src/components/Form';
import ModalSelectStatus from '@src/components/Modal/ModalSelectStatus';
import validate from '@src/lib/validate';
import Client from '@src/lib/apollo';
import { queryProductManage } from '@src/lib/query';
import { geoCurrentPosition, geoLocationPermission } from 'src/utils/geolocation';
import { accessClient } from 'src/utils/access_client';
import FormSelect from 'src/components/FormSelect';
import DatePicker from 'react-native-date-picker';
import Moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'

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
  borderWidth: 1px;
  borderColor: #9CA3A5;
  fontSize: 14px;
  borderRadius: 5;
  paddingHorizontal: 10;
  paddingTop: 16;
  fontSize: 12;
`;

const ErrorView = Styled(View)`
  width: 100%;
  paddingVertical: 4px;
  alignItems: flex-start;
`;

const CreateThreadScreen = (props) => {
    const { navigation, route } = props;
    const { params } = route;

    const { height } = useWindowDimensions();
    const { Color } = useColor();

    const [userData, setUserData] = useState({
        code: '',
        name: '',
        image: '',
        status: 'PUBLISH', // PUBLISH | DRAFT | PRIVATE | REMOVE
        method: 'INSERT', // UPDATE | DELETE
        type: params.productType,
        category: params.productSubCategory,
        description: '',
        latitude: '',
        longitude: '',
        eventDate: new Date(),
    });
    const [error, setError] = useState({
        name: null,
        image: null,
        description: null,
        share_link: null
    });
    const [thumbImage, setThumbImage] = useState('');
    const [mimeImage, setMimeImage] = useState('image/jpeg');
    const [selectedStatus, setSelectedStatus] = useState({
        label: 'Publik', value: 'PUBLISH', iconName: 'globe'
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

   
    // ref
    const modalSelectStatusRef = useRef();

    // hooks
    const [loadingProps, showLoading, hideLoading] = useLoading();
    const [popupProps, showPopup] = usePopup();

    useEffect(() => {
        // BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        requestLocationPermission();
  
        // return () => {
        //     BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        // }
    }, []);

    const requestLocationPermission = async () => {
        const isGranted = await geoLocationPermission();
    
        console.log('isGranted',isGranted);
    
        geoCurrentPosition(
          (res) => {
            console.log(res, 'res location');
            if (res.coords) {
                setUserData({
                    ...userData,
                    latitude: res.coords.latitude.toString(),
                    longitude: res.coords.longitude.toString(),
                });
            }
          },
          (err) => {
            console.log(err, 'err location');
          }
        );
    }
  
    const handleBackPress = () => {
        backToSelectVideo();
        return true;
    }

    const backToSelectVideo = () => {
        setThumbImage('');
        setMimeImage('image/jpeg');
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

        if (thumbImage === '') {
            showPopup('Silahkan pilih gambar terlebih dulu', 'warning');
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
                eventDate: Moment(userData.eventDate).format('YYYY-MM-DD HH:mm:ss'),
            }],
        };

        if (params.parentProductId) {
            variables.products[0]['parentProductId'] = params.parentProductId;
        }

        console.log(variables, 'variables');
        console.log('userData', userData)
        
        Client.query({
            query: queryProductManage,
            variables,
        })
        .then((res) => {
            console.log(res, '=== Berhsail ===');

            const data = res.data.contentProductManage;
            console.log("Aticel",data);

            if (Array.isArray(data) && data.length > 0 && data[0]['id']) {
                showLoading('success', 'Thread berhasil dibuat!');

                setTimeout(() => {
                    // navigation.navigate('ForumSegmentScreen', { ...params, componentType: 'LIST', refresh: true });
                    navigation.popToTop();
                }, 2500);
            } else {
                showLoading('error', 'Thread gagal dibuat!');
            }

        })
        .catch((err) => {
            console.log(err, 'errrrr');
            showLoading('error', 'Gagal membuat thread, Harap ulangi kembali');
        });
    }

    const showEvent = userData.category === 'EVENT';
    
    return (
        <Scaffold
            headerTitle={"Buat "+ params.title}
            loadingProps={loadingProps}
            popupProps={popupProps}
        >
            <ScrollView>
                

                <View style={{paddingHorizontal: 16, paddingTop: 16}}>
                    
                    <EmailRoundedView>
                        <CustomTextInput
                            placeholder='Masukkan Judul Artikel . . . '
                            keyboardType='default'
                            placeholderTextColor={Color.gray}
                            underlineColorAndroid='transparent'
                            autoCorrect={false}
                            onChangeText={(text) => onChangeUserData('name', text)}
                            selectionColor={Color.text}
                            value={userData.name}
                            onBlur={() => isValueError('name')}
                            style={{color: Color.text}}
                        />
                        <LabelInput style={{position: 'absolute', bottom: 26, left: 10}}>
                            <Text size={7} letterSpacing={0.08} style={{opacity: 0.6}}>Judul</Text>
                        </LabelInput>
                    </EmailRoundedView>
                    <ErrorView>
                        {/* <Text type='medium' color={Color.error}>error</Text> */}
                    </ErrorView>
                </View>

                <View style={{paddingHorizontal: 16, paddingTop: 10}}>
                    
                    <View
                        style={{
                            width: '100%',
                            height: 220,
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                        }}
                    >
                        <LabelInput style={{position: 'absolute', top: 0, paddingHorizontal: 10, paddingVertical: 5}}>
                            <Text size={7} letterSpacing={0.08} style={{opacity: 0.6}}>Isi Artikel</Text>
                        </LabelInput>
                        <CustomTextInput
                            placeholder='Masukkan isi artikel . . .'
                            keyboardType='default'
                            placeholderTextColor={Color.gray}
                            underlineColorAndroid='transparent'
                            autoCorrect={false}
                            onChangeText={(text) => onChangeUserData('description', text)}
                            selectionColor={Color.text}
                            value={userData.description}
                            onBlur={() => isValueError('description')}
                            multiline
                            numberOfLines={8}
                            style={{color: Color.text, textAlignVertical: 'top'}}
                        />
                        
                    </View>
                    <ErrorView>
                        {/* <Text type='medium' color={Color.error}>error</Text> */}
                    </ErrorView>
                </View>
                <View>
                    <TouchableOpacity style={{fontSize: 12, paddingTop: 15,paddingHorizontal: 10,borderWidth: 1, borderColor: '#9CA3A5', width: '92%', height: 42, borderRadius: 5, alignSelf: 'center'}}>
                        <Row>
                            <Text style={{width: '94%', textAlign: 'left'}}>- Kategori Artikel -</Text>
                            <MaterialIcons name={'keyboard-arrow-down'} size={20}/>
                        </Row>
                        <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', left: 10, top: 4}}>Kategori</Text>
                    </TouchableOpacity>
            
                </View>
                <View style={{paddingHorizontal: 16, paddingTop: 16}}>
                    <LabelInput>
                        <Text size={12} letterSpacing={0.08} style={{fontWeight: 'bold'}}>Gambar Cover</Text>
                    </LabelInput>
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
                                if (callback.base64) {
                                    setThumbImage(callback.base64);
                                    setMimeImage(callback.type);
                                }
                            })
                        }}
                        style={{width: '100%', height: 160, borderRadius: 4, borderWidth: 1,marginTop: 5,borderStyle:'dashed', alignItems: 'center', justifyContent: 'center'}}
                    >
                        <AntDesign name={"picture"} size={40} color={Color.secondary} style={{opacity: 0.7}}/>
                        <Text style={{color: Color.secondary, opacity: 0.8}}>Upload Foto</Text>
                <Text style={{fontSize: 8, color: Color.secondary, marginVertical: 3, opacity: 0.8}}>Upload ukuran gambar maksimal 2Mb</Text>
                <Text style={{fontSize: 8, color: Color.secondary, opacity: 0.8}}>Gambar harus berformat JPG, JPEG, atau PNG</Text>
                    </TouchableOpacity>
                </View>

                {thumbImage !== '' && <TouchableOpacity
                    onPress={() => {}}
                    style={{width: '100%', aspectRatio: 1, padding: 16}}
                >
                    <Image
                        style={{width: '100%', height: '100%', borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                        source={{ uri: `data:${mimeImage};base64,${thumbImage}` }}
                    />
                </TouchableOpacity>}

                <View style={{paddingHorizontal: 16, paddingTop: 16}}>
                    
                    <EmailRoundedView>
                        <CustomTextInput
                            placeholder='Masukkan sumber gambar . . . '
                            keyboardType='default'
                            placeholderTextColor={Color.gray}
                            underlineColorAndroid='transparent'
                            autoCorrect={false}
                            onChangeText={(text) => onChangeUserData('name', text)}
                            selectionColor={Color.text}
                            value={userData.name}
                            onBlur={() => isValueError('name')}
                            style={{color: Color.text}}
                        />
                        <LabelInput style={{position: 'absolute', bottom: 26, left: 10}}>
                            <Text size={7} letterSpacing={0.08} style={{opacity: 0.6}}>Sumber Gambar</Text>
                        </LabelInput>
                    </EmailRoundedView>
                    <ErrorView>
                        {/* <Text type='medium' color={Color.error}>error</Text> */}
                    </ErrorView>
                </View>

                <View style={{paddingHorizontal: 16, paddingTop: 16}}>
                    
                    <EmailRoundedView>
                        <CustomTextInput
                            placeholder='Bandung, Lifestyle, Bike '
                            keyboardType='default'
                            placeholderTextColor={Color.gray}
                            underlineColorAndroid='transparent'
                            autoCorrect={false}
                            onChangeText={(text) => onChangeUserData('name', text)}
                            selectionColor={Color.text}
                            value={userData.name}
                            onBlur={() => isValueError('name')}
                            style={{color: Color.text}}
                        />
                        <LabelInput style={{position: 'absolute', bottom: 26, left: 10}}>
                            <Text size={7} letterSpacing={0.08} style={{opacity: 0.6}}>Tag</Text>
                        </LabelInput>
                    </EmailRoundedView>
                    <ErrorView>
                        {/* <Text type='medium' color={Color.error}>error</Text> */}
                    </ErrorView>
                </View>
                {/* <View style={{paddingHorizontal: 16, paddingTop: 16}}>
                    <TouchableOpacity onPress={() => modalSelectChapterRef.current.open()}>
                        <View style={{marginTop: 6, paddingHorizontal: 12, borderWidth: 1, borderRadius: 4, borderColor: Color.border}}>
                            <LabelInput>
                                <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Domisili</Text>
                            </LabelInput>
                            <View style={{height: 34, paddingRight: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Text size={14} style={{marginTop: 2}}>{userData.chapterId || 'Pilih Domisili'}</Text>
                                <Ionicons name='chevron-down-outline' color={Color.text} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View> */}

                {showEvent && <FormSelect
                    label='Tanggal Event'
                    placeholder='Pilih Tanggal'
                    value={Moment(userData.eventDate).format('DD MMM YYYY')}
                    onPress={() => setShowDatePicker(true)}
                    // error={errorUserData.usageType}
                    suffixIcon={
                        <View style={{height: '100%', width: '10%', paddingRight: 16, justifyContent: 'center', alignItems: 'flex-end'}}>
                            <Ionicons name='calendar' />
                        </View>
                    }
                />}

                {/* {accessClient.CreatePosting.showPrivacy && <TouchSelect
                    title='Siapa yang dapat melihat ini?'
                    value={selectedStatus.label}
                    iconName={selectedStatus.iconName}
                    onPress={() => modalSelectStatusRef.current.open()}
                />} */}

            </ScrollView>

            <Submit
                buttonLabel='Buat'
                buttonColor={Color.primary}
                type='bottomSingleButton'
                buttonBorderTopWidth={0.5}
                onPress={() => {
                    onSubmit();
                }}
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

            {showDatePicker && <DatePicker
                modal
                open={showDatePicker}   
                date={userData.eventDate}
                mode="date"
                minimumDate={new Date()}
                onConfirm={(date) => {
                    setShowDatePicker(false);
                    onChangeUserData('eventDate', date);
                }}
                onCancel={() => {
                    setShowDatePicker(false)
                }}
            />}
        </Scaffold>
    )
}

export default CreateThreadScreen;