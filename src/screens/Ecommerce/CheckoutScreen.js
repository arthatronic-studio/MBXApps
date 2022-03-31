import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, SafeAreaView } from 'react-native';
import Styled from 'styled-components';
import { connect, useDispatch, useStore } from 'react-redux';
import {useIsFocused, useRoute} from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import store from '../../state/redux'
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
import { mutationCheckout, queryCheckout, queryGetAddress, queryGetShipper } from 'src/lib/query/ecommerce';

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


    const dispatch = useDispatch();
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
      const {saveAddress, saveShippment} = route.params
      if(saveAddress) {
            getAddress()
        //   setAddress(saveAddress)
        }else{
            getAddress()
        }
      if(saveShippment) setShipping(saveShippment)
  }, [isFocused]);

  const getAddress = () => {
    showLoading();
    let variables = {
        userId: user.userId,
        page: 1,
        itemPerPage: 1
    }
    console.log(variables)
    Client.query({query: queryGetAddress, variables})
      .then(res => {
        hideLoading()
        console.log(res)
        if(res.data.userAddressList){
            if (res.data.userAddressList.length > 0) {
                setAddress({...res.data.userAddressList[0], userAddressIdDestination: res.data.userAddressList[0]['id']})
            }
        }
       
      })
      .catch(reject => {
        hideLoading()
        console.log(reject.message, 'reject');
      });
  }

  const submit = () => {
    const {saveAddress, saveShippment, item} = route.params
    console.log(route, 'props')
    showLoading();
    const prod = item.tempData.map((val, id) => {
        return{
            id: val.id,
            qty: val.qty
        }
    })
    let variables = {
        // type: "BOOKING",
        // products: [{ id: 17, qty: 1 }],
        // courier: { rate_id: 268, use_insurance: false, cod: false, cost: 20000},
        // destinationAddressId: 2,
        courier: {
            rate_id: shippment.rateId,
            cod: false,
            use_insurance: false,
            cost: shippment.price
        },
        destinationAddressId: address.userAddressIdDestination,
        type: 'BOOKING',
        products: prod
    }
    console.log(variables, 'variables')
    Client.mutate({mutation: mutationCheckout, variables})
      .then(res => {
        hideLoading()
        console.log(res)
        if (res.data.ecommerceOrderManage) {
            console.log('datanya nih',{...res.data.ecommerceOrderManage, id: res.data.ecommerceOrderManage.data.bookingId, vestaBiller: true})
            alert('Success order')
            dispatch({
                type: 'BOOKING.ADD_BOOKING',
                data: {...res.data.ecommerceOrderManage, id: res.data.ecommerceOrderManage.data.bookingId, vestaBiller: true, finalAmount: res.data.ecommerceOrderManage.data.totalPrice}
              });
            
            setTimeout(() => {
                navigation.navigate('PaymentScreen',{back: true})
                // navigation.popToTop()
            }, 1000);
        }
      })
      .catch(reject => {
        hideLoading()
        alert(reject)
        console.log( reject, 'reject');
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
                        <TouchableOpacity style={{ }} onPress={() => navigation.navigate('FormPayment',{address: address}) }>
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
                    <Text color={Color.text} size={10} style={{ marginTop: 8 }} align='left'>{address.address ? address.address+' '+address.postalCode+', kel. '+address.area.name+', kec. '+address.suburb.name+', '+address.city.name+', provinsi. '+address.province.name : 'Alamat belum tersedia'}</Text>
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
                        <Text color={Color.text} type='semiBold' style={{ marginHorizontal: 10 }}>{shippment.logisticName ? shippment.logisticName+' '+shippment.rateName : 'Pilih Pengiriman'}</Text>
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
                        <Text color={Color.text} size={10}>{shippment.price ? FormatMoney.getFormattedMoney(shippment.price) : ''}</Text>
                    </Col>
                </Row>
                <Row style={{ alignItems: 'center', marginBottom: 8 }}>
                    <Col alignItems='flex-start'>
                        <Text color={Color.text} size={10}>Ppn 10%</Text>
                    </Col>
                    <Col alignItems='flex-end'>
                        <Text color={Color.text} size={10}>{FormatMoney.getFormattedMoney(totalProduct(item.tempData)*10/100)}</Text>
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
                <Text type='bold' color={Color.text} size={18} >{FormatMoney.getFormattedMoney(totalProduct(item.tempData)+(totalProduct(item.tempData)*10/100)+(shippment.price ? shippment.price : 0))}</Text>
            </Col>
            <Col>
                <TouchableOpacity onPress={() => {shippment.price ? submit() : alert('Pilih Pengiriman terlebih dahulu')}} style={{ backgroundColor: Color.info, borderRadius: 30, paddingVertical: 10 }}>
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