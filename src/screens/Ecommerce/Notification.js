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
  Alert,
} from '@src/components';
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

const itemPerPage = 20;

const Notification = () => {
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const [page, setPage] = useState(1);
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [listData, setList] = useState([]);
  const {Color} = useColor();
  const navigation = useNavigation();

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = () => {
    showLoading()
    console.log(user);
    let variables = {
      page: page,
      itemPerPage,
      status: undefined,
      userId: user.userId,
    };
    console.log(variables);
    Client.query({query: queryListOrder, variables})
      .then(res => {
        hideLoading()
        console.log(res);
        if (res.data.ecommerceOrderList.length > 0) {
          setList(listData.concat(res.data.ecommerceOrderList));
          setPage(page+1)
          // getCancelOrder()
        }

        // hideLoading();
        // navigation.navigate('TopUpScreen');
      })
      .catch(reject => {
        hideLoading()
        console.log(reject);
      });
  };

  const updateStatus = (item) => {
    setPage(1)
    console.log(user);
    showLoading()
    let variables = {
      type: 'FINISH',
      orderId: item.id,
    };
    console.log(variables);
    Client.query({query: mutationCancel, variables})
      .then(res => {
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

  const onEndReached = async () => {
    // setPage(page+1);
      getProduct()
  }

  const renderItem = ({item}) => (
    <View style={{width: '100%', paddingHorizontal: 8, marginBottom: 16}}>
      <Pressable
        onPress={() => navigation.navigate('TransactionDetail', {item})}
        style={{
          backgroundColor: Color.theme,
          width: '100%',
          borderRadius: 8,
          ...shadowStyle,
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            padding: 8,
          }}>
          <View style={{width: '70%', justifyContent: 'center', paddingHorizontal: 8}}>
            <Text
              style={{textAlign: 'left', color: Color.secondary, fontSize: 8}}>
              No. Recipt
            </Text>
            <Text style={{textAlign: 'left', fontSize: 10, fontWeight: 'bold'}}>
              {item.orderNumber}
            </Text>
          </View>

          <View style={{width: '30%', padding: 8}}>
            <View
              style={{
                backgroundColor: Color.primarySoft,
                borderRadius: 5,
                width: '100%',
                height: 20,
              }}>
              <Text
                style={{
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
            width: '100%',
            height: 1,
            alignSelf: 'center',
          }} />
          
        {item.items && item.items.length > 0 && item.items[0].products.length > 0 &&
        <View style={{width: '100%', flexDirection: 'row', padding: 16}}>
          <View
            style={{
              width: '20%',
              aspectRatio: 1,
            }}
          >
            <Image
              source={{uri: item.items[0].products[0]['imageUrl']}}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </View>

          <View style={{width: '80%', paddingLeft: 16, }}>
            <Text align='left' type='bold'>
              {item.items[0].products[0]['name'].length > 58 ? item.items[0].products[0]['name'].substring(0,55)+' ...' : item.items[0].products[0]['name']}
            </Text>
            {/* <View
              style={{
                flexDirection: 'row',
                marginVertical: 5,
              }}>
              <Entypo name={'star'} style={{color: Color.yellow}} />
              <Text
                style={{
                  fontSize: 10,
                  color: Color.secondary,
                  marginHorizontal: 3,
                }}>
                {item.rating || 0}
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
                {item.sold || 0}
              </Text>
              <Text style={{fontSize: 10, color: Color.secondary}}>Terjual</Text>
            </View> */}
          </View>
        </View>}

        {item.items && item.items.length != 0 && <View style={{flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 16}}>
          <View style={{}}>
            <Text
              style={{fontSize: 8, textAlign: 'left', color: Color.secondary}}>
              Harga Barang
            </Text>
            <Text style={{fontSize: 12, textAlign: 'left', fontWeight: 'bold'}}>
              {FormatMoney.getFormattedMoney(item.items[0].products[0]['price'])}
            </Text>
          </View>
            
          <Col style={{ alignItems: 'flex-end' }}>
          {(item.shipperOrderNumber && item.statusId == 2) && <View
            style={{
              backgroundColor: Color.primary,
              width: 100,
              borderRadius: 20,
            }}>
            <TouchableOpacity
             onPress={() => navigation.navigate('TrackingOrder',{item})}
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
              paddingHorizontal: 16,
              borderRadius: 20,
            }}>
            <TouchableOpacity
              onPress={() => Alert(
                'Konfirmasi',
                'Apakah Anda yakin akan menerima pesanan?',
                () => updateStatus(item)
              )}
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

          {/* hide ulasan */}
          {/* {(item.statusId == 4) && <View
            style={{
              backgroundColor: Color.primary,
              width: 100,
              borderRadius: 20,
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Review', {item})}
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
          </View>} */}
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
          </Col>
        </View>}
      </Pressable>
    </View>
  );

  return (
    <Scaffold
      loadingProps={loadingProps}
      header={
        <Header customIcon title="Notifikasi" type="bold" centerTitle={false} />
      }
      onPressLeftButton={() => navigation.pop()}
    >
      {/* hide filter */}
      {/* <View style={{flexDirection: 'row', marginVertical: 10}}>
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
      </View> */}

      <FlatList
        data={listData}
        renderItem={renderItem}
        onEndReachedThreshold={0.3}
        onEndReached={() => onEndReached()}
        keyExtractor={item => item.id}
        style={{ backgroundColor: Color.semiwhite }}
        contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 8 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </Scaffold>
  );
};

export default Notification;
