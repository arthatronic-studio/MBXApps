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

const MyTicket = () => {

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
          title="Tiketku"
          actions={<></>}
        />
      }
    >
        <ScrollView>
        <Divider/>
        <View style={{backgroundColor: Color.theme, paddingHorizontal: 10, paddingVertical: 10,width: '92%', alignSelf:'center', flexDirection:'row',borderRadius: 10, elevation: 2}}>
            <View style={{width: 55, height: 55, backgroundColor: Color.secondary, borderRadius: 5}}>
                <Image source={ImagesPath.produklelang3} style={{width:'100%', height: '100%'}}/>
            </View>
            <View style={{width: '70%', paddingHorizontal: 10}}>
                <Text align={'left'} style={{fontWeight: 'bold'}}>Festival Pemuda Karang Taruna Jabodetabek</Text>
                <View style={{flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
                    <Text style={{fontSize: 10, color: Color.secondary}}>1 Tiket</Text>
                    <View style={{width: 3, height: 3, backgroundColor: Color.secondary, borderRadius: 20, marginHorizontal: 5}}/>
                    <Text style={{fontSize: 10, color: Color.secondary}}>1 Pax</Text>
                </View>
            </View>
        </View>
        <Divider/>
        <View style={{backgroundColor: Color.theme, width: '92%', alignSelf: 'center', borderRadius: 15}}>
            <Divider/>
            <View style={{paddingHorizontal: 15, flexDirection: 'row'}}>
                <View style={{width: '85%'}}>
                    <Text align={'left'} style={{fontWeight: 'bold'}}>Tn. Adang Susanyo</Text>
                    <Text align={'left'} style={{fontSize: 8, color: Color.secondary,marginTop: 2}}>Tiket Masuk Partisipasi</Text>
                    <Divider/>
                </View>
                <View style={{backgroundColor: Color.theme, width: 40, height: 40, borderRadius: 20}}>
                    <Image source={ImagesPath.tribes} style={{width: '100%', height: '100%'}}/>
                </View>
            </View>
            <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'center'}}>
                <View style={{backgroundColor: Color.border, height: 15, width: '5%', borderTopRightRadius: 20}}/>
                <View style={{borderBottomColor: Color.border, borderStyle: 'dashed',borderBottomWidth: 1,height:'100%', width: '90%'}}/>
                <View style={{backgroundColor: Color.border, height: 15, width: '5%',borderTopLeftRadius: 20}}/>
            </View>
            <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'center'}}>
                <View style={{backgroundColor: Color.border, height: 15, width: '5%', borderBottomRightRadius: 20}}/>
                <View style={{borderColor: Color.theme, width: '90%'}}/>
                <View style={{backgroundColor: Color.border, height: 15, width: '5%',borderBottomLeftRadius: 20}}/>
            </View>
            <Divider/>
            <Row style={{alignItems:'center', justifyContent: 'center'}}>
                <View style={{paddingHorizontal: 10,paddingVertical: 10,borderWidth: 1, borderRadius: 8,marginRight: 5,borderColor: Color.border, width: '45%'}}>
                    <Image source={ImagesPath.PurpleClock}/>
                    <Text align={'left'} style={{fontWeight: 'bold', marginTop: 3}}>10:00 - 22:00</Text>
                </View>
                <View style={{paddingHorizontal: 10,paddingVertical: 10,borderWidth: 1, borderRadius: 8,marginLeft: 5,borderColor: Color.border, width: '45%'}}>
                    <Image source={ImagesPath.BlueCalendar}/>
                    <Text align={'left'} style={{fontWeight: 'bold', marginTop: 3}}>12 Januari 2022</Text>
                </View>
            </Row>
            <Divider height={10}/>
            <Row style={{width: '92%', paddingVertical: 10,paddingHorizontal: 10,borderRadius: 5,alignSelf: 'center', borderWidth: 1, borderColor: Color.border}}>
                <Image source={ImagesPath.RedPin}/>
                <View style={{width: '85%', marginLeft: 10}}>
                    <Text align={'left'} numberOfLines={3} style={{fontSize: 10, lineHeight: 15, fontWeight: 'bold'}}>Jl Prof Dr Soepomo SH 27 Ged Anakida Lt 3 Suite 303,Tebet Barat, Jakarta Selatan</Text>
                    <Divider height={10}/>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        <Text style={{fontSize: 10, color: Color.primary, marginRight: 5}}>Detail lokasi</Text>
                        <AntDesign name={'arrowright'} size={10} color={Color.primary}/>
                    </View>
                </View>
            </Row>
            <Divider height={10}/>
            <View style={{width: '92%', alignItems: 'center',padding: 20,borderWidth: 1,borderRadius: 8,height: 350, marginBottom: 20,borderColor: Color.border, alignSelf:'center'}}>
                    <Image source={ImagesPath.QRCode} style={{width: '95%', height: '89%'}}/>
                    <Text style={{fontWeight: 'bold', padding: 15}}>10000000013654987</Text>
            </View>
            <Divider/>
            <View style={{justifyContent: 'center', alignItems:'center',flexDirection:'row',backgroundColor: '#3C58C1', width: '100%', height: 40, borderBottomLeftRadius: 15,borderBottomRightRadius: 15}}>
                <MaterialCommunityIcons size={14} name={'cash-refund'} color={Color.textInput}/>
                <Text style={{fontSize: 10, color: Color.textInput, marginLeft: 5}}>Bisa Refund</Text>
                <View style={{backgroundColor: Color.theme, width: 4, height: 4, borderRadius: 20, marginHorizontal: 8}}/>
                <AntDesign name={'calendar'} color={Color.textInput}/>
                <Text style={{fontSize: 10, color: Color.textInput, marginLeft: 5}}>Tidak Perlu Reservasi</Text>
            </View>
        </View>
        <Divider height={50}/>
        </ScrollView>
    
    </Scaffold>
  )
}

export default MyTicket