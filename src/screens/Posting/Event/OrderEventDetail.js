import React, {useState, useEffect, useRef} from 'react';
import {View, Image, FlatList,ScrollView, Platform, Linking, Pressable, Touchable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Header from '@src/components/Header';
import {useLoading, usePopup, useColor, Alert, Row, Col} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {TouchableOpacity, Button} from '@src/components/Button';
import Client from '@src/lib/apollo';
import {queryAddLike} from '@src/lib/query';
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

const Content = styled(View)`
    elevation: 2px
    margin: 1px
    marginBottom: 16px
    borderRadius: 10px
    paddingHorizontal: 10px
    paddingVertical: 16px
    backgroundColor: #fff
   
`;


const DATA = [
  {
    id: 1,
    title: 'PRESALE - Reguler (A)',
    date: '08 Feb 2022',
    refund: 'Bisa Refund',
    reservasi: "Tidak Perlu Reservasi",
    harga: 'Rp 100.000'
  },
  {
    id: 2,
    title: 'PRESALE - Reguler (B)',
    date: '08 Feb 2022',
    refund: 'Bisa Refund',
    reservasi: "Tidak Perlu Reservasi",
    harga: 'Rp 100.000'
  },
  {
    id: 3,
    title: 'PRESALE - VIP (A)',
    date: '08 Feb 2022',
    refund: 'Bisa Refund',
    reservasi: "Tidak Perlu Reservasi",
    harga: 'Rp 100.000'
  },
  {
    id: 4,
    title: 'PRESALE - VIP (A)',
    date: '08 Feb 2022',
    refund: 'Bisa Refund',
    reservasi: "Tidak Perlu Reservasi",
    harga: 'Rp 100.000'
  },
];


const OrderEventDetail = ({navigation, route}) => {
  const {Color} = useColor();
  const items = route.params.item;
  const modalOptionsRef = useRef();
  const user = useSelector(state => state['user.auth'].login.user);
  const dispatch = useDispatch();

  const [im_like, set_im_like] = useState(items.im_like);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const isFocused = useIsFocused();

  useEffect(() => {
    getDetail()
  }, [isFocused]);

    const getDetail = () => {
      // showLoading();
      console.log(items)
      let variables = {
        id: items.id,
      };
      console.log(variables);
      Client.query({query: getDetailOrderEvent, variables})
        .then(res => {
          // hideLoading()
          if(res.data.eventTicketOrderDetail){
            setData(res.data.eventTicketOrderDetail)
          }
          console.log(res);

          setLoading(false);
        })
        .catch(reject => {
          // hideLoading()
          alert(reject.message)
          console.log(reject.message, 'reject');
          setLoading(false);
        });
    };

  const onPayment = () => {
    dispatch({
      type: 'BOOKING.ADD_BOOKING',
      data: {...data, id: data.bookingId, vestaBiller: true, finalAmount: data.totalAmount, invoiceNumber: data.orderNumber},
    });
    navigation.navigate('PaymentScreen', {back: true});
  };

  if(!data) return <View />

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
    >
      {data && <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ padding: 16 }}
      >
        <Content>
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
                    <Text align='right' size={12} color='#111' type='medium'>{moment(data.event.date).format('DD/MMM/YYYY')}</Text>
                </Col>
            </Row>
        </Content>

        <Content>
            <Text align='left' type='bold' style={{ paddingBottom: 13 }}>Detail Produk</Text>
            <View style={{ height: 1, backgroundColor: Color.grayLight, marginHorizontal: -10, marginBottom: 13 }} />
            <View style={{ borderWidth: 1, borderColor: '#CDD1D2', padding: 10, borderRadius: 10 }}>
                <Row>
                    <Image source={{ uri: data.event.images.length == 0 ? '' : data.event.images[0] }} style={{ height: 48, backgroundColor: '#ddd', width: 48, marginRight: 10 }} />
                    <Col>
                        <Text size={14} type='semibold' align='left'>{data.event.name}</Text>
                    </Col>
                </Row>
                <View style={{ height: 1, backgroundColor: Color.grayLight, marginVertical: 15 }} />
                <Row style={{ marginBottom: 4 }}>
                    <Text size={12} type='bold' align='left'>{data.ticket.name}</Text>
                    <Col>
                        <Text size={11} align='right'>{moment(data.event.date).format('DD/MMM/YYYY')}</Text>
                    </Col>
                </Row>
                <Text size={11} align='left'>{data.items.length} Tiket • {data.items.length} Pax</Text>
                <View style={{ height: 1, backgroundColor: Color.grayLight, marginVertical: 15 }} />
                <Row style={{alignItems: 'center', }}>
                    <MaterialCommunityIcons name={'cash-refund'} color={Color.secondary} size={22}/>
                    <Text style={{fontSize: 10, color: Color.secondary, marginHorizontal: 5}}>{data.ticket.refund ? 'Bisa Refund' : 'Tidak Bisa Refund'}</Text>
                    <Divider width={8}/>
                    <AntDesign name='calendar' size={18} color={Color.secondary}/>
                    <Text style={{fontSize: 10, color: Color.secondary, marginHorizontal: 5}}>{data.ticket.reservation ? 'Perlu Reservasi' : 'Tidak Perlu Reservasi'}</Text>
                </Row>
            </View>
        </Content>
        <Content>
            <Text align='left' type='bold' style={{ paddingBottom: 13 }}>Detail Pengunjung</Text>
            <View style={{ height: 1, backgroundColor: Color.grayLight, marginHorizontal: -10, marginBottom: 13 }} />
                {data.items.map((val, id) => (
                  <TouchableOpacity onPress={() => navigation.navigate('MyTicket',{item: data})} style={{ marginBottom: 10 }} key={id}>
                    <Text align='left' type='bold' style={{ marginBottom: 8 }} size={13}>PAX {id+1}</Text>
                    <Row style={{ marginBottom: 8 }}>
                        <Col>
                            <Text size={9} align='left'>Nama Lengkap</Text>
                            <Text type='bold' size={11} align='left'>{val.title}. {val.name}</Text>
                        </Col>
                        <Col>
                            <Text size={9} align='left'>No. telpon</Text>
                            <Text type='bold' size={11} align='left'>{val.phone}</Text>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col>
                            <Text size={9} align='left'>Email</Text>
                            <Text type='bold' size={11} align='left'>{val.email}</Text>
                        </Col>
                        <Col>
                            <Text size={9} align='left'>No. KTP</Text>
                            <Text type='bold' size={11} align='left'>{val.idCardNumber}</Text>
                        </Col>
                    </Row>
                </TouchableOpacity>
                ))}
        </Content>
        <Content>
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
        </Content>

       
        <Divider height={25}/>
      </ScrollView>}
      {data.status == 'OPEN' && <View style={{width: '100%', height: 70, alignItems: 'center', borderRadius: 10}}>
          <TouchableOpacity onPress={() => onPayment()} style={{backgroundColor: Color.primary, width: '90%', height: 45, borderRadius: 50, justifyContent: 'center'}}>
              <Text style={{color: Color.textInput}}>Lanjut</Text>
          </TouchableOpacity>
      </View>}
      
    </Scaffold>
  );
};

export default OrderEventDetail;