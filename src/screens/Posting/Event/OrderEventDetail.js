import React, { useState, useEffect, useRef } from 'react';
import { View, Image, FlatList, ScrollView, Platform, Linking, Pressable, Touchable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Header from '@src/components/Header';
import { useLoading, usePopup, useColor, Alert, Row, Col } from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { TouchableOpacity, Button } from '@src/components/Button';
import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import { Container, Divider, Padding } from 'src/styled';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import ImagesPath from 'src/components/ImagesPath';
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { getDetailEvent, getDetailOrderEvent } from 'src/lib/query/event';
import styled from 'styled-components';
import { FormatMoney } from 'src/utils';
import imageAssets from 'assets/images';
import { postAPI } from 'src/api-rest/httpService';

const Content = styled(View)`
    elevation: 2px
    margin: 1px
    marginBottom: 16px
    borderRadius: 10px
    paddingHorizontal: 10px
    paddingVertical: 16px
    backgroundColor: #fff 
`;

const OrderEventDetail = ({ navigation, route }) => {
  const items = route.params.item;

  const { Color } = useColor();
  const modalOptionsRef = useRef();
  const user = useSelector(state => state['user.auth'].login.user);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(items);
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const isFocused = useIsFocused();

  console.log('data', data);

  const onPayment = async() => {
    showLoading();

    const body = {
      amount: data.total_price,
      id: data.id,
      'product-desc': 'ticket',
    };

    console.log('body', body);

    const result = await postAPI('pay', body);
    console.log('result', result);

    if (result.status && result.paymentResponse && result.paymentResponse.data && result.paymentResponse.data.redirect_url) {
      showLoading('success', result.message, () => {
        navigation.navigate('WebviewPaymentScreen', { sourceURL: result.paymentResponse.data.redirect_url });
      });
    } else {
      showLoading('error', result.message);
    }
  }

  if (!data) return <View />

  return (
    <Scaffold
      fallback={false}
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}
      header={
        <Header
          type="bold"
          centerTitle={false}
          title="Detail Pesanan"
        />
      }
      style={{
        backgroundColor: '#F4F4F4'
      }}
    >
      {data && <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Container padding={16} color={Color.theme}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 40, height: 40, backgroundColor: Color.secondary, borderRadius: 4 }}>
              <Image source={{ uri: data.ticket.event.image }} style={{ width: '100%', height: '100%', borderRadius: 4 }} />
            </View>
            <View style={{ paddingHorizontal: 10, width: '70%' }}>
              <Text numberOfLines={2} align={'left'} style={{ fontWeight: 'bold' }}>{data.ticket.name}</Text>
            </View>
          </View>

          <Divider />

          <Row style={{ alignItems: 'center', width: '100%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={imageAssets.calendar}
                style={{
                  height: 16,
                  width: 16,
                }}
                resizeMode='contain'
              />
              <Text style={{ fontSize: 11, color: Color.secondary, marginHorizontal: 8 }}>{moment(data.selected_date).format('DD/MMM/YYYY')}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={imageAssets.location}
                style={{
                  height: 16,
                  width: 16,
                }}
                resizeMode='contain'
              />
              <Text style={{ fontSize: 11, color: Color.secondary, marginHorizontal: 8 }}>Jakarta</Text>
            </View>
          </Row>
        </Container>

        {/* <Content>
          <Text align='left' type='bold' style={{ paddingBottom: 13 }}>Detail Transaksi</Text>
          <View style={{ height: 1, backgroundColor: Color.grayLight, marginHorizontal: -10, marginBottom: 13 }} />
          <Row style={{ marginBottom: 8 }}>
            <Text type='medium' size={11} align='left' color={Color.textGray}>Status</Text>
            <Col>
              <Text align='right' size={12} color='#558617' type='bold'>{data.status}</Text>
            </Col>
          </Row>
          <Row style={{ marginBottom: 8 }}>
            <Text type='medium' size={11} align='left' color={Color.textGray}>No Recipt</Text>
            <Col>
              <Text align='right' size={12} color='#111' type='medium'>{data.orderNumber}</Text>
            </Col>
          </Row>
          <Row style={{ marginBottom: 8 }}>
            <Text type='medium' size={11} align='left' color={Color.textGray}>Tanggal Transaksi</Text>
            <Col>
              <Text align='right' size={12} color='#111' type='medium'>{moment(data.created_at).format('DD/MMM/YYYY')}</Text>
            </Col>
          </Row>
        </Content> */}

        {/* <Content>
          <Text align='left' type='bold' style={{ paddingBottom: 13 }}>Detail Produk</Text>
          <View style={{ height: 1, backgroundColor: Color.grayLight, marginHorizontal: -10, marginBottom: 13 }} />
          <View style={{ borderWidth: 1, borderColor: '#CDD1D2', padding: 10, borderRadius: 10 }}>
            <Row>
              <Image source={{ uri: '' }} style={{ height: 48, backgroundColor: '#ddd', width: 48, marginRight: 10 }} />
              <Col>
                <Text size={14} type='semibold' align='left'>{data.name}</Text>
              </Col>
            </Row>
            <View style={{ height: 1, backgroundColor: Color.grayLight, marginVertical: 15 }} />
            <Row style={{ marginBottom: 4 }}>
              <Text size={12} type='bold' align='left'>{data.ticket.name}</Text>
              <Col>
                <Text size={11} align='right'>{moment(data.created_at).format('DD/MMM/YYYY')}</Text>
              </Col>
            </Row>
            <Text size={11} align='left'>{data.amount} Tiket • 1 Pax</Text>
            <View style={{ height: 1, backgroundColor: Color.grayLight, marginVertical: 15 }} />
            <Row style={{ alignItems: 'center', }}>
              <MaterialCommunityIcons name={'cash-refund'} color={Color.secondary} size={22} />
              <Text style={{ fontSize: 10, color: Color.secondary, marginHorizontal: 5 }}>{data.ticket.refund ? 'Bisa Refund' : 'Tidak Bisa Refund'}</Text>
              <Divider width={8} />
              <AntDesign name='calendar' size={18} color={Color.secondary} />
              <Text style={{ fontSize: 10, color: Color.secondary, marginHorizontal: 5 }}>{data.ticket.reservation ? 'Perlu Reservasi' : 'Tidak Perlu Reservasi'}</Text>
            </Row>
          </View>
        </Content> */}
        <Container padding={16}>
          <Container padding={16} color={Color.theme} radius={8}>
            {[data.visitor].map((val, id) => (
              <TouchableOpacity
                key={id}
                onPress={() => {
                  // navigation.navigate('MyTicket', { item: data });
                }}
                style={{ marginBottom: 10 }}
              >
                <Text align='left' type='medium' style={{ marginBottom: 8 }}>{val.title === 0 ? "MR" : val === 1 ? "MRS" : "MS"} {val.name}</Text>
                <Row style={{ marginBottom: 24 }}>
                  <Row>
                    <Image
                      source={imageAssets.mail}
                      style={{
                        width: 16,
                        height: 16,
                        resizeMode: 'contain',
                      }}
                    />
                    <Container paddingHorizontal={8}>
                      <Text type='medium' size={11} align='left'>{val.email}</Text>
                    </Container>
                  </Row>
                  <Row>
                    <Image
                      source={imageAssets.call}
                      style={{
                        width: 16,
                        height: 16,
                        resizeMode: 'contain',
                      }}
                    />
                    <Container paddingHorizontal={8}>
                      <Text type='medium' size={11} align='left'>{val.phone}</Text>
                    </Container>
                  </Row>
                </Row>

                <Text type='medium' align='left'>Regular Ticket</Text>
              </TouchableOpacity>
            ))}
          </Container>
        </Container>

        {/* <Content>
          <Text align='left' type='bold' style={{ paddingBottom: 13 }}>Rincian Pembayaran</Text>
          <View style={{ height: 1, backgroundColor: Color.grayLight, marginHorizontal: -10, marginBottom: 13 }} />
          <Row style={{ marginBottom: 8 }}>
            <Text type='medium' size={11} align='left' color={Color.textGray}>Metode Pembayaran</Text>
            <Col>
              <Text align='right' size={12} color='#558617' type='bold'>{data.payment ? data.payment.name : 'Belum dipilih'}</Text>
            </Col>
          </Row>
          <Row style={{ marginBottom: 8 }}>
            <Text type='medium' size={11} align='left' color={Color.textGray}>Subtotal</Text>
            <Col>
              <Text align='right' size={12} color='#111' type='medium'>{FormatMoney.getFormattedMoney(data.price)}</Text>
            </Col>
          </Row>
          {data.discount != 0 && <Row style={{ marginBottom: 8 }}>
            <Text type='medium' size={11} align='left' color={Color.textGray}>Diskon</Text>
            <Col>
              <Text align='right' size={12} color='#111' type='medium'>{FormatMoney.getFormattedMoney(data.discount)}</Text>
            </Col>
          </Row>}
          <Row style={{ marginBottom: 8 }}>
            <Text type='medium' size={11} align='left' color={Color.textGray}>Biaya Administrasi</Text>
            <Col>
              <Text align='right' size={12} color='#111' type='medium'>Rp0</Text>
            </Col>
          </Row>
          <Row style={{ marginBottom: 8 }}>
            <Text type='medium' size={11} align='left' color={Color.textGray}>Total Bayar</Text>
            <Col>
              <Text align='right' size={12} color='#111' type='medium'>{data.totalAmount}</Text>
            </Col>
          </Row>
        </Content> */}
      </ScrollView>}

      {data && data.status === 0 && <View style={{ width: '100%', height: 70, alignItems: 'center', borderRadius: 10 }}>
        <TouchableOpacity
          onPress={() => {
            onPayment();
          }}
          style={{ backgroundColor: Color.primary, width: '90%', height: 45, borderRadius: 50, justifyContent: 'center' }}
        >
          <Text>Lanjut</Text>
        </TouchableOpacity>
      </View>}

    </Scaffold>
  );
};

export default OrderEventDetail;