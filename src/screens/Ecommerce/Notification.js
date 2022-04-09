import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Platform,
  Image,
  SafeAreaView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Styled from 'styled-components';
import {TabView, SceneMap} from 'react-native-tab-view';
import {useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNSimpleCrypto from 'react-native-simple-crypto';
import {useNavigation} from '@react-navigation/native';

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
  Header,
} from '@src/components';
import ListForum from '@src/screens/MainForum/ListForum';

import {shadowStyle} from '@src/styles';

import Client from '@src/lib/apollo';
import {queryContentProduct} from '@src/lib/query';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import moment from 'moment';
import Ecommerce from '../Ecommerce/Ecommerce';
import {mutationCancel, queryListOrder} from 'src/lib/query/ecommerce';
import {FormatMoney} from 'src/utils';
var crypto = require('crypto-js');

function sha1(data) {}

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
    total: 1,
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
    total: 1,
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
    total: 1,
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
    total: 1,
  },
];

const Notification = () => {
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [listData, setList] = useState('');
  const {Color} = useColor();
  const navigation = useNavigation();

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = () => {
    console.log(user);
    let variables = {
      page: 1,
      itemPerPage: 20,
      status: undefined,
      userId: user.userId,
    };
    console.log(variables);
    Client.query({query: queryListOrder, variables})
      .then(res => {
        console.log(res);
        if (res.data.ecommerceOrderList) {
          setList(res.data.ecommerceOrderList);
          // getCancelOrder()
        }

        // hideLoading();
        // navigation.navigate('TopUpScreen');
      })
      .catch(reject => {
        console.log(reject);
      });
  };

  const updateStatus = (item) => {
    console.log(user);
    showLoading()
    let variables = {
      type: 'FINISH',
      orderId: item.id,
    };
    console.log(variables);
    Client.query({query: mutationCancel, variables})
      .then(res => {
        hideLoading()
        console.log(res);
        getProduct()
        // hideLoading();
        // navigation.navigate('TopUpScreen');
      })
      .catch(reject => {
        hideLoading()
        console.log(reject);
      });
  };

  const initialLayout = {width: Dimensions.get('window').width};

  const [routes] = React.useState([
    {key: 'sedangdibeli', title: 'Sedang Dibeli'},
    {key: 'semuariwayat', title: 'Semua Riwayat'},
  ]);

  const renderItem = ({item}) => (
    <Pressable
      onPress={() => navigation.navigate('TransactionDetail', {item})}
      style={{
        marginHorizontal: 10,
        marginVertical: 5,
        backgroundColor: Color.theme,
        width: '95%',
        height: 210,
        borderRadius: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 5,
          paddingHorizontal: 5,
        }}>
        <View style={{width: '65%', marginHorizontal: 10, marginVertical: 10}}>
          <Text
            style={{textAlign: 'left', color: Color.secondary, fontSize: 8}}>
            No Recipt
          </Text>
          <Text style={{textAlign: 'left', fontSize: 10, fontWeight: 'bold'}}>
            {item.orderNumber}
          </Text>
        </View>
        <View>
          <View
            style={{
              backgroundColor: '#FEEFCC',
              borderRadius: 5,
              width: 90,
              marginVertical: 10,
              marginHorizontal: 12,
              height: 20,
            }}>
            <Text
              style={{
                color: '#F9AE00',
                fontSize: 10,
                paddingVertical: 3,
              }}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: Color.border,
          width: '95%',
          height: 1,
          alignSelf: 'center',
        }}></View>
      {item.items.length != 0 && <View style={{flexDirection: 'row'}}>
        <Image
          source={{uri: item.items[0].products[0]['imageUrl']}}
          style={{
            resizeMode: 'contain',
            width: 70,
            height: 70,
            marginVertical: 8,
            marginHorizontal: 8,
          }}
        />
        <View style={{marginVertical: 8}}>
          <Text style={{fontWeight: 'bold', marginHorizontal: 15}}>
            {item.items[0].products[0]['name']}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 12,
              marginVertical: 5,
            }}>
            <Entypo name={'star'} style={{color: Color.yellow}} />
            <Text
              style={{
                fontSize: 10,
                color: Color.secondary,
                marginHorizontal: 3,
              }}>
              {item.review}
            </Text>
            <View
              style={{
                backgroundColor: Color.secondary,
                height: 12,
                width: 1,
                marginHorizontal: 5,
              }}></View>
            <Text
              style={{
                fontSize: 10,
                color: Color.secondary,
                marginHorizontal: 3,
              }}>
              {item.terjual}
            </Text>
            <Text style={{fontSize: 10, color: Color.secondary}}>Terjual</Text>
          </View>
          <Text
            style={{
              fontSize: 8,
              color: Color.secondary,
              textAlign: 'left',
              marginHorizontal: 15,
            }}>
            {item.items[0].products[0]['quantity']} Barang
          </Text>
        </View>
      </View>}
      {item.items.length != 0 && <View style={{marginVertical: 20, flexDirection: 'row'}}>
        <View style={{marginHorizontal: 10, width: '65%'}}>
          <Text
            style={{fontSize: 8, textAlign: 'left', color: Color.secondary}}>
            Harga Barang
          </Text>
          <Text style={{fontSize: 12, textAlign: 'left', fontWeight: 'bold'}}>
            {FormatMoney.getFormattedMoney(item.items[0].products[0]['price'])}
          </Text>
        </View>
        {(item.shipperOrderNumber && item.statusId == 2) && <View
          style={{
            backgroundColor: Color.primary,
            width: 100,
            borderRadius: 20,
          }}>
          <TouchableOpacity
            style={{
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 10,
                color: Color.textInput,
                fontWeight: 'bold',
              }}>
              Lacak Paket
            </Text>
          </TouchableOpacity>
        </View>}
        {(item.statusId == 3) && <View
          style={{
            backgroundColor: Color.primary,
            width: 100,
            borderRadius: 20,
          }}>
          <TouchableOpacity
            onPress={() => updateStatus()}
            style={{
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 10,
                color: Color.textInput,
                fontWeight: 'bold',
              }}>
              Pesanan Diterima
            </Text>
          </TouchableOpacity>
        </View>}
        {(item.statusId == 4) && <View
          style={{
            backgroundColor: Color.primary,
            width: 100,
            borderRadius: 20,
          }}>
          <TouchableOpacity
            style={{
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 10,
                color: Color.textInput,
                fontWeight: 'bold',
              }}>
              Ulasan
            </Text>
          </TouchableOpacity>
        </View>}
        {item.statusId == 0 && <View
          style={{
            backgroundColor: Color.primary,
            width: 100,
            borderRadius: 20,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TransactionDetail', {item})}
            style={{
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 10,
                color: Color.textInput,
                fontWeight: 'bold',
              }}>
              Detail Pemesanan
            </Text>
          </TouchableOpacity>
        </View>}
      </View>}
    </Pressable>
  );

  return (
    <Scaffold
      header={
        <Header customIcon title="Notifikasi" type="bold" centerTitle={false} />
      }
      onPressLeftButton={() => navigation.pop()}
      style={{backgroundColor: Color.semiwhite}}>
        <ScrollView>
          <View style={{flexDirection: 'row', marginVertical: 10}}>
            <TouchableOpacity
              style={{
                marginHorizontal: 15,
                flexDirection: 'row',
                backgroundColor: Color.theme,
                width: '35%',
                height: 35,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  paddingHorizontal: 3,
                  fontWeight: 'bold',
                }}>
                Semua Status
              </Text>
              <MaterialIcons
                name={'keyboard-arrow-down'}
                size={18}
                style={{marginVertical: 9}}
              />
            </TouchableOpacity>
            <View style={{width: 80}}></View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                backgroundColor: Color.theme,
                width: '35%',
                height: 35,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  paddingHorizontal: 3,
                  fontWeight: 'bold',
                }}>
                Semua Tanggal
              </Text>
              <MaterialIcons
                name={'keyboard-arrow-down'}
                size={18}
                style={{marginVertical: 9}}
              />
            </TouchableOpacity>
          </View>

          <FlatList
            data={listData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </ScrollView>
    </Scaffold>
  );
};

export default Notification;
