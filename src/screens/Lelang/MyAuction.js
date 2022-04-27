import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, FlatList,SafeAreaView, TextInput as TextInputs, Pressable, useWindowDimensions } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {
	Text,
	// TouchableOpacity,
	useLoading,
	Scaffold,
	Col,
	HeaderBig,
	useColor,
	Header
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';

import { Divider, Circle, Container, Row } from '@src/styled';
import { shadowStyle } from '@src/styles';
import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import { TextInput } from 'src/components/Form';
import TopTabShop from '../Ecommerce/TopTabShop';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MyShopHeader from '../Ecommerce/MyShopHeader';
import { queryGetMyProduct, queryGetMyShop } from 'src/lib/query/ecommerce';
import { useIsFocused } from '@react-navigation/native';

const DATA = [
	{
		id: 1,
	  image: ImagesPath.produklelang,
	  title: 'Pashmina Pink Nissa Sabyan',
	  date: '05 Apr 2022',
	  time: '25:43',
	  duration: 30,
	  price: '1.000'
	},
	{
		id: 2,
		image: ImagesPath.produklelang,
		title: 'Pashmina Pink Nissa Sabyan',
		date: '05 Apr 2022',
		time: '25:43',
		duration: 30,
		price: '1.000'
	},
	{
		id: 3,
		image: ImagesPath.produklelang,
		title: 'Pashmina Pink Nissa Sabyan',
		date: '05 Apr 2022',
		time: '25:43',
		duration: 30,
		price: '1.000'
	  },
  ];

const MyAuction = () => {
	const { Color } = useColor();
	const navigation = useNavigation();
	const renderItem = ({ item }) => (
		<View style={{paddingVertical: 10, paddingHorizontal: 10,backgroundColor: Color.theme, width: '92%', borderRadius: 8, marginVertical: 5,height: 150, alignSelf: 'center'}}>
			<View style={{flexDirection: 'row'}}>
				<Image source={item.image} style={{width: '15%', height: 50, borderRadius: 5}}/>
				<Col style={{paddingHorizontal: 10,}}>
					<Text style={{fontWeight: 'bold', textAlign: 'left'}}>{item.title}</Text>
					<View style={{width: '20%'}}/>
					<Divider/>
					<Row>
						<Col>
							<Text style={{textAlign: 'left',fontSize: 8, color: Color.secondary}}>Tanggal Lelang</Text>
							<Text style={{fontWeight: 'bold', fontSize: 10, textAlign: 'left'}}>{item.date}</Text>
						</Col>
						<Col>
							<Text style={{textAlign: 'left',fontSize: 8, color: Color.secondary}}>Durasi Lelang</Text>
							<Text style={{fontWeight: 'bold', fontSize: 10, textAlign: 'left'}}>{item.duration} Menit</Text>
						</Col>
					</Row>
				</Col>
				<View style={{width: '25%'}}/>
				<View style={{alignItems: 'center', justifyContent: 'center',backgroundColor: '#3C58C1', width: '12%', borderRadius: 20, height: 20}}>
					<Text style={{fontSize: 8,color: Color.textInput}}>{item.time}</Text>
				</View>
			</View>
			<Divider/>
			<Row>
				<Col>
					<Text style={{fontSize: 8, color: Color.secondary,textAlign: 'left',}}>Harga Awal</Text>
					<Text style={{fontWeight: 'bold', fontSize: 10, textAlign: 'left'}}>{item.price} Poin</Text>
				</Col>
				<View style={{width: '20%', alignItems: 'center', justifyContent: 'center',backgroundColor: Color.theme, borderWidth: 1, borderColor: Color.primary, height:30, borderRadius: 20}}>
					<Text style={{fontSize: 11, color: Color.primary}}>Lihat</Text>
				</View>
			</Row>
		</View>
	  );
  return (
    <Scaffold
	style={{backgroundColor: Color.semiwhite}}
      header={<Header title={'Lelang Produk'} customIcon type="bold" centerTitle={false} />}
      onPressLeftButton={() => navigation.pop()}>
		<TouchableOpacity style={{backgroundColor: Color.theme, marginVertical: 15, width: '22%', flexDirection: 'row', height: 30,
		borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10, borderWidth: 1, borderColor: Color.border}}>
			<Text style={{fontSize: 10, marginHorizontal: 5}}>Semua</Text>
			<MaterialIcons name={'keyboard-arrow-down'} size={15} style={{marginHorizontal: 8}}/>
		</TouchableOpacity>
		<ScrollView>
			<FlatList
				data={DATA}
				renderItem={renderItem}
				keyExtractor={item => item.id}
			/>
		</ScrollView>
		<Row style={{backgroundColor: Color.theme, height: 70,elevation: 5, alignItems: 'center', justifyContent: 'center'}}>
			<TouchableOpacity onPress={()=> navigation.navigate('AddProductAuction')} style={{flexDirection: 'row',backgroundColor: Color.primary, width: '95%', height: '60%', borderRadius: 20, alignItems: 'center', justifyContent: 'center'}}>
				<IonIcons name={'add-circle-outline'} size={18} color={Color.textInput}/>
				<Text style={{marginHorizontal: 5,fontSize: 12, color: Color.textInput}}>Tambah Produk Lelang</Text>
			</TouchableOpacity>
		</Row>
	</Scaffold>
  )
}

export default MyAuction