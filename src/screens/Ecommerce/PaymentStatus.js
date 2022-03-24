import React, { useState, useEffect, useRef } from 'react';
import { View, Image ,ScrollView, Platform, SafeAreaView, TextInput as TextInputs } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  Text,
  // TouchableOpacity,
  useLoading,
  Scaffold,
  Row, Col,
  useColor,
  Header
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import { TextInput } from 'src/components/Form';
import CardListProduk from 'src/components/Card/CardListProduct';
import TopTabShop from './TopTabShop';
import ImagesPath from 'src/components/ImagesPath';
import { Divider } from 'src/styled';

const PaymentStatus = () => {
const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const { Color } = useColor();

  
  useEffect(() => {
  }, []);
  return (
    <Scaffold
        style={{backgroundColor: Color.semiwhite}}
          header={
            <Header 
              customIcon 
              title='Status Pembayaran' 
              type='regular'
              centerTitle={false}
            />
          }
          onPressLeftButton={() => navigation.pop()}
        >
            <View style={{backgroundColor: Color.theme}}>
            <Divider height={20}/>
                <View style={{flexDirection: 'row', marginHorizontal: 15}}>
                    <Text style={{textAlign: 'left',width: '85%',color: Color.text, fontWeight: 'bold',fontSize: 12, marginVertical: 1.5}}>Silahkan lakukan pembayaran sebelum</Text>
                    <Text style={{color: Color.error, fontSize: 14, fontWeight: 'bold'}}>00:15:00</Text>
                </View>
                <Divider height={35}/>
                <View style={{marginHorizontal: 15}}> 
                    <View style={{flexDirection: 'row', marginVertical: 5}}>
                        <Text style={{textAlign: 'left',width: '67%',color: Color.secondary, fontWeight: 'normal',fontSize: 10}}>Status</Text>
                        <Text style={{textAlign: 'right',width: '33%',color: Color.text, fontWeight: 'bold',fontSize: 10}}>Menunggu Pembayaran</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginVertical: 5}}>
                        <Text style={{textAlign: 'left',width: '67%',color: Color.secondary, fontWeight: 'normal',fontSize: 10}}>Tanggal Transaksi</Text>
                        <Text style={{textAlign: 'right',width: '33%',color: Color.text, fontWeight: 'normal',fontSize: 10}}>28 Januari 2022</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginVertical: 5}}>
                        <Text style={{textAlign: 'left',width: '67%',color: Color.secondary, fontWeight: 'normal',fontSize: 10}}>No Receipt</Text>
                        <Text style={{textAlign: 'right',width: '33%',color: Color.text, fontWeight: 'normal',fontSize: 10}}>1000000234596929748</Text>
                    </View>
                </View>
                <Divider height={8}/>
                <View style={{justifyContent: 'center', alignItems: 'center',backgroundColor: Color.semiwhite, width: '93%', height: 70, borderRadius: 3, alignSelf: 'center',}}>
                    <Text style={{fontSize: 10, color: Color.text, fontWeight: 'bold'}}>No. Rekening Tujuan</Text>
                    <View style={{flexDirection: 'row', marginVertical: 6}}>
                        <Image source={ImagesPath.bca} style={{marginVertical: 4.2}}/>
                        <Text style={{marginHorizontal: 8,fontSize: 18, color: Color.text, fontWeight: 'bold'}}>5475361331</Text>
                    </View>
                </View>
                <View style={{ alignSelf: 'center',borderRadius: 5,backgroundColor: '#F2F4FA', width: '93%', height: 90, marginVertical:12}}>
                    <View style={{flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 8}}>
                        <Text style={{textAlign: 'left', marginVertical: 1,width: '75%',fontSize: 10, color: Color.secondary}}>Nominal Transfer</Text>
                        <Text style={{marginHorizontal: 4,fontSize: 12, color: '#3C58C1', fontWeight: 'bold'}}>Rp. 155.000</Text>
                        <MaterialIcons name={'keyboard-arrow-up'} size={17}/>
                    </View>
                    <View style={{alignSelf: 'center',backgroundColor: Color.border, width: '95%', height: 1}}/>
                    <Divider height={5}/>
                    <View style={{flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 3}}>
                        <Text style={{textAlign: 'left', marginVertical: 1,width: '80%',fontSize: 10, color: Color.secondary}}>Subtotal</Text>
                        <Text style={{textAlign: 'right',width: '20%',fontSize: 10, color: Color.text, fontWeight: 'bold'}}>Rp. 155.000</Text>
                    </View>
                    <View style={{flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 3}}>
                        <Text style={{textAlign: 'left', marginVertical: 1,width: '80%',fontSize: 10, color: Color.secondary}}>Biaya Admin</Text>
                        <Text style={{width: '20%',textAlign: 'right',fontSize: 10, color: Color.text, fontWeight: 'bold'}}>GRATIS</Text>
                    </View>
                </View>
            </View>
            <Divider height={320}/>
            <View style={{justifyContent: 'center', alignItems: 'center',backgroundColor: Color.theme, height: 70, width: '100%'}}>
                <TouchableOpacity style={{justifyContent: 'center',backgroundColor: Color.primary, width: '90%', height: 42, borderRadius: 20}}>
                    <Text style={{color: Color.textInput, fontSize: 12, fontWeight: 'bold'}}>Kembali</Text>
                </TouchableOpacity>
            </View>
        </Scaffold>
  )
}

export default PaymentStatus