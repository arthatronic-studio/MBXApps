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

    

const SurveySecond = ({navigation}) => {
    const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
	const { Color } = useColor();

    const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'},
	{label: 'Pear', value: 'apple'},
    {label: 'Manggo', value: 'banana'},
	{label: 'Melon', value: 'apple'},
    {label: 'Manggosteen', value: 'banana'},
	{label: 'Pineaple', value: 'apple'},
    {label: 'Rambutans', value: 'banana'}
  ]);

	useEffect(() => {}, []);
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
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 90}}></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Alamat lengkap</Text>
                </View>
            </View>
            <View style={{height: 500}}>
			<View style={{ width: '95%',marginHorizontal: 10, marginBottom: 20, marginTop: 5}}>
						<Text 
							style={{
								paddingHorizontal: 15,
								paddingTop: 5,
								color: Color.secondary,
								fontSize: 8,
								fontWeight: '400',
								textAlign: 'left'
							}}>Provinsi</Text>
						<DropDownPicker
                        zIndex={3000}
                        zIndexInverse={1000}
							placeholder='- Pilih Provinsi -'
							open={open}
							value={value}
							items={items}
							setOpen={setOpen}
							setValue={setValue}
							setItems={setItems}
							style={{position: 'absolute', paddingHorizontal: 12, paddingBottom: 5,marginHorizontal: 1,borderWidth: 0, width: '99%', height: 28}}
							/>
						<View style={{position: 'absolute',width: '100%',height: 47, 
						borderWidth: 1, borderColor: Color.secondary, borderRadius: 5}}/>
			</View>
            <View style={{width: '95%',marginHorizontal: 10, marginVertical: 20}}>
						<Text 
							style={{
								paddingHorizontal: 15,
								paddingTop: 5,
								color: Color.secondary,
								fontSize: 8,
								fontWeight: '400',
								textAlign: 'left'
							}}>Provinsi</Text>
						<DropDownPicker
                        zIndex={2000}
                        zIndexInverse={2000}
							placeholder='- Kota/Kabupaten -'
							open={open}
							value={value}
							items={items}
							setOpen={setOpen}
							setValue={setValue}
							setItems={setItems}
							style={{position: 'absolute',paddingHorizontal: 12, paddingBottom: 5,marginHorizontal: 1,borderWidth: 0, width: '99%', height: 28}}
							/>
						<View style={{position: 'absolute',width: '100%',height: 47, 
						borderWidth: 1, borderColor: Color.secondary, borderRadius: 5}}/>
			</View>
			<View style={{width: '95%',marginHorizontal: 10, marginTop: 20, marginBottom: 20}}>
						<Text 
							style={{
								paddingHorizontal: 15,
								paddingTop: 5,
								color: Color.secondary,
								fontSize: 8,
								fontWeight: '400',
								textAlign: 'left'
							}}>Provinsi</Text>
						<DropDownPicker
                        zIndex={2000}
                        zIndexInverse={2000}
							placeholder='- Pilih Kecamatan -'
							open={open}
							value={value}
							items={items}
							setOpen={setOpen}
							setValue={setValue}
							setItems={setItems}
							style={{position: 'absolute',paddingHorizontal: 12, paddingBottom: 5,marginHorizontal: 1,borderWidth: 0, width: '99%', height: 28}}
							/>
						<View style={{position: 'absolute',width: '100%',height: 47, 
						borderWidth: 1, borderColor: Color.secondary, borderRadius: 5}}/>
			</View>
			<View style={{width: '95%',marginHorizontal: 10, marginVertical: 20}}>
						<Text 
							style={{
								paddingHorizontal: 15,
								paddingTop: 5,
								color: Color.secondary,
								fontSize: 8,
								fontWeight: '400',
								textAlign: 'left'
							}}>Provinsi</Text>
						<DropDownPicker
                        zIndex={2000}
                        zIndexInverse={2000}
							placeholder='- Pilih Desa/Kelurahan -'
							open={open}
							value={value}
							items={items}
							setOpen={setOpen}
							setValue={setValue}
							setItems={setItems}
							style={{position: 'absolute',paddingHorizontal: 12, paddingBottom: 5,marginHorizontal: 1,borderWidth: 0, width: '99%', height: 28}}
							/>
						<View style={{position: 'absolute',width: '100%',height: 47, 
						borderWidth: 1, borderColor: Color.secondary, borderRadius: 5}}/>
			</View>
			<View style={{width: '95%',marginHorizontal: 10, marginVertical: 20}}>
						<Text 
							style={{
								paddingHorizontal: 15,
								paddingTop: 5,
								color: Color.secondary,
								fontSize: 8,
								fontWeight: '400',
								textAlign: 'left'
							}}>Provinsi</Text>
						<DropDownPicker
                        zIndex={2000}
                        zIndexInverse={2000}
							placeholder='- Pilih Desa/Kelurahan -'
							open={open}
							value={value}
							items={items}
							setOpen={setOpen}
							setValue={setValue}
							setItems={setItems}
							style={{position: 'absolute',paddingHorizontal: 12, paddingBottom: 5,marginHorizontal: 1,borderWidth: 0, width: '99%', height: 28}}
							/>
						<View style={{position: 'absolute',width: '100%',height: 47, 
						borderWidth: 1, borderColor: Color.secondary, borderRadius: 5}}/>
			</View>
			<View style={{borderRadius: 5, width: '95%',marginHorizontal: 10, marginVertical: 20, borderWidth: 1, borderColor: Color.secondary, height: 200}}>
				<Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left', paddingHorizontal: 10, paddingVertical: 5,}}>Koordinat Lokasi</Text>
			</View>
			</View>
        </ScrollView>
		<View style={{width: '100%', height: 70, alignItems: 'center', borderRadius: 10}}>
            <TouchableOpacity onPress={() => navigation.navigate('SurveyThird')} style={{backgroundColor: Color.primary, width: '90%', height: 45, borderRadius: 50, justifyContent: 'center'}}>
                <Text style={{color: Color.textInput}}>Lanjut</Text>
            </TouchableOpacity>
        </View>
    </Scaffold>
  )
}

export default SurveySecond