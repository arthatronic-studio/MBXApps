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
import DropDownPicker from 'react-native-dropdown-picker';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;

    

const SurveySecond = ({ route, navigation}) => {
    const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
	const { Color } = useColor();

    const [open, setOpen] = useState(false);

    const [address, setAddress] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [kecamatan, setKecamatan] = useState('');
    const [kelurahan, setKelurahan] = useState('');
	


	useEffect(() => {submit()}, []);

	const submit = async () => {
        const label = ['address','province','city','kecamatan','kelurahan']
        const dataState = [address, province, city, kecamatan, kelurahan]
        let tempData = []
        label.forEach((element, index) => {
            tempData.push({
                block: '2',
                index: index,
                name: element,
                value: dataState[index]
            })
        });
        // console.log('route', route.params.item.concat(tempData))
        navigation.navigate('SurveyThird',{item: route.params.item.concat(tempData)})
        // console.log(dataq, 'dataq')
      };

  return (
    <Scaffold
		header={<Header customIcon title="Survey" type="regular" centerTitle={false} />}
		onPressLeftButton={() => navigation.pop()}
	>
        <ScrollView>
            <View style={{flexDirection: 'row',}}>
                <Image source={ImagesPath.survey2} style={{marginHorizontal: 10}}/>
                <View style={{alignItems: 'flex-start', paddingVertical: 5}}>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>Alamat Responden</Text>
                    <Text style={{fontSize: 10, color: Color.secondary}}>Masukkan alamat lengkap</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginTop: 20, marginBottom: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Masukkan alamat lengkap . . .' style={{borderWidth: 1, borderColor: Color.secondary,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 90}}
						onChangeText={(value) => setAddress(value)}
                        value={address}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Alamat lengkap</Text>
                </View>
            </View>
            <View style={{height: 500}}>
			<View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Banten' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setProvince(value)}
                        value={province}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Provinsi</Text>
                </View>
            </View>
			<View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Tangerang' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setCity(value)}
                        value={city}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Kota/Kabupaten</Text>
                </View>
            </View>
			<View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Jatiuwung' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setKecamatan(value)}
                        value={kecamatan}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Kecamatan</Text>
                </View>
            </View>
			<View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Keroncong' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}
                        onChangeText={(value) => setKelurahan(value)}
                        value={kelurahan}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Kelurahan</Text>
                </View>
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

export default SurveySecond