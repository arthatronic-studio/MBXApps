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

const FilterProduk = [
    {
        id: 1,
        name: 'Terlaris'
    },
    {
        id: 2,
        name: 'Gratis Ongkir'
    },
    {
        id: 3,
        name: 'Terpopuler'
    }
]

const FilterToko = [
    {
        id: 1,
        name: 'Nama Toko'
    },
    {
        id: 2,
        name: 'Popularitas'
    },
]

const DataProduk = [
    {
      id: 1,
      namaProduk: 'Tas Laptop Formal Pria',
      review: '4.5',
      terjual: 450,
      hargaCoret: 'Rp. 300.000',
      hargaAkhir: 'Rp. 278.100',
      image: ImagesPath.lelangecommerce3,
      diskon: '10%'
    },
    {
        id: 1,
        namaProduk: 'Tas Laptop Formal Pria',
        review: '4.5',
        terjual: 450,
        hargaCoret: '300.000',
        hargaAkhir: '278.100',
        image: ImagesPath.lelangecommerce4,
        diskon: '10%'
      },
      {
        id: 1,
        namaProduk: 'Tas Laptop Formal Pria',
        review: '4.5',
        terjual: 450,
        hargaCoret: '300.000',
        hargaAkhir: '278.100',
        image: ImagesPath.lelangecommerce5,
        diskon: '10%'
      },
      {
        id: 1,
        namaProduk: 'Tas Laptop Formal Pria',
        review: '4.5',
        terjual: 450,
        hargaCoret: '300.000',
        hargaAkhir: '278.100',
        image: ImagesPath.lelangecommerce6,
        diskon: '10%'
      },
    
  ];

const DataToko = [
    {
        id: 1,
        name: 'Bytme Shop',
        location: 'Jakarta Selatan',
        image: ImagesPath.merchant1,
    },
    {
        id: 2,
        name: 'Observe Shop',
        location: 'Jakarta Selatan',
        image: ImagesPath.merchant2,
    },
    {
        id: 3,
        name: 'Hammerhead Shop',
        location: 'Jakarta Selatan',
        image: ImagesPath.merchant3,
    },
    {
        id: 4,
        name: 'Suslli Shop',
        location: 'Jakarta Selatan',
        image: ImagesPath.merchant4,
    },
    {
        id: 5,
        name: 'Hammerhead Shop',
        location: 'Jakarta Selatan',
        image: ImagesPath.merchant5,
    },
]

  const render = ({ item }) => (
    <Pressable style={{marginHorizontal: 10, marginVertical: 10, backgroundColor: '#FFFFFF', width: '45%', height: 300, borderRadius: 10 }}>
        <Image source={item.image} style={{resizeMode: 'contain', width: 175, height: 160, marginVertical: 8}}/>
        <Text style={{fontWeight: 'bold'}}>{item.namaProduk}</Text>
        <View style={{flexDirection: 'row', marginHorizontal: 12, marginVertical: 5}}>
            <Entypo name={'star'} style={{color: '#FFD35B',}}/>
            <Text style={{fontSize: 10, color: '#6A7479', marginHorizontal: 3}}>{item.review}</Text>
            <View style={{backgroundColor: '#6A7479', height: 12, width: 1, marginHorizontal: 5}}></View>
            <Text style={{fontSize: 10, color: '#6A7479', marginHorizontal: 3}}>{item.terjual}</Text>
            <Text style={{fontSize: 10, color: '#6A7479',}}>Terjual</Text>
        </View>
        <View style={{marginHorizontal: 15, marginVertical: 15}}>
            <Text style={{marginVertical: 1, textAlign: 'left',color: '#6A7479', fontSize: 8}}>Harga</Text>
            <Text style={{marginVertical: 1, textAlign: 'left',textDecorationLine: 'line-through', fontSize: 10, color: '#6A7479', fontWeight: 'bold'}}>{item.hargaCoret}</Text>
            <Text style={{marginVertical: 1, textAlign: 'left',color: '#D83030', fontWeight: 'bold'}}>{item.hargaAkhir}</Text>
        </View>
        <View style={{paddingVertical: 5, backgroundColor: '#D83030', width: 60, height: 42, position: 'absolute', alignSelf: 'flex-end', borderTopRightRadius: 10, borderBottomLeftRadius: 20}}>
            <Text style={{color: '#FFFFFF', fontSize: 10}}>Diskon</Text>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#FFFFFF'}}>{item.diskon}</Text>
        </View>
    </Pressable>
  );

  const renderFilter = ({item}) => (
    <Pressable 
        style={{
            width: 100, 
            paddingVertical: 8, 
            paddingHorizontal: 12, 
            marginRight: 10,
            borderRadius: 120,
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: '#A1A1A1'
        }}
    >
        <Text align='left' size={10} color='#ffffff'>{item.name}</Text>
    </Pressable>
  )

  const TabProduk = () => {
    return (
        <>  
            <View style={{padding: 16, flexDirection: 'row', alignItems: 'center'}}>
                <Pressable 
                    style={{
                        width: 80,
                        borderWidth: 0.8,
                        paddingVertical: 8, 
                        paddingHorizontal: 12, 
                        marginRight: 10,
                        borderRadius: 120,
                        flexDirection: 'row',
                        justifyContent: 'center', 
                        alignItems: 'center',
                    }}
                >
                    <AntDesign
                        name={'filter'}
                        size={16}
                    />
                    <Text align='left' style={{marginLeft: 8}} size={10}>Filter</Text>
                </Pressable>
                <FlatList 
                    data={FilterProduk}
                    renderItem={renderFilter}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <FlatList
                data={DataProduk}
                renderItem={render}
                keyExtractor={item => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            />
        </>
    )
  }

  const TabToko = () => {
      return (
          <>
            <View style={{padding: 16, flexDirection: 'row', alignItems: 'center'}}>
                <Pressable 
                    style={{
                        width: 80,
                        borderWidth: 0.8,
                        paddingVertical: 8, 
                        paddingHorizontal: 12, 
                        marginRight: 10,
                        borderRadius: 120,
                        flexDirection: 'row',
                        justifyContent: 'center', 
                        alignItems: 'center',
                    }}
                >
                    <AntDesign
                        name={'filter'}
                        size={16}
                    />
                    <Text align='left' style={{marginLeft: 8}} size={10}>Filter</Text>
                </Pressable>
                <FlatList 
                    data={FilterToko}
                    renderItem={renderFilter}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <FlatList
              key={'GENERAL'}
              keyExtractor={(item, index) => item.toString() + index}
              data={DataToko}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{}}
              renderItem={({ item, index }) => {
                return (
                  <CardMerchant
                    componentType={'GENERAL'}
                    item={item}
                    onPress={() => onPress(item)}
                  />
                )
              }}
            />
          </>
      )
  }

const SearchResult = ({navigation, route}) => {
    const {Color} = useColor()

    return (
        <Scaffold
            header={
            <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 16}}>
                <AntDesign
                name={'arrowleft'}
                color={Color.text}
                size={24}
                onPress={() => navigation.pop()}
                />
                <BottomSection style={{borderColor: Color.border}}>
                    <BoxInput
                    style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: Color.border,
                    }}
                    >
                    <TextInputNumber
                        name="text"
                        placeholder="Cari Topik apa kali ini  . . ."
                        placeholderTextColor={Color.placeholder}
                        returnKeyType="done"
                        returnKeyLabel="Done"
                        blurOnSubmit={false}
                        onBlur={() => {}}
                        error={null}
                        onChangeText={text => {}}
                        style={{
                            backgroundColor: '#FFFFFF',
                            color: Color.text,
                        }}
                    />
                    <CircleSend
                        onPress={() => {}}>
                        <Ionicons name="search" size={20} color={Color.placeholder} />
                    </CircleSend>
                </BoxInput>
                </BottomSection>
            </View>  
            }
        >
            <MainView style={{marginTop: 16}}>
                <Navigator
                    initialRouteName="TabProduk"
                    tabBarOptions={{
                        activeTintColor: Color.text,
                        inactiveColor: Color.border,
                        labelStyle: { fontSize: 14, fontWeight: 'bold' },
                        style: {
                            backgroundColor: '#FFFFFF',
                        },
                        labelStyle: { textTransform: 'none' },
                        indicatorStyle: { backgroundColor: Color.primary,}
                    }}
                >
                    <Screen
                    name="TabProduk"
                    component={TabProduk}
                    options={{ tabBarLabel: 'Produk' }}
                    />
                    <Screen
                    name="TabToko"
                    component={TabToko}
                    options={{ tabBarLabel: 'Toko' }}
                    />
                </Navigator>
            </MainView>    
        </Scaffold>
    )
}

export default SearchResult