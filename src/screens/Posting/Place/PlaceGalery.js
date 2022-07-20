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
  iconGaleryAdd
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
  const DATACONTENT = [
    {
        id: 1,
        nama: 'Helena Helinsky',
        icon: 'https://reactnative.dev/img/tiny_logo.png',
        desc: 'Cupcake ipsum dolor sit amet. Pudding jelly-o danish powder halvah I love jujubes jelly-o.'

    },
    {
        id: 2,
        nama: 'Hendra Budi ',
        icon: 'https://reactnative.dev/img/tiny_logo.png',
        desc:'Cupcake ipsum dolor sit amet. Pudding jelly-o danish powder halvah I love jujubes jelly-o.'

    },
    {
      id: 2,
      nama: 'Hendra Budi ',
      icon: 'https://reactnative.dev/img/tiny_logo.png',
      desc:'Cupcake ipsum dolor sit amet. Pudding jelly-o danish powder halvah I love jujubes jelly-o.'

  },
  {
    id: 2,
    nama: 'Hendra Budi ',
    icon: 'https://reactnative.dev/img/tiny_logo.png',
    desc:'Cupcake ipsum dolor sit amet. Pudding jelly-o danish powder halvah I love jujubes jelly-o.'

},
{
  id: 2,
  nama: 'Hendra Budi ',
  icon: 'https://reactnative.dev/img/tiny_logo.png',
  desc:'Cupcake ipsum dolor sit amet. Pudding jelly-o danish powder halvah I love jujubes jelly-o.'

},
   
];
  
  const renderItem = ({ item }) => (
    <View style={{margin:5}}>

      
<Image
        style={{ 
          width: 110,
          height: 'auto',
          aspectRatio: 3/2 ,
    }} 
        source={{
          uri: 'https://reactnative.dev/img/tiny_logo.png',
        }}
      />
    
  </View>
  );

  return (
    
        
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={{marginHorizontal:16,marginVertical:16}}>

          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text type="bold">Semua</Text>
<TouchableOpacity onPrees={()=>{

}}>
              <View style={{flexDirection:'row', borderRadius:20,borderWidth:1,borderColor:Color.grayLight,paddingHorizontal:20,paddingVertical:10}}>
              
              <Image
              source={iconGaleryAdd}
              style={{ height: 20, width: 20,  }}
              resizeMode='contain'
            />

            <Text> Tambahkan Foto</Text>
              </View>
              </TouchableOpacity>

          </View>
          <View style={{flexDirection:'row',marginVertical:10}}>
          <TouchableOpacity style={{ borderWidth: 1, paddingHorizontal: 10, paddingVertical: 7, marginHorizontal: 10, borderRadius: 20 }}>
                <Text type="bold">Semua(124)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ borderWidth: 1, paddingHorizontal: 10, paddingVertical: 7, marginHorizontal: 10, borderRadius: 20 }}>
                <Text type="bold">Foto(24)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ borderWidth: 1, paddingHorizontal: 10, paddingVertical: 7, marginHorizontal: 10, borderRadius: 20 }}>
                <Text type="bold">Video(2)</Text>
            </TouchableOpacity>
          </View>
        <FlatList
                data={DATACONTENT}
                renderItem={renderItem}
               numColumns={3}
            
             
                keyExtractor={item => item.id}
            />
        </View>

      </ScrollView>

  );
};

export default PlaceMore;
