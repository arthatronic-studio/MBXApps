import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, SafeAreaView } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;

const CheckoutScreen = ({ navigation, route }) => {
  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const { Color } = useColor();

  
  useEffect(() => {
  }, []);

  return (
    <Scaffold
        header={
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
                        <TouchableOpacity onPress={() => navigation.navigate('FormPayment')}>
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
                    <Text color={Color.text} size={10} style={{ marginTop: 8 }} align='left'>Jl. Kembar Timur I No.11A, Bandung, Jawa Barat, Indonesia 40264</Text>
                </View>
            </Content>
            <Content style={{ backgroundColor: Color.textInput }}>
                <Row style={{ marginBottom: 30 }}>
                    <View style={{ height: 74, width: 74, marginRight: 14, backgroundColor: Color.text, borderRadius: 8 }} />
                    <Col alignItems='flex-start'>
                        <Text color={Color.text} size={14} type='bold' textAlign='left'>Pashmina Pink</Text>
                        <Text color={Color.text} textAlign='left' size={10}>Jumlah : 1 Buah</Text>
                        <View style={{ justifyContent: 'flex-end', flex: 1, alignItems: 'flex-start' }}>
                            <Text size={10} color={Color.text} >Harga</Text>
                            <Text type='bold' color={Color.text}>Rp. 100.000</Text>
                        </View>
                    </Col>
                </Row>
                <Row style={{ backgroundColor: Color.semiwhite, alignItems: 'center', padding: 12, borderRadius: 8 }}>
                    <MaterialCommunityIcons name='truck' color={Color.text} size={18}   />
                    <Text color={Color.text} type='semiBold' style={{ marginHorizontal: 10 }}>Pilih Pengiriman</Text>
                    <Col alignItems='flex-end'>
                        <AntDesign name='right' size={18} color={Color.text} />
                    </Col>
                </Row>
            </Content>
            <Content style={{ backgroundColor: Color.textInput }}>
                <Row style={{ alignItems: 'center' }}>
                    <Col alignItems='flex-start'>
                        <Text color={Color.text} type='bold'>Subtotal</Text>
                    </Col>
                    <Col alignItems='flex-end'>
                        <Text color={Color.text} type='bold'>Rp 176.000</Text>
                    </Col>
                </Row>
                <View style={{ backgroundColor: 'rgba(18, 18, 18, 0.2)', height: 1, marginVertical: 12 }} />

                <Row style={{ alignItems: 'center', marginBottom: 8 }}>
                    <Col alignItems='flex-start'>
                        <Text color={Color.text} size={10}>Harga (1 Barang)</Text>
                    </Col>
                    <Col alignItems='flex-end'>
                        <Text color={Color.text} size={10}>Rp 150.000</Text>
                    </Col>
                </Row>
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

            <Content>
                <View style={{ backgroundColor: Color.semiwhite, borderRadius: 8, padding: 10}}>
                    <Row style={{ alignItems: 'center' }}>
                        <FontAwesome5 name='ticket-alt' color={Color.text} size={18}   />
                        <Text color={Color.text} type='semiBold' style={{ marginHorizontal: 10 }}>Masukkan Promo</Text>
                        <Col alignItems='flex-end'>
                            <AntDesign name='right' size={18} color={Color.text} />
                        </Col>
                    </Row>
                </View>
            </Content>
        </ScrollView>
        <Row style={{ padding: 16 }}>
            <Col align='flex-start' justify='center'>
                <Text size={10} color={Color.text}>Total Harga</Text>
                <Text type='bold' color={Color.text} size={18} >Rp. 160.000</Text>
            </Col>
            <Col>
                <TouchableOpacity onPress={() => navigation.popToTop()} style={{ backgroundColor: Color.info, borderRadius: 30, paddingVertical: 10 }}>
                    <Text type='semibold' color={Color.textInput}>Checkout</Text>
                </TouchableOpacity>
            </Col>
        </Row>
      {/* <Loading {...loadingProps} /> */}
    </Scaffold>
  );
}

export default CheckoutScreen;