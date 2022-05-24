import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput,ScrollView,Image, FlatList,Pressable,useWindowDimensions, AppState } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import ImagesPath from 'src/components/ImagesPath';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import { usePopup } from '@src/components/Modal/Popup';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Scaffold from '@src/components/Scaffold';
import { Header } from 'src/components';
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import {
	Row,
	Col,
} from '@src/components';
import Client from '@src/lib/apollo';
import { queryContentChatRoomManage, queryContentChatMessage } from '@src/lib/query';
import { Divider } from 'src/styled';
import { currentSocket } from '@src/screens/MainHome/MainHome';

const DATA = [
    {
      id: 1,
      image: ImagesPath.avatar1,
      name: 'Courtney Henry',
    },
    {
        id: 2,
        image: ImagesPath.avatar1,
        name: 'Courtney Henry',
      },
      {
        id: 2,
        image: ImagesPath.avatar1,
        name: 'Courtney Henry',
      },
      {
        id: 2,
        image: ImagesPath.avatar1,
        name: 'Courtney Henry',
      },
      {
        id: 2,
        image: ImagesPath.avatar1,
        name: 'Courtney Henry',
      },
  ];

const AddMember = () => {
    const { Color } = useColor();

    const renderItem = ({ item }) => (
        <Row style={{marginHorizontal: 15, marginVertical: 12}}>
            <Image source={item.image} style={{borderRadius: 20}}/>
            <Text style={{fontSize: 14, width: '60%',fontWeight: 'bold',marginVertical: 5, marginHorizontal: 8, textAlign: 'left'}}>{item.name}</Text>
            <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center',backgroundColor: Color.primary, height: 30,width: 95, borderRadius: 20}}>
                <Text style={{color: Color.textInput, fontSize: 12}}>+ Undang</Text>
            </TouchableOpacity>
        </Row>
        
       );
  return (
    <Scaffold
            header={
                <Header
                    title='Undang Temanmu'
                />
            }
    >
    <View>
        <TextInput placeholder='Ayo cari temanmu' style={{fontSize: 12, paddingHorizontal: 28,backgroundColor: Color.border, width: '95%', alignSelf: 'center', borderRadius: 5, height: 40}}>

        </TextInput>
        <AntDesign name={'search1'} size={13} style={{position: 'absolute', color: Color.secondary, top: 13, left: 17}}/>
    </View>
    <Text style={{fontSize: 8, color: Color.secondary, marginVertical: 8, textAlign: 'left', marginHorizontal: 10}}>Anggota yang akan ditambahkan</Text>
    <View style={{flexDirection: 'row', marginHorizontal: 10}}>
        
        <Image source={ImagesPath.avatar1} style={{marginRight: 10}}/>
        <Image source={ImagesPath.avatar1}/>
    </View>
    <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'left', marginHorizontal: 10, marginVertical: 10}}>Undang teman kamu</Text>
    <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    <TouchableOpacity style={{backgroundColor: Color.primary, height: 40, justifyContent: 'center', marginVertical: 12, width: '95%', borderRadius: 20, alignSelf: 'center'}}>
        <Text style={{fontSize: 12, color: Color.textInput, fontWeight: 'bold'}}>Tambahkan Anggota</Text>
    </TouchableOpacity>
    </Scaffold>
  )
}

export default AddMember