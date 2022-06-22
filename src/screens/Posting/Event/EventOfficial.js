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

const DATA = [
    {
      id: 1,
      title: 'Geek Con by TRIBESOCIAL at Kota Kasablanka',
      date: '08 Feb 2022',
      author: "Tribesocial Management",
      harga: 'Rp 100.000',
      status: 'OFFICIAL',
      Image: ImagesPath.productImage,
      discount: 75000
    },
    {
        id: 1,
        title: 'Geek Con by TRIBESOCIAL at Kota Kasablanka',
        date: '08 Feb 2022',
        author: "Tribesocial Management",
        harga: 'Rp 100.000',
        status: 'OFFICIAL',
        Image: ImagesPath.productImage,
        discount: 75000
      },
      {
        id: 1,
        title: 'Geek Con by TRIBESOCIAL at Kota Kasablanka',
        date: '08 Feb 2022',
        author: "Tribesocial Management",
        harga: 'Rp 100.000',
        status: 'OFFICIAL',
        Image: ImagesPath.productImage,
        discount: 75000
      },
      {
        id: 1,
        title: 'Geek Con by TRIBESOCIAL at Kota Kasablanka',
        date: '08 Feb 2022',
        author: "Tribesocial Management",
        harga: 'Rp 100.000',
        status: 'OFFICIAL',
        Image: ImagesPath.productImage,
        discount: 75000
      },
  ];


const EventOfficial = ({route}) => {

    const {Color} = useColor();

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  return (
    <Scaffold
      fallback={false}
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}
      style={{backgroundColor: Color.colorDominant}}
      header={
        <Header
          type="bold"
          centerTitle={false}
          title="Official Event"
          actions={
            <View>
              <TouchableOpacity>
                <Ionicons name='search' size={22} color={Color.text} style={{marginHorizontal: 15}} />
              </TouchableOpacity>
            </View>
          }
        />
      }
    >
    <View style={{width: '100%', height: 70, paddingHorizontal: 15,}}>
      <TouchableOpacity style={{alignSelf: 'flex-end',backgroundColor: Color.theme, marginTop: 20,alignItems: 'center', justifyContent: 'center',flexDirection: 'row', borderWidth: 1, borderColor: Color.text, width: '25%', borderRadius: 30, height: 30}}>
        <Text style={{fontSize: 10}}>Terbaru</Text>
        <MaterialIcons name={"keyboard-arrow-down"} size={18}/>
      </TouchableOpacity>
    </View>
    <FlatList
        data={DATA}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => 
            <View style={{flexDirection: 'row', width: '90%', alignSelf: 'center',marginBottom: 10}}>
                    <Image
                        source={item.Image}
                        style={{width: '35%', aspectRatio: 10/16, borderTopLeftRadius: 4, borderBottomLeftRadius: 4, backgroundColor: Color.border}}
                    />
                    <View style={{width: '65%', paddingHorizontal: 15, paddingVertical: 10, borderTopRightRadius: 4, borderBottomRightRadius: 4, backgroundColor: Color.textInput}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{width: 70, height: 20, alignItems: 'center', justifyContent: 'center',paddingHorizontal: 16, borderWidth: 1, borderRadius: 20, borderColor: '#2C70F7', backgroundColor: '#2C70F766'}}>
                                <Text size={8} color={'#2C70F7'} style={{fontWeight: 'bold'}}>{item.status}</Text>
                            </View>
    
                            {/* <Ionicons name='bookmark-outline' size={20} color={Color.primary} /> */}
                        </View>
    
                        <View style={{paddingTop: 8}}>
                            <Text type='bold' align='left' numberOfLines={3} style={{lineHeight: 20}}>{item.title}</Text>
                            <Divider height={12} />
                            <Row style={{alignItems: 'center'}}>
                                <AntDesign name={'clockcircleo'} color={Color.secondary} size={9} style={{marginRight: 8}}/>
                                <Text style={{fontSize: 10, color: Color.secondary}}>{item.harga}</Text>
                            </Row>
                            <Divider height={3} />
                            <Row style={{alignItems: 'center'}}>
                                <AntDesign name={'user'} size={10} color={Color.secondary} style={{marginRight: 7}}/>
                                <Text size={10} color={Color.secondary} align='left' numberOfLines={2}>{item.author}</Text>
                            </Row>
                            <Divider height={12} />
                            <Text size={8} color={Color.secondary} align='left' numberOfLines={2} style={{marginBottom: 2}}>Mulai dari</Text>
                            <Row style={{alignItems: 'center'}}>
                                <Text type='bold' align='left' numberOfLines={3}>{item.harga}</Text>
                                <Text style={{fontSize: 8, color: Color.secondary, marginLeft: 5, textDecorationLine: 'line-through'}}>{item.discount}</Text>
                            </Row>
                        </View>
    
                        {/* <View style={{paddingTop: 24, flexDirection: 'row'}}>
                            <Foundation name='calendar' color={Color.yellow} style={{marginRight: 8}} />
                            <Text size={10} align='left'>3 Bulan</Text>
                        </View> */}
    
                        {/* <View style={{paddingTop: 6, flexDirection: 'row'}}>
                            <Ionicons name='location' color={Color.error} style={{marginRight: 8}} />
                            <Text size={10} align='left'>Cilandak, Jakarta Selatan</Text>
                        </View> */}
    
                        {/* <View style={{paddingTop: 6, flexDirection: 'row'}}>
                            <Ionicons name='information-circle-outline' color={Color.error} style={{marginRight: 8}} />
                            <Text size={10} align='left'>3 Hari lagi Pendaftaran Ditutup</Text>
                        </View> */}
                    </View>

                </View>    
    }
        keyExtractor={item => item.id}
    />
    <Divider height={20}/>
    </Scaffold>
  )
}

export default EventOfficial