import React, { useState, useEffect, useRef } from 'react';

import { useWindowDimensions, View, Image, ScrollView, Platform, Linking, } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import { useSelector } from 'react-redux';
import moment from 'moment';
import ListContentProduct from 'src/components/Content/ListContentProduct';
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

import { useIsFocused } from '@react-navigation/native';

const PlaceDetailCategory = ({ navigation,route }) => {
  const item = route.params;

console.log('ini params det',item);
  const { Color } = useColor();
  const isFocused = useIsFocused();
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


  return (
    <Scaffold
      header={
        <Header
          title={item.nama}
          centerTitle={false}
          showLeftButton={true}
          iconLeftButton={'arrow-left'}

        />
      }>
       {isFocused && <ListContentProduct
           
            productCategory='NEARBY_PLACE'
            name='Tempat'
          />}



    </Scaffold>
  );
};

export default PlaceDetailCategory;
