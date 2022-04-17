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

let tepung = [{name: 'Pasar Basah Modern', checked: false},
{name: 'Cakra Kembar', checked: false},
{name: 'Pasar Basah Tradisional', checked: false},
{name: 'Pasar Hewan', checked: false},
{name: 'Pasar Pakaian', checked: false},
{name: 'Pasar Grosiran', checked: false},
{name: 'Lainnya', checked: false, label: ''}]

let tempaTepung = [{name: 'Warung', checked: false},
{name: 'Minimarket', checked: false},
{name: 'Supermarket/Mall', checked: false},
{name: 'Pasar', checked: false},
{name: 'Online/E-Commerce', checked: false},
{name: 'Lainnya', checked: false}]

let temp = []
let tempTempat = []
const SurveyThird = ({route, navigation}) => {
    const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
    const [nameTepung, setNameTepung] = useState(tepung); 
    const [pedagangDaging, setPedagangDaging] = useState(''); 
    const [pedagangFMCG, setPedagangFMCG] = useState(''); 
    const [pedagangIkan, setPedagangIkan] = useState(''); 
    const [pedagangMakanan, setPedagangMakanan] = useState(''); 
    const [pedagangSayurBuah, setPedagangSayurBuah] = useState(''); 
    const [pengunjungPerHari, setPengunjungPerhari] = useState(''); 
    const [penjualanFMCG, setPenjualanFMCG] = useState(''); 
    
    const [refresh, setRefresh] = useState(0);
    const [nameTempatTepung, setNameTempatTepung] = useState(tempaTepung);
	const { Color } = useColor();

	useEffect(() => {
        temp = []
        tempTempat = []
    }, []);

    const submit = async () => {
        const label = ['nameTepung','pedagangDaging','pedagangFMCG','pedagangIkan','pedagangMakanan','pedagangSayurBuah','pengunjungPerHari','penjualanFMCG' ]
        let tempData = []
        const tempPasar = []
        nameTepung.forEach(element => {
            if(element.checked){
                tempPasar.push(element.name)
            }
        });
        const dataState = [tempPasar,pedagangDaging,pedagangFMCG,pedagangIkan,pedagangMakanan,pedagangSayurBuah,pengunjungPerHari,penjualanFMCG ]
        label.forEach((element, index) => {
                tempData.push({
                    block: '4',
                    index: index,
                    name: element,
                    value: dataState[index]
                })
        });
        const sha1Hash = await RNSimpleCrypto.SHA.sha1("SURVEY-20220229" + moment().format('YYYY-MM-DD HH:mm:ss') + '123!!qweQWE');
        const dataq = {
            "auth": sha1Hash, 
            "survey_code": "SURVEY-20220229", 
            "timestamps": moment().format('YYYY-MM-DD HH:mm:ss'),
            "caption_code": pasar,
            "data": route.params.item.concat(tempData)
        }
        console.log(dataq, 'dataq')
        axios
        try {
            showLoading()
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
              hideLoading()
              alert('Success send survey')
              navigation.popToTop()
              console.log(response, "respon apicall")
          } catch (error) {
            hideLoading()
            alert(error.response.data.message)
            console.log(error.response, 'error apicall')
          }
      };

      const onSelected = (data, index) => {
        let tempx = nameTepung
        tempx[index].checked=data
        setNameTepung(tempx)
        setRefresh(refresh+1)
      }

      const onSelectedTempat = (data, index) => {
        let tempx = nameTempatTepung
        tempx[index].checked=data
        setNameTempatTepung(tempx)
        setRefresh(refresh+1)
      }


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
                    <Text style={{fontSize: 10, color: Color.secondary}}>Survey seputar pasar yang kamu kunjungi</Text>
                </View>
            </View>
            <View style={{ marginHorizontal: 10 }}>
                <View style={{alignItems: 'flex-start', paddingVertical: 10}}>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>Klasifikasi Pasar</Text>
                    <Text style={{fontSize: 10, color: Color.secondary}}>Anda dapat memilih lebih dari 1 pilihan</Text>
                </View>
                <View >
                    <Row style={{ flexWrap: 'wrap' }}>
                        {nameTepung.map((val, id) => (
                            <TouchableOpacity key={id} onPress={() => onSelected(!val.checked, id)} style={{ borderColor: val.checked ? '#fff' : '#111', backgroundColor: !val.checked ? '#fff' : 'orange', borderWidth: 2, borderRadius: 20, margin: 5 }}>
                                <Text style={{ marginHorizontal: 16, marginVertical: 8 }} color={val.checked ? '#fff' : '#000'}>{val.name}</Text>
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
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='100' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setPengunjungPerhari(value)}
                        value={pengunjungPerHari}></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Jumlah Pengunjung per Hari</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='100' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setPedagangFMCG(value)}
                        value={pedagangFMCG}></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Jumlah Pedagang FMCG</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Pasar' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setPenjualanFMCG(value)}
                        value={penjualanFMCG}></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Produk FMCG Penjualan Tertinggi di</Text>
                </View>
            </View>


            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='14' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setPedagangMakanan(value)}
                        value={pedagangMakanan} ></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Jumlah Pedagang Makanan</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='10' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setPedagangSayurBuah(value)}
                        value={pedagangSayurBuah} ></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Jumlah Pedagang Sayur/Buah</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='20' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setPedagangIkan(value)}
                        value={pedagangIkan} ></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Jumlah Pedagang Ikan</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='20' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setPedagangDaging(value)}
                        value={pedagangDaging} ></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Jumlah Pedagang Daging</Text>
                </View>
            </View>
            <View>
                
            </View>
            
            
            
        </ScrollView>
        <View style={{width: '100%', height: 70, alignItems: 'center', borderRadius: 10}}>
            <TouchableOpacity onPress={() => {submit()}} style={{backgroundColor: Color.primary, width: '90%', height: 45, borderRadius: 50, justifyContent: 'center'}}>
                <Text style={{color: Color.textInput}}>Lanjut</Text>
            </TouchableOpacity>
        </View>
      <Loading {...loadingProps} />
    </Scaffold>
  )
}

export default SurveyThird