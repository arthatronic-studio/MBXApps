import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, SafeAreaView } from 'react-native';
import Styled from 'styled-components';
import { connect } from 'react-redux';
import {useIsFocused, useRoute} from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Text,
  // TouchableOpacity,
  Loading, useLoading,
  Scaffold,
  Row, Col,
  HeaderBig,
  useColor,
  Header
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import { FormatMoney } from 'src/utils';
import ImagesPath from 'src/components/ImagesPath';
import { queryCheckout, queryGetShipper } from 'src/lib/query/ecommerce';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    marginBottom: 0px
    padding: 12px
    borderRadius: 8px
`;

const CheckoutScreen = ({ navigation }) => {

    const route = useRoute()
    console.log(route)
    const {item} =  route.params
    const [address, setAddress] = useState({});
    const [shippment, setShipping] = useState({});
    const isFocused = useIsFocused();
  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);
    console.log(user, 'user')
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const { Color } = useColor();

  
  useEffect(() => {
      console.log(route.params, 'address focus')
      const {saveAddress, saveShippment} = route.params
      if(saveAddress) {
          setAddress(saveAddress)
        }
      if(saveShippment) setShipping(saveShippment)
  }, [isFocused]);

  const submit = () => {
    const {saveAddress, saveShippment, item} = route.params
    console.log(route, 'props')
    showLoading();
    let variables = {
        input: {
            courier: {
                cod: false,
                rate_id: 1,
                use_insurance: false
            },
            userAddressIdDestination: 268,
            userAddressIdOrigin: 3,
            payment_type: "postpay",
            product: [{
                id: 3,
                qty:2
            }]
        }
    }
    console.log(variables)
    Client.mutate({mutation: queryCheckout, variables})
      .then(res => {
        hideLoading()
        console.log(res)
        if (res.data.shipperCreateOrder) {
          alert('Success order')
          navigation.popToTop()
        }
      })
      .catch(reject => {
        hideLoading()
        alert(reject.message)
        console.log(reject.message, 'reject');
      });
  };

  const totalProduct = (item) => {
    let total = 0
    if(item){
        item.forEach((element, index) => {
          total = total + (element.price * element['qty'])
        });
        return total
    }
    
  }

  return (
    <Scaffold
        headeor={
            <Header
                customIcon
                title='Checkout'
                type='regular'
                centerTitle={false}
            />
        }
        onPressLeftButton={() => navigation.pop()}
    >

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <Content style={{ backgroundColor: Color.textInput }}>
                <Row style={{ alignItems: 'center' }}>
                    <Col alignItems='flex-start'>
                        <Text size={11} color={Color.text} type='bold'>Alamat Pengiriman</Text>
                    </Col>
                    <Col alignItems='flex-end'>
                        <TouchableOpacity style={{ }} onPress={() => navigation.navigate('FormPayment')}>
                            <Text color={Color.info} size={10}>Ubah Alamat</Text>
                        </TouchableOpacity>
                    </Col>
                </Row>
                <View style={{ backgroundColor: '#rgba(255, 255, 254, 0.2)', height: 2, marginVertical: 12 }} />
                <View style={{ alignItems: 'flex-start' }}>
                    <Row style={{ alignItems: 'center' }}>
                        <Fontisto name='map-marker-alt' color={Color.error} size={13} style={{ marginRight: 6 }} />
                        <Text color={Color.text} type='bold'>Rumah</Text>
                    </Row>
                    <Text color={Color.text} size={10} style={{ marginTop: 8 }} align='left'>{address.address ? address.address : 'Alamat belum tersedia'}</Text>
                </View>
            </Content>
            <Content style={{ backgroundColor: Color.textInput }}>
                {item.tempData.map((val, id) => (
                    <Row style={{ marginBottom: 10 }}>
                        <Image source={{ uri: val.imageUrl }} style={{ height: 74, width: 74, marginRight: 14,  borderRadius: 8 }} />
                        <Col alignItems='flex-start'>
                            <Text color={Color.text} size={14} type='bold' textAlign='left'>{val.name}</Text>
                            <Text color={Color.text} textAlign='left' size={10}>Jumlah : {val.qty} Buah</Text>
                            <View style={{ justifyContent: 'flex-end', flex: 1, alignItems: 'flex-start' }}>
                                <Text size={10} color={Color.text} >Harga</Text>
                                <Text type='bold' color={Color.text}>{FormatMoney.getFormattedMoney(val.price)}</Text>
                            </View>
                        </Col>
                    </Row>
                ))}
                <TouchableOpacity onPress={() => {address.address ? navigation.navigate('ListShipping', {item: {...address, product: item.tempData }}) : alert('Isi alamat terlebih dahulu')}}>
                    <Row style={{ backgroundColor: Color.semiwhite, alignItems: 'center', padding: 12, marginTop: 20, borderRadius: 8 }}>
                        <MaterialCommunityIcons name='truck' color={Color.text} size={18}   />
                        <Text color={Color.text} type='semiBold' style={{ marginHorizontal: 10 }}>{shippment.logistic ? shippment.logistic.name : 'Pilih Pengiriman'}</Text>
                        <Col alignItems='flex-end'>
                            <AntDesign name='right' size={18} color={Color.text} />
                        </Col>
                    </Row>
                </TouchableOpacity>
            </Content>
            <Content style={{ backgroundColor: Color.textInput }}>
                <Row style={{ alignItems: 'center' }}>
                    <Col alignItems='flex-start'>
                        <Text color={Color.text} type='bold'>Subtotal</Text>
                    </Col>
                    <Col alignItems='flex-end'>
                        <Text color={Color.text} type='bold'>{FormatMoney.getFormattedMoney(totalProduct(item.tempData))}</Text>
                    </Col>
                </Row>
                <View style={{ backgroundColor: 'rgba(18, 18, 18, 0.2)', height: 1, marginVertical: 12 }} />

                {/* <Row style={{ alignItems: 'center', marginBottom: 8 }}>
                    <Col alignItems='flex-start'>
                        <Text color={Color.text} size={10}>Harga (1 Barang)</Text>
                    </Col>
                    <Col alignItems='flex-end'>
                        <Text color={Color.text} size={10}>{FormatMoney.getFormattedMoney(item.price)}</Text>
                    </Col>
                </Row> */}
                <Row style={{ alignItems: 'center', marginBottom: 8 }}>
                    <Col alignItems='flex-start'>
                        <Text color={Color.text} size={10}>Ongkos Kirim</Text>
                    </Col>
                    <Col alignItems='flex-end'>
                        <Text color={Color.text} size={10}>Rp 10.000</Text>
                    </Col>
                </Row>
                <Row style={{ alignItems: 'center', marginBottom: 8 }}>
                    <Col alignItems='flex-start'>
                        <Text color={Color.text} size={10}>Ppn 10%</Text>
                    </Col>
                    <Col alignItems='flex-end'>
                        <Text color={Color.text} size={10}>Rp 16.000</Text>
                    </Col>
                </Row>
            </Content>

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
        <Row style={{ padding: 16 }}>
            <Col align='flex-start' justify='center'>
                <Text size={10} color={Color.text}>Total Harga</Text>
                <Text type='bold' color={Color.text} size={18} >{FormatMoney.getFormattedMoney(totalProduct(item.tempData)+10000+16000)}</Text>
            </Col>
            <Col>
                <TouchableOpacity onPress={() => submit()} style={{ backgroundColor: Color.info, borderRadius: 30, paddingVertical: 10 }}>
                    <Text type='semibold' color={Color.textInput}>Checkout</Text>
                </TouchableOpacity>
            </Col>
        </Row>
      <Loading {...loadingProps} />
    </Scaffold>
  );
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch, props) => ({
  addBooking: (data) => dispatch({ type: 'BOOKING.ADD_BOOKING', data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutScreen);