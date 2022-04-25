import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, SafeAreaView, TextInput as TextInputs, Pressable, useWindowDimensions } from 'react-native';
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
import TopTabShop from './TopTabShop';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MyShopHeader from './MyShopHeader';
import { queryGetMyProduct, queryGetMyShop } from 'src/lib/query/ecommerce';
import { useIsFocused } from '@react-navigation/native';
import { Container } from 'src/styled';

const MyShopHomepage = ({ navigation }) => {
	const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);

	const [data, setData] = useState([]);
	const [loadingProps, showLoading, hideLoading] = useLoading();
	const { Color } = useColor();
	const isFocused = useIsFocused();
	const { height, width } = useWindowDimensions();

	useEffect(() => {
		getMyShop();
	}, []);

	const getMyShop = () => {
		let variables = {
			merchantId: undefined,
		};

		Client.query({ query: queryGetMyShop })
			.then(res => {
				console.log(res, 'ress')
				if (res.data.ecommerceGetMerchant) {
					if (res.data.ecommerceGetMerchant.id) {
						setData(res.data.ecommerceGetMerchant);
					} else {
						navigation.replace('SplashCreateShop')
					}
				}

				// hideLoading();
				// navigation.navigate('TopUpScreen');
			})
			.catch(reject => {
				console.log(reject);
			});
	};

	return (
		<Scaffold
			header={<MyShopHeader />}
			onPressLeftButton={() => navigation.pop()}
			fallback={data.length === 0}
		>
			<ScrollView style={{ backgroundColor: Color.semiwhite }}>
				<Container padding={16}>
					<Pressable
						onPress={() => navigation.navigate('MyShop')}
					>
						<View style={{ backgroundColor: Color.textInput, borderRadius: 8, ...shadowStyle, }}>
							<View style={{ width: '100%', aspectRatio: 4 / 1 }}>
								<Image source={ImagesPath.shopbanner} style={{ width: '100%', height: '100%' }} />
							</View>

							<View style={{ width: '100%', position: 'absolute', top: width / 8, alignItems: 'center' }}>
								<View style={{ width: width / 4, aspectRatio: 1 }}>
									<Image source={{ uri: data.profileImg }} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
								</View>
							</View>

							<View style={{ marginTop: width / 6 }}>
								<Text>{data.name}</Text>
							</View>

							<View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', marginTop: 6, paddingHorizontal: 8 }}>
								<View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 5, justifyContent: 'flex-end'}}>
									<Entypo name={'location-pin'} size={12} style={{ color: Color.secondary }} />
									<Text align='left' style={{ fontSize: 10, paddingHorizontal: 3, color: Color.secondary }}>{data.cityName}, {data.provinceName}</Text>
								</View>
								<View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 5 }}>
									<FontAwesome name={'phone'} size={12} style={{ color: Color.secondary, paddingVertical: 2 }} />
									<Text align='left' style={{ fontSize: 10, paddingHorizontal: 5, color: Color.secondary }}>{data.noTelp}</Text>
								</View>
							</View>

							<View style={{ alignItems: 'center', marginVertical: 16 }}>
								<Pressable onPress={() => navigation.navigate('EditMerchantInfo', { item: data })} style={{ borderWidth: 1, borderColor: Color.primary, height: 30, width: '30%', borderRadius: 3 }}>
									<View style={{ flexDirection: 'row', paddingVertical: 5, justifyContent: 'center', alignItems: 'center' }}>
										<AntDesign name={'edit'} size={14} style={{ color: Color.primary, paddingHorizontal: 5 }} />
										<Text style={{ color: Color.primary, fontSize: 10, paddingHorizontal: 5 }}>Edit Toko</Text>
									</View>
								</Pressable>
							</View>
						</View>
					</Pressable>

					{/* hide saldo toko */}
					{/* <View
						style={{
							flexDirection: 'row', marginVertical: 16, width: '92%', height: 70, backgroundColor: '#3C58C1', borderRadius: 5,
							alignSelf: 'center', paddingHorizontal: 20, paddingVertical: 22
						}}
					>
						<View style={{ width: '90%' }}>
							<Text style={{ color: Color.textInput, fontSize: 10, textAlign: 'left' }}>Saldo Toko</Text>
							<Text style={{ color: Color.textInput, fontSize: 14, fontWeight: 'bold', textAlign: 'left' }}>Rp. 200.000</Text>
						</View>
						<View>
							<MaterialIcons name={'keyboard-arrow-right'} size={30} style={{ color: Color.textInput }} />
						</View>
					</View> */}

					<View style={{ width: '100%', marginTop: 16, }}>
						<View style={{
							width: '100%',
							padding: 16,
							backgroundColor: Color.textInput,
							alignSelf: 'center',
							borderRadius: 5,
						}}>
							<View style={{ flexDirection: 'row' }}>
								<Text style={{
									fontSize: 10,
									fontWeight: 'bold', width: '70%', textAlign: 'left',
								}}>Penjualan</Text>
								<Text
									align='right'
									onPress={() => navigation.navigate('IncomingOrder', { item: data })}
									style={{ fontSize: 10, color: Color.primary, width: '30%' }}
								>Lihat Riwayat</Text>
							</View>
							<View style={{
								marginTop: 12,
								alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderWidth: 1, borderColor: Color.border, width: '100%',
								alignSelf: 'center', borderRadius: 5,
								paddingVertical: 8,
							}}>
								<View style={{ marginHorizontal: 5, flexDirection: 'row', borderRadius: 20, width: 30, height: 30, backgroundColor: '#761AAB', alignItems: 'center', justifyContent: 'center' }}>
									<FontAwesome name={'inbox'} size={20} style={{ color: Color.textInput }} />
								</View>
								<Pressable onPress={() => navigation.navigate('IncomingOrder', { item: data, routeName: "Dikemas" })} style={{ flexDirection: 'column', marginHorizontal: 5 }}>
									<View style={{ flexDirection: 'row' }}>
										<Text style={{ fontWeight: 'bold', fontSize: 11 }}>Pesanan Masuk</Text>
										<View style={{ marginHorizontal: 5, marginVertical: 5, backgroundColor: Color.error, width: 5, height: 5, borderRadius: 20 }}></View>
									</View>
									<Text style={{ fontSize: 10, textAlign: 'left' }}>{data.incomingOrdersCount} Pesanan Baru</Text>
								</Pressable>
								<View style={{ backgroundColor: Color.border, width: 2, height: 15, marginHorizontal: 25 }}></View>
								<View style={{ marginHorizontal: 5, flexDirection: 'row', borderRadius: 20, width: 30, height: 30, backgroundColor: Color.primary, alignItems: 'center', justifyContent: 'center' }}>
									<FontAwesome5 name={'shopping-cart'} size={15} style={{ color: Color.textInput }} />
								</View>
								<Pressable onPress={() => navigation.navigate('IncomingOrder', { item: data, routeName: "Dikirim" })} style={{ flexDirection: 'column', marginHorizontal: 5 }}>
									<View style={{ flexDirection: 'row', }}>
										<Text style={{ fontWeight: 'bold', fontSize: 11, textAlign: 'left' }}>Siap Dikirim</Text>
										<View style={{ marginHorizontal: 5, marginVertical: 5, backgroundColor: Color.error, width: 5, height: 5, borderRadius: 20 }}></View>
									</View>
									<Text style={{ fontSize: 10, textAlign: 'left', color: Color.secondary }}>{data.productsToBeSentCount} Barang</Text>
								</Pressable>
							</View>
						</View>
					</View>

					<View style={{marginTop: 8,}}>
						<View style={{
							backgroundColor: Color.theme, width: '100%', marginVertical: 10, alignSelf: 'center',
							borderRadius: 5, padding: 16,
						}}>
							<Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'left', marginBottom: 12 }}>Produk</Text>
							<Pressable style={{
								backgroundColor: Color.semiwhite, width: '100%',
								alignSelf: 'center', borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
								paddingVertical: 8,
							}}>
								<FontAwesome5 name={'box'} size={20} style={{ color: Color.text, paddingHorizontal: 20, }} />
								<TouchableOpacity style={{ width: '70%' }} onPress={() => { navigation.navigate('MyProduct') }}>
									<Text style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'left' }}>Produk Kamu</Text>
									<Text style={{ fontSize: 10, fontWeight: 'normal', textAlign: 'left' }}>Produk Terdaftar</Text>
								</TouchableOpacity>
								<MaterialIcons name={'keyboard-arrow-right'} size={30} style={{ color: Color.text, width: '13%' }} />
							</Pressable>
							<Pressable onPress={() => navigation.navigate('MyAuction')}>
								<View 
									style={{
										flexDirection: 'row', 
										alignItems: 'center', 
										justifyContent: 'space-between', 
										paddingHorizontal: 16, 
										marginTop: 14
									}}
								>
									<Text align='left'>Lelang Produk</Text>
									<MaterialIcons name={'keyboard-arrow-right'} size={20} style={{ color: Color.text}} />
								</View>
							</Pressable>
							{/* hide lelang produk */}
							{/* <View style={{ borderRadius: 5, flexDirection: 'row', marginHorizontal: 10, width: '95%', alignItems: 'center' }}>
								<Text style={{ width: '92%', textAlign: 'left' }}>Lelang Produk</Text>
								<MaterialIcons name={'keyboard-arrow-right'} size={20} style={{ color: Color.text, width: '13%' }} />
							</View> */}
						</View>
					</View>

					<View style={{ marginTop: 8, backgroundColor: Color.textInput, width: '100%', alignSelf: 'center', borderRadius: 5, paddingHorizontal: 16 }}>
						<Text style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'left', paddingVertical: 10 }}>Kata Pembeli</Text>
						<View style={{ width: '100%', height: 1, backgroundColor: Color.border, alignSelf: 'center' }}></View>
						<Pressable onPress={() => { navigation.navigate('Review') }} style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', justifyContent: 'space-between' }}>
							<View style={{width: '85%'}}>
								<Text align='left'>Ulasan</Text>
							</View>
							<View style={{ backgroundColor: Color.error, width: 13, height: 13, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
								<Text style={{ color: Color.textInput, fontSize: 8 }}>9</Text>
							</View>
							<MaterialIcons name={'keyboard-arrow-right'} size={20} style={{ color: Color.text }} />
						</Pressable>
						<Pressable onPress={() => navigation.navigate('IncomingOrder', { routeName: "Komplainan" })} style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', justifyContent: 'space-between' }}>
							<View style={{width: '85%'}}>
								<Text align='left'>Pesanan</Text>
							</View>
							<View style={{ backgroundColor: Color.error, width: 13, height: 13, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
								<Text style={{ color: Color.textInput, fontSize: 8 }}>9</Text>
							</View>
							<MaterialIcons name={'keyboard-arrow-right'} size={20} style={{ color: Color.text }} />
						</Pressable>
					</View>

					<View style={{ marginTop: 16, backgroundColor: Color.textInput, width: '100%', alignSelf: 'center', borderRadius: 5, paddingHorizontal: 16 }}>
						<Text style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'left', paddingVertical: 10 }}>Bantuan Toko</Text>
						<View style={{ width: '95%', height: 1, backgroundColor: Color.border, alignSelf: 'center' }}></View>
						<Pressable style={{ flexDirection: 'row', marginVertical: 10, justifyContent: 'space-between' }} onPress={() => navigation.navigate("MerchantSetting")} >
							<Text style={{ textAlign: 'left', width: '80%' }}>Pengaturan Toko</Text>
							<MaterialIcons name={'keyboard-arrow-right'} size={20} style={{ color: Color.text }} />
						</Pressable>
						<Pressable style={{ flexDirection: 'row', marginVertical: 10, justifyContent: 'space-between' }}>
							<Text style={{ textAlign: 'left', width: '80%' }}>Bantuan</Text>
							<MaterialIcons name={'keyboard-arrow-right'} size={20} style={{ color: Color.text }} />
						</Pressable>
					</View>
				</Container>
			</ScrollView>
		</Scaffold>
	);
};

export default MyShopHomepage;
