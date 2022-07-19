import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
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

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;

const SurveyThird = ({route, navigation}) => {
    const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);
    const [namePengusaha, setNamePengusaha] = useState('');
    const [nameUsaha, setNameUsaha] = useState('');
    const [phoneUsaha, setPhoneUsaha] = useState('');
    const [merkProduksi, setmerkProduksi] = useState('');
    const [kegiatanUtama, setKegiatanUtama] = useState('');
    const [tepungTambahan, setTepungTambahan] = useState('');
    const [kegiatanTambahan, setKegiatanTambahan] = useState('');

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
	const { Color } = useColor();

	useEffect(() => {}, []);

    const submit = async () => {
        const label = ['namePengusaha', 'nameUsaha', 'merkProduksi', 'kegiatanUtama']
        const dataState = [namePengusaha, nameUsaha, merkProduksi, kegiatanUtama]
        let tempData = []
        label.forEach((element, index) => {
            tempData.push({
                block: '3',
                index: index,
                name: element,
                value: dataState[index]
            })
        });
        const valid = tempData.every(val => val.value)
        if(valid) navigation.navigate('SurveyTahuTempeFourth',{item: route.params.item.concat(tempData)})
        else alert('Data harus diisi semua')
        
    //    navigation.navigate('SurveyFourth')
      };

  return (
    <Scaffold
		header={<Header customIcon title="Survey Pabrik" type="regular" centerTitle={false} />}
		onPressLeftButton={() => navigation.pop()}
	>
        <ScrollView>
            <View style={{flexDirection: 'row',}}>
                <Image source={ImagesPath.survey3} style={{marginHorizontal: 10, height: 40, width: 40 }} resizeMode='contain' />
                <View style={{alignItems: 'flex-start', paddingVertical: 5}}>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>Informasi Kegiatan Usaha</Text>
                    <Text style={{fontSize: 10, color: Color.secondary}}>Deskripsikan kegiatan usaha kamu</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Adang Susanyo' style={{borderWidth: 1, borderColor: Color.border,
                        color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setNamePengusaha(value)}
                        value={namePengusaha}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Nama Pengusaha</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Adang Susanyo' style={{borderWidth: 1, borderColor: Color.border,
                        color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setNameUsaha(value)}
                        value={nameUsaha}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Nama Usaha</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='813-1234-5678' style={{borderWidth: 1, borderColor: Color.border,
                        color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 40, paddingTop: 20, height: 47}}
                        keyboardType='numeric'
                        onChangeText={(value) => setPhoneUsaha(value)}
                        value={phoneUsaha}
                    />
                    <Text style={{position: 'absolute', marginVertical: 17, marginHorizontal: 10, fontSize: 13}}>+62</Text>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>No Telepon</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Tempe Enak' style={{borderWidth: 1, borderColor: Color.border,
                        color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setmerkProduksi(value)}
                        value={merkProduksi}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Merk Produksi</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginTop: 20, marginBottom: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Masukkan deskripsi usaha . . . . . .' style={{borderWidth: 1, borderColor: Color.secondary,
                        color: Color.text,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 90}}
                        onChangeText={(value) => setKegiatanUtama(value)}
                        value={kegiatanUtama}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Kegiatan Utama</Text>
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

export default SurveyThird