import React, {useState, useEffect, useRef} from 'react';
import {View, Pressable, FlatList, Image, TextInput} from 'react-native';
import {useSelector} from 'react-redux';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MapView, {Marker} from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/core';
import Modal from 'react-native-modal';
import Client from '@src/lib/apollo';
import moment from 'moment';
import {
  Text,
  // TouchableOpacity,
  useLoading,
  Scaffold,
  Row,
  Col,
  useColor,
  Header,
} from '@src/components';
import {TouchableOpacity} from '@src/components/Button';
import ImagesPath from 'src/components/ImagesPath';
import {Divider} from 'src/styled';
import {FormatMoney} from 'src/utils';

const CardOrder = ({data}) => {
 
  const {Color} = useColor();
  // console.log(data);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Color.semiwhite,
        alignItems: 'center',
      }}>
      {data.items.map(item => {
        return (
          <Pressable
            onPress={() => navigation.navigate('TransactionDetailSucces')}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 15,
              backgroundColor: Color.theme,
              width: '95%',
              alignSelf: 'center',
              borderRadius: 5,
              marginVertical: 8,
            }}>
            {item.products.map(product => {
        
              return (
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <Image source={ImagesPath.avatar4} />
                    <View
                      style={{
                        width: '70%',
                        paddingHorizontal: 10,
                        paddingVertical: 2,
                      }}>
                      <Text
                        style={{
                          fontSize: 11,
                          textAlign: 'left',
                          fontWeight: 'bold',
                        }}>
                        Hendra Helinsky
                      </Text>
                      <Text
                        style={{
                          fontSize: 8,
                          textAlign: 'left',
                          color: Color.secondary,
                        }}>
                        No. Pesanan : {data.orderNumber}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 10,
                        marginVertical: 8,
                        color: Color.primary,
                      }}>
                      Belum Dibayar
                    </Text>
                  </View>
                  <Divider />
                  <View
                    style={{
                      width: '99%',
                      height: 1,
                      backgroundColor: Color.border,
                    }}
                  />
                  <Divider />
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={ImagesPath.produklelang}
                      style={{width: 50, height: 50, borderRadius: 5}}
                    />
                    <View style={{marginHorizontal: 10}}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          textAlign: 'left',
                        }}>
                        {product.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 8,
                          color: Color.secondary,
                          textAlign: 'left',
                        }}>
                        Stok Barang : {product.stock}
                      </Text>
                      <Divider />
                      <View>
                        <View style={{flexDirection: 'row', marginVertical: 2}}>
                          <Text
                            style={{
                              fontSize: 8,
                              color: Color.secondary,
                              textAlign: 'left',
                              width: '89%',
                            }}>
                            Jumlah pembelian
                          </Text>
                          <Text
                            style={{
                              fontSize: 8,
                              color: Color.secondary,
                              textAlign: 'right',
                            }}>
                            {' '}
                            x{product.quantity}
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row', marginVertical: 2}}>
                          <Text
                            style={{
                              fontSize: 8,
                              color: Color.secondary,
                              textAlign: 'left',
                              width: '77%',
                            }}>
                            Harga Barang
                          </Text>
                          <Text
                            style={{
                              fontSize: 8,
                              color: Color.secondary,
                              textAlign: 'right',
                            }}>
                            {FormatMoney.getFormattedMoney(product.price)} Poin
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row', marginVertical: 2}}>
                          <Text
                            style={{
                              fontSize: 8,
                              color: Color.secondary,
                              textAlign: 'left',
                              width: '77%',
                            }}>
                            Total pembelian
                          </Text>
                          <Text
                            style={{
                              fontWeight: 'bold',
                              fontSize: 8,
                              color: Color.text,
                              textAlign: 'right',
                            }}>
                            {' '}
                            {FormatMoney.getFormattedMoney(
                              data.totalPrice,
                            )}{' '}
                            Poin
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <Divider height={10} />
                  <View
                    style={{
                      paddingHorizontal: 10,
                      justifyContent: 'center',
                      borderRadius: 3,
                      backgroundColor: Color.border,
                      width: '99%',
                      height: 46,
                    }}>
                    <Text
                      style={{
                        fontSize: 8,
                        textAlign: 'left',
                        paddingVertical: 2,
                      }}>
                      Catatan Pembeli
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 'bold',
                        textAlign: 'left',
                        paddingVertical: 2,
                      }}>
                      Tolong anternya pake buroq ya biar cepet hehehe
                    </Text>
                  </View>
                  <Divider />

                  <Text style={{textAlign: 'left', marginHorizontal: 2}}>
                    <Text
                      style={{
                        fontSize: 8,
                        color: Color.secondary,
                        lineHeight: 12,
                        textAlign: 'left',
                      }}>
                      Pembeli sedang melakukan proses pembayaran. Pesanan akan
                      dibatalkan otomatis pada tanggal{' '}
                      {moment(data.expiredDate).format('DD MMM YYYY')}
                    </Text>
                  </Text>
                </View>
              );
            })}
          </Pressable>
        );
      })}
    </View>
  );
};

export default CardOrder;
