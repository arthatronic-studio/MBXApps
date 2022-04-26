import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, FlatList,SafeAreaView, TextInput, Pressable, useWindowDimensions } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import IonIcons from 'react-native-vector-icons/Ionicons';
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
import TopTabShop from '../Ecommerce/TopTabShop';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MyShopHeader from '../Ecommerce/MyShopHeader';
import { queryGetMyProduct, queryGetMyShop } from 'src/lib/query/ecommerce';
import { useIsFocused } from '@react-navigation/native';

const AddProductAuctionSecond = ({navigation}) => {
    const { Color } = useColor();
  return (
    <Scaffold
      header={<Header title={'Tambah Barang Lelang'} customIcon type="bold" centerTitle={false} />}
      onPressLeftButton={() => navigation.pop()}>
    <ScrollView>
    <Row style={{backgroundColor: Color.theme, paddingHorizontal: 15, paddingVertical: 15}}>
        <Image source={ImagesPath.two} style={{width: 40, height: 40}}/>
        <Col style={{paddingHorizontal: 10}}>
            <Text style={{fontWeight: 'bold', fontSize: 14, textAlign: 'left'}}>Hampir Selesai</Text>
            <Text style={{lineHeight: 15,fontSize: 8, color: Color.secondary, textAlign: 'left'}}>Masukkan jadwal lelang, harga, dan informasi lainnya tentang lelang ini.</Text>
        </Col>
        <View style={{width: '22%'}}/>    
    </Row>
    <Row style={{borderWidth: 1, borderColor: Color.border, width: '95%', alignSelf: 'center',paddingHorizontal: 10,borderRadius: 10}}>
        <Image source={ImagesPath.produklelang} style={{width: 60, height: 60, borderRadius: 10}}/>
        <Col style={{paddingHorizontal: 10, paddingVertical: 10}}>
            <Text style={{fontSize: 12, fontWeight: 'bold', textAlign: 'left'}}>Xiaomi 11T 128GB</Text>
            <Divider/>
            <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left'}}>Harga saat ini</Text>
            <Text style={{fontSize: 12, fontWeight: 'bold', textAlign: 'left'}}>Rp. 5.999.000</Text>
        </Col>
    </Row>
    
    <View style={{alignSelf: 'center', width:'95%'}}>
        <Text style={{marginVertical: 14,position: 'absolute', fontSize: 6, marginHorizontal: 10, color: Color.secondary}}>Tanggal Mulai Lelang</Text>
        <TextInput placeholder={'dd/mm/yyyy'} style={{ontSize: 12, paddingHorizontal: 10, paddingTop: 16,borderWidth: 1, borderColor: Color.border, width: '100%', alignSelf: 'center', height: 45, borderRadius: 5, marginVertical: 10}}>

        </TextInput>
        <Fontisto name={'date'} style={{position: 'absolute', marginVertical: 30, right: 10, marginHorizontal: 10}} color={Color.secondary}/>
    </View>
    <View style={{alignSelf: 'center', width:'95%', flexDirection: 'row'}}>
        <View style={{width: '49%'}}>
            <Text style={{marginVertical: 5,position: 'absolute', fontSize: 6, marginHorizontal: 10, color: Color.secondary}}>Jam Mulai</Text>
            <TextInput placeholder={'00:00'} style={{fontSize: 12, paddingHorizontal: 10, paddingTop: 16,borderWidth: 1, borderColor: Color.border, width: '100%', alignSelf: 'center', height: 45, borderRadius: 5,}}>

            </TextInput>
        </View>
        <View style={{width: '48%', marginHorizontal: 10}}>
            <TouchableOpacity style={{borderWidth: 1, borderColor: Color.border, width: '100%', height: 45, borderRadius: 5,}}>
                <Text style={{marginVertical: 5,fontSize: 6, marginHorizontal: 10, color: Color.secondary, textAlign: 'left'}}>Durasi</Text>
                <Row>
                    <Text style={{fontSize: 12, color: Color.text, marginHorizontal: 10, width: '75%', textAlign: 'left'}}>Pilih Durasi</Text>
                    <MaterialIcons name={'keyboard-arrow-down'} size={16} style={{width: '25%'}}/>
                </Row>
            </TouchableOpacity>
        </View>
    </View>
        <View style={{width: '95%', alignSelf: 'center', marginVertical: 10}}>
            <Text style={{marginVertical: 5,position: 'absolute', fontSize: 6, marginHorizontal: 10, color: Color.secondary}}>Deskripsi</Text>
            <TextInput placeholder={'Tuliskan sesuatu tentang ini . . .'} style={{fontSize: 12, paddingHorizontal: 10, paddingTop: 16,borderWidth: 1, borderColor: Color.border, width: '100%', alignSelf: 'center', height: 95, borderRadius: 5,}}>

            </TextInput>
        </View>
    <View style={{alignSelf: 'center', width:'95%'}}>
        <Text style={{marginVertical: 7,position: 'absolute', fontSize: 6, marginHorizontal: 10, color: Color.secondary}}>Harga awal</Text>
        <TextInput placeholder={'0'} style={{ontSize: 12, paddingHorizontal: 10, paddingTop: 16,borderWidth: 1, borderColor: Color.border, width: '100%', alignSelf: 'center', height: 45, borderRadius: 5, marginBottom: 10}}>

        </TextInput>
        <Text style={{position: 'absolute', marginVertical: 16, right: 10, marginHorizontal: 10, fontSize: 12}} color={Color.text}>Poin</Text>
        <Row>
            <IonIcons name={'information-circle-outline'} color={'#2C70F7'}/>
            <Text style={{fontSize: 8, marginHorizontal: 5, color: Color.secondary}}>Harga akhir lelang nantinya akan dikonversikan kedalam rupiah</Text>
        </Row>
    </View>
    <Divider/>
    <Row style={{paddingHorizontal: 10}}>
        <Text style={{fontSize: 8, marginHorizontal: 5, color: Color.secondary, width: '47%', textAlign: 'left'}}>Nominal Kelipatan Biding</Text>
        <Text style={{fontSize: 8, marginHorizontal: 5, color: Color.primary, width: '47%', textAlign: 'right'}}>Tambah Nominal Kelipatan</Text>
    </Row>
    <View style={{alignItems: 'center', justifyContent: 'center',marginVertical: 10, borderRadius: 5,width: '95%', backgroundColor: Color.border, height: 60, alignSelf: 'center'}}>
        <Text style={{fontSize: 10, color: Color.secondary}}>Nominal bidding belum diatur</Text>
    </View>
    </ScrollView>
    <Row style={{backgroundColor: Color.theme, height: 60, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={()=> navigation.navigate('AddProductAuctionSecond')} style={{backgroundColor: Color.primary, width: '95%',height: '65%', justifyContent: 'center', alignItems: 'center',borderRadius: 20}}>
            <Text style={{marginHorizontal: 5,fontSize: 12, color: Color.textInput}}>Lanjutkan</Text>
        </TouchableOpacity>
   </Row>
    </Scaffold>
  )
}

export default AddProductAuctionSecond