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
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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

const AddAddress = () => {
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


    const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);
	const navigation = useNavigation();
	const [ loadingProps, showLoading, hideLoading ] = useLoading();
	const { Color } = useColor();
	const modalListActionRef = useRef();
  return (
    <Scaffold
        style
			header={<Header customIcon title="Tambah Alamat" type="regular" centerTitle={false} />}
			onPressLeftButton={() => navigation.pop()}
			
	>
		<ScrollView>
			<View>
                <Image source={ImagesPath.maps} style={{width: '100%', height: 180}}/>
            </View>
            <View>
                <Text style={{textAlign: 'left', fontWeight: 'bold', fontSize: 12, paddingHorizontal: 10, paddingVertical: 10}}>Detail Alamat</Text>
                <View>
                    <Text style={{textAlign: 'left', fontWeight: 'normal', fontSize: 8, paddingHorizontal: 10, paddingVertical: 5}}>Nama Penerima</Text>
                    <TextInput placeholder='Adang Susanyo' style={{borderWidth:1, borderColor: Color.border, width: '96%', height: 40, fontSize: 12, paddingHorizontal: 10, alignSelf: 'center', borderRadius: 5}}></TextInput>
                </View>
                <View style={{marginVertical: 10}}>
                    <Text style={{textAlign: 'left', fontWeight: 'normal', fontSize: 8, paddingHorizontal: 10, paddingVertical: 5}}>No Telepon</Text>
                    <TextInput placeholder='8123-1234-5678' style={{borderWidth:1, borderColor: Color.border, width: '96%', height: 40, fontSize: 12, paddingHorizontal: 35, alignSelf: 'center', borderRadius: 5}}></TextInput>
                    <Text style={{position: 'absolute', fontSize: 11, marginVertical: 33, marginHorizontal: 15}}>+62</Text>
                </View>
                <View>
                    <Text style={{textAlign: 'left', fontWeight: 'normal', fontSize: 8, paddingHorizontal: 10, paddingVertical: 5}}>Alamat Lengkap</Text>
                    <TextInput placeholder='Tambahkan Alamat . . .' style={{borderWidth:1, borderColor: Color.border, width: '96%', height: 90, fontSize: 12, paddingHorizontal: 10, alignSelf: 'center', borderRadius: 5}}></TextInput>
                </View>
                <View style={{marginVertical: 10}}>
                    <Text style={{textAlign: 'left', fontWeight: 'normal', fontSize: 8, paddingHorizontal: 10, paddingVertical: 5}}>Provinsi</Text>
                    <DropDownPicker
							placeholder='- PILIH PROVINSI -'
							open={open}
							value={value}
							items={items}
							setValue={setValue}
							setItems={setItems}
							style={{ borderRadius: 5,borderColor: Color.border,paddingHorizontal: 12, paddingBottom: 5,marginHorizontal: 1,borderWidth: 1, width: '96%', height: 40, alignSelf: 'center'}}
                            
					/>
                </View>
                <View style={{marginVertical: 10}}>
                    <Text style={{textAlign: 'left', fontWeight: 'normal', fontSize: 8, paddingHorizontal: 10, paddingVertical: 5}}>Kecamatan</Text>
                    <DropDownPicker
							placeholder='- PILIH KECAMATAN -'
							open={open}
							value={value}
							items={items}
							setValue={setValue}
							setItems={setItems}
							style={{ borderRadius: 5,borderColor: Color.border,paddingHorizontal: 12, paddingBottom: 5,marginHorizontal: 1,borderWidth: 1, width: '96%', height: 40, alignSelf: 'center'}}
                            
					/>
                </View>
                <View>
                    <Text style={{textAlign: 'left', fontWeight: 'normal', fontSize: 8, paddingHorizontal: 10, paddingVertical: 5}}>Kode Pos</Text>
                    <TextInput placeholder='12345' style={{borderWidth:1, borderColor: Color.border, width: '96%', height: 40, fontSize: 12, paddingHorizontal: 10, alignSelf: 'center', borderRadius: 5}}></TextInput>
                </View>
            </View>
		</ScrollView>
		<View style={{paddingVertical: 15,flexDirection: 'row', backgroundColor: Color.textInput, height: 60}}>
			<View style={{width: '60%', paddingHorizontal: 15}}>
				<Text style={{textAlign: 'left',fontSize: 8, color: Color.secondary}}>Total Harga</Text>
				<Text style={{textAlign: 'left',fontWeight: 'bold',}}>Rp. 176.000</Text>
			</View>
			<View style={{width: '35%', }}>
				<TouchableOpacity onPress={() => navigation.navigate('PurchasingMethod')}  style={{ paddingVertical: 8,backgroundColor: Color.secondary, width: '100%', borderRadius: 20, height: 35}}>
					<Text style={{  fontWeight: 'bold',color: Color.textInput, fontSize: 12}}>Lanjut Bayar</Text>
				</TouchableOpacity>
			</View>
		</View>
	</Scaffold>
  )
}

export default AddAddress