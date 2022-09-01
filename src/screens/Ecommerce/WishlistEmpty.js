import React, { useState, useEffect, useRef, Component } from 'react';
import { View, AppRegistry, FlatList, ScrollView, Platform, Image, SafeAreaView, TextInput, TouchableOpacity, Pressable } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNSimpleCrypto from "react-native-simple-crypto";
import Octicons from 'react-native-vector-icons/Octicons'
import Feather from 'react-native-vector-icons/Feather'

import {
	Text,
	// TouchableOpacity,
	Loading,
	useLoading,
	Scaffold,
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

const WishlistEmpty = ({navigation}) => {
  const {Color} = useColor();
  return (
    <Scaffold
		header={<Header customIcon title="Wishlist" type="regular" centerTitle={false} />}
		onPressLeftButton={() => navigation.pop()}
	>
    <View style={{alignItems: 'center', justifyContent: 'center', marginVertical: 100}}>
      <Image source={ImagesPath.wishlist}/>
      <Text style={{fontSize: 12, color: Color.secondary, width: '60%', paddingVertical: 15, lineHeight: 20}}>Kamu belum memiliki daftar wishlist apapun</Text>
      <View>
        <TouchableOpacity style={{backgroundColor: Color.primary, width: 160, height: 35, borderRadius: 20,
        justifyContent: 'center'}}>
          <Text style={{fontSize: 12, fontWeight: 'bold', color: Color.textInput}}>Belanja Sekarang</Text>
        </TouchableOpacity>
      </View>
    </View>
      
    </Scaffold>
  )
}

export default WishlistEmpty