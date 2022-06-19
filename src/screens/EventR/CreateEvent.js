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
    const [namePetugas, setNamePetugas] = useState('');
    const [phonePetugas, setPhonePetugas] = useState('');
    const [nameKoor, setNameKoor] = useState('');
    const [phoneKoor, setPhoneKoor] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false); 
    const [showDatePicker2, setShowDatePicker2] = useState(false); 
    const [jamBukaOperasional, setjamBukaOperasional] = useState(new Date()); 
    const [jamTutupOperasional, setjamTutupOperasional] = useState(new Date()); 
	const { Color } = useColor();

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
            <View style={{ marginVertical:-10, marginHorizontal: -6 }}>
                <FormSelect
                    label='Jam Buka Operasional'
                    placeholder='Pilih Jam'
                    value={moment(jamBukaOperasional).format('HH:mm')}
                    onPress={() => setShowDatePicker(true)}
                    // error={errorUserData.usageType}
                    suffixIcon={
                        <View style={{height: '100%', width: '10%', paddingRight: 16, justifyContent: 'center', alignItems: 'flex-end'}}>
                            <AntDesign name='clockcircle' />
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
            <View style={{ marginVertical:-20, marginHorizontal: -6 }}>
                <FormSelect
                    label='Jam Tutup Operasional'
                    placeholder='Pilih Jam'
                    value={moment(jamTutupOperasional).format('HH:mm')}
                    onPress={() => setShowDatePicker2(true)}
                    // error={errorUserData.usageType}
                    suffixIcon={
                        <View style={{height: '100%', width: '10%', paddingRight: 16, justifyContent: 'center', alignItems: 'flex-end'}}>
                            <AntDesign name='clockcircle' />
                        </View>
                    }
                />
            </View>
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
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='813-1234-5678' style={{borderWidth: 1, borderColor: Color.border, color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 40, paddingTop: 20, height: 47}}
                        keyboardType='number-pad'
                        onChangeText={(value) => setPhone(value)}
                        value={phone}
                    />
                    <Text style={{position: 'absolute', marginVertical: 17, marginHorizontal: 10, fontSize: 13}}>+62</Text>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>No Telepon</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='contoh@gmail.com' style={{borderWidth: 1, borderColor: Color.border, color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setEmail(value)}
                        value={email}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Email</Text>
                </View>
            </View>
            {/* informasi petugas */}
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <Text style={{fontSize: 10, fontWeight: 'bold', marginVertical: 10}}>Informasi Petugas</Text>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Adang Susanyo' style={{borderWidth: 1, borderColor: Color.border, color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setNamePetugas(value)}
                        value={namePetugas}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Nama Petugas</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='813-1234-5678' style={{borderWidth: 1, borderColor: Color.border, color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 40, paddingTop: 20, height: 47}}    
                        keyboardType='number-pad'
                        onChangeText={(value) => setPhonePetugas(value)}
                        value={phonePetugas}
                    />
                    <Text style={{position: 'absolute', marginVertical: 17,marginHorizontal: 10, fontSize: 13}}>+62</Text>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>No Telepon</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Adang Susanyo' style={{borderWidth: 1, borderColor: Color.border, color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setNameKoor(value)}
                        value={nameKoor}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Nama Koordinator Kab/Kota</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='812-1234-5678' style={{borderWidth: 1, borderColor: Color.border, color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 40, paddingTop: 20, height: 47}}
                        keyboardType='number-pad'
                        onChangeText={(value) => setPhoneKoor(value)}
                        value={phoneKoor}
                    />
                    <Text style={{position: 'absolute', marginVertical: 17,marginHorizontal: 10, fontSize: 13}}>+62</Text>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>No. Telepon</Text>
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