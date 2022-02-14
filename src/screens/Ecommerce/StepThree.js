import React, { useState, useEffect, useRef, Component, AppRegistry } from 'react';
import {
	TextInput,
	View,
	Image,
	ScrollView,
	Platform,
	SafeAreaView,
	TextInput as TextInputs,
	Pressable,
	Button
} from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
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
	Popup
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

const StepThree = ({ navigation }) => {
	const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);
	const [ isModalVisible, setModalVisible ] = useState(false);

	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};
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
					<Image source={ImagesPath.stepthree} />
					<View style={{ paddingVertical: 5, alignItems: 'flex-start', paddingHorizontal: 20 }}>
						<Text style={{ fontWeight: 'bold', fontSize: 14 }}>Sedikit Lagi!</Text>
						<Text style={{ color: Color.secondary, fontSize: 10 }}>
							Masukkan harga serta etalase untuk produk
						</Text>
					</View>
				</View>
				<View style={{ width: '100%', height: 25 }} />
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
						Harga Produk
					</Text>
				</View>
				<View>
					<TextInput
						placeholder={'0'}
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
					>
						Rp
					</TextInput>
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
				<View>
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
								<Picker.Item style={{ fontSize: 12 }} label="- Pilih Potongan Harga -" value="java" />
								<Picker.Item label="ada" value="ada" />
								<Picker.Item label="tidak ada" value="tidakada" />
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
				</View>
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
						Etalase Produk
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
							<Picker.Item style={{ fontSize: 12 }} label="- Pilih Etalase -" value="java" />
							<Picker.Item label="Produk Terbaru" value="terbaru" />
							<Picker.Item label="Produk Terlaris" value="terlaris" />
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
							Etalase Produk
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
					onPress={toggleModal}
				>
					<Text style={{ color: Color.textInput, fontWeight: 'bold' }}>Selesai</Text>
				</TouchableOpacity>
			</View>
			<View style={{ height: 100, backgroundColor: Color.textInput }}>
				<Modal isVisible={isModalVisible}>
					<View style={{ backgroundColor: Color.textInput, height: 300, borderRadius: 20 }}>
						<Image source={ImagesPath.checkCircle} style={{ alignSelf: 'center', marginVertical: 10 }} />
						<Text style={{ marginVertical: 10, fontWeight: 'bold', fontSize: 16 }}>
							Produk Berhasil Ditambahkan
						</Text>
						<Text
							style={{
								color: Color.secondary,
								fontSize: 12,
								lineHeight: 20,
								width: '80%',
								marginHorizontal: 34,
								marginVertical: 8
							}}
						>
							Yeay, produk kamu berhasil ditambahkan ke barang daganganmu! Produk akan muncul setelah
							proses upload selesai
						</Text>
						<View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
							<Pressable
								style={{
									width: '80%',
									backgroundColor: Color.gray,
									height: 50,
									borderRadius: 30,
									justifyContent: 'center',
									alignItems: 'center'
								}}
								onPress={toggleModal}
							>
								<Text style={{color: Color.textInput, fontWeight: 'bold'}}>Mengerti</Text>
							</Pressable>
						</View>
					</View>
				</Modal>
			</View>
		</Scaffold>
	);
};

export default StepThree;
