import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TextInput, SafeAreaView, Image, Keyboard, BackHandler, useWindowDimensions } from 'react-native';
import Styled from 'styled-components';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {
    Header,
    Text,
    Popup, usePopup,
    Loading, useLoading,
    Submit,
    TouchableOpacity,
    useColor,
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
import ModalImagePicker from 'src/components/Modal/ModalImagePicker';

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
  borderBottomWidth: 1px;
  borderColor: #666666;
  fontSize: 14px;
`;

const ErrorView = Styled(View)`
  width: 100%;
  paddingVertical: 4px;
  alignItems: flex-start;
`;

const CreateThreadScreen = (props) => {
    const { navigation, route } = props;
    const { params } = route;

    console.log('route', route);

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
    });
    const [thumbImage, setThumbImage] = useState('');
    const [mimeImage, setMimeImage] = useState('image/jpeg');
    const [selectedStatus, setSelectedStatus] = useState({
        label: 'Publik', value: 'PUBLISH', iconName: 'globe'
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [modalImagePicker, setModalImagePicker] = useState(false);
    const [disabled, setDisabled] = useState(true);
   
   
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
    const onValueText = (key,val) => {
        let name = key !== 'name'  ? val: '';
        
        if (name === ''  ) {
            setDisabled(true);
        }else{
            setDisabled(false);
        }
       
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
        
        Client.query({
            query: queryProductManage,
            variables,
        })
        .then((res) => {
            console.log(res, '=== Berhsail ===');

            const data = res.data.contentProductManage;

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
            headerTitle={params.title}
            loadingProps={loadingProps}
            popupProps={popupProps}
        >
            <KeyboardAwareScrollView>
                <View style={{paddingHorizontal: 16, paddingTop: 16}}>
                    <LabelInput>
                        <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Gambar</Text>
                    </LabelInput>
                    <TouchableOpacity
                        onPress={() => {
                            setModalImagePicker(true);
                        }}
                        style={{width: '100%', height: 70, borderRadius: 4, marginTop: 16, backgroundColor: Color.secondary, alignItems: 'center', justifyContent: 'center'}}
                    >
                        <Entypo name='folder-images' size={22} style={{marginBottom: 4}} />
                        <Text size={10}>Pilih gambar</Text>
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
                    <LabelInput>
                        <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Judul</Text>
                    </LabelInput>
                    <EmailRoundedView>
                        <CustomTextInput
                            placeholder=''
                            keyboardType='default'
                            placeholderTextColor={Color.gray}
                            underlineColorAndroid='transparent'
                            autoCorrect={false}
                            onChangeText={(text) => { onChangeUserData('name', text);onValueText('name',text) } }
                            selectionColor={Color.text}
                            value={userData.name}
                            onBlur={() => isValueError('name')}
                            style={{color: Color.text}}
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
                    <View
                        style={{
                            width: '100%',
                            height: 80,
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                        }}
                    >
                        <CustomTextInput
                            placeholder=''
                            keyboardType='default'
                            placeholderTextColor={Color.gray}
                            underlineColorAndroid='transparent'
                            autoCorrect={false}
                            onChangeText={(text) => { onChangeUserData('description', text);onValueText('description',text) } }
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

                {showEvent && <FormSelect
                    label='Tanggal Event'
                    placeholder='Pilih Tanggal'
                    value={Moment(userData.eventDate).format('DD MMM YYYY')}
                    onPress={() => setShowDatePicker(true)}
                    // error={errorUserData.usageType}
                    suffixIcon={
                        <View style={{ width: '10%', paddingRight: 16, justifyContent: 'center', alignItems: 'flex-end'}}>
                            <Ionicons name='calendar' />
                        </View>
                    }
                />}

                {accessClient.CreatePosting.showPrivacy && <TouchSelect
                    title='Siapa yang dapat melihat ini?'
                    value={selectedStatus.label}
                    iconName={selectedStatus.iconName}
                    onPress={() => modalSelectStatusRef.current.open()}
                />}
            </KeyboardAwareScrollView>

            <Submit
                buttonLabel='Buat'
                buttonColor={disabled ? Color.grayLight: Color.primary}
                disabled={disabled}
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

            <ModalImagePicker
                visible={modalImagePicker}
                onClose={() => {
                    setModalImagePicker(false);
                }}
                onSelected={(callback) => {
                    if (callback.base64) {
                        setThumbImage(callback.base64);
                        setMimeImage(callback.type);
                    }

                    setModalImagePicker(false);
                }}
            />
        </Scaffold>
    )
}

export default CreateThreadScreen;