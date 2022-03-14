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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';


    
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
	ModalListAction
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import CardListProduk from 'src/components/Card/CardListProduct';
import TopTabShop from './TopTabShop';
import ImagesPath from 'src/components/ImagesPath';
import { updateCurrentUserProfile } from 'src/state/actions/user/auth';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;

const AddProduct = ({ navigation }) => {
	const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
	const { Color } = useColor();
	const modalListActionRef = useRef();

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
        style
			header={<Header customIcon title="Tambah Produk" type="regular" centerTitle={false} />}
			onPressLeftButton={() => navigation.pop()}
			
		>
			<ScrollView>
			
				<View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10 }}>
					<Image source={ImagesPath.stepone} />
					<View style={{ paddingVertical: 5, alignItems: 'flex-start', paddingHorizontal: 20 }}>
						<Text style={{ fontWeight: 'bold', fontSize: 14 }}>Tambah Produk</Text>
						<Text style={{ color: Color.secondary, fontSize: 10 }}>Masukkan Produk baru untuk dijual</Text>
					</View>
				</View>
				<View style={{ width: '100%', height: 25 }} />
				<View>
					<View style={{ flexDirection: 'row' }}>
						<Text
							style={{
								width: '50%',
								textAlign: 'left',
								paddingHorizontal: 20,
								fontWeight: 'bold',
								fontSize: 10
							}}
						>
							Foto Produk
						</Text>
						<Text
							style={{
								width: '50%',
								textAlign: 'right',
								paddingHorizontal: 20,
								color: Color.primary,
								fontSize: 10
							}}
						>
							+ Tambah Foto
						</Text>
					</View>
					<View
						style={{
							width: '30%',
							borderWidth: 1,
							borderColor: Color.text,
							height: 100,
							borderStyle: 'dashed',
							borderRadius: 8,
							justifyContent: 'center',
							alignItems: 'center',
							marginHorizontal: 20,
							marginVertical: 12
						}}
					>
						<AntDesign name={'camerao'} size={22} style={{ color: Color.secondary, paddingVertical: 5 }} />
						<Text style={{ color: Color.secondary, fontSize: 12 }}>Tambah Foto</Text>
					</View>
					<Text
						style={{
							textAlign: 'left',
							paddingHorizontal: 20,
							fontSize: 8,
							lineHeight: 14,
							color: Color.secondary
						}}
					>
						Pastikan anda mengupload gambar dengan kondisi pencahayaan yang baik dan produk yang jelas
						sesuai dengan kondisi saat ini
					</Text>
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
							Deskripsi Produk
						</Text>
						<View>
							<TextInput
								placeholder={'Buku, Baju, Hijab . . .'}
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
								Nama Produk
							</Text>
							<Text
								style={{
									fontSize: 8,
									color: Color.secondary,
									textAlign: 'left',
									paddingHorizontal: 20,
									paddingVertical: 5
								}}
							>
								Tips : Nama Barang = Merk + Keterangan
							</Text>
						</View>
					</View>
				</View>
				
				
					<View style={{height: 250, width: '90%',marginHorizontal: 20, marginVertical: 20}}>
						<Text 
							style={{
								paddingHorizontal: 15,
								paddingTop: 5,
								color: Color.secondary,
								fontSize: 8,
								fontWeight: '400',
								textAlign: 'left'
							}}>Kategori Barang</Text>
						<DropDownPicker
							placeholder='- Pilih Kategori -'
							open={open}
							value={value}
							items={items}
							setOpen={setOpen}
							setValue={setValue}
							setItems={setItems}
							style={{paddingHorizontal: 12, paddingBottom: 5,marginHorizontal: 1,borderWidth: 0, width: '99%', height: 28}}
							/>
						<View style={{position: 'absolute',width: '100%',height: 47, 
						borderWidth: 1, borderColor: Color.secondary, borderRadius: 5}}/>
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
                    onPress={() => navigation.navigate('StepTwo')}
				>
					<Text style={{color: Color.textInput, fontWeight: 'bold'}}>Lanjut</Text>
				</TouchableOpacity>
			</View>


			
		</Scaffold>
	);
};

export default AddProduct;
