import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Dimensions, FlatList, SafeAreaView, TextInput, Image, Pressable } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CardHistorySearch from './CardHistorySearch';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CardMerchant from './CardMerchant';

import ImagesPath from '../../components/ImagesPath'

const { width } = Dimensions.get('window');

import {
  Text,
  // TouchableOpacity,
  Loading, useLoading,
  HeaderBig,
  Submit,
  Header,
  Scaffold,
  useColor
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';

const { Navigator, Screen } = createMaterialTopTabNavigator();

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const ContentView = Styled(View)`
    width: 100%;
    marginTop: 16px;
    paddingHorizontal: 16px;
`;

const MainMenuView = Styled(View)`
    width: 100%;
    borderRadius: 8px;
    marginTop: 12px;
    padding: 20px 0px;
    flexDirection: row;
    flexWrap: wrap;
`;

const BottomSection = Styled(View)`
flexDirection: row;
paddingRight: 34;
alignItems: center;
borderTopWidth: 0.5px;
`;

const BoxInput = Styled(View)`
  marginHorizontal: 16;
  backgroundColor: #FFFFFF;
  paddingVertical: 8px;
  paddingHorizontal: 12px;
  borderRadius: 8px;
  borderWidth: 0.5px;
  flexDirection: row;
`;


const PerUserIcons = Styled(TouchableOpacity)`
    width: 33.33%;
    aspectRatio: 1.3;
    flexDirection: column;
    paddingHorizontal: 8px;
`;

const UserIcon = Styled(View)`
    height: 100%;
    justifyContent: center;
    alignItems: center;
`;

const LabelInput = Styled(View)`
  width: 100%;
  justifyContent: flex-start;
  alignItems: flex-start;
`;

const EmailRoundedView = Styled(View)`
  width: 100%;
  height: 40px;
  alignItems: flex-start;
  justifyContent: center;
  flexDirection: column;
`;

const CustomTextInput = Styled(TextInput)`
  width: 100%;
  height: 100%;
  fontFamily: Inter-Regular;
  backgroundColor: transparent;
  fontSize: 14px;
`;

const TextInputNumber = Styled(TextInput)`
  width: 90%;
  alignContent: flex-start;
  fontFamily: Inter-Regular;
  letterSpacing: 0.23;
  height: 40px;
`;

const CircleSend = Styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  borderRadius: 20px;
  justifyContent: center;
  alignItems: center;
  
`;

const CardProductSearch = (props) => {

    const {item} = props

    return (
        <Pressable style={{marginHorizontal: 10, marginVertical: 10, backgroundColor: '#FFFFFF', width: '45%', height: 270, borderRadius: 10 }}>
            
            <Image source={{uri: item.imageUrl}} style={{resizeMode: 'contain', width: 175, height: 160}}/>
            
            <Text align='left' style={{fontWeight: 'bold', marginHorizontal: 15}}>{item.name}</Text>
            <View style={{marginHorizontal: 15, marginVertical: 15}}>
                <Text style={{marginVertical: 1, textAlign: 'left',color: '#6A7479', fontSize: 10}}>Harga</Text>
                <Text style={{marginVertical: 1, textAlign: 'left',textDecorationLine: 'line-through', fontSize: 12, color: '#6A7479', fontWeight: 'bold'}}>{item.initialPrice}</Text>
            </View>
        </Pressable>   
    )
}   

export default CardProductSearch