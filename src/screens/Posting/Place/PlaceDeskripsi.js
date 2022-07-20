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
    <ScrollView>
    <View
      style={{
        backgroundColor: Color.theme,
        padding: 16,
        alignItems: 'flex-start',
      }}>
        <Text align='left'>
        Cupcake ipsum dolor sit amet carrot cake. Sweet jelly beans gummi bears danish lemon drops gingerbread soufflé. Danish shortbread gummi bears cotton candy gingerbread. Marzipan macaroon shortbread jelly caramels chocolate bar ice cream.

Muffin marshmallow chocolate macaroon gummies candy canes I love liquorice. Jujubes chocolate cake gingerbread I love candy. Cotton candy chocolate bar lemon drops I love tootsie roll danish.
        </Text>
    </View>
    </ScrollView>
  );
};

export default PlaceMore;
