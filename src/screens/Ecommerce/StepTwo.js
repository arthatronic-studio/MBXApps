import React, { useState, useEffect, useRef, Component, AppRegistry } from 'react';
import {
	TextInput,
	View,
	Image,
	ScrollView,
	Platform,
	SafeAreaView,
	TextInput as TextInputs,
	Pressable
} from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
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
import { TouchableOpacity } from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import CardListProduk from 'src/components/Card/CardListProduct';
import TopTabShop from './TopTabShop';
import ImagesPath from 'src/components/ImagesPath';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;

const StepTwo = ({ navigation }) => {
	const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
	const { Color } = useColor();

	useEffect(() => {}, []);

	return (
		<Scaffold
			style
			header={<Header customIcon title="Tambah Produk" type="regular" centerTitle={false} />}
			onPressLeftButton={() => navigation.pop()}
		>
			<ScrollView>
				<View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10 }}>
					<Image source={ImagesPath.steptwo} />
					<View style={{ paddingVertical: 5, alignItems: 'flex-start', paddingHorizontal: 20 }}>
						<Text style={{ fontWeight: 'bold', fontSize: 14 }}>Detail Lebih Lanjut</Text>
						<Text style={{ color: Color.secondary, fontSize: 10 }}>
							Masukkan detail produk lebih lanjut
						</Text>
					</View>
				</View>
				<View style={{ width: '100%', height: 25 }} />
				<View>
					<View>
						<Text
							style={{
								textAlign: 'left',
								fontSize: 10,
								paddingHorizontal: 20,
								paddingVertical: 12,
								fontWeight: 'bold'
							}}
						>
							Detail Produk
						</Text>
					</View>
					<View
						style={{
							borderRadius: 5,
							marginHorizontal: 20,
							marginVertical: 10,
							borderWidth: 1,
							borderColor: Color.secondary,
							width: '90%',
							height: 45
						}}
					>
						<View>
							<Picker style={{ height: 10, marginVertical: 2 }}>
								<Picker.Item style={{ fontSize: 12 }} label="- Pilih Satuan -" value="java" />
								<Picker.Item label="pcs" value="js" />
								<Picker.Item label="box" value="js" />
								<Picker.Item label="kodi" value="js" />
							</Picker>

							<Text
								style={{
									paddingHorizontal: 12,
									paddingVertical: 5,
									color: Color.secondary,
									fontSize: 8,
									fontWeight: '400',
									position: 'absolute'
								}}
							>
								Satuan Barang
							</Text>
						</View>
					</View>
					<View>
						<TextInput
							placeholder={'Stok Barang'}
							style={{
								borderWidth: 1,
								borderColor: Color.secondary,
								height: 45,
								width: '90%',
								paddingHorizontal: 12,
								paddingTop: 18,
								marginHorizontal: 20,
								borderRadius: 5,
								fontSize: 12
							}}
						/>
						<Text
							style={{
								paddingHorizontal: 32,
								paddingVertical: 5,
								color: Color.secondary,
								fontSize: 8,
								fontWeight: '400',
								position: 'absolute'
							}}
						>
							Stock Barang
						</Text>
					</View>
					<View style={{ marginVertical: 10 }}>
						<TextInput
							placeholder={'Minimum Pembelian'}
							style={{
								borderWidth: 1,
								borderColor: Color.secondary,
								height: 45,
								width: '90%',
								paddingHorizontal: 12,
								paddingTop: 18,
								marginHorizontal: 20,
								borderRadius: 5,
								fontSize: 12
							}}
						/>
						<Text
							style={{
								paddingHorizontal: 32,
								paddingVertical: 5,
								color: Color.secondary,
								fontSize: 8,
								fontWeight: '400',
								position: 'absolute'
							}}
						>
							Minimum Pembelian
						</Text>
					</View>
					<View style={{ marginVertical: 3 }}>
						<TextInput
							multiline={true}
							placeholder={'Masukkan Deskripsi . . .'}
							style={{
								borderWidth: 1,
								borderColor: Color.secondary,
								height: 100,
								width: '90%',
								paddingHorizontal: 12,
								paddingTop: 18,
								marginHorizontal: 20,
								borderRadius: 5,
								fontSize: 12,
								textAlign: 'left'
							}}
						/>
						<Text
							style={{
								paddingHorizontal: 32,
								paddingVertical: 5,
								color: Color.secondary,
								fontSize: 8,
								fontWeight: '400',
								position: 'absolute'
							}}
						>
							Deskripsi Barang
						</Text>
					</View>
					<Text
						style={{
							textAlign: 'left',
							fontSize: 10,
							paddingHorizontal: 20,
							paddingVertical: 12,
							fontWeight: 'bold'
						}}
					>
						Massa Produk
					</Text>
					<View style={{marginVertical: 5}}>
						<TextInput
							placeholder={'Satuan Massa'}
							style={{
								borderWidth: 1,
								borderColor: Color.secondary,
								height: 45,
								width: '90%',
								paddingHorizontal: 12,
								paddingTop: 18,
								marginHorizontal: 20,
								borderRadius: 5,
								fontSize: 12
							}}
						/>
						<Text
							style={{
								paddingHorizontal: 32,
								paddingVertical: 5,
								color: Color.secondary,
								fontSize: 8,
								fontWeight: '400',
								position: 'absolute'
							}}
						>
							Satuan Massa
						</Text>
					</View>
					<View style={{marginVertical: 5}}>
						<TextInput
							placeholder={'Berat Barang'}
							style={{
								borderWidth: 1,
								borderColor: Color.secondary,
								height: 45,
								width: '90%',
								paddingHorizontal: 12,
								paddingTop: 18,
								marginHorizontal: 20,
								borderRadius: 5,
								fontSize: 12
							}}
						/>
						<Text
							style={{
								paddingHorizontal: 32,
								paddingVertical: 5,
								color: Color.secondary,
								fontSize: 8,
								fontWeight: '400',
								position: 'absolute'
							}}
						>
							Berat Barang
						</Text>
					</View>
				</View>
			</ScrollView>
			<View
				style={{
					backgroundColor: 'white',
					width: '100%',
					height: 70,
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<TouchableOpacity
					style={{
						backgroundColor: Color.primary,
						width: '80%',
						height: 45,
						borderRadius: 30,
						justifyContent: 'center',
						textAlign: 'center'
					}}
					onPress={() => navigation.navigate('StepThree')}
				>
					<Text style={{ color: Color.textInput, fontWeight: 'bold' }}>Lanjut</Text>
				</TouchableOpacity>
			</View>
		</Scaffold>
	);
};

export default StepTwo;
