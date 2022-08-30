import { View, Text, StyleSheet, Dimensions, StatusBar, FlatList, Image } from 'react-native'
import React from 'react'
import {useColor} from '@src/components';
import { TabView, SceneMap } from 'react-native-tab-view';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNSimpleCrypto from "react-native-simple-crypto";
import Octicons from 'react-native-vector-icons/Octicons'
import Feather from 'react-native-vector-icons/Feather'
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'


const DATA = [
    {
      id: 1,
      namaProduk: 'Tas Laptop Formal Pria',
      review: '4.5',
      terjual: 450,
      hargaCoret: 'Rp. 300.000',
      hargaAkhir: 'Rp. 278.100',
      image: ImagesPath.lelangecommerce3,
      diskon: '10%',
      status: 'Menang'
    },
    {
        id: 1,
        namaProduk: 'Tas Laptop Formal Pria',
        review: '4.5',
        terjual: 450,
        hargaCoret: '300.000',
        hargaAkhir: '278.100',
        image: ImagesPath.lelangecommerce4,
        diskon: '10%',
        status: 'Menang'
      },
      {
        id: 1,
        namaProduk: 'Tas Laptop Formal Pria',
        review: '4.5',
        terjual: 450,
        hargaCoret: '300.000',
        hargaAkhir: '278.100',
        image: ImagesPath.lelangecommerce5,
        diskon: '10%',
        status: 'Menang'
      },
      {
        id: 1,
        namaProduk: 'Tas Laptop Formal Pria',
        review: '4.5',
        terjual: 450,
        hargaCoret: '300.000',
        hargaAkhir: '278.100',
        image: ImagesPath.lelangecommerce6,
        diskon: '10%',
        status: 'Menang'
      },
    
  ];


const Cart = () => {
    const {Color} = useColor();

    const renderItem = ({ item }) => (
    
        <View style={{marginHorizontal: 10, marginVertical: 10, backgroundColor: Color.textInput, width: '95%', height: 100, borderRadius: 10 }}>
            <View style={{flexDirection: 'row',}}>
                <Image source={item.image} style={{resizeMode: 'contain', width: 70, height: 70, marginVertical: 8, marginHorizontal: 8, backgroundColor: 'yellow'}}/>
                <View style={{marginVertical: 8}}>
                    <Text style={{fontWeight: 'bold', marginHorizontal: 15}}>{item.namaProduk}</Text>
                    <View style={{flexDirection: 'row', marginHorizontal: 12, marginVertical: 5}}>
                    <Entypo name={'star'} style={{color: Color.yellow,}}/>
                    <Text style={{fontSize: 10, color: Color.secondary, marginHorizontal: 3}}>{item.rating || 0}</Text>
                    <View style={{backgroundColor: Color.secondary, height: 12, width: 1, marginHorizontal: 5}}></View>
                    <Text style={{fontSize: 10, color: Color.secondary, marginHorizontal: 3}}>{item.terjual}</Text>
                    <Text style={{fontSize: 10, color: Color.secondary,}}>Terjual</Text>
                </View>
                    <View style={{flexDirection: 'row', marginVertical: 2}}>
                        <Text style={{marginVertical: 1, textAlign: 'left', fontWeight: 'bold', marginHorizontal: 15}}>{item.hargaAkhir}</Text>
                        <AntDesign name={'delete'} style={{marginHorizontal: 5, marginVertical: 5, color: Color.error}}/>
                        <AntDesign name={'minuscircleo'} style={{marginHorizontal: 5, marginVertical: 5, color: Color.secondary}}/>
                        <Text style={{marginHorizontal: 5, marginVertical: 4, fontSize: 12}}>1</Text>
                        <AntDesign name={'pluscircleo'} style={{marginHorizontal: 5, marginVertical: 5, color: Color.primary}}/>
                        
                    </View>
                </View>
            </View>
            
        </View>
      );
      const render = ({ item }) => (
    
        <View style={{marginHorizontal: 10, marginVertical: 10, backgroundColor: Color.textInput, width: '95%', height: 100, borderRadius: 10 }}>
            <View style={{flexDirection: 'row',}}>
                <Image source={item.image} style={{resizeMode: 'contain', width: 70, height: 70, marginVertical: 8, marginHorizontal: 8, backgroundColor: 'yellow'}}/>
                <View style={{marginVertical: 8}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontWeight: 'bold', marginHorizontal: 15, width: '55%'}}>{item.namaProduk}</Text>
                        <View style={{backgroundColor: Color.success, borderWidth: 2, borderColor: Color.oldGreen, height: 25, width: 60, borderRadius: 20}}>
                            <Text style={{fontSize: 10, color: Color.textInput, marginVertical: 2, marginHorizontal: 8}}>Menang</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', marginHorizontal: 12, marginVertical: 5}}>
                    <Entypo name={'star'} style={{color: Color.yellow,}}/>
                    <Text style={{fontSize: 10, color: Color.secondary, marginHorizontal: 3}}>{item.rating || 0}</Text>
                    <View style={{backgroundColor: Color.secondary, height: 12, width: 1, marginHorizontal: 5}}></View>
                    <Text style={{fontSize: 10, color: Color.secondary, marginHorizontal: 3}}>{item.terjual}</Text>
                    <Text style={{fontSize: 10, color: Color.secondary,}}>Terjual</Text>
                </View>
                
                    <View style={{ marginVertical: 2, marginHorizontal: 15}}>
                        <Text style={{fontSize: 8, color: Color.secondary}}>Harga</Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{width: '55%',marginVertical: 1, textAlign: 'left', fontWeight: 'bold',}}>{item.hargaAkhir}</Text>
                            <View style={{flexDirection: 'row', marginVertical: 2}}>
                                <Text style={{marginHorizontal: 10, fontSize: 12, color: Color.primary}}>Checkout</Text>
                                <AntDesign name={'arrowright'} size={16} style={{color: Color.primary}}/>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            
        </View>
      );
      

    const FirstRoute = () => (
        <FlatList
                    data={DATA}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
        />
        
      );
      
      const SecondRoute = () => (
        <FlatList
                    data={DATA}
                    renderItem={render}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
        />
      );
      
      const initialLayout = { width: Dimensions.get('window').width };
      
      const renderScene = SceneMap({
        belanjaan: FirstRoute,
        baranglelang: SecondRoute,
      });
      
      
      const [index, setIndex] = React.useState(0);
      const [routes] = React.useState([
        { key: 'belanjaan', title: 'Belanjaan' },
        { key: 'baranglelang', title: 'Barang Lelang' },
      ])

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
    
  )
}

export default Cart