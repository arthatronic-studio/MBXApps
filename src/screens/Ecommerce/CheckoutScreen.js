import React, {useState, useEffect, useRef} from 'react';
import {View, ScrollView, Image, SafeAreaView} from 'react-native';
import Styled from 'styled-components';
import {connect, useDispatch, useStore} from 'react-redux';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import store from '../../state/redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Text,
  // TouchableOpacity,
  useLoading,
  Scaffold,
  Row,
  Col,
  HeaderBig,
  useColor,
  Header,
} from '@src/components';
import {TouchableOpacity} from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';

import {shadowStyle} from '@src/styles';
import Client from '@src/lib/apollo';
import {queryContentProduct} from '@src/lib/query';
import {FormatMoney} from 'src/utils';
import ImagesPath from 'src/components/ImagesPath';
import {
  mutationCheckout,
  queryCheckout,
  queryGetAddress,
  queryGetShipper,
} from 'src/lib/query/ecommerce';
import {TextInput} from 'react-native-gesture-handler';
import { Divider } from 'src/styled';
import { mutationCheckoutAuction } from 'src/lib/query/auction';

var styled = function styled(tag) {
  return constructWithOptions(createStyledComponent, tag);
};
const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    marginBottom: 0px
    padding: 12px
    borderRadius: 8px
`;

const CheckoutScreen = ({ navigation, route }) => {
  const {item} = route.params;

  const dispatch = useDispatch();
  const [address, setAddress] = useState({});
  const [shippment, setShipping] = useState({});
  const isFocused = useIsFocused();
  const [note, setNote] = useState();
  const [productList, setProductList] = useState([]);

  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);
  
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const {Color} = useColor();

  useEffect(() => {
    const {saveAddress, saveShippment} = route.params;
    if (saveAddress) {
      getAddress();
      //   setAddress(saveAddress)
    } else {
      getAddress();
    }

    if (saveShippment) setShipping(saveShippment);

    // let newArr = [];
    // route.params.list.map((item) => {
    //   newArr.push({ ...item, note: '' });
    // });
    setProductList(route.params.list);
  }, [isFocused]);

  const getAddress = () => {
    showLoading();

    let variables = {
      userId: user.userId,
      page: 1,
      itemPerPage: 1,
    };

    console.log(variables);

    Client.query({query: queryGetAddress, variables})
      .then(res => {
        hideLoading();
        console.log(res);
        if (res.data.userAddressList) {
          if (res.data.userAddressList.length > 0) {
            setAddress({
              ...res.data.userAddressList[0],
              userAddressIdDestination: res.data.userAddressList[0]['id'],
            });
          }
        }
      })
      .catch(reject => {
        hideLoading();
        console.log(reject.message, 'reject');
      });
  };

  const submitAuction = () => {
      const {saveAddress, saveShippment, item} = route.params;
      showLoading();
  
      let variables = {
        courier: {
          rate_id: shippment.rateId,
          cod: false,
          use_insurance: false,
          cost: shippment.price,
        },
        destinationAddressId: address.userAddressIdDestination,
        type: 'BOOKING',
        auctionProductId: item.tempData[0]['auctionId'],
        winningPrice: item.tempData[0]['total']
      };
  
      console.log(variables, 'variables');
  
      Client.mutate({mutation: mutationCheckoutAuction, variables})
        .then(res => {
          hideLoading();
          console.log(res);
          if (res.data.auctionOrderManage && res.data.auctionOrderManage.success) {
            console.log('datanya nih', {
              ...res.data.auctionOrderManage,
              id: res.data.auctionOrderManage.data.bookingId,
              vestaBiller: true,
            });
  
            alert(res.data.auctionOrderManage.message);
  
            dispatch({
              type: 'BOOKING.ADD_BOOKING',
              data: {
                ...res.data.auctionOrderManage.data,
                id: res.data.auctionOrderManage.data.bookingId,
                vestaBiller: true,
                finalAmount: res.data.auctionOrderManage.data.totalPrice,
              },
            });
  
            setTimeout(() => {
              navigation.navigate('PaymentScreen', {back: true});
              // navigation.popToTop()
            }, 1000);
          } else if (res.data.auctionOrderManage) {
            alert(res.data.auctionOrderManage.message);
          } else {
            alert('Gagal Order');
          }
        })
        .catch(reject => {
          hideLoading();
          alert('Gagal Order');
          console.log(reject, 'reject');
        });
  }

  const submit = () => {
    const {saveAddress, saveShippment, item} = route.params;
    showLoading();
    let prod = [];
    productList.map((i) => {
      i.products.map((e) => {
        prod.push({
          id: e.id,
          qty: e.quantity,
          note: e.note,
        });
      })
    });

    let variables = {
      // type: "BOOKING",
      // courier: { rate_id: 268, use_insurance: false, cod: false, cost: 20000},
      // destinationAddressId: 2,
      courier: {
        rate_id: shippment.rateId,
        cod: false,
        use_insurance: false,
        cost: shippment.price,
      },
      destinationAddressId: address.userAddressIdDestination,
      type: 'BOOKING',
      products: prod,
    };

    console.log(variables, 'variables');

    Client.mutate({mutation: mutationCheckout, variables})
      .then(res => {
        hideLoading();
        console.log(res);
        if (res.data.ecommerceOrderManage && res.data.ecommerceOrderManage.success) {
          console.log('datanya nih', {
            ...res.data.ecommerceOrderManage,
            id: res.data.ecommerceOrderManage.data.bookingId,
            vestaBiller: true,
          });

          alert(res.data.ecommerceOrderManage.message);

          dispatch({
            type: 'BOOKING.ADD_BOOKING',
            data: {
              ...res.data.ecommerceOrderManage.data,
              id: res.data.ecommerceOrderManage.data.bookingId,
              vestaBiller: true,
              finalAmount: res.data.ecommerceOrderManage.data.totalPrice,
            },
          });

          setTimeout(() => {
            navigation.navigate('PaymentScreen', {back: true});
            // navigation.popToTop()
          }, 1000);
        } else if (res.data.ecommerceOrderManage) {
          alert(res.data.ecommerceOrderManage.message);
        } else {
          alert('Gagal Order');
        }
      })
      .catch(reject => {
        hideLoading();
        alert('Gagal Order');
        console.log(reject, 'reject');
      });
  };

  const totalProduct = item => {
    let total = 0;
    if (item) {
      item.forEach((element, index) => {
        total = total + element.price * element['qty'];
      });
      return total;
    }
  };

  return (
    <Scaffold
      header={
        <Header customIcon title="Checkout" type="bold" centerTitle={false} />
      }
      onPressLeftButton={() => navigation.pop()}
      loadingProps={loadingProps}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: Color.semiwhite}}
      >
        <Content
          style={{
            backgroundColor: Color.theme,
            shadowColor: Color.border,
            shadowWidth: 5,
          }}>
          <Row style={{alignItems: 'center'}}>
            <Col alignItems="flex-start">
              <Text size={11} color={Color.text} type="bold">
                Alamat Pengiriman
              </Text>
            </Col>
            <Col alignItems="flex-end">
              <TouchableOpacity
                style={{}}
                onPress={() =>
                  navigation.navigate('FormPayment', {address: address})
                }>
                <Text color={Color.primary} size={10}>
                  {address.address ? 'Ubah Alamat' : 'Tambahkan Alamat'}
                </Text>
              </TouchableOpacity>
            </Col>
          </Row>
          <View
            style={{
              backgroundColor: Color.border,
              height: 1,
              marginVertical: 12,
            }}
          />
          <View style={{alignItems: 'flex-start'}}>
            <Row style={{alignItems: 'center'}}>
              <Fontisto
                name="map-marker-alt"
                color={Color.error}
                size={13}
                style={{marginRight: 6}}
              />
              <Text color={Color.text} type="bold">
                Alamat Saya
              </Text>
            </Row>
            <Text
              color={Color.text}
              size={10}
              style={{marginTop: 8}}
              align="left">
              {address.address
                ? address.address +
                  ' ' +
                  address.postalCode +
                  ', kel. ' +
                  address.area.name +
                  ', kec. ' +
                  address.suburb.name +
                  ', ' +
                  address.city.name +
                  ', provinsi. ' +
                  address.province.name
                : 'Alamat belum tersedia'}
            </Text>
          </View>
        </Content>
        <Content style={{backgroundColor: Color.theme}}>
          {productList.map((item, index) => (
            <>
              {item.name && <Row>
                <Image
                  source={{ uri: item.profileImg }}
                  resizeMode='contain'
                  style={{width: 40, height: 40, marginBottom: 5 }}
                />
                <Col style={{justifyContent: 'center', paddingHorizontal: 10}}>
                  <Text
                    style={{
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 'bold',
                    }}>
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      textAlign: 'left',
                      color: Color.secondary,
                      fontSize: 8,
                      fontWeight: 'normal',
                    }}>
                    {item.alamat}
                  </Text>
                </Col>
              </Row>}
              {item.products.map((val, idx) => (
                <>
                  <Row style={{marginBottom: 10}}>
                    <Image
                      source={{uri: val.imageUrl}}
                      style={{
                        height: 74,
                        width: 74,
                        marginRight: 14,
                        borderRadius: 8,
                      }}
                    />
                    <Col alignItems="flex-start">
                      <Text
                        color={Color.text}
                        size={12}
                        type="bold"
                        align="left">
                        {val.name}
                      </Text>
                      <Text style={{fontSize: 10, color: Color.secondary}}>
                        Jumlah : {val.quantity || val.qty} Buah
                      </Text>
                      <View style={{flex: 1, paddingVertical: 5}}>
                        {/* <Text size={10} color={Color.text} >Harga</Text> */}
                        <Text type="bold" color={Color.text}>
                          {FormatMoney.getFormattedMoney(val.price)}
                        </Text>
                      </View>
                    </Col>
                  </Row>

                  <Row>
                    <TextInput
                      onChangeText={(e) => {
                        let newPrd = [...item.products];
                        newPrd[idx].note = e;

                        let newList = [...productList];
                        newList[index].products = newPrd;

                        setProductList(newList);
                      }}
                      value={val.note}
                      placeholder="Tambahkan catatan untuk penjual"
                      style={{
                        width: '100%',
                        backgroundColor: Color.border,
                        borderRadius: 5,
                        height: 35,
                        fontSize: 10,
                        paddingHorizontal: 30,
                      }}></TextInput>
                    <FontAwesome
                      name={'sticky-note-o'}
                      style={{
                        position: 'absolute',
                        paddingVertical: 11,
                        paddingHorizontal: 10,
                      }}
                    />
                  </Row>

                  <Divider />
                </>
              ))}
            </>
          ))}
          
          <TouchableOpacity
            onPress={() => {
              address.address
                ? navigation.navigate('ListShipping', {
                    item: {...address, product: item.tempData},
                  })
                : alert('Isi alamat terlebih dahulu');
            }}>
            <Row
              style={{
                backgroundColor: Color.theme,
                borderWidth: 1,
                borderColor: Color.border,
                alignItems: 'center',
                padding: 12,
                marginTop: 10,
                borderRadius: 8,
              }}>
              <MaterialCommunityIcons
                name="truck"
                color={Color.text}
                size={18}
              />
              <Text
                color={Color.text}
                type="semiBold"
                style={{marginHorizontal: 10}}>
                {shippment.logisticName
                  ? shippment.logisticName + ' ' + shippment.rateName
                  : 'Pilih Pengiriman'}
              </Text>
              <Col alignItems="flex-end">
                <AntDesign name="right" size={18} color={Color.text} />
              </Col>
            </Row>
          </TouchableOpacity>
        </Content>
        <Content style={{backgroundColor: Color.textInput}}>
          <Row style={{alignItems: 'center'}}>
            <Col alignItems="flex-start">
              <Text color={Color.text} type="bold">
                Subtotal
              </Text>
            </Col>
            <Col alignItems="flex-end">
              <Text color={Color.text} type="bold">
                {FormatMoney.getFormattedMoney(totalProduct(item.tempData))}
              </Text>
            </Col>
          </Row>
          <View
            style={{
              backgroundColor: 'rgba(18, 18, 18, 0.2)',
              height: 1,
              marginVertical: 12,
            }}
          />

          {/* <Row style={{ alignItems: 'center', marginBottom: 8 }}>
                    <Col alignItems='flex-start'>
                        <Text color={Color.secondary} size={10}>Harga (1 Barang)</Text>
                    </Col>
                    <Col alignItems='flex-end'>
                        <Text color={Color.secondary} size={10}>{FormatMoney.getFormattedMoney(item.price)}</Text>
                    </Col>
                </Row> */}
          <Row style={{alignItems: 'center', marginBottom: 8}}>
            <Col alignItems="flex-start">
              <Text color={Color.secondary} size={10}>
                Ongkos Kirim
              </Text>
            </Col>
            <Col alignItems="flex-end">
              <Text color={Color.secondary} size={10}>
                {shippment.price
                  ? FormatMoney.getFormattedMoney(shippment.price)
                  : ''}
              </Text>
            </Col>
          </Row>
          {/* <Row style={{ alignItems: 'center', marginBottom: 8 }}>
                    <Col alignItems='flex-start'>
                        <Text color={Color.secondary} size={10}>Ppn 10%</Text>
                    </Col>
                    <Col alignItems='flex-end'>
                        <Text color={Color.secondary} size={10}>{FormatMoney.getFormattedMoney(totalProduct(item.tempData)*10/100)}</Text>
                    </Col>
                </Row> */}
        </Content>

        {/* hide promo/voucher */}
        {/* <Content
          style={{backgroundColor: Color.theme, borderRadius: 6, height: 65}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('KuponKu')}
            style={{
              borderRadius: 5,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Color.border,
              height: '100%',
            }}>
            <FontAwesome
              name={'ticket'}
              size={15}
              style={{color: Color.info, paddingHorizontal: 10}}
            />
            <Text
              style={{
                color: Color.secondary,
                fontSize: 12,
                textAlign: 'left',
                width: '80%',
              }}>
              Masukkan Promo
            </Text>
            <MaterialIcons
              name={'keyboard-arrow-right'}
              size={28}
              style={{color: Color.secondary}}
            />
          </TouchableOpacity>
        </Content> */}

        {/* <Content>
                <View style={{ backgroundColor: Color.semiwhite, borderRadius: 8, padding: 10}}>
                    <Row style={{ alignItems: 'center' }}>
                        <FontAwesome5 name='ticket-alt' color={Color.text} size={18}   />
                        <Text color={Color.text} type='semiBold' style={{ marginHorizontal: 10 }}>Masukkan Promo</Text>
                        <Col alignItems='flex-end'>
                            <AntDesign name='right' size={18} color={Color.text} />
                        </Col>
                    </Row>
                </View>
            </Content> */}
      </ScrollView>
      <Row style={{padding: 16, backgroundColor: Color.theme}}>
        <Col align="flex-start" justify="center">
          <Text size={10} color={Color.text}>
            Total Harga
          </Text>
          <Text type="bold" color={Color.text} size={18}>
            {FormatMoney.getFormattedMoney(
              totalProduct(item.tempData) +
                (shippment.price ? shippment.price : 0),
            )}
          </Text>
        </Col>
        <Col>
          <TouchableOpacity
            onPress={() => {
              shippment.price
                ? item['tempData'][0]['auctionId'] ? submitAuction() : submit()
                : alert('Pilih Pengiriman terlebih dahulu');
            }}
            style={{
              backgroundColor: Color.primary,
              borderRadius: 30,
              paddingVertical: 10,
            }}>
            <Text type="semibold" color={Color.textInput}>
              Lanjut Bayar
            </Text>
          </TouchableOpacity>
        </Col>
      </Row>
    </Scaffold>
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = (dispatch, props) => ({
  addBooking: data => dispatch({type: 'BOOKING.ADD_BOOKING', data}),
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutScreen);
