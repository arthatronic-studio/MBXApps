import React, { useState, useEffect, useRef, Component } from 'react';
import { View, AppRegistry, FlatList, ScrollView, Platform, Image, SafeAreaView, TextInput, TouchableOpacity, Pressable, ColorPropType } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNSimpleCrypto from "react-native-simple-crypto";


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
import CardListProduk from 'src/components/Card/CardListProduct';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios';
import moment from 'moment';

const BelanjaanEmpty = ({navigation}) => {
  const {Color} = useColor();
  return (
    
    <View>
        <View style={{alignItems: 'center', justifyContent: 'center', marginVertical: 100}}>
      <Image source={ImagesPath.shoppingcart}/>
      <Text style={{fontSize: 12, color: Color.secondary, width: '60%', paddingVertical: 15, lineHeight: 20}}>Kamu belum memasukkan barang apapun ke keranjang</Text>
      <View>
        <TouchableOpacity style={{backgroundColor: Color.primary, width: 160, height: 35, borderRadius: 20,
        justifyContent: 'center'}}>
          <Text style={{fontSize: 12, fontWeight: 'bold', color: Color.textInput}}>Belanja Sekarang</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={{marginVertical: 130,flexDirection: 'row', width: '100%', height:80, backgroundColor: Color.textInput, elevation: 20,paddingVertical: 20}}>
       <View style={{width: '45%', marginHorizontal: 20}}>
                <Text style={{fontSize: 8, color: Color.secondary}}>Total Harga</Text>
               <Text style={{fontWeight: 'bold', fontSize: 18}}>Rp. 0</Text>
            </View>
             <View style={{backgroundColor: Color.border, width: 150, height: 35, borderRadius: 20}}>
                 <TouchableOpacity>
                     <Text style={{textAlign: 'center', marginVertical: 5, color: Color.textInput, fontWeight: 'bold'}}>Checkout</Text>
                 </TouchableOpacity>
             </View>
    </View>
    </View>
      
    
  )
}

export default BelanjaanEmpty