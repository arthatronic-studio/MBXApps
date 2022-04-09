import React, { useState, useEffect, useRef, Component } from 'react';
import {
	View,
	AppRegistry,
	FlatList,
	ScrollView,
	Platform,
	Image,
	SafeAreaView,
	TextInput,
	TouchableOpacity,
	Pressable,
	useWindowDimensions,
} from 'react-native';

import { accessClient } from 'src/utils/access_client';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNSimpleCrypto from 'react-native-simple-crypto';
import Octicons from 'react-native-vector-icons/Octicons';
import Swiper from 'react-native-swiper';
import ListSoonAuction from 'src/components/Posting/ListSoonAuction';
import ListNews from 'src/components/Posting/ListNews';
import ListPlace from 'src/components/Posting/ListPlace';
import ListEvent from 'src/components/Posting/ListEvent';
import ListAuction from 'src/components/Posting/ListAuction';
import { Divider, Circle, Container, Row } from '@src/styled';
import {
	Text,
	// TouchableOpacity,
	Loading,
	useLoading,
	Scaffold,
	HeaderBig,
	useColor,
	Header,
} from '@src/components';
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import CardListProduk from 'src/components/Card/CardListProduct';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import moment from 'moment';
import { queryGetAuction } from 'src/lib/query/auction';
import { FormatMoney } from 'src/utils';
import { queryGetCart, queryGetProduct } from 'src/lib/query/ecommerce';
import Banner from 'src/components/Banner';
import { queryBannerList } from 'src/lib/query/banner';
import CardEcomerceProduct from './CardEcomerceProduct';

const ecomMenu = [
	{
		code: 'mystore',
		name: 'Toko Saya',
		badge: true,
		imageAsset: ImagesPath.shop,
		navigate: 'MyShop',
		show: true,
	},
	{
		code: 'chat',
		name: 'Chatting',
		badge: true,
		imageAsset: ImagesPath.chatframe,
		navigate: 'ChatEcommerce',
		show: true,
	},
	{
		code: 'wishlist',
		name: 'Whishlist',
		badge: true,
		imageAsset: ImagesPath.wishlistframe,
		navigate: 'Wishlist',
		show: true,
	},
	{
		code: 'auction',
		name: 'Lelang',
		badge: true,
		imageAsset: ImagesPath.scales,
		navigate: 'LiveLelangScreen',
		show: true,
	},
]

const Ecommerce = ({ navigation }) => {
	const isFocused = useIsFocused();
	const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);
	const [ loadingProps, showLoading, hideLoading ] = useLoading();
	const [ listProduct, setListProduct ] = useState([]);
	const [ liveAuction, setLiveAuction ] = useState([]);
	const [ cart, setCart ] = useState(0);

	const { Color } = useColor();
	const {width, height} = useWindowDimensions();

	const [ loadingAuction, setLoadingAuction ] = useState(true);

	const [ loadingSoonAuction, setLoadingSoonAuction ] = useState(true);

	const [ loadingEmergency, setLoadingEmergencyArea ] = useState(true);
	const [ listEmergencyArea, setListEmergencyArea ] = useState([]);

	const [ loadingPosting, setLoadingPosting ] = useState(true);
	const [ listPosting, setListPosting ] = useState([]);

	const [ loadingNearbyPlace, setLoadingNearbyPlace ] = useState(true);
	const [ listNearbyPlace, setListNearbyPlace ] = useState([]);

	const [ loadingEvent, setLoadingEvent ] = useState(true);
	const [ listEvent, setListEvent ] = useState([]);

	const [ loadingJobs, setLoadingJobs ] = useState(true);
	const [ listJobs, setListJobs ] = useState([]);

	const [ loadingBanner, setLoadingBanner ] = useState(true);
	const [ listBanner, setListBanner ] = useState([]);

	useEffect(
		() => {
			fetchBannerList();
			getAuction();
			getProduct();
			getCart();
		},
		[ isFocused ]
	);

	const fetchBannerList = () => {
		const variables = {
		  categoryId: 1,
		};
	
		Client.query({
		  query: queryBannerList,
		  variables,
		})
		  .then(res => {
			console.log('res banner list', res);
			setListBanner(res.data.bannerList);
			setLoadingBanner(false);
		  })
		  .catch(err => {
			console.log(err, 'err banner list');
			setLoadingBanner(false);
		  });
	};

	const getCart = () => {
		// showLoading();
		let variables = {
			page: 1,
			limit: 10
		};
		console.log(variables);
		Client.query({ query: queryGetCart, variables })
			.then((res) => {
				console.log(res);
				if (res.data.ecommerceCartList) {
					setCart(res.data.ecommerceCartList.totalProducts ? res.data.ecommerceCartList.totalProducts : 0);
				}
			})
			.catch((reject) => {
				// hideLoading()
				console.log(reject.message, 'reject');
			});
	};

	const getProduct = () => {
		let variables = {
			page: 1,
			itemPerPage: 10
		};
		Client.query({ query: queryGetProduct, variables })
			.then((res) => {
				console.log(res);
				if (res.data.ecommerceProductList) {
					setListProduct(res.data.ecommerceProductList);
				}

				// hideLoading();
				// navigation.navigate('TopUpScreen');
			})
			.catch((reject) => {
				console.log(reject);
			});
	};

	const getAuction = () => {
		let variables = {
			page: 1,
			limit: 5
		};

		Client.query({ query: queryGetAuction, variables })
			.then((res) => {
				console.log(res);
				if (res.data.auctionProduct) {
					setLiveAuction(res.data.auctionProduct.data);
				}

				// hideLoading();
				// navigation.navigate('TopUpScreen');
			})
			.catch((reject) => {
				console.log(reject);
			});
	};

	const renderItemAuction = ({ item }) => (
		<TouchableOpacity
			onPress={() => navigation.navigate('DetailLelang', { item })}
			style={{ marginHorizontal: 6, marginVertical: 10 }}
		>
			<Image
				source={item.image}
				style={{
					resizeMode: 'contain',
					backgroundColor: '#ddd',
					width: 175,
					height: 200
				}}
			/>
			<View
				style={{
					position: 'absolute',
					marginVertical: 135,
					marginHorizontal: 20
				}}
			>
				<Text style={{ color: Color.textInput }}>{item.namaProduk}</Text>
				<Text style={{ fontSize: 8, color: Color.border, textAlign: 'left' }}>Harga Awal</Text>
				<View style={{ flexDirection: 'row' }}>
					{/* <Text style={{fontSize: 14, fontWeight: 'bold', color: Color.textInput,}}>Rp.</Text> */}
					<Text style={{ fontSize: 14, fontWeight: 'bold', color: Color.textInput }}>
						{FormatMoney.getFormattedMoney(item.start_price)}
					</Text>
				</View>
			</View>
			<View
				style={{
					backgroundColor: Color.error,
					width: 75,
					height: 20,
					position: 'absolute',
					borderRadius: 10,
					marginHorizontal: 80,
					marginVertical: 7
				}}
			>
				<Text
					style={{
						fontSize: 8,
						fontWeight: 'bold',
						color: Color.textInput,
						paddingVertical: 5
					}}
				>
					Tersisa{' '}
					{moment.unix(item.time_end / 1000 - moment().unix()).format('DD') > 0 ? (
						moment.unix(item.time_end / 1000 - moment().unix()).format('DD') + ' Hari '
					) : (
						''
					)}
					{moment.unix(item.time_end / 1000 - moment().unix()).format('HH:mm')}
				</Text>
			</View>
		</TouchableOpacity>
	);

	const renderHeader = () => {
		return (
			<>
				<View
					style={{
						position: 'absolute',
						backgroundColor: Color.primarySoft,
						width: '100%',
						height: height * 0.3,
						borderBottomLeftRadius: 40,
						borderBottomRightRadius: 40,
					}}
				/>

				<View style={{ flexDirection: 'row', marginTop: 15 }}>
					<View style={{ width: '75%' }} onTouchStart={() => navigation.navigate('SearchResult')}>
						<TextInput
							placeholder="Cari apa hari ini . . ."
							style={{
								backgroundColor: Color.textInput,
								width: '100%',
								borderRadius: 7,
								height: 40,
								marginHorizontal: 10,
								marginVertical: 10,
								paddingHorizontal: 10
							}}
						/>
					</View>
					<Octicons
						name={'search'}
						size={14}
						style={{
							color: Color.placeholder,
							marginHorizontal: 290,
							marginVertical: 22,
							position: 'absolute'
						}}
					/>
					<View style={{ flexDirection: 'row', marginVertical: 20, marginLeft: 15 }}>
						{/* <Pressable onPress={() => navigation.navigate('Wishlist')}>
						<MaterialIcons name={'favorite-border'} size={26} style={{marginHorizontal: 3}}/>
						<View style={{marginHorizontal: 18,marginVertical: 1, position: 'absolute', width: 18, height: 10, backgroundColor: Color.error, borderRadius: 5}}>
							<Text style={{fontSize: 5, color: Color.textInput, alignSelf: 'center', paddingVertical: 1}}> +99</Text>
						</View>
					</Pressable> */}
						<Pressable onPress={() => navigation.navigate('CartScreen')}>
							<MaterialCommunityIcons
								name={'shopping-outline'}
								size={24}
								style={{ marginLeft: 10, marginRight: 5 }}
							/>
							{cart > 0 && (
								<View
									style={{
										marginHorizontal: 18,
										marginVertical: 1,
										position: 'absolute',
										width: 18,
										height: 10,
										backgroundColor: Color.error,
										borderRadius: 5
									}}
								>
									<Text
										style={{
											fontSize: 5,
											color: Color.textInput,
											alignSelf: 'center',
											paddingVertical: 1
										}}
									>
										{' '}
										{cart}
									</Text>
								</View>
							)}
						</Pressable>
						<Pressable onPress={() => navigation.navigate('Notification')}>
							<Ionicons name={'notifications-outline'} size={24} style={{ marginHorizontal: 7 }} />
							{/* <View
								style={{
									marginHorizontal: 18,
									marginVertical: 1,
									position: 'absolute',
									width: 18,
									height: 10,
									backgroundColor: Color.error,
									borderRadius: 5
								}}
							>
								<Text
									style={{
										fontSize: 5,
										color: Color.textInput,
										alignSelf: 'center',
										paddingVertical: 1
									}}
								>
									{' '}
									+99
								</Text>
							</View> */}
						</Pressable>
					</View>
				</View>
			</>
		)
	}

	return (
		<Scaffold
			header={renderHeader()}
			useSafeArea={false}
			translucent
			statusBarColor={Color.primarySoft}
		>
			<ScrollView>
				{/* Saldoku Di Hide Dulu */}
				{/* <View
					style={{
						flexDirection: 'row',
						backgroundColor: Color.textInput,
						width: '95%',
						height: 55,
						borderRadius: 5,
						alignSelf: 'center',
						marginVertical: 15,
						elevation: 3,
					}}>
					<View style={{marginHorizontal: 12, marginVertical: 8, width: '60%'}}>
						<Text
						style={{color: Color.secondary, fontSize: 8, textAlign: 'left'}}>
						Saldoku
						</Text>
						<Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'left'}}>
						Rp. 200.000
						</Text>
					</View>
					<View style={{flexDirection: 'column', marginVertical: 10}}>
						<View style={{flexDirection: 'row'}}>
						<View
							style={{
							marginHorizontal: 8,
							backgroundColor: Color.primary,
							width: 20,
							height: 20,
							borderRadius: 3,
							justifyContent: 'center',
							alignItems: 'center',
							}}>
							<AntDesign name={'plus'} style={{color: Color.textInput}} />
						</View>
						<View
							style={{
							marginHorizontal: 8,
							backgroundColor: Color.primary,
							width: 20,
							height: 20,
							borderRadius: 3,
							justifyContent: 'center',
							alignItems: 'center',
							}}>
							<AntDesign name={'upload'} style={{color: Color.textInput}} />
						</View>
						<View
							style={{
							marginHorizontal: 8,
							backgroundColor: Color.secondary,
							width: 20,
							height: 20,
							borderRadius: 3,
							justifyContent: 'center',
							alignItems: 'center',
							}}>
							<Entypo
							name={'dots-three-vertical'}
							style={{color: Color.textInput}}
							/>
						</View>
						</View>
						<View style={{flexDirection: 'row', marginVertical: 2}}>
						<Text style={{fontSize: 8, marginHorizontal: 6}}>Top Up</Text>
						<Text style={{fontSize: 8, marginHorizontal: 6}}>Tarik</Text>
						<Text style={{fontSize: 8, marginHorizontal: 6}}>Lainnya</Text>
						</View>
					</View>
				</View> */}

				<Container paddingVertical={16}>
					<Banner
						data={listBanner}
						loading={loadingBanner}
					/>
				</Container>

				<Container padding={16}>
					<Row justify='space-between' style={{width: '100%'}}>
						{ecomMenu.map((item, idx) => {
							if (!item.show) return <View key={idx} />;

							return (
								<TouchableOpacity
									key={idx}
									onPress={() => navigation.navigate(item.navigate)}
									style={{ width: '25%', alignItems: 'center', }}
								>
									<View
										style={{
											width: '50%',
											aspectRatio: 1,
										}}
									>
										<Image source={item.imageAsset} style={{width: '100%', height: '100%'}} resizeMode='contain' />
									</View>

									<View style={{ paddingVertical: 8 }}>
										<Text style={{ fontSize: 10 }}>
											{item.name}
										</Text>
										{item.badge && <View
											style={{
												width: 4,
												height: 4,
												backgroundColor: Color.error,
												borderRadius: 2,
												position: 'absolute',
												right: -8,
												top: 8
											}}
										/>}
									</View>
								</TouchableOpacity>
							)
						})}
					</Row>
				</Container>

				{/* hide lelang */}
				{/* <View style={{ marginVertical: 5 }}>
					<View style={{ flexDirection: 'row' }}>
						<Text
							style={{
								width: '70%',
								fontWeight: 'bold',
								textAlign: 'left',
								paddingHorizontal: 20
							}}
						>
							Lelang Berlangsung
						</Text>
						<Text
							style={{
								marginHorizontal: 5,
								marginVertical: 2,
								fontSize: 12,
								color: Color.primary,
								fontWeight: 'bold'
							}}
						>
							Lihat Semua
						</Text>
						<AntDesign name={'arrowright'} style={{ marginVertical: 4, color: Color.primary }} />
					</View>
					<FlatList
						data={liveAuction}
						renderItem={renderItemAuction}
						keyExtractor={(item) => item.id}
						horizontal
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
						style={{ marginHorizontal: 15 }}
					/>
				</View> */}

				<View>
					<View style={{ flexDirection: 'row' }}>
						<Text
							style={{
								width: '70%',
								fontWeight: 'bold',
								textAlign: 'left',
								paddingHorizontal: 20
							}}
						>
							Rekomendasi
						</Text>
						<Text
							onPress={() => navigation.navigate('MerchScreen')}
							style={{
								marginHorizontal: 5,
								marginVertical: 2,
								fontSize: 12,
								color: Color.primary,
								fontWeight: 'bold'
							}}
						>
							Lihat Semua
						</Text>
						<AntDesign name={'arrowright'} style={{ marginVertical: 4, color: Color.primary }} />
					</View>
					<FlatList
						data={listProduct}
						renderItem={({ item, index }) => <CardEcomerceProduct item={item} index={index} /> }
						keyExtractor={(item) => item.id}
						numColumns={2}
						contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 8 }}
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
					/>
				</View>

				{/* hide small banner */}
				{/* <Image
					source={ImagesPath.bannerLelangEcommerce}
					style={{ width: '100%', resizeMode: 'contain', marginVertical: 15 }}
				/> */}
				
				<View style={{ marginVertical: 15 }}>
					<View style={{ flexDirection: 'row' }}>
						<Text
							onPress={() => navigation.navigate('MerchScreen')}
							style={{
								width: '70%',
								fontWeight: 'bold',
								textAlign: 'left',
								paddingHorizontal: 20
							}}
						>
							Paling Laku
						</Text>
						<Text
							style={{
								marginHorizontal: 5,
								marginVertical: 2,
								fontSize: 12,
								color: Color.primary,
								fontWeight: 'bold'
							}}
						>
							Lihat Semua
						</Text>
						<AntDesign name={'arrowright'} style={{ marginVertical: 4, color: Color.primary }} />
					</View>
					<FlatList
						data={listProduct}
						renderItem={({ item, index }) => <CardEcomerceProduct item={item} index={index} /> }
						keyExtractor={(item) => item.id}
						numColumns={2}
						contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 8 }}
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
					/>
				</View>
			</ScrollView>
		</Scaffold>
	);
};

export default Ecommerce;
