import React, {useState, useEffect, useRef} from 'react';
import {View, Image, FlatList,ScrollView, Platform, Linking, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import Header from '@src/components/Header';
import {useLoading, usePopup, useColor, Alert, Row, Col} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import {TouchableOpacity, Button} from '@src/components/Button';
import HighlightContentProduct from 'src/components/Content/HighlightContentProduct';
import Client from '@src/lib/apollo';
import {queryAddLike} from '@src/lib/query';
import { Container, Divider, Padding } from 'src/styled';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import ImagesPath from 'src/components/ImagesPath';
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';


const History = ({navigation}) => {

const {Color} = useColor();
const [popupProps, showPopup] = usePopup();
const [loadingProps, showLoading, hideLoading] = useLoading();

  return (
    <Scaffold
        style={{backgroundColor: Color.border}}
      fallback={false}
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}
      header={
        <Header
          type="bold"
          centerTitle={false}
          title="Riwayat"
        />
      }
    >
        <Divider/>
        <FlatList
          data={[
            {Recipt: '100006485791', status: 'Menunggu Pembayaran', title: 'Geek Con by TRIBESOCIAL at Kota Kasablanka',
        totalTicket: 1, pax: 1, totalHarga: '110.000', image: ImagesPath.produklelang3},
            {Recipt: '100006485791', status: 'Lunas', title: 'Geek Con by TRIBESOCIAL at Kota Kasablanka',
        totalTicket: 1, pax: 1, totalHarga: '110.000', image: ImagesPath.produklelang2},
            {Recipt: '100006485791', status: 'Menunggu Pembayaran', title: 'Geek Con by TRIBESOCIAL at Kota Kasablanka',
        totalTicket: 1, pax: 1, totalHarga: '110.000',image: ImagesPath.produklelang5},
          ]}
          
          renderItem={({item}) => 
          <Pressable
          style={{borderRadius: 5, marginBottom: 10,backgroundColor: Color.theme, width:'95%', alignSelf: 'center'}}>
            <View style={{flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10,}}>
                <Col style={{width: '60%'}}>
                    <Text align={'left'} style={{fontSize: 8}}>No. Receipt</Text>
                    <Text align={'left'} style={{fontSize: 10, fontWeight: 'bold'}}>{item.Recipt}</Text>
                </Col>
                {item.status == "Lunas"?
                <View style={{backgroundColor: '#E7F5D0', borderRadius: 8,paddingHorizontal: 10, justifyContent: 'center', alignItems:'center'}}>
                    <Text size={10} color={'#558617'}>{item.status}</Text>
                </View>:
                <View style={{backgroundColor: '#FDD6DA', borderRadius: 8,paddingHorizontal: 10, justifyContent: 'center', alignItems:'center'}}>
                    <Text size={10} color={'#F73347'}>{item.status}</Text>
                </View>
                }
            </View>
            <View style={{borderWidth: 0.6, borderColor: Color.border, width: '95%', alignSelf: 'center'}}/>
            <View style={{paddingVertical: 10, flexDirection: 'row', paddingHorizontal: 10}}>
                <View style={{width: 50, height: 50, backgroundColor: Color.secondary, borderRadius: 5}}>
                    <Image source={item.image} style={{width: '100%', height: '100%'}}/>
                </View>
                <View style={{paddingHorizontal: 10, width: '70%'}}>
                    <Text numberOfLines={2} align={'left'} style={{fontWeight: 'bold'}}>{item.title}</Text>
                    <View style={{flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
                        <Text style={{fontSize: 10, color: Color.secondary}}>{item.totalTicket} Tiket</Text>
                        <View style={{width: 3, height: 3, backgroundColor: Color.secondary, borderRadius: 20, marginHorizontal: 5}}/>
                        <Text style={{fontSize: 10, color: Color.secondary}}>{item.pax} Pax</Text>
                    </View>
                </View>
            </View>
            <View style={{borderWidth: 0.6, borderColor: Color.border, width: '95%', alignSelf: 'center'}}/>
            <View style={{paddingVertical: 10, flexDirection: 'row'}}>
                <View style={{width: '70%', paddingHorizontal: 10}}>
                    <Text align={'left'} style={{fontSize: 8, color: Color.secondary}}>Harga Total</Text>
                    <Text align={'left'} style={{fontWeight: 'bold'}}>Rp. {item.totalHarga}</Text>
                </View>
                <Pressable onPress={()=> navigation.navigate('MyTicket')}
                style={{backgroundColor: Color.primary, borderRadius: 20,alignItems:'center', justifyContent: 'center',paddingHorizontal: 17}}>
                    <Text style={{fontSize:12, color: Color.textInput}}>Lihat Detail</Text>
                </Pressable>
            </View>
          </Pressable>}
        />
    </Scaffold>
  )
}

export default History