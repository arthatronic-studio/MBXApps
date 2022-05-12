import React, {useState, useEffect, useRef} from 'react';
import {View, Image} from 'react-native';
import {useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {ScrollView} from 'react-native-gesture-handler';
import Moment from 'moment';

import {TouchableOpacity, Button} from '@src/components/Button';
import {Container, Divider} from 'src/styled';
import Text from '@src/components/Text';
import {Alert, Header, useLoading} from 'src/components';
import {mutationCancel, queryDetailOrder} from 'src/lib/query/ecommerce';
import {queryEcommerceUlasanManage} from '@src/lib/query/ecommerce/queryEcommerceUlasanManage';
import client from 'src/lib/apollo';
import {FormatMoney} from 'src/utils';
import {
  useColor,
  Scaffold,
  Row,
  Col,
} from '@src/components';
import {Modalize} from 'react-native-modalize';
import FormInput from 'src/components/FormInput';
import { queryCheckIsUlasan } from 'src/lib/query/ecommerce/queryCheckIsUlasan';

const TransactionDetail = ({route, navigation}) => {
  const [data, setData] = useState({});
  const [review, setReview] = useState({
    rating: 5,
    ulasan: '',
  });

  const [loadingProps, showLoading, hideLoading] = useLoading();
  
  const dispatch = useDispatch();
  const modalizeRef = useRef(null);
  const {Color} = useColor();

  useEffect(() => {
    getProduct();
  }, []);

  const cancelButton = () => {
    const {item} = route.params;
    showLoading();
    let variables = {
      type: 'CANCEL',
      orderId: route.params.item.id,
    };
    client
      .mutate({mutation: mutationCancel, variables})
      .then(res => {
        hideLoading();
        console.log(res);
        if (res.data.ecommerceOrderManage) {
          alert('Success cancel order');
          setTimeout(() => {
            navigation.popToTop();
          }, 1000);
        }
      })
      .catch(reject => {
        hideLoading();
        alert(reject);
        console.log(reject, 'reject');
      });
  };

  const updateStatus = (item) => {
    showLoading();

    let variables = {
      type: 'FINISH',
      orderId: item.id,
    };

    console.log(variables);

    client.query({query: mutationCancel, variables})
      .then(res => {
        console.log(res);

        getProduct();
        hideLoading();
      })
      .catch(reject => {
        hideLoading();

        console.log(reject);
      });
  };
  
  const getProduct = () => {
    let variables = {
      orderId: route.params.item.id,
    };

    client
      .query({query: queryDetailOrder, variables})
      .then(res => {
        console.log("reskak",res)
        if (res.data.ecommerceOrderDetail) {
          setData(res.data.ecommerceOrderDetail);
        }

        // hideLoading();
        // navigation.navigate('TopUpScreen');
      })
      .catch(reject => {
        console.log(reject);
      });
  };

  const onPayment = () => {
    dispatch({
      type: 'BOOKING.ADD_BOOKING',
      data: {...data, id: data.bookingId, vestaBiller: true, finalAmount: data.totalPrice},
    });
    navigation.navigate('PaymentScreen', {back: true});
  };

  const fetchCheckIsUlasan = (id) => {
    const variables = {
      productId: id,
    };

    client.query({
      query: queryCheckIsUlasan,
      variables,
    })
    .then((res) => {
      console.log('res cek ulasan', res);
    })
    .catch((err) => {
      console.log('err cek ulasan', err);
    });
  }

  const onSubmitUlasan = (id) => {
    const variables = {
      productId: id,
      ulasan: review.ulasan,
      rating: review.rating,
      manageType: 'ADD',
      // $ulasanId: Int for type delete
    };

    client.mutate({
      mutation: queryEcommerceUlasanManage,
      variables,
    })
    .then((res) => {
      console.log('res ecomm ulasan', res);
      alert('Ulasan berhasil terkirim');
      fetchCheckIsUlasan(id);
    })
    .catch((err) => {
      console.log('err ecomm ulasan', err);
      alert('Ulasan gagal dikirim');
    });
  };

  return (
    <Scaffold
      header={
        <Header
          customIcon
          title="Detail Pesanan"
          type="bold"
          style={{paddingTop: 16, marginBottom: 10}}
          centerTitle={false}
        />
      }
    >
      <ScrollView>
        {/* ======== Detail Transaksi ========== */}
        <View
          style={{
            width: '93%',
            alignSelf: 'center',
            height: 120,
            backgroundColor: Color.theme,
            borderRadius: 10,
            marginTop: 5,
          }}>
          <Row style={{paddingHorizontal: 10, paddingVertical: 10}}>
            <Text style={{fontSize: 11, fontWeight: 'bold'}}>
              Detail Transaksi
            </Text>
          </Row>
          <View
            style={{
              backgroundColor: Color.border,
              height: 1,
              width: '100%',
            }}
          />
          <Row style={{paddingHorizontal: 10, paddingVertical: 5}}>
            <Text
              style={{
                fontSize: 10,
                width: '40%',
                textAlign: 'left',
                color: Color.secondary,
              }}>
              Status
            </Text>
            <Text
              style={{
                fontSize: 10,
                width: '60%',
                textAlign: 'right',
                color: Color.primary,
                fontWeight: 'bold',
              }}>
              {data.status}
            </Text>
          </Row>
          <Row style={{paddingHorizontal: 10, paddingVertical: 5}}>
            <Text
              style={{
                fontSize: 10,
                width: '40%',
                textAlign: 'left',
                color: Color.secondary,
              }}>
              No Recipt
            </Text>
            <Text
              style={{
                fontSize: 10,
                width: '60%',
                textAlign: 'right',
                fontWeight: 'bold',
              }}>
              {data.orderNumber}
            </Text>
          </Row>
          <Row style={{paddingHorizontal: 10, paddingVertical: 5}}>
            <Text
              style={{
                color: Color.secondary,
                fontSize: 10,
                width: '40%',
                textAlign: 'left',
              }}>
              Tanggal Transaksi
            </Text>
            <Text
              style={{
                fontSize: 10,
                width: '60%',
                textAlign: 'right',
                fontWeight: 'bold',
              }}>
              {Moment(parseInt(data.createdAt)).format(
                'dddd, DD MMMM YYYY HH:mm',
              )}{' '}
              WIB
            </Text>
          </Row>
        </View>

        {/* =========== Finish Detail Transaksi ============= */}

        {/* =========== Detail Produk ============= */}
        {data.items &&
          data.items.map((value, id) => (
            <View
              key={id}
              style={{
                width: '93%',
                alignSelf: 'center',
                backgroundColor: Color.theme,
                borderRadius: 10,
                marginVertical: 15,
              }}
            >
              {value.products.map((val, idx) => (
                <>
                  <Row key={idx} style={{paddingHorizontal: 10, paddingVertical: 10}}>
                    <Text style={{fontSize: 11, fontWeight: 'bold'}}>
                      Detail Produk
                    </Text>
                  </Row>
                  <View
                    style={{
                      backgroundColor: Color.border,
                      height: 1,
                      width: '100%',
                    }}
                  />
                  <Row>
                    <Image
                      source={{uri: val.imageUrl}}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 5,
                        marginHorizontal: 10,
                        marginVertical: 10,
                      }}
                    />
                    <Col>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          textAlign: 'left',
                          marginHorizontal: 10,
                          marginVertical: 5,
                        }}
                        numberOfLines={1}
                      >
                        {val.name}
                      </Text>
                      <Row style={{paddingHorizontal: 10, paddingVertical: 2}}>
                        <Text
                          style={{
                            fontSize: 8,
                            width: '40%',
                            textAlign: 'left',
                            color: Color.secondary,
                          }}>
                          Jumlah Pembelian
                        </Text>
                        <Text
                          style={{
                            fontSize: 8,
                            width: '60%',
                            textAlign: 'right',
                            color: Color.secondary,
                            fontWeight: 'bold',
                          }}>
                          x{val.quantity}
                        </Text>
                      </Row>
                      <Row style={{paddingHorizontal: 10, paddingVertical: 2}}>
                        <Text
                          style={{
                            fontSize: 8,
                            width: '40%',
                            textAlign: 'left',
                            color: Color.secondary,
                          }}>
                          Harga Barang
                        </Text>
                        <Text
                          style={{
                            fontSize: 8,
                            width: '60%',
                            textAlign: 'right',
                            color: Color.secondary,
                          }}>
                          {FormatMoney.getFormattedMoney(val.price)}
                        </Text>
                      </Row>
                      {/* <Row style={{paddingHorizontal: 10, paddingVertical: 2}}>
                        <Text
                          style={{
                            fontSize: 8,
                            width: '40%',
                            textAlign: 'left',
                            color: Color.secondary,
                          }}>
                          Total Pembelian
                        </Text>
                        <Text
                          style={{
                            fontSize: 8,
                            width: '60%',
                            textAlign: 'right',
                            color: Color.secondary,
                            fontWeight: 'bold',
                          }}>
                          {FormatMoney.getFormattedMoney(data.totalProductPrice)}
                        </Text>
                      </Row> */}
                      
                    </Col>
                    
                  </Row>
                  
                    <View style={{paddingHorizontal: 10, marginTop: -5}}>
                        <Text
                          style={{
                            fontSize: 8,
                            width: '40%',
                            textAlign: 'left',
                            color: Color.secondary,
                          }} type='semiBold'>
                          Catatan
                        </Text>
                        <Text
                          style={{
                            fontSize: 8,
                            textAlign: 'left',
                            borderRadius: 4,
                            padding: 6,
                            backgroundColor: '#bcbcbc50',
                            color: Color.text,
                            fontWeight: 'semiBold',
                          }}>
                          {val.note}
                        </Text>
                    </View>

                  {data.statusId == 4 && (
                    <Container paddingHorizontal={8} paddingTop={16}>
                      <View style={{paddingVertical: 15,width: '100%', backgroundColor: Color.border, height: 90, borderRadius: 8}}>
                        <Text style={{fontSize: 12, color: Color.secondary, alignSelf: 'center'}}>Beri Nilai Produk</Text>
                        <Row style={{justifyContent: 'center', marginVertical: 15}}>
                          {[1,2,3,4,5].map((item, idx) => {
                            const isActive = item <= review.rating;
                            return (
                              <AntDesign
                                key={idx}
                                name={'star'}
                                size={25}
                                color={isActive ? Color.primary : Color.secondary}
                                style={{marginHorizontal: 8}}
                                onPress={() => {
                                  setReview({ ...review, rating: item });
                                }}
                              />
                            )
                          })}
                        </Row>
                      </View>

                      <Divider />

                      <FormInput
                        multiline
                        label='Tulis ulasan'
                        value={review.ulasan}
                        onChangeText={(val) => setReview({ ...review, ulasan: val })}
                      />

                      <Button
                        onPress={() => {
                          onSubmitUlasan(val.id);
                        }}
                      >
                        Kirim Ulasan
                      </Button>
                    </Container>
                  )}
                </>
              ))}
            </View>
          ))}
        {/* =========== Finish Detail Produk ============= */}

        <View
          style={{
            width: '93%',
            alignSelf: 'center',
            height: 145,
            backgroundColor: Color.theme,
            borderRadius: 10,
          }}>
          <Row style={{paddingHorizontal: 10, paddingVertical: 10}}>
            <Text style={{fontSize: 11, fontWeight: 'bold'}}>
              Info Pengiriman
            </Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              {data.shipperOrderNumber && <Text onPress={() => navigation.navigate('TrackingOrder',{item: data})} style={{fontSize: 11, fontWeight: 'bold'}}>
                Lacak Paket {'>>'}
              </Text>}
            </View>
          </Row>
          <View
            style={{
              backgroundColor: Color.border,
              height: 1,
              width: '100%',
            }}
          />
          <Row style={{paddingHorizontal: 10, paddingVertical: 5}}>
            <Text
              style={{
                fontSize: 10,
                width: '37%',
                textAlign: 'left',
                color: Color.secondary,
              }}>
              Nama Pembeli
            </Text>
            <Text
              style={{
                fontSize: 10,
                width: '60%',
                textAlign: 'left',
                color: Color.secondary,
                fontWeight: 'bold',
              }}>
              {data.address && data.address.penerimaName}
            </Text>
          </Row>
          <Row style={{paddingHorizontal: 10, paddingVertical: 5}}>
            <Text
              style={{
                fontSize: 10,
                width: '28%',
                textAlign: 'left',
                color: Color.secondary,
              }}>
              No Resi Pengiriman
            </Text>
            <Ionicons
              name="copy-outline"
              size={16}
              type="entypo"
              color="orange"
              style={{marginRight: 15}}
            />
            <Text
              style={{
                fontSize: 10,
                width: '60%',
                textAlign: 'left',
                color: Color.secondary,
              }}>
              {data.shipperOrderNumber}
            </Text>
          </Row>
          {data.address && (
            <Row style={{paddingHorizontal: 10, paddingVertical: 5}}>
              <Text
                style={{
                  color: Color.secondary,
                  fontSize: 10,
                  width: '28%',
                  textAlign: 'left',
                }}>
                Alamat Pengiriman
              </Text>
              <Ionicons
                name="copy-outline"
                size={16}
                type="entypo"
                color="orange"
                style={{marginRight: 15}}
              />
              <Text
                style={{
                  fontSize: 10,
                  width: '60%',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  lineHeight: 18,
                }}>
                {data.address.address},{' '}
                {data.address && data.address.suburb.name},{' '}
                {data.address && data.address.city.name},{' '}
                {data.address && data.address.province.name}
              </Text>
            </Row>
          )}
        </View>

        {/* Rincian Pembayaran */}
        <View
          style={{
            width: '93%',
            alignSelf: 'center',
            height: 180,
            backgroundColor: Color.theme,
            borderRadius: 10,
            marginTop: 15,
          }}>
          <Row style={{paddingHorizontal: 10, paddingVertical: 10}}>
            <Text style={{fontSize: 11, fontWeight: 'bold'}}>
              Rincian Pembayaran
            </Text>
          </Row>
          <View
            style={{
              backgroundColor: Color.border,
              height: 1,
              width: '100%',
            }}
          />
          <Row style={{paddingHorizontal: 10, paddingVertical: 5}}>
            <Text
              style={{
                fontSize: 10,
                width: '40%',
                textAlign: 'left',
                color: Color.secondary,
              }}>
              Metode Pembayaran
            </Text>
            <Text
              style={{
                fontSize: 10,
                width: '60%',
                textAlign: 'right',
                color: Color.secondary,
                fontWeight: 'bold',
              }}>
              {data.payment ? data.payment.name : ''}
            </Text>
          </Row>
          <Row style={{paddingHorizontal: 10, paddingVertical: 5}}>
            <Text
              style={{
                fontSize: 10,
                width: '40%',
                textAlign: 'left',
                color: Color.secondary,
              }}>
              Total Harga (1 Barang)
            </Text>
            <Text
              style={{
                fontSize: 10,
                width: '60%',
                textAlign: 'right',
                fontWeight: 'bold',
                color: Color.secondary,
              }}>
              {FormatMoney.getFormattedMoney(data.totalProductPrice)}
            </Text>
          </Row>
          <Row style={{paddingHorizontal: 10, paddingVertical: 5}}>
            <Text
              style={{
                color: Color.secondary,
                fontSize: 10,
                width: '40%',
                textAlign: 'left',
              }}>
              Total Ongkir
            </Text>
            <Text
              style={{
                fontSize: 10,
                width: '60%',
                textAlign: 'right',
                fontWeight: 'bold',
                color: Color.secondary,
              }}>
              {FormatMoney.getFormattedMoney(data.shippingCost)}
            </Text>
          </Row>
          <Row style={{paddingHorizontal: 10, paddingVertical: 5}}>
            <Text
              style={{
                color: Color.secondary,
                fontSize: 10,
                width: '40%',
                textAlign: 'left',
              }}>
              Biaya Administrasi
            </Text>
            <Text
              style={{
                fontSize: 10,
                width: '60%',
                textAlign: 'right',
                fontWeight: 'bold',
                color: Color.secondary,
              }}>
              {FormatMoney.getFormattedMoney(data.adminFee)}
            </Text>
          </Row>
          <Row style={{paddingHorizontal: 10, paddingVertical: 10}}>
            <Text
              style={{
                color: Color.secondary,
                fontSize: 11,
                width: '40%',
                textAlign: 'left',
                fontWeight: 'bold',
                color: Color.text,
              }}>
              Total Bayar
            </Text>
            <Text
              style={{
                fontSize: 11,
                width: '60%',
                textAlign: 'right',
                fontWeight: 'bold',
                color: Color.text,
              }}>
              {FormatMoney.getFormattedMoney(data.totalPrice)}
            </Text>
          </Row>
        </View>

        <Divider />

        <Row
          style={{
            height: 70,
            width: '100%',
            backgroundColor: Color.theme,
            justifyContent: 'center',
            paddingVertical: 15,
          }}>
            {/* refactor ChatRoomsScreen */}
            {data.statusId < 4 && (
            <TouchableOpacity
            onPress={() => navigation.navigate('ChatRoomsScreen' || 'ChatRoom', {item: detail})}
            style={{
              width: '12%',
              height: 40,
              borderWidth: 1,
              borderColor: Color.primary,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
              marginHorizontal: 10,
            }}>
                <MaterialCommunityIcons
                  size={23}
                  name={'message-processing-outline'}
                  style={{color: Color.primary}}
                />
              </TouchableOpacity>
          )}

          {data.statusId == 0 && (
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                borderRadius: 20,
                marginHorizontal: 5,
                width: '40%',
                height: 40,
                borderWidth: 1,
                borderColor: Color.error,
              }}>
              <Text style={{color: Color.error}}>Batalkan Pesanan</Text>
            </TouchableOpacity>
          )}
          
          {data.statusId == 3 && (
            <TouchableOpacity
              onPress={() => Alert(
                'Konfirmasi',
                'Apakah Anda yakin akan menerima pesanan?',
                () => updateStatus(data)
              )}
              style={{
                justifyContent: 'center',
                borderRadius: 20,
                marginHorizontal: 5,
                width: '44%',
                height: 40,
                backgroundColor: Color.primary,
              }}
            >
              <Text style={{color: Color.textInput}}>Pesanan Diterima</Text>
            </TouchableOpacity>
          )}
          
          {data.statusId == 0 && (
            <TouchableOpacity
              onPress={() => onPayment()}
              style={{
                justifyContent: 'center',
                borderRadius: 20,
                marginHorizontal: 5,
                width: '30%',
                backgroundColor: Color.primary,
              }}>
              <Text style={{color: Color.textInput}}>Lanjut Bayar</Text>
            </TouchableOpacity>
          )}
        </Row>
      </ScrollView>

      <Modalize ref={modalizeRef} modalStyle={{}}>
        <View></View>
      </Modalize>
    </Scaffold>
  );
};

export default TransactionDetail;
