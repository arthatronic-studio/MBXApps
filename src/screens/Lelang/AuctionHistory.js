import React, { useState, useEffect, useRef, Component } from 'react';
import { View, AppRegistry, FlatList, Platform, Image, SafeAreaView, TextInput, TouchableOpacity, Pressable } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNSimpleCrypto from "react-native-simple-crypto";
import Octicons from 'react-native-vector-icons/Octicons'
import Feather from 'react-native-vector-icons/Feather'
import Swiper from 'react-native-swiper'
import {useColor} from '@src/components';
import {useIsFocused, useRoute} from '@react-navigation/native';

import {
	Text,
	// TouchableOpacity,
	Loading,
	useLoading,
	Scaffold,
	Row,
	Col,
	HeaderBig,
	Header
} from '@src/components';
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import {
    queryAddCart, 
    queryDetailProduct, 
    queryGetCart, 
    queryUpdateItemCart, 
    queryWishlistManage, 
    queryListWishlist
} from 'src/lib/query/ecommerce';
import Client from 'src/lib/apollo';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios';
import moment from 'moment';
import { FormatMoney } from 'src/utils';
import { Container, Divider } from 'src/styled';


const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      namaProduct: 'Pashmina Pink Nissa Sabyan',
      status: 'Menang',
      tanggal: 'rabu, 29 Desember 2021',
      penawaranmu: '160.000',
      hargaAkhir: '160.000',
      image: ImagesPath.produklelang2
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      namaProduct: 'Gazelle Hi Vintage - Green',
      status: 'Menang',
      tanggal: 'rabu, 29 Desember 2021',
      penawaranmu: '160.000',
      hargaAkhir: '160.000',
      image: ImagesPath.produklelang3
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      namaProduct: 'Zippo Original Armor Japan Special Edition . . .',
      status: 'Menang',
      tanggal: 'rabu, 29 Desember 2021',
      penawaranmu: '160.000',
      hargaAkhir: '160.000',
      image: ImagesPath.produklelang
    },
  ];


const AuctionHistory = () => {
    const {Color} = useColor();
    const renderItem = ({ item }) => (
        <View style={{paddingHorizontal: 10, paddingVertical: 10,borderRadius: 5,alignSelf:'center',marginVertical: 10,width: '95%', height: 150, backgroundColor: Color.theme, elevation: 5}}>
            <Row>
                <Image source={item.image} style={{width: '15%', height: 50, borderRadius: 10}}/>
                <Col style={{marginHorizontal: 10,}}>
                    <Text style={{lineHeight: 20,width: '72%', fontWeight: 'bold', textAlign: 'left'}}>{item.namaProduct}</Text>
                    <Text style={{marginVertical: 5,fontSize: 10, color: Color.secondary, textAlign: 'left'}}>{item.tanggal}</Text>
                </Col>
                <View style={{backgroundColor: '#E7F5D0',borderColor: '#558617', borderWidth: 1, width: '15%', height: 25, alignItems: 'center', justifyContent: 'center', borderRadius: 20}}>
                    <Text style={{color: '#558617',fontSize: 10}}>{item.status}</Text>
                </View>
            </Row>
            <Divider/>
            <Row>
                <Col >
                    <Text style={{fontSize: 10, color: Color.secondary, textAlign: 'left'}}>Penawaranmu</Text>
                    <Text style={{fontSize: 12, fontWeight: 'bold', textAlign: 'left'}}>{item.penawaranmu} <Text style={{fontSize: 8, fontWeight: 'bold'}}>Poin</Text></Text>
                </Col>
                <Col>
                    <Text style={{fontSize: 10, color: Color.secondary, textAlign: 'left'}}>Harga Akhir</Text>
                    <Text style={{fontSize: 12, fontWeight: 'bold', textAlign: 'left'}}>{item.hargaAkhir} <Text style={{fontSize: 8, fontWeight: 'bold'}}>Poin</Text></Text>
                </Col>
                <Text style={{fontSize: 10, marginHorizontal: 5, marginVertical: 8, color: Color.primary}}>Lihat Detail</Text>
                <AntDesign name={'arrowright'} size={11} style={{marginVertical: 9, marginRight: 15, color: Color.primary}}/>
            </Row>
        </View>
      );
  return (
    <Scaffold
      header={
        <Header
          type="bold"
          centerTitle={false}
          customIcon
          title="Riwayat"
        />
      }>
    <Row>
        <TouchableOpacity style={{marginHorizontal: 15,width: '25%', height: 32, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderColor:Color.text, borderWidth: 1}}>
            <FontAwesome name={'filter'} size={12} style={{marginHorizontal: 5}}/>
            <Text style={{fontSize: 10, marginRight: 10}}>Filter</Text>
            <MaterialIcons name={'keyboard-arrow-down'} size={16}/>
        </TouchableOpacity>
        <TouchableOpacity style={{width: '30%', height: 32, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderColor:Color.text, borderWidth: 1}}>
            <MaterialIcons name={'sort'} size={12} style={{marginHorizontal: 5}}/>
            <Text style={{fontSize: 10, marginRight: 10}}>Urutkan</Text>
            <MaterialIcons name={'keyboard-arrow-down'} size={16}/>
        </TouchableOpacity>
    </Row>
    <Divider/>
    <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </Scaffold>
  )
}

export default AuctionHistory