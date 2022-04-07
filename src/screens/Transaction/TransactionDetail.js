import React, {useState, useEffect, useRef} from 'react';
import {View, Image} from 'react-native';
import {Divider, Line} from 'src/styled';
import {connect, useDispatch, useStore} from 'react-redux';
import {TouchableOpacity} from '@src/components/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Styled from 'styled-components';
import Text from '@src/components/Text';
import {Header, Loading, useLoading} from 'src/components';
import {ScrollView} from 'react-native-gesture-handler';
import ImagesPath from 'src/components/ImagesPath';
import {mutationCancel, queryDetailOrder} from 'src/lib/query/ecommerce';
import client from 'src/lib/apollo';
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
} from '@src/components';
import ColorPropType from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedColorPropType';

const Content = Styled(View)`
    margin: 16px
    marginBottom: 0px
    padding: 12px
    borderRadius: 8px
`;

const TransactionDetail = ({route, navigation}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [loadingProps, showLoading, hideLoading] = useLoading();

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

  const getProduct = () => {
    let variables = {
      orderId: route.params.item.id,
    };

    client
      .query({query: queryDetailOrder, variables})
      .then(res => {
        console.log(res);
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
      data: {...data, vestaBiller: true, finalAmount: data.totalPrice},
    });
    navigation.navigate('PaymentScreen', {back: true});
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
                          {val.price} poin
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
                          {data.totalProductPrice} poin
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
      <Row style={{height: 70, width: '100%', backgroundColor: Color.theme, justifyContent: 'center',paddingVertical: 15}}>
          <TouchableOpacity style={{justifyContent: 'center',borderRadius: 20,marginHorizontal: 5,width: '44%', height: 40,borderWidth: 1, borderColor: Color.error,}}>
            <Text style={{color: Color.error}}>Batalkan Pesanan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{justifyContent: 'center',borderRadius: 20,marginHorizontal: 5,width: '44%', backgroundColor: Color.primary}}>
            <Text style={{color: Color.textInput,}}>Chat Penjual</Text>
          </TouchableOpacity>
      </Row>
    </Scaffold>
  );
};

export default TransactionDetail;
