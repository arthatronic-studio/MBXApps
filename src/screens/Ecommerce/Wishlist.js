import React, { useState, useEffect, useRef, Component } from 'react';
import { View, AppRegistry, FlatList, ScrollView, Platform, Image, SafeAreaView, TextInput, TouchableOpacity, Pressable } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNSimpleCrypto from "react-native-simple-crypto";
import Octicons from 'react-native-vector-icons/Octicons'
import Feather from 'react-native-vector-icons/Feather'
import Swiper from 'react-native-swiper'

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
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios';
import moment from 'moment';

const WishlistData = [
    {
      id: 1,
      namaProduk: 'Tas Laptop Formal Pria',
      review: '4.5',
      terjual: 450,
      harga: 'Rp. 278.100',
      image: ImagesPath.lelangecommerce3,
    },
    {
        id: 1,
      namaProduk: 'Tas Laptop Formal Pria',
      review: '4.5',
      terjual: 450,
      harga: 'Rp. 278.100',
      image: ImagesPath.lelangecommerce3,
      },
      {
        id: 1,
      namaProduk: 'Tas Laptop Formal Pria',
      review: '4.5',
      terjual: 450,
      harga: 'Rp. 278.100',
      image: ImagesPath.lelangecommerce3,
      },
      {
        id: 1,
      namaProduk: 'Tas Laptop Formal Pria',
      review: '4.5',
      terjual: 450,
      harga: 'Rp. 278.100',
      image: ImagesPath.lelangecommerce3,
      },
    
  ];


const Wishlist = ({navigation}) => {
    const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [namePetugas, setNamePetugas] = useState('');
    const [phonePetugas, setPhonePetugas] = useState('');
    const [nameKoor, setNameKoor] = useState('');
    const [phoneKoor, setPhoneKoor] = useState('');
	const { Color } = useColor();


    const renderItem = ({ item }) => (
        <View style={{borderRadius: 5, width: '95%', marginHorizontal: 8, marginVertical: 5, paddingVertical: 10, backgroundColor: Color.textInput }}>
            <View style={{ flexDirection: 'row',}}>
                <Image source={item.image} style={{width: 50, height: 50, marginHorizontal: 10}}/>
                <View style={{marginHorizontal: 10}}>
                    <Text style={{fontWeight: 'bold'}}>{item.namaProduk}</Text>
                    <View style={{flexDirection: 'row', marginVertical: 3}}>
                        <Entypo name={'star'} style={{color: Color.yellow,}}/>
                        <Text style={{fontSize: 10, marginHorizontal: 5}}>{item.review}</Text>
                        <View style={{marginHorizontal: 5, marginVertical: 2,backgroundColor: Color.secondary, height: 10, width: 1}}></View>
                        <Text style={{marginHorizontal: 5, fontSize: 10}}>{item.terjual}</Text>
                        <Text style={{ fontSize: 10}}>Terjual</Text>
                    </View>
                    <Text style={{textAlign: 'left', fontWeight: 'bold'}}>{item.harga}</Text>
                </View>
            </View>
            <View style={{flexDirection: 'row', marginTop: 25, alignSelf: 'flex-end', marginHorizontal: 10}}>
                <View style={{ borderRadius: 10, width: '30%', alignSelf: 'flex-end'}}>
                    <TouchableOpacity style={{backgroundColor: Color.textInput, height: 27, borderRadius: 20}}>
                        <Text style={{color: Color.error, fontWeight: 'bold', fontSize: 10, marginVertical: 5}}>Hapus</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ borderRadius: 10, width: '30%'}}>
                    <TouchableOpacity style={{backgroundColor: Color.primary, borderRadius: 20, height: 27}}>
                        <Text style={{color: Color.textInput, fontWeight: 'bold', fontSize: 10, marginVertical: 5}}>+ Ke keranjang</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      );
  return (
    <Scaffold header={<Header customIcon title="Wishlist" type="regular" centerTitle={false} />}
    onPressLeftButton={() => navigation.pop()}>
        <ScrollView style={{backgroundColor: Color.semiwhite}}>
            <View>
            <FlatList
                    data={WishlistData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </ScrollView>
    </Scaffold>
  )
}

export default Wishlist