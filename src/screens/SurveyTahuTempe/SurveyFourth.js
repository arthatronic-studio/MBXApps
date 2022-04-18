import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import RNSimpleCrypto from "react-native-simple-crypto";
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchImageLibrary} from 'react-native-image-picker';

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

let tepung = [{name: 'Tahu', checked: false},
{name: 'Tempe', checked: false},
{name: 'Kerupuk', checked: false},
{name: 'Lainnya', checked: false, label: ''}]

let tempaTepung = [{name: 'Warung', checked: false},
{name: 'Minimarket', checked: false},
{name: 'Supermarket/Mall', checked: false},
{name: 'Pasar', checked: false},
{name: 'Online/E-Commerce', checked: false},
{name: 'Lainnya', checked: false}]

let temp = []
let tempTempat = []
const SurveyFourth = ({route, navigation}) => {
    const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
    const [nameTepung, setNameTepung] = useState(tepung); 
    const [tenagaKerja, setTenagaKerja] = useState(''); 
    const [hariKerja, setHariKerja] = useState(''); 
    const [kapasitasProduksi, setKapasitasProduksi] = useState(''); 
    const [luasBangunan, setLuasBangunan] = useState(''); 
    const [luasTanah, setLuasTanah] = useState(''); 
    const [tempatJual, setTempatJual] = useState(tempaTepung); 
    const [kapasitasMesin, setKapasitasMesin] = useState(''); 

  const [thumbImage, setThumbImage] = useState(null);
  const [mimeImage, setMimeImage] = useState('image/jpeg');
    
    const [refresh, setRefresh] = useState(0);
    const [nameTempatTepung, setNameTempatTepung] = useState(tempaTepung);
	const { Color } = useColor();

	useEffect(() => {
        temp = []
        tempTempat = []
    }, []);

    const submit = async () => {
        const label = ['tempatJual', 'nameTempatTepung', 'nameTepung','tenagaKerja','hariKerja','kapasitasMesin','kapasitasProduksi','luasBangunan','luasTanah']
        let tempData = []
        const tempProduk = []
        nameTepung.forEach(element => {
            if(element.checked){
                tempProduk.push(element.name)
            }
        });
        const tempTempat = []
        nameTempatTepung.forEach(element => {
            if(element.checked){
                tempTempat.push(element.name)
            }
        });
        const tempJual = []
        tempatJual.forEach(element => {
            if(element.checked){
                tempJual.push(element.name)
            }
        });
        const dataState = [tempJual, tempTempat, tempProduk, tenagaKerja, hariKerja, kapasitasMesin, kapasitasProduksi, luasBangunan, luasTanah]
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
            "caption_code": "pabrik",
            "survey_code": "SURVEY-20220229", 
            "timestamps": moment().format('YYYY-MM-DD HH:mm:ss'),
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

      const onSelectedJual = (data, index) => {
        let tempx = tempatJual
        tempx[index].checked=data
        setTempatJual(tempx)
        setRefresh(refresh+1)
      }

      const addImage = () => {
        const options = {
          mediaType: 'photo',
          maxWidth: 640,
          maxHeight: 640,
          quality: 1,
          includeBase64: true,
        };
    
        launchImageLibrary(options, callback => {
          if (callback.base64) {
            setThumbImage(callback.base64);
            setMimeImage(callback.type);
          }
        });
      };


  return (
    <Scaffold
		header={<Header customIcon title="Survey Tahu Tempe" type="regular" centerTitle={false} />}
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
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>Jenis Produk yang sering digunakan</Text>
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
            <View style={{ marginHorizontal: 10 }}>
                <View style={{alignItems: 'flex-start', paddingVertical: 10}}>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>Tempat Pembelian Bahan Baku</Text>
                    <Text style={{fontSize: 10, color: Color.secondary}}>Anda dapat memilih lebih dari 1 pilihan</Text>
                </View>
                <View >
                    <Row style={{ flexWrap: 'wrap' }}>
                        {nameTempatTepung.map((val, id) => (
                            <TouchableOpacity key={id} onPress={() => onSelectedTempat(!val.checked, id)} style={{ borderColor: val.checked ? '#fff' : '#111', backgroundColor: !val.checked ? '#fff' : 'orange', borderWidth: 2, borderRadius: 20, margin: 5 }}>
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
                    <TextInput placeholder='2' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setTenagaKerja(value)}
                        value={tenagaKerja}></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Jumlah Tenaga Kerja</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='2' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setHariKerja(value)}
                        value={hariKerja}></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Jumlah Tenaga Kerja</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='2' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setKapasitasProduksi(value)}
                        value={kapasitasProduksi}></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Jumlah Tenaga Kerja</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='2' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setLuasBangunan(value)}
                        value={luasBangunan}></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Jumlah Tenaga Kerja</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='2' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setLuasTanah(value)}
                        value={luasTanah}></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Jumlah Tenaga Kerja</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='2' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setKapasitasMesin(value)}
                        value={kapasitasMesin}></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Jumlah Tenaga Kerja</Text>
                </View>
            </View>
           
            <View style={{ marginHorizontal: 10 }}>
                <View style={{alignItems: 'flex-start', paddingVertical: 10}}>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>Tempat Penjualan Barang</Text>
                    <Text style={{fontSize: 10, color: Color.secondary}}>Anda dapat memilih lebih dari 1 pilihan</Text>
                </View>
                <View >
                    <Row style={{ flexWrap: 'wrap' }}>
                        {tempatJual.map((val, id) => (
                            <TouchableOpacity key={id} onPress={() => onSelectedJual(!val.checked, id)} style={{ borderColor: val.checked ? '#fff' : '#111', backgroundColor: !val.checked ? '#fff' : 'orange', borderWidth: 2, borderRadius: 20, margin: 5 }}>
                                <Text style={{ marginHorizontal: 16, marginVertical: 8 }} color={val.checked ? '#fff' : '#000'}>{val.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </Row>
                </View>
            </View>

          {/* <View>
            <Text
              style={{
                width: '50%',
                textAlign: 'left',
                paddingHorizontal: 20,
                fontWeight: 'bold',
                fontSize: 10,
              }}>
              Foto Produk
            </Text>
          </View> */}
            <TouchableOpacity
              onPress={() => {
                addImage();
              }}
              style={{
                width: '30%',
                borderWidth: 1,
                borderColor: Color.text,
                height: 100,
                borderStyle: 'dashed',
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 20,
                marginVertical: 12,
              }}>
                  {thumbImage && <Image
                  style={{
                    height: '100%',
                    aspectRatio: 1,
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  source={{uri: `data:${mimeImage};base64,${thumbImage}`}}
                />}
              {!thumbImage && <AntDesign
                name={'camerao'}
                size={22}
                style={{color: Color.secondary, paddingVertical: 5}}
              />}
              {!thumbImage && <Text style={{color: Color.secondary, fontSize: 12}}>
                Tambah Foto
              </Text>}
            </TouchableOpacity>

            
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

export default SurveyFourth