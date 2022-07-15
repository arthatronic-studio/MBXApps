import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, useWindowDimensions, Image, SafeAreaView, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNSimpleCrypto from "react-native-simple-crypto";
import {launchImageLibrary} from 'react-native-image-picker';
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

import { queryContentProduct } from '@src/lib/query';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios';
import moment from 'moment';
import Ecommerce from '../../Ecommerce/Ecommerce';
import FormSelect from 'src/components/FormSelect';
import { mutationAddEvent } from 'src/lib/query/event';
import ModalSelectMap from 'src/components/ModalSelectMap';
import client from '@src/lib/apollo';
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

const EditEvent = ({navigation, route}) => {
    const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);
    const {width} = useWindowDimensions();
    console.log(route)
    const {item} = route.params

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
    const [name, setName] = useState(item.name);
    const [address, setAddress] = useState(item.location);

    const [province, setProvince] = useState(item.provinsi);
    const [city, setCity] = useState(item.kota);
    const [kecamatan, setKecamatan] = useState(item.kecamatan);
    const [kelurahan, setKelurahan] = useState(item.kelurahan);

    const [desc, setDes] = useState(item.description);
    const [showDatePicker3, setShowDatePicker3] = useState(false); 
    const [showDatePicker, setShowDatePicker] = useState(false); 
    const [showDatePicker2, setShowDatePicker2] = useState(false); 
    const [jamBukaOperasional, setjamBukaOperasional] = useState(new Date(item.date+' '+item.endTime)); 
    const [dateEvent, setDateEvent] = useState(new Date(item.date)); 
    const [jamTutupOperasional, setjamTutupOperasional] = useState(new Date(item.date+' '+item.startTime)); 
	const { Color } = useColor();
    const [coords, setCoords] = useState({
      latitude: item.lat ? item.lat : initialLatitude,
      longitude: item.lng ? item.lng : initialLongitude,
    });


  const [modalSelectMap, setModalSelectMap] = useState(false);
  const [isPinnedMap, setIsPinnedMap] = useState(item.lat ? true: false);
  const [locationPinnedMap, setLocationPinnedMap] = useState('');
  const [thumbImage, setThumbImage] = useState(item.images.length == 0 ? '' : item.images[0]);
  const [mimeImage, setMimeImage] = useState('image/jpeg');

	useEffect( () => {
        // submit()
    }, []);

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
            // listThumbImage.push('data:image/png;base64,'+ callback.base64)
          }
        });
      };

      const submit = async () => {
        showLoading()
        const variables = {
            type: 'UPDATE',
            newEvent: {
                name,
                provinsi: province,
                kota: city,
                kecamatan,
                kelurahan,
                location: address,
                description: desc,
                startTime: moment(jamBukaOperasional).format('hh:mm'),
                endTime: moment(jamTutupOperasional).format('hh:mm'),
                date: moment(dateEvent).format('YYYY-MM-DD'),
                lat: ""+coords.latitude,
                lng: ""+coords.longitude,
                images: thumbImage ? item.images.length ==  0 ? ['data:image/png;base64,'+thumbImage] : item.images[0] == thumbImage ? undefined : ['data:image/png;base64,'+thumbImage] : undefined
            },
            eventId: item.id
        }
        console.log(variables)
        client.mutate({mutation: mutationAddEvent, variables})
        .then(res => {
            hideLoading();
            console.log(res);
            if (res.data.eventManage) {
                alert('Event berhasil diupdate')
                setTimeout(() => {
                    navigation.pop()
                }, 1000);
            }
        })
        .catch(reject => {
            hideLoading();
            console.log(reject.message, 'reject');
        });
      };

  return (
    <Scaffold
		header={<Header customIcon title="" type="regular" centerTitle={false} />}
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
            <TouchableOpacity onPress={() => {
                addImage();
              }} style={{ height: width/2+40,  marginVertical: 15, backgroundColor: '#CDD1D2' }}>
                <ImageBackground source={{uri: item.images.length == 0 ? '' : item.images[0] == thumbImage ? thumbImage :  thumbImage ? 'data:image/png;base64,'+thumbImage : ''}} style={{ height: width/2+40,justifyContent: 'center', }}>
                    <FontAwesome name='image' color='#111' size={25} style={{ alignSelf: 'center', marginBottom: 9 }}  />
                    <Text type='medium'>Upload Poster Event</Text>
                </ImageBackground>
            </TouchableOpacity>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <Text style={{fontSize: 10, fontWeight: 'bold', marginVertical: 10}}>Nama Event</Text>
                <View style={{width: '100%'}}>
                    <TextInput
                        placeholder='Masukkan Nama Event . . .'
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
            <Row style={{ marginTop: -20, marginBottom: -30 }}>
                <Col>
                    <View style={{   marginHorizontal: -6 }}>
                        <FormSelect
                            labelInside='Jam Mulai'
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
                    <View style={{  marginHorizontal: -6 }}>
                    <FormSelect
                        labelInside='Jam Tutup'
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
            <View style={{ marginVertical:-10,  marginHorizontal: -6 }}>
                <FormSelect
                    labelInside='Mulai Acara'
                    placeholder='01/01/1990'
                    value={moment(dateEvent).format('DD/MM/YYYY')}
                    onPress={() => setShowDatePicker3(true)}
                    minimumDate={new Date()}
                    // error={errorUserData.usageType}
                    suffixIcon={
                        <View style={{height: 20, width: '10%', paddingRight: 16, justifyContent: 'center', alignItems: 'flex-end'}}>
                            <Text />
                        </View>
                    }
                />
                {showDatePicker3 && <DatePicker
                    modal
                    open={showDatePicker3}   
                    date={dateEvent}
                    is24Hour={true}
                    mode="date"
                    onConfirm={(date) => {
                        console.log(date)
                        setShowDatePicker3(false);
                        setDateEvent(date);
                    }}
                    onCancel={() => {
                        setShowDatePicker3(false)
                    }}
                />}
        </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10}}>
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
            <View style={{ marginHorizontal: -6, marginVertical: -10 }}>
                <FormSelect
                type='select'
                labelInside='Pin Lokasi'
                value={isPinnedMap ? 'Lokasi berhasil disimpan' || 'Lokasi di Pin' : ''}
                placeholder='Pilih di Peta'
                onPress={() => {
                    setModalSelectMap(true);
                }}
                />
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Masukkan Deskripsi Event . . ' style={{borderWidth: 1, borderColor: Color.border,
                        color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, minHeight: 80}}
						onChangeText={(value) => setDes(value)}
                        multiline
                        value={desc}
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
        <ModalSelectMap
          visible={modalSelectMap}
          extraProps={{
            title: 'Alamat Saya',
            fullAddress: '',
            ...coords,
          }}
          onSelect={(item) => {
            // const name = item.name;
            const spl = item.fullAddress.split(",");
            const fullAddress = item.fullAddress;
            const latitude = item.latitude;
            const longitude = item.longitude;

            const provinceName = item.provinceName
            const cityName = item.cityName
            const kecName = spl[3]
            const kelName = spl[2]

            // const provinceName = item.provinceName ? item.provinceName : state.userData.provinceName;
            // const cityName = item.cityName ? item.cityName : state.userData.cityName;
            // const postCode = item.postCode ? item.postCode : state.userData.postCode;

            setProvince(provinceName)
            setCity(cityName)
            setKecamatan(kecName)
            setKelurahan(kelName)

            setIsPinnedMap(true);
            setLocationPinnedMap(fullAddress);
            setCoords({
              latitude,
              longitude,
            });

            // setState({
            //   userData: {
            //     ...state.userData,
            //     fullAddress,
            //     latitude,
            //     longitude,
            //     provinceName,
            //     cityName,
            //     postCode,
            //   }
            // });
          }}
          onClose={() => setModalSelectMap(false)}
        />
    </Scaffold>
  )
}

export default EditEvent