import React, {useState, useEffect, useRef} from 'react';
import {View, Image, useWindowDimensions, TextInput} from 'react-native';
import {Divider, Line} from 'src/styled';
import {connect, useDispatch, useStore} from 'react-redux';
import {TouchableOpacity} from '@src/components/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Styled from 'styled-components';
import Text from '@src/components/Text';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Header, Loading, useLoading} from 'src/components';
import {ScrollView} from 'react-native-gesture-handler';
import ImagesPath from 'src/components/ImagesPath';

import {
  mutationCancel,
  mutationCheckout,
  queryDetailOrder,
  queryShipperPickupTimeSlot,
  queryCheckout,
  queryShipperCreatePickupOrderTimeSlot,
} from 'src/lib/query/ecommerce';
import Client from '@src/lib/apollo';
import Moment from 'moment';
import {FormatMoney} from 'src/utils';
import {
  HeaderBig,
  useColor,
  Scaffold,
  Row,
  Col,
  Button,
  Submit,
  ModalListAction,
} from '@src/components';
import ColorPropType from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedColorPropType';
import {Modalize} from 'react-native-modalize';
import moment from 'moment';

const Content = Styled(View)`
    margin: 16px
    marginBottom: 0px
    padding: 12px
    borderRadius: 8px
`;

const TransactionDetailSeller = ({route, navigation}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [loadingProps, showLoading, hideLoading] = useLoading();
  console.log('routeee', route);
  const modalizeRef = useRef(null);
  const {width, height} = useWindowDimensions();

  const [pickUpTime, setPickUpTime] = useState([]);
  const [pickUpOrderTimeSlot, setPickUpOrderTimeSlot] = useState();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState([]);
  const [shipperOrder, setShipperOrder] = useState();
  console.log('dataaa', data);
  useEffect(() => {
    getProduct();
    getDate();
  }, []);
  console.log('pickkuuu', pickUpTime);
  const cancelButton = () => {
    const {item} = route.params;
    showLoading();
    let variables = {
      type: 'CANCEL',
      orderId: route.params.item.id,
    };
    Client.mutate({mutation: mutationCancel, variables})
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

  const getDate = () => {
    let variables = {
      time_zone: 'Asia_Jakarta',
    };
    Client.query({query: queryShipperPickupTimeSlot, variables})
      .then(res => {
        setDate(res.data.shipperPickupTimeSlot.time_slots);
      })
      .catch(error => {
        console.log('eeeeeee', error);
      });
  };

  const getProduct = () => {
    let variables = {
      orderId: route.params.item.id,
    };

    Client.query({query: queryDetailOrder, variables})
      .then(res => {
        console.log('reskak', res);
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

  console.log('userAddressIdDestination', data.shippingAddressId);
  console.log('userPenerima', data.userId);
  console.log('rate', data.shippingRateId);
  console.log('insurance', data.shippingUseInsurance);

  const updateStatusToPacking = () => {
    let variablesPacking = {
      type: 'PACKING',
      orderId: route.params.item.id,
    };

    Client.mutate({mutation: mutationCheckout, variables: variablesPacking})
      .then(res => {
        console.log('BERHASIL', res);
        getProduct();
        // hideLoading();
        // navigation.navigate('TopUpScreen');
      })
      .catch(reject => {
        hideLoading();
        console.log(reject);
      });
  };

  const createShipperOrder = () => {
    const prod = data.items[0].products.map(e => {
      return {
        id: e.id,
        qty: e.quantity,
      };
    });
    console.log('proddd', prod);
    console.log('datalk', data);
    let variablesCreateOrder = {
      input: {
        userAddressIdDestination: data.shippingAddressId,
        userAddressIdOrigin: data.shippingAddressId,
        products: prod,
        payment_type: 'postpay',
        package_type: 'SMALLPACKAGE',
        userPenerima: data.userId,
        courier: {
          rate_id: data.shippingRateId,
          use_insurance: data.shippingUseInsurance,
        },
      },
    };
    console.log('variablesCreateOrder', variablesCreateOrder);
    Client.mutate({
      mutation: queryCheckout,
      variables: variablesCreateOrder,
    }).then(res => {
      console.log(res, 'createeeorder');
      setShipperOrder(res.data.shipperCreateOrder);
    });
  };

  console.log("shipperorder",shipperOrder)

  const createPickupOrderTimeSlot = () => {
    let variables = {
      order_activation: {
        order_id: [shipperOrder.order_id],
        timezone: 'Asia_Jakarta',
        start_time: pickUpTime.start_time,
        end_time: pickUpTime.end_time,
      },
    };
    console.log('variables queryShipperCreatePickupOrderTimeSlot', variables);
    // Client.mutate({
    //   mutation: queryShipperCreatePickupOrderTimeSlot,
    //   variables,
    // }).then(res => {
    //   console.log('res queryShipperCreatePickupOrderTimeSlot', res);
    //   setPickUpOrderTimeSlot(res.data.shipperCreatePickupOrderTimeSlot);
    // });
  };

  const inputShippingNumber = () => {
    let variables = {
      type: 'INPUT_SHIPPING_NUMBER',
      orderId: route.params.item.id,
      shippingNumber: shipperOrder.order_id,
    };
    Client.mutate({
      mutation: mutationCheckout,
      variables,
    }).then(res => {
      console.log("berhasil input shipping number",res);
    });
  };

  const updateStatusToSend = () => {
    let variables = {
      type: 'SEND',
      orderId: route.params.item.id,
    };
    Client.mutate({
      mutation: mutationCheckout,
      variables,
    }).then(res => {
      console.log('res berhasil ubah ke semddddd', res);
      getProduct();
    });
  };

  const onPayment = () => {
    dispatch({
      type: 'BOOKING.ADD_BOOKING',
      data: {
        ...data,
        id: data.bookingId,
        vestaBiller: true,
        finalAmount: data.totalPrice,
      },
    });
    navigation.navigate('PaymentScreen', {back: true});
  };

  const pickupSchedule = () => {
    modalizeRef.current.open();
    createShipperOrder()
  };
  const {Color} = useColor();
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
      style={{backgroundColor: '#E5E5E5'}}>
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
              style={{
                width: '93%',
                alignSelf: 'center',
                height: 130,
                backgroundColor: Color.theme,
                borderRadius: 10,
                marginVertical: 15,
              }}>
              {value.products.map((val, idx) => (
                <>
                  <Row style={{paddingHorizontal: 10, paddingVertical: 10}}>
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
                        }}>
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
                      <Row style={{paddingHorizontal: 10, paddingVertical: 2}}>
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
                          {FormatMoney.getFormattedMoney(
                            data.totalProductPrice,
                          )}
                        </Text>
                      </Row>
                    </Col>
                  </Row>
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
        <Divider height={25} />
      </ScrollView>

      {data.status === 'Menunggu Pembayaran' && (
        <Row
          style={{
            height: 70,
            width: '100%',
            backgroundColor: Color.theme,
            justifyContent: 'center',
            paddingVertical: 15,
          }}>
          <TouchableOpacity
            onPress={() => cancelButton()}
            style={{
              justifyContent: 'center',
              borderRadius: 20,
              marginHorizontal: 5,
              width: '44%',
              height: 40,
            borderWidth: 1,
              borderColor: Color.error,
            }}>
            <Text style={{color: Color.error}}>Batalkan Pesanan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ChatRoom')}
            style={{
              justifyContent: 'center',
              borderRadius: 20,
              marginHorizontal: 5,
              width: '44%',
              backgroundColor: Color.primary,
            }}>
            <Text style={{color: Color.textInput}}>Chat Pembeli</Text>
          </TouchableOpacity>
        </Row>
      )}

      {data.statusId === 1 && (
        <View
          style={{
            backgroundColor: Color.theme,
            flexDirection: 'column',
            height: 190,
            width: '100%',
            justifyContent: 'center',
            padding: 16,
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => {
              updateStatusToPacking();
              navigation.navigate('IncomingOrder');
            }}
            style={{
              backgroundColor: Color.primary,
              borderRadius: 120,
              paddingVertical: 10,
              paddingHorizontal: 107,
            }}>
            <Text style={{color: Color.theme}}>Proses Pesanan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ChatRoom')}
            style={{
              backgroundColor: Color.theme,
              borderRadius: 120,
              paddingVertical: 10,
              paddingHorizontal: 107,
              borderColor: Color.primary,
              borderWidth: 1,
            }}>
            <Text style={{color: Color.primary}}>Chat Pembeli</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => cancelButton()}
            style={{
              backgroundColor: Color.theme,
              borderRadius: 120,
              paddingVertical: 10,
              paddingHorizontal: 107,
              borderColor: Color.danger,
              borderWidth: 1,
            }}>
            <Text style={{color: Color.danger}}>Batalkan Pesanan</Text>
          </TouchableOpacity>
        </View>
      )}

      {data.statusId === 2 && (
        <View
          style={{
            backgroundColor: Color.theme,
            flexDirection: 'column',
            width: '100%',
            padding: 16,
          }}>
          <TouchableOpacity
            onPress={() => {
              pickupSchedule();
            }}
            style={{
              backgroundColor: Color.primary,
              borderRadius: 120,
              paddingVertical: 10,
              paddingHorizontal: 107,
              marginBottom: 8,
            }}>
            <Text style={{color: Color.theme}}>Atur Jadwal Pickup</Text>
          </TouchableOpacity>
          {!data.invoiceNumber && (
            <TouchableOpacity
              onPress={() => {}}
              style={{
                backgroundColor: Color.theme,
                borderRadius: 120,
                paddingVertical: 10,
                paddingHorizontal: 107,
                borderColor: Color.primary,
                borderWidth: 1,
                marginBottom: 8,
              }}>
              <Text style={{color: Color.primary}}>Ubah Resi</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              
              createPickupOrderTimeSlot();
              inputShippingNumber();
                  updateStatusToSend();
                  navigation.navigate('IncomingOrder');
            }}
            style={{
              backgroundColor: Color.theme,
              borderRadius: 120,
              paddingVertical: 10,
              paddingHorizontal: 107,
              borderColor: Color.primary,
              borderWidth: 1,
            }}>
            <Text style={{color: Color.primary}}>Kirim Barang</Text>
          </TouchableOpacity>
        </View>
      )}

      {data.statusId === 3 && (
        <View
          style={{
            width: '100%',
            backgroundColor: Color.theme,
            justifyContent: 'center',
            padding: 16,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChatRoom');
            }}
            style={{
              backgroundColor: Color.primary,
              borderRadius: 120,
              paddingVertical: 10,
              paddingHorizontal: 107,
            }}>
            <Text style={{color: Color.theme}}>Chat Pembeli</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modalize
        ref={modalizeRef}
        modalHeight={height / 3}
        modalStyle={{padding: 16}}>
        <View style={{width: '100%', alignItems: 'flex-start'}}>
          <Text type="bold" style={{marginBottom: 14}}>
            Jadwal Pickup Kurir
          </Text>
          {/* <View style={{width: '100%'}}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setOpen(!open);
                }}
                placeholder={'dd/mm/yy'}
                style={{
                  borderWidth: 1,
                  borderColor: Color.secondary,
                  height: 45,
                  paddingHorizontal: 12,
                  paddingTop: 18,
                  borderRadius: 5,
                  fontSize: 12,
                  position: 'relative',
                }}>
                <Text
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                    color: Color.secondary,
                    fontSize: 8,
                    fontWeight: '400',
                    position: 'absolute',
                  }}>
                  Pilih Tanggal Pickup
                </Text>
                <Text style={{position: 'absolute', left: 13, top: 15}}>
                  dd/mm/yy
                </Text>
                <Image
                  style={{position: 'absolute', top: 10, right: 10}}
                  source={ImagesPath.calendarIcon}
                />
              </TouchableOpacity>
            </View>
            {open &&
              date.map((e, idx) => {
                return (
                  <Text>
                    {moment(new Date(e.start_time)).format('DD/MM/YYYY')} -{' '}
                    {moment(new Date(e.end_time)).format('DD/MM/YYYY')}
                  </Text>
                );
              })}
          </View> */}
          <View style={{alignItems: 'flex-start'}}>
            <Text style={{color: Color.secondary, marginTop: 10}} size="10">
              Jam Pick Up
            </Text>

            {date.map((e, idx) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setPickUpTime({
                      start_time: e.start_time,
                      end_time: e.end_time,
                    });
                  }}>
                  <Text style={{color: pickUpTime.length == 0 ? (Color.secondary) : (Color.text) }}>
                    {String(new Date(e.start_time).getHours()).padStart(2, '0')}{' '}
                    :{' '}
                    {String(new Date(e.start_time).getMinutes()).padStart(
                      2,
                      '0',
                    )}{' '}
                    - {String(new Date(e.end_time).getHours()).padStart(2, '0')}{' '}
                    :{' '}
                    {String(new Date(e.end_time).getMinutes()).padStart(2, '0')}
                    {/* {e.start_time}-{e.end_time} */}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              onPress={() => {
                pickUpTime && modalizeRef.current.close();
              }}
              style={{
                backgroundColor: pickUpTime.length == 0 ? Color.secondary: Color.primary,
                borderRadius: 120,
                width: '100%',
                paddingVertical: 10,
                paddingHorizontal: 135,
                marginVertical: 26,
              }}>
              <Text type="medium" style={{color: Color.theme}}>
                Konfirmasi
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modalize>
    </Scaffold>
  );
};

export default TransactionDetailSeller;
