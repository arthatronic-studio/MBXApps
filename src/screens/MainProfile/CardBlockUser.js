import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Dimensions, FlatList, SafeAreaView, TextInput, Image, Pressable, ColorPropType } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

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

const CardBlockUser = (props) => {
    const navigation = useNavigation();
    const {Color} = useColor()

    const {item} = props

    return (
        // <Pressable onPress={() => navigation.navigate('DetailProduct',{item})} style={{marginHorizontal: 10, marginVertical: 10, backgroundColor: '#FFFFFF', width: '45%', height: 270, borderRadius: 10 }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginHorizontal: 16}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {item.photoProfile && (
                    <Image source={{uri: item.photoProfile}} style={{resizeMode: 'contain', width: 48, height: 48, borderRadius: 24, marginRight: 12}} />
                )}
                {item.photoProfile==null && (
                    <View style={{width: 48, height: 48, borderRadius: 24, backgroundColor: Color.grayLight, marginRight: 12}} /> 
                    // <Image source={{uri: item.photoProfile}} style={{resizeMode: 'contain', width: 48, height: 48, marginVertical: 8}} />
                )}
                <Text size={14}>{item.firstName} {item.lastName}</Text>
            </View>

            <View style={{backgroundColor: Color.primary, paddingHorizontal: 16, paddingVertical: 6, alignSelf: 'center', borderRadius: 120}}>
                <Text align='left' size={8} color='#ffffff'>Buka Blokir</Text>
            </View>
        </View>   
    )
}

export default CardBlockUser