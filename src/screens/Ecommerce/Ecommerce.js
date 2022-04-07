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
	Pressable
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
import { Divider, Circle, Container } from '@src/styled';
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
	Header,
	Banner
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

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;

const DATA = [
	{
		id: 1,
		namaProduk: 'Acer Aspire 3 A314',
		hargaAwal: '3.000.000',
		waktuSisa: '06:12',
		image: ImagesPath.lelangecommerce1
	},
	{
		id: 2,
		namaProduk: 'Acer Aspire 3 A314',
		hargaAwal: '3.000.000',
		waktuSisa: '06:12',
		image: ImagesPath.lelangecommerce2
	},
	{
		id: 3,
		namaProduk: 'Acer Aspire 3 A314',
		hargaAwal: '3.000.000',
		waktuSisa: '06:12',
		image: ImagesPath.lelangecommerce1
	},
	{
		id: 4,
		namaProduk: 'Acer Aspire 3 A314',
		hargaAwal: '3.000.000',
		waktuSisa: '06:12',
		image: ImagesPath.lelangecommerce2
	},
	{
		id: 5,
		namaProduk: 'Acer Aspire 3 A314',
		hargaAwal: '3.000.000',
		waktuSisa: '06:12',
		image: ImagesPath.lelangecommerce1
	},
	{
		id: 6,
		namaProduk: 'Acer Aspire 3 A314',
		hargaAwal: '3.000.000',
		waktuSisa: '06:12',
		image: ImagesPath.lelangecommerce2
	}
];

const Rekomendasi = [
	{
		id: 1,
		namaProduk: 'Tas Laptop Formal Pria',
		review: '4.5',
		terjual: 450,
		hargaCoret: 'Rp. 300.000',
		hargaAkhir: 'Rp. 278.100',
		image: ImagesPath.lelangecommerce3,
		diskon: '10%'
	},
	{
		id: 1,
		namaProduk: 'Tas Laptop Formal Pria',
		review: '4.5',
		terjual: 450,
		hargaCoret: '300.000',
		hargaAkhir: '278.100',
		image: ImagesPath.lelangecommerce4,
		diskon: '10%'
	},
	{
		id: 1,
		namaProduk: 'Tas Laptop Formal Pria',
		review: '4.5',
		terjual: 450,
		hargaCoret: '300.000',
		hargaAkhir: '278.100',
		image: ImagesPath.lelangecommerce5,
		diskon: '10%'
	},
	{
		id: 1,
		namaProduk: 'Tas Laptop Formal Pria',
		review: '4.5',
		terjual: 450,
		hargaCoret: '300.000',
		hargaAkhir: '278.100',
		image: ImagesPath.lelangecommerce6,
		diskon: '10%'
	}
];

const Ecommerce = ({ navigation }) => {
	const isFocused = useIsFocused();
	const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);
	const [ loadingProps, showLoading, hideLoading ] = useLoading();
	const [ listProduct, setListProduct ] = useState([]);
	const [ liveAuction, setLiveAuction ] = useState([]);
	const [ cart, setCart ] = useState(0);
	const { Color } = useColor();

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
			getAuction();
			getProduct();
			getCart();
			// });
		},
		[ isFocused ]
	);

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
				alert(reject.message);
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

	const renderItem = ({ item }) => (
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

	const render = ({ item }) => (
		<Pressable
			onPress={() => navigation.navigate('DetailProduct', { item })}
			style={{
				marginHorizontal: 15,
				marginVertical: 10,
				backgroundColor: Color.theme,
				width: '43%',
				height: 320,
				borderRadius: 10,
				elevation: 5
			}}
		>
			<Image
				source={{ uri: item.imageUrl }}
				style={{
					resizeMode: 'contain',
					width: 175,
					height: 160,
					marginVertical: 8
				}}
			/>
			<View
				style={{
					backgroundColor: Color.error,
					width: '40%',
					height: 47,
					position: 'absolute',
					borderBottomLeftRadius: 15,
					borderTopRightRadius: 15,
					alignSelf: 'flex-end',
					paddingVertical: 5
				}}
			>
				<Text style={{ fontSize: 10, color: Color.textInput }}>Diskon</Text>
				<Text style={{ fontSize: 18, color: Color.textInput, fontWeight: 'bold' }}>10%</Text>
			</View>
			<Text
				style={{
					fontWeight: 'bold',
					width: '95%',
					height: 38,
					paddingHorizontal: 2
				}}
			>
				{item.name}
			</Text>
			<View style={{ flexDirection: 'row', marginHorizontal: 12, marginVertical: 5 }}>
				<Entypo name={'star'} style={{ color: Color.yellow }} />
				<Text style={{ fontSize: 10, color: Color.secondary, marginHorizontal: 3 }}>{item.review}</Text>
				<View
					style={{
						backgroundColor: Color.secondary,
						height: 12,
						width: 1,
						marginHorizontal: 5
					}}
				/>
				<Text style={{ fontSize: 10, color: Color.secondary, marginHorizontal: 3 }}>{item.terjual}</Text>
				<Text style={{ fontSize: 10, color: Color.secondary }}>Terjual</Text>
			</View>
			<View style={{ marginHorizontal: 15, marginVertical: 15 }}>
				<Text
					style={{
						marginVertical: 1,
						textAlign: 'left',
						color: Color.secondary,
						fontSize: 8
					}}
				>
					Harga
				</Text>
				<Text
					style={{
						marginVertical: 1,
						textAlign: 'left',
						textDecorationLine: 'line-through',
						fontSize: 10,
						color: Color.secondary,
						fontWeight: 'bold'
					}}
				>
					{item.hargaCoret}
				</Text>
				<Text
					style={{
						marginVertical: 1,
						textAlign: 'left',
						color: Color.error,
						fontWeight: 'bold'
					}}
				>
					{item.price}
				</Text>
			</View>
			{/* <View style={{paddingVertical: 5, backgroundColor: Color.error, width: 60, height: 42, position: 'absolute', alignSelf: 'flex-end', borderTopRightRadius: 10, borderBottomLeftRadius: 20}}>
                <Text style={{color: Color.textInput, fontSize: 10}}>Diskon</Text>
                <Text style={{fontSize: 14, fontWeight: 'bold', color: Color.textInput}}>{item.diskon}</Text>
            </View> */}
		</Pressable>
	);

	return (
		<ScrollView style={{ backgroundColor: Color.theme }}>
			<View>
				<View
					style={{
						position: 'absolute',
						backgroundColor: '#FDE4D2',
						width: '100%',
						height: 250,
						borderBottomLeftRadius: 40,
						borderBottomRightRadius: 40
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
									+99
								</Text>
							</View>
						</Pressable>
					</View>
				</View>

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
			</View>
			<View style={{ marginTop: 5 }}>
				<Text style={{ textAlign: 'left', marginHorizontal: 15, fontWeight: 'bold' }}>
					Tribes Special Deals
				</Text>
				<Pressable
					style={{
						width: '95%',
						height: 220,
						alignSelf: 'center',
						borderRadius: 10,
						marginVertical: 10
					}}
				>
					<FlatList
						showsHorizontalScrollIndicator={false}
						horizontal
						data={[ { image: ImagesPath.BannerPink }, { image: ImagesPath.bannerlelang } ]}
						renderItem={({ item }) => (
							<Image
								source={item.image}
								style={{
									resizeMode: 'cover',
									width: 391,
									height: '100%'
								}}
							/>
						)}
					/>
				</Pressable>
			</View>
			<Content
				style={{
					alignItems: 'center',
					borderRadius: 5
				}}
			>
				<Row>
					<TouchableOpacity
						onPress={() => navigation.navigate('MyShop')}
						style={{ marginRight: 27, alignItems: 'center' }}
					>
						<Image source={ImagesPath.shop} />
						<View style={{ marginVertical: 5 }}>
							<Text style={{ fontSize: 10 }}>Toko Saya</Text>
							<View
								style={{
									width: 4,
									height: 4,
									backgroundColor: Color.error,
									borderRadius: 20,
									position: 'absolute',
									marginHorizontal: 53,
									marginVertical: 3
								}}
							/>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => navigation.navigate('ChatEcommerce')}
						style={{ marginHorizontal: 27, alignItems: 'center' }}
					>
						<Image source={ImagesPath.chatframe} />
						<View style={{ marginVertical: 5 }}>
							<Text style={{ fontSize: 10 }}>Chatting</Text>
							<View
								style={{
									width: 4,
									height: 4,
									backgroundColor: Color.error,
									borderRadius: 20,
									position: 'absolute',
									marginHorizontal: 45,
									marginVertical: 3
								}}
							/>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => navigation.navigate('Wishlist')}
						style={{ marginHorizontal: 27, alignItems: 'center' }}
					>
						<Image source={ImagesPath.wishlistframe} />
						<View style={{ marginVertical: 5 }}>
							<Text style={{ fontSize: 10 }}>Wishlist</Text>
							<View
								style={{
									width: 4,
									height: 4,
									backgroundColor: Color.error,
									borderRadius: 20,
									position: 'absolute',
									marginHorizontal: 41,
									marginVertical: 3
								}}
							/>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => navigation.navigate('LiveLelangScreen')}
						style={{ marginLeft: 27, marginRight: 5, alignItems: 'center' }}
					>
						<Image source={ImagesPath.scales} />
						<View style={{ marginVertical: 5 }}>
							<Text style={{ fontSize: 10 }}>Lelang</Text>
							<View
								style={{
									width: 4,
									height: 4,
									backgroundColor: Color.error,
									borderRadius: 20,
									position: 'absolute',
									marginHorizontal: 35,
									marginVertical: 3
								}}
							/>
						</View>
					</TouchableOpacity>
				</Row>
			</Content>
			<View style={{ marginVertical: 5 }}>
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
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
					horizontal
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					style={{ marginHorizontal: 15 }}
				/>
			</View>
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
					renderItem={render}
					keyExtractor={(item) => item.id}
					numColumns={2}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
				/>
			</View>
			<Image
				source={ImagesPath.bannerLelangEcommerce}
				style={{ width: '100%', resizeMode: 'contain', marginVertical: 15 }}
			/>
			<View style={{ marginVertical: 15 }}>
				<View style={{ flexDirection: 'row' }}>
					<Text
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
					renderItem={render}
					keyExtractor={(item) => item.id}
					numColumns={2}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
				/>
			</View>
		</ScrollView>
	);
};

export default Ecommerce;
