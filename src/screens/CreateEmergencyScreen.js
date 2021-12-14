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
    useColor
  } from '@src/components';
import { TouchSelect } from '@src/components/Form';
import ModalSelectPriority from '@src/components/Modal/ModalSelectPriority';
import ModalSelectStatus from '@src/components/Modal/ModalSelectStatus';
import validate from '@src/lib/validate';

import Client from '@src/lib/apollo';
import { queryProductManage } from '@src/lib/query';
import { Box, Divider } from 'src/styled';
import DatePicker from 'react-native-date-picker';
import Moment from 'moment';

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
const CustomTouch = Styled(TouchableOpacity)`
    backgroundColor: transparent;
`;

const CreateEmergencyScreen = (props) => {
    const { navigation, route } = props;
    const { params } = route;

    const { height } = useWindowDimensions();
    const { Color } = useColor();

    const [userData, setUserData] = useState({
        code: '',
        name: '',
        image: '',
        status: 'PRIVATE', // PUBLISH | DRAFT | PRIVATE | REMOVE
        method: 'INSERT', // UPDATE | DELETE
        type: params.productType,
        category: params.productSubCategory,
        description: '',
        priority: 'High',
        date: date ? date : Moment(new Date()).format('DD-MM-YYYY') ,
        
    
    });
    console.log('liat userdata',userData.date)
    const [error, setError] = useState({
        name: null,
        image: null,
        description: null,
        date: null,
        
    });
    const [thumbImage, setThumbImage] = useState('');
    const [mimeImage, setMimeImage] = useState('image/jpeg');
    const [selectedPriority, setSelectedPriority] = useState({
        id: 3, value: 'High'
    });

    const [selectedStatus, setSelectedStatus] = useState({
        id: 2, value: 'PRIVATE', iconName: 'lock-closed'
    });

    // ref
    const modalSelectPriorityRef = useRef();
    const modalSelectStatusRef = useRef();

    // hooks
    const [loadingProps, showLoading, hideLoading] = useLoading();
    const [popupProps, showPopup] = usePopup();

    //Tanggal 
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
  
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        }
    }, []);
  
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
        if (userData.date === '') {
            showPopup('Silahkan isi Tanggal terlebih dulu', 'warning');
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
                CreatedDate:date,
            }],
        };

        console.log(variables, 'variables');
        

        Client.query({
            query: queryProductManage,
            variables,
        })
        .then((res) => {
            console.log(res, '=== Berhsail ===');
            showLoading('success', 'Emergency berhasil dibuat!');

            setTimeout(() => {
                // navigation.navigate('ForumSegmentScreen', { ...params, componentType: 'LIST', refresh: true });
                navigation.navigate('MainHome');
            }, 2500);
        })
        .catch((err) => {
            console.log(err, 'errrrr');
            showLoading('error', 'Gagal membuat Emergency, Harap ulangi kembali');
        });
    }
    
    return (
        <MainView style={{backgroundColor: Color.theme}}>
            <Header
                showLeftButton={false}
                title={`Buat ${params.title}`}
            />

            <ScrollView>
                <View style={{paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12}}>
                    <LabelInput>
                        <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Gambar</Text>
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

                <View style={{paddingHorizontal: 16, paddingTop: 24}}>
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
                            onChangeText={(text) => onChangeUserData('name', text)}
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
                <View style={{paddingHorizontal: 16, paddingTop: 24}}>
                    <LabelInput>
                        <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Tanggal</Text>
                    </LabelInput>
                    <EmailRoundedView>
                        <CustomTouch title="Open" onPress={() => setOpen(true)}>
                            <EmailRoundedView>
                                <View style={{height: 34, paddingRight: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                                    <Text size={14} style={{marginTop: 2}}></Text>
                                    <Text>{userData.date ? userData.date : 'Pilih Tanggal '} </Text>
                                    <Ionicons name='calendar' color={Color.text} />
                                </View>
                            </EmailRoundedView>
                        </CustomTouch>
                    </EmailRoundedView>

                    <ErrorView>
                        {/* <Text type='medium' color={Color.error}>error</Text> */}
                    </ErrorView>

                    {open && <DatePicker
                        modal
                        open={open}
                        date={date}
                        mode="date"
                        onConfirm={(date) => {
                            setOpen(false);
                            setDate(date);
                            onChangeUserData('date', Moment(date).format('DD-MM-YYYY'));
                            console.log('koko',date);
                        }}
                        onCancel={() => {
                            setOpen(false)
                        }}
                    />}
                </View>

                <TouchSelect
                    title='Siapa yang dapat melihat ini?'
                    value={userData.status}
                    iconName={selectedStatus.iconName}
                    onPress={() => modalSelectStatusRef.current.open()}
                />

                <TouchSelect
                    title='Priority'
                    value={userData.priority}
                    onPress={() => modalSelectPriorityRef.current.open()}
                />
            </ScrollView>

            {/* android - untuk mencegah klik laundry bag yang belakang ikut ter klik */}
            <Box
                size={70}
                style={{position: 'absolute', bottom: -40}}
            />
            {/*  */}

            <Submit
                buttonLabel='Buat'
                buttonColor={Color.primary}
                type='bottomSingleButton'
                buttonBorderTopWidth={0.5}
                onPress={() => {
                    onSubmit();
                }}
            />

            <Divider height={24} />

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

            <ModalSelectPriority
                ref={modalSelectPriorityRef}
                selected={selectedPriority}
                onPress={(e) => {
                    onChangeUserData('priority', e.value);
                    setSelectedPriority(e);
                    modalSelectPriorityRef.current.close();
                }}
            />
        </MainView>
    )
}

export default CreateEmergencyScreen;