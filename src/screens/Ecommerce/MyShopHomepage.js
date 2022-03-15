import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, SafeAreaView, TextInput as TextInputs, Pressable } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
import { TouchableOpacity } from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import { TextInput } from 'src/components/Form';
import CardListProduk from 'src/components/Card/CardListProduct';
import TopTabShop from './TopTabShop';
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

const MyShopHomepage = ({ navigation }) => {
	const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
	const { Color } = useColor();

	useEffect(() => {}, []);
	return (
		<Scaffold
		header={<Header customIcon title="Toko Kamu" type="regular" centerTitle={false} />}
		onPressLeftButton={() => navigation.pop()}
		>
			<ScrollView style={{backgroundColor: Color.semiwhite}}>
				<View style={{backgroundColor: Color.textInput, width: '92%', height: 240,
						borderRadius: 8, elevation: 5, marginTop: 20, marginHorizontal: 16,
						}}>
					<Image source={ImagesPath.shopbanner} style={{width: '100%', resizeMode: 'contain'}}/>
					<Image source={ImagesPath.shopprofile} style={{alignSelf: 'center', position: 'absolute', marginVertical: 20}}/>
					<View style={{width: '100%', height: 50}}></View>
					<Text>Toko Sumber Makmur</Text>
					<View style={{alignSelf: 'center', flexDirection: 'row', marginVertical: 6}}>
						<View style={{flexDirection: 'row', marginHorizontal: 5}}>
							<Entypo name={'location-pin'} size={12} style={{color:Color.secondary}}/>
							<Text style={{fontSize: 10, paddingHorizontal: 3, color: Color.secondary}}>Tangerang, Banten</Text>
						</View>
						<View style={{flexDirection: 'row', marginHorizontal: 5}}>
							<FontAwesome name={'phone'} size={12} style={{color:Color.secondary,paddingVertical: 2}}/>
							<Text style={{fontSize: 10, paddingHorizontal: 5, color: Color.secondary}}>0813-1234-5678</Text>
						</View>
					</View>
					<View style={{alignItems: 'center', marginVertical: 20}}>
						<Pressable style={{borderWidth: 1, borderColor: Color.primary, height: 30, width: '30%', borderRadius: 3}}>
							<View style={{flexDirection: 'row', paddingVertical: 5, justifyContent: 'center', alignItems: 'center'}}>
								<AntDesign name={'edit'} size={14} style={{color: Color.primary ,paddingHorizontal: 5}}/>
								<Text style={{color: Color.primary ,fontSize: 10, paddingHorizontal: 5}}>Edit Toko</Text>
							</View>
						</Pressable>
					</View>
				</View>
				<View style={{flexDirection: 'row', marginVertical: 10, width: '92%', height: 70, backgroundColor: '#3C58C1', borderRadius: 5,
							alignSelf: 'center', paddingHorizontal: 20, paddingVertical: 22}}>
					<View style={{width: '90%'}}>
						<Text style={{color: Color.textInput, fontSize: 10, textAlign: 'left'}}>Saldo Toko</Text>
						<Text style={{color: Color.textInput, fontSize: 14, fontWeight: 'bold', textAlign: 'left'}}>Rp. 200.000</Text>
					</View>
					<View>
						<MaterialIcons name={'keyboard-arrow-right'} size={30} style={{color: Color.textInput}}/>
					</View>
				</View>
				<View style={{width: '92%', height: 100, backgroundColor: Color.textInput, alignSelf: 'center',
						borderRadius: 5}}>
					<View style={{flexDirection: 'row'}}>
						<Text style={{fontSize: 10, fontWeight: 'bold', width: '70%', textAlign: 'left',
							paddingHorizontal: 10, paddingVertical: 8}}>Penjualan</Text>
						<Text style={{fontSize: 10, color: Color.primary, paddingVertical: 8, paddingHorizontal: 5, width: '30%'}}>Lihat Riwayat</Text>
					</View>
					<View style={{alignItems: 'center', justifyContent: 'center',flexDirection: 'row', borderWidth: 1, borderColor: Color.border, height: '60%', width: '95%',
							alignSelf: 'center', borderRadius: 5}}>
						<View style={{marginHorizontal: 5,flexDirection: 'row', borderRadius: 20, width: 30, height: 30, backgroundColor: '#761AAB', alignItems: 'center', justifyContent: 'center'}}>
							<FontAwesome name={'inbox'} size={20} style={{color: Color.textInput}}/>
						</View>
						<View style={{flexDirection: 'column', marginHorizontal: 5}}>
							<View style={{flexDirection: 'row'}}>
								<Text style={{fontWeight: 'bold', fontSize: 11}}>Pesanan Masuk</Text>
								<View style={{marginHorizontal: 5, marginVertical: 5, backgroundColor: Color.error, width: 5, height: 5, borderRadius: 20}}></View>
							</View>
							<Text style={{fontSize: 10, textAlign: 'left'}}>12 Pesanan Baru</Text>
						</View>
						<View style={{backgroundColor: Color.border, width: 2, height: 15, marginHorizontal: 25}}></View>
						<View style={{marginHorizontal: 5,flexDirection: 'row', borderRadius: 20, width: 30, height: 30, backgroundColor: Color.primary, alignItems: 'center', justifyContent: 'center'}}>
							<FontAwesome5 name={'shopping-cart'} size={15} style={{color: Color.textInput}}/>
						</View>
						<View style={{flexDirection: 'column', marginHorizontal: 5}}>
							<View style={{flexDirection: 'row',}}>
								<Text style={{fontWeight: 'bold', fontSize: 11, textAlign: 'left'}}>Siap Dikirim</Text>
								<View style={{marginHorizontal: 5, marginVertical: 5, backgroundColor: Color.error, width: 5, height: 5, borderRadius: 20}}></View>
							</View>
							<Text style={{fontSize: 10, textAlign: 'left', color: Color.secondary}}>8 Barang</Text>
						</View>
					</View>
					
				</View>
				<View style={{backgroundColor: Color.textInput, width: '92%', height: 90, marginVertical: 10, alignSelf: 'center',
						borderRadius: 5}}>
					<Text style={{textAlign: 'left', fontSize: 10, color: Color.primary, fontWeight: 'bold',
							paddingHorizontal: 10, paddingVertical: 10}}
							onPress={() => navigation.navigate('AddProduct')}>+ Tambah Produk</Text>
					<Pressable style={{backgroundColor: Color.semiwhite, width: '95%', height: '55%',
							alignSelf: 'center', borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
						<FontAwesome5 name={'box'} size={20} style={{color: Color.text, paddingHorizontal: 20,}}/>
						<TouchableOpacity style={{width: '70%'}} onPress={()=>{navigation.navigate('MyProduct')}}>
							<Text style={{fontSize: 11, fontWeight: 'bold', textAlign: 'left'}}>Produk Kamu</Text>
							<Text style={{fontSize: 10, fontWeight: 'normal', textAlign: 'left'}}>2 Produk Terdaftar</Text>
						</TouchableOpacity>
						<MaterialIcons name={'keyboard-arrow-right'} size={30} style={{color: Color.text, width: '13%'}}/>
					</Pressable>
				</View>
				<View style={{backgroundColor: Color.textInput, width: '92%', height: 125, alignSelf: 'center', borderRadius: 5}}>
					<Text style={{fontSize: 11, fontWeight: 'bold', textAlign: 'left', paddingHorizontal: 10, paddingVertical: 10}}>Kata Pembeli</Text>
					<View style={{width: '95%', height: 1, backgroundColor: Color.border, alignSelf: 'center'}}></View>
					<Pressable style={{flexDirection: 'row', marginVertical: 10}}>
						<TouchableOpacity onPress={()=>{navigation.navigate('Review')}} style={{textAlign: 'left', width: '90%', fontSize: 14, paddingHorizontal: 10}}><Text style={{textAlign:'left'}}>Ulasan</Text></TouchableOpacity>
						<MaterialIcons name={'keyboard-arrow-right'} size={20} style={{color: Color.text, width: '13%'}}/>
					</Pressable>
					<Pressable style={{flexDirection: 'row', marginVertical: 10}}>
						<Text style={{textAlign: 'left', width: '90%', fontSize: 14, paddingHorizontal: 10}}>Pesanan dikomplain</Text>
						<MaterialIcons name={'keyboard-arrow-right'} size={20} style={{color: Color.text, width: '13%'}}/>
					</Pressable>
				</View>
				<View style={{marginVertical: 10, backgroundColor: Color.textInput, width: '92%', height: 125, alignSelf: 'center', borderRadius: 5}}>
					<Text style={{fontSize: 11, fontWeight: 'bold', textAlign: 'left', paddingHorizontal: 10, paddingVertical: 10}}>Bantuan Toko</Text>
					<View style={{width: '95%', height: 1, backgroundColor: Color.border, alignSelf: 'center'}}></View>
					<Pressable style={{flexDirection: 'row', marginVertical: 10}} onPress={() => navigation.navigate("MerchantSetting")} >
						<Text style={{textAlign: 'left', width: '90%', fontSize: 14, paddingHorizontal: 10}}>Pengaturan Toko</Text>
						<MaterialIcons name={'keyboard-arrow-right'} size={20} style={{color: Color.text, width: '13%'}}/>
					</Pressable>
					<Pressable style={{flexDirection: 'row', marginVertical: 10}}>
						<Text style={{textAlign: 'left', width: '90%', fontSize: 14, paddingHorizontal: 10}}>Bantuan</Text>
						<MaterialIcons name={'keyboard-arrow-right'} size={20} style={{color: Color.text, width: '13%'}}/>
					</Pressable>
				</View>
			</ScrollView>
		</Scaffold>
	);
};

export default MyShopHomepage;
