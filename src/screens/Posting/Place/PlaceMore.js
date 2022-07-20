import React, { useState, useEffect, useRef } from 'react';

import { useWindowDimensions, View, Image, ScrollView, Platform, Linking,FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { useLoading, usePopup, useColor, Alert, Header } from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { TouchableOpacity } from '@src/components/Button';
import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import { Container, Divider, Line } from 'src/styled';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import {
  iconBengkel,
  iconToko,
  iconKafe,
  iconResto,
  iconLainnya, iconStar,
  iconAddPlace,
  iconSendok,
  iconCoffe,
  iconBar,
  iconTree,
  iconGym,
  iconBook,
  iconRenang,
  iconBioskop,
  IconMuseum,
  iconCar,
  iconCuciMobil,
  iconHotel,
  iconPangkas,
  iconShop,
  iconCart,
  iconMontir,
} from 'assets/images/place';

const PlaceMore = ({ navigation }) => {
  const { Color } = useColor();

  const modalOptionsRef = useRef();

  const user = useSelector(state => state['user.auth'].login.user);
  const { width } = useWindowDimensions();

  const setState = obj => changeState({ ...state, ...obj });

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();


  //   // useEffect(() => {
  //   //     const timeout = trigger ? setTimeout(() => {
  //   //         fetchAddLike();
  //   //     }, 500) : null;

  //   //     return () => {
  //   //         clearTimeout(timeout);
  //   //     }
  //   // }, [trigger]);

  const DataMakan = [
    {
      id:1,
      nama: 'Restoran',
      icon: iconSendok
    },
    {
      id:2,
      nama: 'Kafe',
      icon: iconCoffe
    },
    {
      id:3,
      nama: 'Bar',
      icon: iconBar
    },
  ];
  const DataFasilitas1 = [
    {
      id:1,
      nama: 'Taman',
      icon: iconTree
    },
    {
      id:2,
      nama: 'Gym',
      icon: iconGym
    },
    {
      id:3,
      nama: 'Perpustakaan',
      icon: iconBook
    },
   
  ];
  const DataFasilitas2 =
  [
    {
      id:4,
      nama: 'Bioskop',
      icon: iconBioskop
    },
    {
      id:5,
      nama: 'Museum',
      icon: IconMuseum
    },
    {
      id:6,
      nama: 'Kolam Renang',
      icon: iconRenang
    },
  ]
  const DataBelanja =
  [
    {
      id:4,
      nama: 'Toko',
      icon: iconShop
    },
    {
      id:5,
      nama: 'Mall',
      icon: iconCart
    },
    
  ]

  const DataLayanan1 =
  [
    {
      id:4,
      nama: 'Bengkel',
      icon: iconMontir
    },
    {
      id:5,
      nama: 'Rental',
      icon: iconCar
    },
    {
      id:6,
      nama: 'Cuci Mobil',
      icon: iconCuciMobil
    },
    
  ]
  const DataLayanan2 =
  [
    {
      id:4,
      nama: 'Salon',
      icon: iconPangkas
    },
    {
      id:5,
      nama: 'Hotel',
      icon: iconHotel
    },
    
    
  ]
  const renderItem = ({ item }) => (
    <View style={{marginRight:10}}>
    <TouchableOpacity onPress={()=> navigation.navigate('PlaceDetailCategory',{nama:item.nama})}>
    <View style={{  flexDirection: 'row', borderColor: Color.border, borderWidth: 1, width: 110, height: 40, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 20 }}>

      <Image
        source={item.icon}
        style={{ height: 18, width: 20 }}
        resizeMode='contain'
      ></Image>
      <Text type="bold" style={{marginHorizontal:2,marginTop:2}} size={11} color={Color.menuPlace} align="left">{item.nama}</Text>
      <View>
      </View>
    </View>
  </TouchableOpacity>
  </View>
  );

  return (
    <Scaffold
      header={
        <Header
          title='Lainnya'
          centerTitle={false}
          showLeftButton={true}
          iconLeftButton={'arrow-left'}

        />
      }>
        
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={{ marginHorizontal: 16 }}>


          <Text type="bold" align="left">Makanan</Text>

          <Divider />
          <FlatList
        data={DataMakan}
        renderItem={renderItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
      />
       
          <Divider />
          <Line color={Color.border} width={width} />
          <Line color={Color.border} width={width} />
          <Line color={Color.border} width={width} />
          <Divider />
          {/* fasilitas umum */}

          <Text type="bold" align="left">Fasilitas Umum</Text>
          <Divider />
          <FlatList
        data={DataFasilitas1}
        renderItem={renderItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
      />
       <Divider />
       <FlatList
        data={DataFasilitas2}
        renderItem={renderItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
      />
          <Divider />
          <Divider />
          <Line color={Color.border} width={width} />
          <Line color={Color.border} width={width} />
          <Line color={Color.border} width={width} />
          <Divider />


          {/* fasilitas umum */}

          <Text type="bold" align="left">Belanja</Text>
          <Divider />
          <FlatList
        data={DataBelanja}
        renderItem={renderItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
      />
         
          <Divider />
          <Line color={Color.border} width={width} />
          <Line color={Color.border} width={width} />
          <Line color={Color.border} width={width} />
          <Divider />

          {/* Layanan */}


          <Text type="bold" align="left">Layanan</Text>
          <Divider />
          <FlatList
        data={DataLayanan1}
        renderItem={renderItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
      />
     
          <Divider />
          <FlatList
        data={DataLayanan2}
        renderItem={renderItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
      />
       
          <Divider />
          <Line color={Color.border} width={width} />
          <Line color={Color.border} width={width} />
          <Line color={Color.border} width={width} />
          <Divider />
        </View>

      </ScrollView>



    </Scaffold>
  );
};

export default PlaceMore;
