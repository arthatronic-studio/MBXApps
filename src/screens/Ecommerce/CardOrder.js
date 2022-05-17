import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Pressable,
  FlatList,
  Image,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
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
  ScreenIndicator,
} from '@src/components';
import {TouchableOpacity} from '@src/components/Button';
import ImagesPath from 'src/components/ImagesPath';
import {Container, Divider} from 'src/styled';
import {FormatMoney} from 'src/utils';
import {navigationRef} from 'App';

const CardOrder = ({data}) => {
  const navigation = useNavigation();
  const {Color} = useColor();
  const items = data.items.length > 0 ? data.items[0].products : [];
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Color.semiwhite,
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('TransactionDetailSeller', {item: data})}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 15,
          backgroundColor: Color.theme,
          width: '95%',
          alignSelf: 'center',
          borderRadius: 5,
          marginVertical: 8,
        }}>
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
              {data.address.penerimaName}
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
              width: '20%'
            }}>
            {data.statusId == 1 ? ("Sudah Dibayar"):(data.status)}
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
        {items.length != 0 && 
            <View>
            <View style={{flexDirection: 'row'}}>
                    <Image
                      source={{uri:items[0].imageUrl}}
                      style={{width: 50, height: 50, borderRadius: 5}}
                    />
                    <View style={{marginHorizontal: 10}}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          textAlign: 'left',
                        }}>
                        {items[0].name.length > 64 ? items[0].name.substring(0,64)+' ...' : items[0].name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 8,
                          color: Color.secondary,
                          textAlign: 'left',
                        }}>
                        Stok Barang : {items[0].stock}
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
                            x{items[0].quantity}
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
                            {FormatMoney.getFormattedMoney(items[0].price)} 
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
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
              {/* <View style={{flexDirection: 'row'}}>
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
                    {items[0].name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 8,
                      color: Color.secondary,
                      textAlign: 'left',
                    }}>
                    Stok Barang : {items[0].stock} pcs
                  </Text>
                  <Divider />
                  <View>
                    <View style={{flexDirection: 'row', marginVertical: 2}}>
                      <Text
                        style={{
                          fontSize: 11,
                          textAlign: 'left',
                          fontWeight: 'bold',
                        }}>
                        {data.address.penerimaName}
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
                  
                </View>
              </View> */}
            </View>}

        <Divider height={10} />
        <View
          style={{
            paddingHorizontal: 10,
            justifyContent: 'center',
            borderRadius: 3,
            backgroundColor: Color.border,
            width: '99%',
            minHeight: 46,
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
              {items.length > 0 && items[0].note}
            {/* Tolong anternya pake buroq ya biar cepet hehehe */}
          </Text>
        </View>
        <Divider />

        {data.status == 'OPEN' && (
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
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CardOrder;
