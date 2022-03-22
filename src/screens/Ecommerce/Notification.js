import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, FlatList ,Platform, Image, SafeAreaView, Dimensions, TextInput, TouchableOpacity, Pressable } from 'react-native';
import Styled from 'styled-components';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNSimpleCrypto from "react-native-simple-crypto";
import { useNavigation } from '@react-navigation/native';

import {
	Text,
	// TouchableOpacity,
	Loading,
	useLoading,
	Scaffold,
	Row,
	Col,
	HeaderBig,
	useColor,
	Header
} from '@src/components';
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import CardListProduk from 'src/components/Card/CardListProduct';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios';
import moment from 'moment';
import Ecommerce from '../Ecommerce/Ecommerce';
import {queryListOrder} from 'src/lib/query/ecommerce';
import { FormatMoney } from 'src/utils';
var crypto = require('crypto-js')

function sha1(data) {
}

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
    
`;

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
    status: 'Menang',
    Recipt: '100003254876',
    total: 1
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
      status: 'Paket Dikirim',
      Recipt: '100003254876',
      total: 1
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
      status: 'Menunggu Pembayaran',
      Recipt: '100003254876',
      total: 1
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
      status: 'Paket Dikirim',
      Recipt: '100003254876',
      total: 1
    },
  
];

const Notification = () => {
  const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
  const [listData, setList] = useState('');
	const { Color } = useColor();
  const navigation = useNavigation();

	useEffect( () => {
        getProduct()
    }, []);

    const getProduct = () => {
      let variables = {
        page: 1,
        itemPerPage: 10,
        status: 'BOOKING'
      }
      console.log(variables)
      Client.query({query: queryListOrder, variables})
        .then(res => {
          console.log(res)
          if (res.data.ecommerceOrderList) {
            setList(res.data.ecommerceOrderList);
          }
  
          // hideLoading();
          // navigation.navigate('TopUpScreen');
        })
        .catch(reject => {
          console.log(reject);
        });
    };
    

    const FirstRoute = () => (
      <View>
          <ScrollView>
          
          <FlatList
                  data={listData}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
          />
      </ScrollView>
      <View style={{marginVertical: 130,flexDirection: 'row', width: '100%', height:80, backgroundColor: Color.textInput, elevation: 20,paddingVertical: 20}}>
          <View style={{width: '45%', marginHorizontal: 20}}>
              <Text style={{fontSize: 8, color: Color.secondary}}>Total Harga</Text>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>Rp. 0</Text>
          </View>
          <View style={{backgroundColor: Color.primary, width: 150, height: 35, borderRadius: 20}}>
              <TouchableOpacity>
                  <Text style={{textAlign: 'center', marginVertical: 5, color: Color.textInput, fontWeight: 'bold'}}>Checkout</Text>
              </TouchableOpacity>
          </View>
    </View>
      </View>
    );
    
    const SecondRoute = () => (
      
      <View>
        <TouchableOpacity style={{ marginVertical: 10, marginHorizontal: 10,flexDirection: 'row',backgroundColor: Color.textInput, width: '28%', height: 33, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
      }}>
          <Text style={{fontSize:12}}>Terbaru</Text>
          <MaterialIcons name={'keyboard-arrow-down'} size={20} style={{marginVertical: 6}}/>
        </TouchableOpacity>
        <FlatList
                  data={listData}
                  renderItem={render}
                  keyExtractor={item => item.id}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
      />
      </View>
    );
    
    const initialLayout = { width: Dimensions.get('window').width };

    const totalBarang = (data) => {
      let total = 0
      if(data){
        data.forEach(element => {
          total = total + element.quantity
        });
        return total
      }
    }
    
    const renderScene = SceneMap({
      sedangdibeli: FirstRoute,
      semuariwayat: SecondRoute,
    });
    
    const [index, setIndex] = React.useState(0);
          const [routes] = React.useState([
            { key: 'sedangdibeli', title: 'Sedang Dibeli' },
            { key: 'semuariwayat', title: 'Semua Riwayat' },
          ])


          const renderItem = ({ item }) => (
            <Pressable onPress={() => navigation.navigate('TransactionDetail', {item})} style={{marginHorizontal: 10, marginVertical: 5, backgroundColor: Color.theme, width: '95%', height: 200, borderRadius: 10 }}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '65%', marginHorizontal: 10, marginVertical: 10}}>
                    <Text style={{textAlign: 'left', color: Color.secondary, fontSize: 8}}>No Recipt</Text>
                    <Text style={{textAlign: 'left', fontSize: 10, fontWeight: 'bold'}}>{item.orderNumber}</Text>
                  </View>
                  <View>
                    <View style={{backgroundColor: Color.warning, borderRadius: 5, width: 90, marginVertical: 10, height: 20}}>
                      <Text style={{color: Color.textInput, fontSize: 10, paddingVertical: 3}}>Paket Dikirim</Text>
                    </View>
                  </View>
                </View>
                <View style={{backgroundColor: Color.border, width: '95%', height: 1, alignSelf: 'center'}}></View>
                <View style={{flexDirection: 'row',}}>
                    <Image source={item.image} style={{resizeMode: 'contain', width: 70, height: 70, marginVertical: 8, marginHorizontal: 8, backgroundColor: 'yellow'}}/>
                    <View style={{marginVertical: 8}}>
                        <Text style={{fontWeight: 'bold', marginHorizontal: 15}}>{item.products[0]['id']}</Text>
                        <View style={{flexDirection: 'row', marginHorizontal: 12, marginVertical: 5}}>
                        <Entypo name={'star'} style={{color: Color.yellow,}}/>
                        <Text style={{fontSize: 10, color: Color.secondary, marginHorizontal: 3}}>{item.review}</Text>
                        <View style={{backgroundColor: Color.secondary, height: 12, width: 1, marginHorizontal: 5}}></View>
                        <Text style={{fontSize: 10, color: Color.secondary, marginHorizontal: 3}}>{item.terjual}</Text>
                        <Text style={{fontSize: 10, color: Color.secondary,}}>Terjual</Text>
                    </View>
                    <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left', marginHorizontal: 15}}>{item.products[0]['quantity']} Barang</Text>
                    </View>
                    
                </View>
                <View style={{marginVertical: 20, flexDirection: 'row'}}>
                      <View style={{marginHorizontal: 10, width: '65%'}}>
                        <Text style={{fontSize: 8, textAlign: 'left', color: Color.secondary}}>Harga Barang</Text>
                        <Text style={{fontSize: 12, textAlign: 'left', fontWeight: 'bold'}}>{FormatMoney.getFormattedMoney(item.products[0]['price'])}</Text>
                      </View>
                      <View style={{backgroundColor: Color.primary, width: 100, borderRadius: 20}}>
                        <TouchableOpacity>
                          <Text style={{fontSize: 10, paddingVertical: 6, color: Color.textInput, fontWeight: 'bold'}}>Lacak Paket</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
            </Pressable>
          );

          const render = ({ item }) => (
    
            <View style={{marginHorizontal: 10, marginVertical: 5, backgroundColor: Color.textInput, width: '95%', height: 200, borderRadius: 10 }}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '65%', marginHorizontal: 10, marginVertical: 10}}>
                    <Text style={{textAlign: 'left', color: Color.secondary, fontSize: 8}}>No Recipt</Text>
                    <Text style={{textAlign: 'left', fontSize: 10, fontWeight: 'bold'}}>{item.Recipt}</Text>
                  </View>
                  <View>
                    <View style={{backgroundColor: '#E3F7BC', borderRadius: 5, width: 90, marginVertical: 10, height: 20}}>
                      <Text style={{color: '#76AE0B', fontSize: 10, paddingVertical: 3}}>Paket Diterima</Text>
                    </View>
                  </View>
                </View>
                <View style={{backgroundColor: Color.border, width: '95%', height: 1, alignSelf: 'center'}}></View>
                <View style={{flexDirection: 'row',}}>
                    <Image source={item.image} style={{resizeMode: 'contain', width: 70, height: 70, marginVertical: 8, marginHorizontal: 8, backgroundColor: 'yellow'}}/>
                    <View style={{marginVertical: 8}}>
                        <Text style={{fontWeight: 'bold', marginHorizontal: 15}}>{item.namaProduk}</Text>
                        <View style={{flexDirection: 'row', marginHorizontal: 12, marginVertical: 5}}>
                        <Entypo name={'star'} style={{color: Color.yellow,}}/>
                        <Text style={{fontSize: 10, color: Color.secondary, marginHorizontal: 3}}>{item.review}</Text>
                        <View style={{backgroundColor: Color.secondary, height: 12, width: 1, marginHorizontal: 5}}></View>
                        <Text style={{fontSize: 10, color: Color.secondary, marginHorizontal: 3}}>{item.terjual}</Text>
                        <Text style={{fontSize: 10, color: Color.secondary,}}>Terjual</Text>
                    </View>
                    <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left', marginHorizontal: 15}}>{item.total} Barang</Text>
                    </View>
                    
                </View>
                <View style={{marginVertical: 20, flexDirection: 'row'}}>
                      <View style={{marginHorizontal: 10, width: '70%'}}>
                        <Text style={{fontSize: 8, textAlign: 'left', color: Color.secondary}}>Harga Barang</Text>
                        <Text style={{fontSize: 12, textAlign: 'left', fontWeight: 'bold'}}>{item.hargaAkhir}</Text>
                      </View>
                      <View style={{backgroundColor: Color.primary, width: 80, borderRadius: 20}}>
                        <TouchableOpacity>
                          <Text style={{fontSize: 10, paddingVertical: 6, color: Color.textInput, fontWeight: 'bold'}}>Ulasan</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
            </View>
          );

  return (
    <Scaffold
		header={<Header customIcon title="Notifikasi" type="regular" centerTitle={false} />}
		onPressLeftButton={() => navigation.pop()}
	>
      <View style={{marginVertical: 10}}>
        <View style={{flexDirection: 'row', marginHorizontal: 15}}>
          <Image source={ImagesPath.clock} style={{marginHorizontal: 30}}/>
          <Image source={ImagesPath.package} style={{marginHorizontal: 30}}/>
          <Image source={ImagesPath.truck} style={{marginHorizontal: 30}}/>
          <Image source={ImagesPath.mappinline} style={{marginHorizontal: 30}}/>
        </View>
        <View style={{flexDirection: 'row', marginHorizontal: 15, marginVertical: 5}}>
          <Text style={{width: '25%', fontSize: 10, color: Color.secondary,}}>Menunggu Pembayaran</Text>
          <Text style={{width: '20%',fontSize: 10, color: Color.secondary, marginHorizontal: 10}}>Sedang Diproses</Text>
          <Text style={{width: '20%', fontSize: 10, color: Color.secondary, marginHorizontal: 10}}>Paket Dikirim</Text>
          <Text style={{width: '15%', fontSize: 10, color: Color.secondary, marginHorizontal: 20}}>Paket Diterima</Text>
        </View>
      </View>
      <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                style={{backgroundColor: Color.semiwhite}}
      />
    </Scaffold>

  )
}

export default Notification