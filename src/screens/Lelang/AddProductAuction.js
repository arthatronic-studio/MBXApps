import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, FlatList,SafeAreaView, TextInput as TextInputs, Pressable, useWindowDimensions } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
	  stock: 120,
	  price: '10.000'
	},
    {
		id: 2,
	  image: ImagesPath.produklelang2,
	  title: 'Pashmina Pink Nissa Sabyan',
	  stock: 120,
	  price: '10.000'
	},
    {
		id: 3,
	  image: ImagesPath.produklelang3,
	  title: 'Pashmina Pink Nissa Sabyan',
	  stock: 120,
	  price: '10.000'
	},
    {
		id: 4,
	  image: ImagesPath.productImage,
	  title: 'Pashmina Pink Nissa Sabyan',
	  stock: 120,
	  price: '10.000'
	},
  ];

export default function AddProductAuction({navigation}) {
	const { Color } = useColor();
    const renderItem = ({ item }) => (
		<View style={{backgroundColor: Color.theme, width: '44%',paddingHorizontal: 10, paddingVertical: 10,height: 280, marginHorizontal: 10, borderRadius: 10, marginVertical: 8}}>
            <Image source={item.image} style={{width: '100%', height: '58%', marginBottom: 10,borderRadius: 10}}/>
            <Text style={{fontWeight: 'bold', textAlign: 'left', lineHeight: 20}}>{item.title}</Text>
            <Text style={{fontSize: 8, textAlign: 'left',color: Color.secondary, marginVertical: 8}}>{item.stock} stok</Text>
            <Text style={{fontSize: 8, textAlign: 'left',color: Color.secondary, marginBottom: 3}}>Harga</Text>
            <Text style={{fontSize: 12, textAlign: 'left',color: Color.text, fontWeight: 'bold'}}>{item.price}</Text>
        </View>
	  );
  return (
    <Scaffold
	style={{backgroundColor: Color.semiwhite}}
      header={<Header title={'Tambah Barang Lelang'} customIcon type="bold" centerTitle={false} />}
      onPressLeftButton={() => navigation.pop()}>
    <Row style={{backgroundColor: Color.theme, paddingHorizontal: 15, paddingVertical: 15}}>
        <Image source={ImagesPath.one} style={{width: 40, height: 40}}/>
        <Col style={{paddingHorizontal: 10}}>
            <Text style={{fontWeight: 'bold', fontSize: 14, textAlign: 'left'}}>Pilih Barang</Text>
            <Text style={{lineHeight: 15,fontSize: 8, color: Color.secondary, textAlign: 'left'}}>Pilih atau tambahkan produk baru untuk dilelang. Barang yang dipilih akan . . .</Text>
        </Col>
        <View style={{width: '32%'}}/>    
    </Row>
    <ScrollView>
    <Text style={{fontSize: 12, fontWeight: 'bold', marginHorizontal: 15, marginVertical: 15, textAlign: 'left'}}>Etalase Kamu</Text>
    <FlatList
    numColumns={2}
		data={DATA}
		renderItem={renderItem}
		keyExtractor={item => item.id}
	>
    </FlatList>
    <View style={{borderWidth: 1, borderColor: '#3C58C1', borderStyle: 'dashed', marginVertical: 10, flexDirection: 'row', height: 40, justifyContent: 'center', alignItems: 'center',width: '92%', borderRadius: 20, alignSelf: 'center'}}>
        <IonIcons name={'add-circle-outline'} size={18} color={'#3C58C1'}/>
        <Text style={{marginHorizontal: 5,fontSize: 12, color: '#3C58C1'}}>Tambah Produk</Text>
    </View>
    <Divider height={10}/>
    </ScrollView>
   <Row style={{backgroundColor: Color.theme, height: 60, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={()=> navigation.navigate('AddProductAuctionSecond')} style={{backgroundColor: Color.primary, width: '95%',height: '65%', justifyContent: 'center', alignItems: 'center',borderRadius: 20}}>
            <Text style={{marginHorizontal: 5,fontSize: 12, color: Color.textInput}}>Lanjutkan</Text>
        </TouchableOpacity>
   </Row>
    </Scaffold>
  )
}