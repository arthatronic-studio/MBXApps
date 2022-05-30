import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TextInput, Image } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import { usePopup } from '@src/components';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Entypo from 'react-native-vector-icons/Entypo'
import ImagesPath from 'src/components/ImagesPath';
import { Header, Scaffold, Alert } from 'src/components';
import {currentSocket} from '@src/screens/MainHome/MainHome';
import {
    Row,
    Col,
} from '@src/components';

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

const CreateGroup = ({navigation}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { Color } = useColor();



    const renderItem = ({ item }) => (
       <Row style={{marginHorizontal: 15, marginVertical: 12}}>
           <Image source={item.image} style={{borderRadius: 20}}/>
           <Text style={{fontSize: 14, width: '60%',fontWeight: 'bold',marginVertical: 5, marginHorizontal: 8}}>{item.name}</Text>
           <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center',backgroundColor: Color.primary, height: 30,width: 95, borderRadius: 20}}>
               <Text style={{color: Color.textInput, fontSize: 12}}>+ Undang</Text>
           </TouchableOpacity>
       </Row>
       
      );
  return (
    <Scaffold
            isLoading={isLoading}
            header={
                <Header
                    title='Buat Grup'
                    
                />
                
            }
    >
    <Row style={{marginHorizontal: 15, marginVertical: 15}}>
        <Image source={ImagesPath.firstChat}/>
        <Col style={{marginHorizontal: 10, paddingVertical: 5}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'left'}}>Tambahkan Anggota</Text>
            <Text style={{fontSize: 10, textAlign: 'left', color: Color.secondary}}>Pilih anggota grup setidaknya satu peserta</Text>
        </Col>
    </Row>
    <Text style={{fontWeight: 'bold', textAlign: 'left', marginHorizontal: 15, marginVertical: 15}}>Undang teman kamu</Text>
    <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    <TouchableOpacity onPress={() => {navigation.navigate('AddInformationGroup')}} style={{marginVertical: 10,backgroundColor: Color.secondary, height: 40, width: '92%', alignSelf: 'center', borderRadius: 20, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 12, color: Color.textInput}}>Lanjutkan</Text>
    </TouchableOpacity>
    </Scaffold>
  )
}

export default CreateGroup