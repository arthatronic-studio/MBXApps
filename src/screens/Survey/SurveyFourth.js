import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import RNSimpleCrypto from "react-native-simple-crypto";
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
	Text,
	// TouchableOpacity,
	Loading,
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
import CardListProduk from 'src/components/Card/CardListProduct';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment';
import axios from 'axios';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;

const SurveyFourth = ({route, navigation}) => {
    const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
    const [nameTepung, setNameTepung] = useState(['Segitiga Biru','Cakra Kembar']); 
    const [nameTempatTepung, setNameTempatTepung] = useState(['Warung','Minimarket']);
	const { Color } = useColor();

	useEffect(() => {}, []);

    const submit = async () => {
        const label = ['nameTempatTepung', 'nameTepung']
        const dataState = [nameTempatTepung, nameTepung]
        let tempData = []
        label.forEach((element, index) => {
            tempData.push({
                block: '4',
                index: index,
                name: element,
                value: dataState[index]
            })
        });
        console.log(tempData)
        const sha1Hash = await RNSimpleCrypto.SHA.sha1("SURVEY-20220229" + moment().format('YYYY-MM-DD HH:mm:ss') + '123!!qweQWE');
        const dataq = {
            "auth": sha1Hash, 
            "survey_code": "SURVEY-20220229", 
            "timestamps": moment().format('YYYY-MM-DD HH:mm:ss'),
            "data": route.params.item.concat(tempData)
        }
        console.log(dataq, 'dataq')
        axios
        try {
            const response = await axios({
                baseURL: 'http://panel.sw.tribesocial.id',
                method: 'post',
                url: '/submit-survey',
                data: dataq,
                headers: {
                    Accept: 'application/json'
                },
                timeout: 5000,
                
              });
              console.log(response, "respon apicall")
          } catch (error) {
            console.log(error.response, 'error apicall')
          }
      };


  return (
    <Scaffold
		header={<Header customIcon title="Survey" type="regular" centerTitle={false} />}
		onPressLeftButton={() => navigation.pop()}
	>
        <ScrollView>
            <View style={{flexDirection: 'row',}}>
                <Image source={ImagesPath.survey4} style={{marginHorizontal: 10, height: 40, width: 40 }} resizeMode='contain' />
                <View style={{alignItems: 'flex-start', paddingVertical: 5}}>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>Seputar Produk</Text>
                    <Text style={{fontSize: 10, color: Color.secondary}}>Survey seputar produk yang kamu gunakan</Text>
                </View>
            </View>
            <View style={{ marginHorizontal: 10 }}>
                <View style={{alignItems: 'flex-start', paddingVertical: 10}}>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>Merk tepung yang sering digunakan</Text>
                    <Text style={{fontSize: 10, color: Color.secondary}}>Anda dapat memilih lebih dari 1 pilihan</Text>
                </View>
                <View >
                    <Row style={{ flexWrap: 'wrap' }}>
                        {['Segitiga Biru','Cakra Kembar','Kunci Biru','Mila','Bola Salju','Gatotkaca','Kompas','Kompas','Lainnya'].map((val, id) => (
                            <TouchableOpacity style={{ borderColor: '#111', borderWidth: 2, borderRadius: 20, margin: 5 }}>
                                <Text style={{ marginHorizontal: 16, marginVertical: 8 }}>{val}</Text>
                            </TouchableOpacity>
                        ))}
                    </Row>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Masukkan pilihan lainnya' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Lainnya</Text>
                </View>
            </View>
            <View style={{ marginHorizontal: 10 }}>
                <View style={{alignItems: 'flex-start', paddingVertical: 10}}>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>Tempat Pembelian Tepung</Text>
                    <Text style={{fontSize: 10, color: Color.secondary}}>Anda dapat memilih lebih dari 1 pilihan</Text>
                </View>
                <View >
                    <Row style={{ flexWrap: 'wrap' }}>
                        {['Warung','Minimarket','Supermarket/Mall','Pasar','Online/E-Commerce','Lainnya'].map((val, id) => (
                            <TouchableOpacity style={{ borderColor: '#111', borderWidth: 2, borderRadius: 20, margin: 5 }}>
                                <Text style={{ marginHorizontal: 16, marginVertical: 8 }}>{val}</Text>
                            </TouchableOpacity>
                        ))}
                    </Row>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Masukkan pilihan lainnya' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Lainnya</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 10}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='0' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 40, paddingTop: 20, height: 47}}></TextInput>
                    <Text style={{position: 'absolute', marginVertical: 17,marginHorizontal: 10, fontSize: 13}}>Rp</Text>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Harga Tepung Perkilogram</Text>
                </View>
            </View>
            
        </ScrollView>
        <View style={{width: '100%', height: 70, alignItems: 'center', borderRadius: 10}}>
            <TouchableOpacity onPress={() => {submit()}} style={{backgroundColor: Color.primary, width: '90%', height: 45, borderRadius: 50, justifyContent: 'center'}}>
                <Text style={{color: Color.textInput}}>Lanjut</Text>
            </TouchableOpacity>
        </View>
    </Scaffold>
  )
}

export default SurveyFourth