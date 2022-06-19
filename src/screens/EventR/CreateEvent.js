import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNSimpleCrypto from "react-native-simple-crypto";
import { initialLatitude, initialLongitude } from 'src/utils/constants';

import {
	Text,
	// TouchableOpacity,
	
	useLoading,
	Scaffold,
	Row,
	Col,
	HeaderBig,
	useColor,
	Header
} from '@src/components';
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios';
import moment from 'moment';
import Ecommerce from '../Ecommerce/Ecommerce';
import FormSelect from 'src/components/FormSelect';
var crypto = require('crypto-js')

function sha1(data) {
}

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;

const CreateEvent = ({navigation}) => {
    const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
    const [name, setName] = useState(user ? user.firstName+' '+user.lastName : '');
    const [phone, setPhone] = useState(user ? user.phoneNumber : '');
    const [email, setEmail] = useState(user ? user.email : '');
    const [address, setAddress] = useState('');
    const [phonePetugas, setPhonePetugas] = useState('');
    const [nameKoor, setNameKoor] = useState('');
    const [phoneKoor, setPhoneKoor] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false); 
    const [showDatePicker2, setShowDatePicker2] = useState(false); 
    const [jamBukaOperasional, setjamBukaOperasional] = useState(new Date()); 
    const [jamTutupOperasional, setjamTutupOperasional] = useState(new Date()); 
	const { Color } = useColor();
    const [coords, setCoords] = useState({
      latitude: initialLatitude,
      longitude: initialLongitude,
    });


  const [modalSelectMap, setModalSelectMap] = useState(false);
  const [isPinnedMap, setIsPinnedMap] = useState(false);
  const [locationPinnedMap, setLocationPinnedMap] = useState('');

	useEffect( () => {
        // submit()
    }, []);

    const submit = async () => {
        const label = ['name', 'phone', 'email', 'namePetugas', 'phonePetugas', 'nameKoor', 'phoneKoor']
        const dataState = [name, phone, email, namePetugas, phonePetugas, nameKoor, phoneKoor]
        let tempData = []
        label.forEach((element, index) => {
            tempData.push({
                block: '1',
                index: index,
                name: element,
                value: dataState[index]
            })
        });
        console.log(tempData)
        // const sha1Hash = await RNSimpleCrypto.SHA.sha1("SURVEY-20220229" + moment().format('YYYY-MM-DD HH:mm:ss') + '123!!qweQWE');
        // const dataq = {
        //     "auth": sha1Hash, 
        //     "survey_code": "SURVEY-20220229", 
        //     "timestamps": moment().format('YYYY-MM-DD HH:mm:ss'),
        //     "data": tempData
        // }
        navigation.navigate('SurveySecond',{item: tempData})
        // try {
        //     const response = await axios({
        //         baseURL: 'http://panel.sw.tribesocial.id',
        //         method: 'post',
        //         url: '/submit-survey',
        //         data: dataq,
        //         headers: {
        //             Accept: 'application/json'
        //         },
        //         timeout: 5000,
                
        //       });
        //       console.log(response, "respon apicall")
        //   } catch (error) {
        //     console.log(error.response, 'error apicall')
        //   }
      };

  return (
    <Scaffold
		header={<Header customIcon title="Survey" type="regular" centerTitle={false} />}
		onPressLeftButton={() => navigation.pop()}
	>
        <ScrollView>
            {/* <Text onPress={() => navigation.navigate('Ecommerce')}>E-commerce</Text> */}
            <View style={{flexDirection: 'row',}}>
                <Image source={ImagesPath.survey1} style={{marginHorizontal: 10}}/>
                <View style={{alignItems: 'flex-start', paddingVertical: 5}}>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>Informasi Dasar</Text>
                    <Text style={{fontSize: 10, color: Color.secondary}}>Masukkan Informasi Seputar Event</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <Text style={{fontSize: 10, fontWeight: 'bold', marginVertical: 10}}>Nama Event</Text>
                <View style={{width: '100%'}}>
                    <TextInput
                        placeholder='Adang Susanyo'
                        style={{
                            borderWidth: 1, borderColor: Color.border, color: Color.text,
                            width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47
                        }}
                        onChangeText={(value) => setName(value)}
                        value={name}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Nama Responden</Text>
                </View>
            </View>
            <Row>
                <Col>
                    <View style={{ marginVertical:-10,  marginHorizontal: -6 }}>
                        <FormSelect
                            label='Jam Mulai'
                            placeholder='Pilih Jam'
                            value={moment(jamBukaOperasional).format('HH:mm')}
                            onPress={() => setShowDatePicker(true)}
                            // error={errorUserData.usageType}
                            suffixIcon={
                                <View style={{height: 20, width: '10%', paddingRight: 16, justifyContent: 'center', alignItems: 'flex-end'}}>
                                    <Text />
                                </View>
                            }
                        />
                </View>
                {showDatePicker && <DatePicker
                    modal
                    open={showDatePicker}   
                    date={jamBukaOperasional}
                    is24Hour={true}
                    mode="time"
                    onConfirm={(date) => {
                        console.log(date)
                        setShowDatePicker(false);
                        setjamBukaOperasional(date);
                    }}
                    onCancel={() => {
                        setShowDatePicker(false)
                    }}
                />}
                </Col>
                <Col>
                    <View style={{ marginVertical:-10, marginHorizontal: -6 }}>
                    <FormSelect
                        label='Jam Tutup'
                        placeholder='Pilih Jam'
                        value={moment(jamTutupOperasional).format('HH:mm')}
                        onPress={() => setShowDatePicker2(true)}
                        // error={errorUserData.usageType}
                        suffixIcon={
                            <View style={{height: 20, width: '10%', paddingRight: 16, justifyContent: 'center', alignItems: 'flex-end'}}>
                                <Text />
                            </View>
                        }
                    />
                </View>
                </Col>
            </Row>
            {showDatePicker2 && <DatePicker
                modal
                open={showDatePicker2}   
                date={jamTutupOperasional}
                is24Hour={true}
                mode="time"
                onConfirm={(date) => {
                    console.log(date)
                    setShowDatePicker2(false);
                    setjamTutupOperasional(date);
                }}
                onCancel={() => {
                    setShowDatePicker2(false)
                }}
            />}
            
            <View style={{alignItems: 'flex-start', marginHorizontal: 15}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Masukkan Lokasi Acara . . .' style={{borderWidth: 1, borderColor: Color.border,
                        color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, minHeight: 80}}
						onChangeText={(value) => setAddress(value)}
                        multiline
                        value={address}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Lokasi Acara</Text>
                </View>
            </View>
            <FormSelect
              type='select'
              label='Pin Lokasi'
              value={isPinnedMap ? 'Lokasi berhasil disimpan' || 'Lokasi di Pin' : ''}
              placeholder='Pilih di Peta'
              onPress={() => {
                setModalSelectMap(true);
              }}
            />
            <View style={{alignItems: 'flex-start', marginHorizontal: 15}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Masukkan Deskripsi Event . . ' style={{borderWidth: 1, borderColor: Color.border,
                        color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, minHeight: 80}}
						onChangeText={(value) => setAddress(value)}
                        multiline
                        value={address}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Deskripsi Event</Text>
                </View>
            </View>

        </ScrollView>
        <View style={{width: '100%', height: 70, alignItems: 'center', borderRadius: 10}}>
            <TouchableOpacity onPress={() => submit()} style={{backgroundColor: Color.primary, width: '90%', height: 45, borderRadius: 50, justifyContent: 'center'}}>
                <Text style={{color: Color.textInput}}>Lanjut</Text>
            </TouchableOpacity>
        </View>
    </Scaffold>
  )
}

export default CreateEvent