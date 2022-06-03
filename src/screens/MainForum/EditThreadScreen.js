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
    Button,
    Alert,
    Row
  } from '@src/components';
import { TouchSelect } from '@src/components/Form';
import ModalSelectStatus from '@src/components/Modal/ModalSelectStatus';
import validate from '@src/lib/validate';

import Client from '@src/lib/apollo';
import { queryProductManage } from '@src/lib/query';
import { Divider } from 'src/styled';
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

const EditThreadScreen = (props) => {
    const { navigation, route } = props;
    const { params } = route;
    const eventDate = parseInt(params.eventDate);

    const { height } = useWindowDimensions();
    const { Color } = useColor();

    const [userData, setUserData] = useState({
        code: params.code,
        name: params.productName,
        image: '',
        status: params.status,
        method: 'UPDATE',
        type: params.productType,
        category: params.productCategory,
        description: params.productDescription,
        latitude: '',
        longitude: '',
        eventDate: Moment(eventDate).isValid() ? new Date(eventDate) : new Date(),
    });
    const [error, setError] = useState({
        name: null,
        image: null,
        description: null,
    });
    const [thumbImage, setThumbImage] = useState('');
    const [mimeImage, setMimeImage] = useState('image/jpeg');
    const [selectedStatus, setSelectedStatus] = useState({
        label: params.status === 'PRIVATE' ? 'Privasi' : 'Publik',
        value: params.status,
        iconName: params.status === 'PRIVATE' ? 'lock-closed' : 'globe',
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

    const onSubmit = (status) => {
        Keyboard.dismiss();

        // if (thumbImage === '') {
        //     showPopup('Silahkan pilih gambar terlebih dulu', 'warning');
        //     return;
        // }

        if (userData.name === '') {
            showPopup('Silahkan isi judul terlebih dulu', 'warning');
            return;
        }

        if (userData.description === '') {
            showPopup('Silahkan isi deskripsi terlebih dulu', 'warning');
            return;
        }

        showLoading();

        let objProduct = userData;
        objProduct.eventDate = Moment(userData.eventDate).format('YYYY-MM-DD HH:mm:ss');
        if (status) objProduct.status = status;
        if (thumbImage !== '') objProduct.image = thumbImage;

        let variables = {
            products: [objProduct],
        };

        console.log(variables, 'variables');
        
        Client.query({
            query: queryProductManage,
            variables,
        })
        .then((res) => {
            console.log(res, '=== Berhsail ===');
            showLoading('success', 'Berhasil!');

            setTimeout(() => {
                // navigation.navigate('ForumSegmentScreen', { ...params, componentType: 'LIST', refresh: true });
                navigation.popToTop();
            }, 2500);
        })
        .catch((err) => {
            console.log(err, 'errrrr');
            showLoading('error', 'Gagal, Harap ulangi kembali');
        });
    }

    const showEvent = userData.category === 'EVENT';
    console.log('showEvent', userData);
    
    return (
        <MainView style={{backgroundColor: Color.theme}}>
            <Header
                title={params.title}
                // iconRightButton={<Entypo name='trash' size={18} />}
            />

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
                        <Text size={12} letterSpacing={0.08} style={{fontWeight: 'bold', marginVertical: 10}}>Gambar Cover</Text>
                    </LabelInput>
                    
                </View>

                {thumbImage !== '' ?
                    <TouchableOpacity
                        onPress={() => {}}
                        style={{width: '100%', height: height / 3, borderRadius: 4, alignItems: 'center'}}
                    >
                        <Image
                            style={{width: '92%',position: 'absolute',height: '100%', aspectRatio: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                            source={{ uri: `data:${mimeImage};base64,${thumbImage}` }}
                        />
                    </TouchableOpacity>
                :
                    <View
                        onPress={() => {}}
                        style={{width: '100%', height: height / 3, borderRadius: 4, alignItems: 'center'}}
                    >
                        <Image
                            style={{width: '92%',position: 'absolute',height: '100%', aspectRatio: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                            source={{ uri: params.image }}
                        />
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
                        style={{width: '30%', backgroundColor: 'rgba(255,255,255,0.2)', top: 120,height: 40, borderRadius: 4, borderWidth: 1,marginTop: 5,borderColor: Color.textInput, alignItems: 'center', justifyContent: 'center'}}
                    >
                        <Text style={{color: Color.textInput, fontSize: 10}}>Ganti Gambar</Text>
                    </TouchableOpacity>
                    </View>
                }

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

                <Divider />
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
                            <Text size={7} letterSpacing={0.08} style={{opacity: 0.6}}>Tag</Text>
                        </LabelInput>
                    </EmailRoundedView>
                    <ErrorView>
                        {/* <Text type='medium' color={Color.error}>error</Text> */}
                    </ErrorView>
                </View>
                <Button
                    color={Color.theme}
                    fontColor={Color.error}
                    onPress={() => {
                        Alert('Hapus', 'Apakah Anda yakin akan menghapus postingan ini?', () => onSubmit('REMOVE'))
                    }}
                >
                    Hapus Posting
                </Button>

                <Divider />
            </ScrollView>

            <Submit
                buttonLabel='Simpan'
                buttonColor={Color.green}
                type='bottomSingleButton'
                buttonBorderTopWidth={0.5}
                onPress={() => {
                    onSubmit();
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
        </MainView>
    )
}

export default EditThreadScreen;