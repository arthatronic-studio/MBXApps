import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import RNSimpleCrypto from "react-native-simple-crypto";
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {launchImageLibrary} from 'react-native-image-picker';
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
import FormSelect from 'src/components/FormSelect';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;

const tepung = [{name: 'Pasar Basah Modern', checked: false},
{name: 'Pasar Basah Tradisional', checked: false},
{name: 'Pasar Hewan', checked: false},
{name: 'Pasar Pakaian', checked: false},
{name: 'Pasar Grosiran', checked: false},
{name: 'Lainnya', checked: false, label: ''}]

const tempaTepung = [{name: 'Warung', checked: false},
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
    const [showDatePicker, setShowDatePicker] = useState(false); 
    const [showDatePicker2, setShowDatePicker2] = useState(false); 
    const [nameTepung, setNameTepung] = useState([{name: 'Pasar Basah Modern', checked: false},
    {name: 'Pasar Basah Tradisional', checked: false},
    {name: 'Pasar Hewan', checked: false},
    {name: 'Pasar Pakaian', checked: false},
    {name: 'Pasar Grosiran', checked: false},
    {name: 'Lainnya', checked: false, label: ''}]); 
    const [pedagangDaging, setPedagangDaging] = useState(''); 
    const [pedagangFMCG, setPedagangFMCG] = useState(''); 
    const [pedagangIkan, setPedagangIkan] = useState(''); 
    const [pedagangMakanan, setPedagangMakanan] = useState(''); 
    const [pedagangSayurBuah, setPedagangSayurBuah] = useState(''); 
    const [pengunjungPerHari, setPengunjungPerhari] = useState(''); 
    const [penjualanFMCG, setPenjualanFMCG] = useState(''); 
    const [penjualanFMCG2, setPenjualanFMCG2] = useState(''); 
    const [penjualanFMCG3, setPenjualanFMCG3] = useState(''); 
    const [jamBukaOperasional, setjamBukaOperasional] = useState(new Date()); 
    const [jamTutupOperasional, setjamTutupOperasional] = useState(new Date()); 
    const [thumbImage, setThumbImage] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [logistik, setLogistik] = useState('Pribadi'); 

    
    const [refresh, setRefresh] = useState(0);
    const [nameTempatTepung, setNameTempatTepung] = useState([{name: 'Warung', checked: false},
    {name: 'Minimarket', checked: false},
    {name: 'Supermarket/Mall', checked: false},
    {name: 'Pasar', checked: false},
    {name: 'Online/E-Commerce', checked: false},
    {name: 'Lainnya', checked: false}]);
	const { Color } = useColor();

	useEffect(() => {
    }, []);

    const submit = async () => {
        const label = [ 'logistik', 'jamBukaOperasional', 'jamTutupOperasional', 'namaPasar','pedagangDaging','pedagangFMCG','pedagangIkan','pedagangMakanan','pedagangSayurBuah','pengunjungPerHari','penjualanFMCG','penjualanFMCG2','penjualanFMCG3' ]
        let tempData = []
        const tempPasar = []
        nameTepung.forEach(element => {
            if(element.checked){
                tempPasar.push(element.name)
            }
        });

        const dataState = [logistik, moment(jamBukaOperasional).format('HH:mm'), moment(jamTutupOperasional).format('HH:mm'), tempPasar,pedagangDaging,pedagangFMCG,pedagangIkan,pedagangMakanan,pedagangSayurBuah,pengunjungPerHari,penjualanFMCG,penjualanFMCG2,penjualanFMCG3 ]
        label.forEach((element, index) => {
                tempData.push({
                    block: '4',
                    index: index,
                    name: element,
                    value: dataState[index]
                })
        });
        const valid = tempData.every(val => val.value);

        if(!valid) return alert('Semua data harus diisi');

        const sha1Hash = await RNSimpleCrypto.SHA.sha1("SURVEY-20220229" + moment().format('YYYY-MM-DD HH:mm:ss') + '123!!qweQWE');
        const dataq = {
            "auth": sha1Hash, 
            "survey_code": "SURVEY-20220229", 
            "timestamps": moment().format('YYYY-MM-DD HH:mm:ss'),
            "caption_code": "pasar",
            "data": route.params.item.concat(tempData)
        }
        console.log(dataq, 'dataq')

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

              hideLoading();
              
              onUploadImage();
              console.log(response, "respon apicall")
          } catch (error) {
            hideLoading()
            alert(error.response.data.message);
            console.log(error.response, 'error apicall')
          }
    };

    const onUploadImage = async() => {
        const sha1Hash = await RNSimpleCrypto.SHA.sha1("SURVEY-20220229" + moment().format('YYYY-MM-DD HH:mm:ss') + '123!!qweQWE');
        
        const data = new FormData();

        const images = {
            'block': 4,
            'index': 11,
            'name': 'photo',
            'value': photos[0]
        };

        data.append('auth', sha1Hash);
        data.append('survey_code', 'SURVEY-20220229');
        data.append('timestamps', moment().format('YYYY-MM-DD HH:mm:ss'));
        data.append('caption_code', 'pasar');
        // data.append('data[][photo]', images);
        data.append('data[][photo]', images);

        console.log(data);

        // route.params.item.concat(tempData)

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        // force
        setTimeout(() => {
            navigation.popToTop();
        }, 2000);

        try {
            const requestHttp = axios.create({ baseURL: 'http://panel.sw.tribesocial.id/' });

            const response = await requestHttp.post('survey-form-file', data, config);

            console.log('response uploading', response);
            alert('Success send survey');
            // navigation.popToTop();
        } catch (error) {
            console.log('error uploading', error.response);
            alert(error.response.data.message);
        }
    }

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

      const addImage = () => {
        const options = {
          mediaType: 'photo',
          maxWidth: 640,
          maxHeight: 640,
          multiple: true,
          quality: 0.5,
          includeBase64: true,
        };
    
        launchImageLibrary(options, callback => {
          if (callback.base64) {
              console.log(callback);

              const newPhotos = [...photos];
              newPhotos.push({
                uri: callback.uri,
                type: callback.type,
                name: callback.fileName
              });

              if (thumbImage.length == 0) {
                setThumbImage([`data:${callback.type};base64,${callback.base64}`]);
                setPhotos(newPhotos);
              }
              else {
                setThumbImage(thumbImage.concat(`data:${callback.type};base64,${callback.base64}`));
                setPhotos(newPhotos);
              }
          }
        });
    };

    const onDeleteImagee = (id) => {
        const dataIma = thumbImage
        dataIma.splice(id, 1);

        const newPhotos = [...photos];
        newPhotos.splice(id, 1);

        setThumbImage(dataIma);
        setRefresh(refresh+1);
        setPhotos(newPhotos);
    }

  return (
    <Scaffold
		header={<Header customIcon title="Survey Pasar" type="regular" centerTitle={false} />}
		onPressLeftButton={() => navigation.pop()}
	>
        <ScrollView>
            <View style={{flexDirection: 'row',}}>
                <Image source={ImagesPath.survey3} style={{marginHorizontal: 10, height: 40, width: 40 }} resizeMode='contain' />
                <View style={{alignItems: 'flex-start', paddingVertical: 5}}>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>Seputar Pasar</Text>
                    <Text style={{fontSize: 10, color: Color.secondary}}>Survey seputar pasar yang kamu kunjungi</Text>
                </View>
            </View>
            {thumbImage.length != 0 && <Row style={{ flexWrap: 'wrap', flex: 1 }}>
                {thumbImage.map((val, id) => (
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
                            <Image
                            style={{
                                height: '100%',
                                aspectRatio: 1,
                                borderRadius: 4,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            source={{uri: val}}
                            />
                            <TouchableOpacity onPress={() => onDeleteImagee(id)} style={{ position: 'absolute', zIndex: 1, top: 8, right: 10 }}>
                                <AntDesign
                                    name={'close'}
                                    size={22}
                                    style={{color: 'red', paddingVertical: 5}}
                                />
                            </TouchableOpacity>
                        </TouchableOpacity>
                ))}
            </Row>}
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
              <AntDesign
                name={'camerao'}
                size={22}
                style={{color: Color.secondary, paddingVertical: 5}}
              />
            <Text style={{color: Color.secondary, fontSize: 12}}>
                Tambah Foto
              </Text>
            </TouchableOpacity>
            <Text size={10} style={{ marginBottom: 20 }}>*)Setelah melakukan geotagging infrastruktur lengkapi foto infrastruktur pintu masuk, tampak luar, tampak dalam, tampak samping kanan kiri dan tengah pasar</Text>

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
                        color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Lainnya</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='20' style={{borderWidth: 1, borderColor: Color.border,
                        color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setPengunjungPerhari(value)}
                        keyboardType='numeric'
                        value={pengunjungPerHari}></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Jumlah Pengunjung per Hari</Text>
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
                <Text align='left' size={12} color={Color.secondary} style={{ marginBottom: 4 }}>Pilih sumber logistik</Text>
                <Row>
                    <TouchableOpacity onPress={() => setLogistik('Pribadi')} style={{ height: 20, width: 20, borderRadius: 15, backgroundColor: Color.primary, justifyContent: 'center', alignItems: 'center' }}>
                        {logistik == 'Pribadi' && <View style={{ height: 14, width: 14, borderRadius: 7, backgroundColor: '#fff' }} />}
                    </TouchableOpacity>
                    <Text size={12}>  Pribadi     </Text>
                    <TouchableOpacity onPress={() => setLogistik('Sewa')} style={{ height: 20, width: 20, borderRadius: 15, backgroundColor: Color.primary, justifyContent: 'center', alignItems: 'center' }}>
                        {logistik == 'Sewa' && <View style={{ height: 14, width: 14, borderRadius: 7, backgroundColor: '#fff' }} />}
                    </TouchableOpacity>
                    <Text size={12}>  Sewa</Text>
                </Row>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='100' style={{borderWidth: 1, borderColor: Color.border,
                        color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setPedagangFMCG(value)}
                        keyboardType='numeric'
                        value={pedagangFMCG}></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Jumlah Pedagang FMCG</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <Text style={{fontSize: 8, color: Color.secondary, paddingVertical: 5}}>Produk FMCG Penjualan Tertinggi di</Text>
                <View style={{width: '100%'}}>
                    <TextInput placeholder={"1. Pasar Pakaian "} style={{borderWidth: 1, marginBottom: 10, borderColor: Color.border,
                        color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 0, minHeight: 30}}
                        onChangeText={(value) => setPenjualanFMCG(value)}
                        value={penjualanFMCG}></TextInput>
                    <TextInput placeholder={"2. Pasar Grosiran"} style={{borderWidth: 1, marginBottom: 10, borderColor: Color.border,
                        color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 0, minHeight: 30}}
                        onChangeText={(value) => setPenjualanFMCG2(value)}
                        value={penjualanFMCG2}></TextInput>
                    <TextInput placeholder={"3. Pasar Modern"} style={{borderWidth: 1, marginBottom: 10, borderColor: Color.border,
                        color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 0, minHeight: 30}}
                        onChangeText={(value) => setPenjualanFMCG3(value)}
                        value={penjualanFMCG3}>
                    </TextInput>
                </View>
            </View>


            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='14' style={{borderWidth: 1, borderColor: Color.border,
                        color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setPedagangMakanan(value)}
                        keyboardType='numeric'
                        value={pedagangMakanan} ></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Jumlah Pedagang Makanan</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='10' style={{borderWidth: 1, borderColor: Color.border,
                        color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setPedagangSayurBuah(value)}
                        keyboardType='numeric'
                        value={pedagangSayurBuah} ></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Jumlah Pedagang Sayur/Buah</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='20' style={{borderWidth: 1, borderColor: Color.border,
                        color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setPedagangIkan(value)}
                        keyboardType='numeric'
                        value={pedagangIkan} ></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Jumlah Pedagang Ikan</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='20' style={{borderWidth: 1, borderColor: Color.border,
                        color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setPedagangDaging(value)}
                        keyboardType='numeric'
                        value={pedagangDaging} ></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Jumlah Pedagang Daging</Text>
                </View>
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