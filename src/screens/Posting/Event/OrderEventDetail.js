import React, { useState, useEffect, useRef } from 'react';
import { View, Image, FlatList, ScrollView, Platform, Linking, Pressable, Touchable, ImageBackground, DeviceEventEmitter, NativeEventEmitter, useWindowDimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Header from '@src/components/Header';
import { useLoading, usePopup, useColor, Alert, Row, Col } from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { useIsFocused, useRoute } from '@react-navigation/native';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
// import Kontakt, { KontaktModule } from 'react-native-kontaktio';
import Modal from 'react-native-modal';

import { TouchableOpacity, Button } from '@src/components/Button';
import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import { Container, Divider, Padding } from 'src/styled';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
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
import ModalQRBottom from 'src/components/Modal/ModalQRBottom';
import { stateUpdateProfile } from 'src/api-rest/stateUpdateProfile';

// const { connect, init, startDiscovery, startScanning, isScanning } = Kontakt;
// const kontaktEmitter = new NativeEventEmitter(KontaktModule);

const OrderEventDetail = ({ navigation, route }) => {
  const items = route.params.item;

  const auth = useSelector(state => state['auth']);
  const localStoragBeacons = useSelector(state => state['beacons']);

  const { Color } = useColor();
  const modalOptionsRef = useRef();
  const dispatch = useDispatch();
  const { height, width } = useWindowDimensions();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(items);
  const [stateListEventUID, setStateListEventUID] = useState([]);
  const [modalEventVerification, setModalEventVerification] = useState({
    show: false,
    item: null,
    errorMessage: '',
  });
  const [isActiveBluetooth, setIsActiveBluetooth] = useState(false);

  const [modalQRIndex, setModalQRIndex] = useState(-1);

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const isFocused = useIsFocused();

  const isCheckin = auth && auth.user && auth.user.isCheckin;

  useEffect(() => {
    if (isCheckin && data.redeemableNow) {
      setModalEventVerification({ ...modalEventVerification, show: true });

      setTimeout(() => {
        onVerifyTicket();
      }, 5000);
    }
  }, []);

  console.log('data.redeemableNow', data.redeemableNow);

  const onVerifyTicket = async () => {
    const body = {
      isDetailPage: true,
      ticket_id: data.id,
    };

    let newItem = null;

    console.log('body', body);

    const result = await postAPI('user-activity/beacons', body);

    console.log('result', result);

    if (result.status) {
      // 1	Mural
      // 2	Gate In
      // 3	Gate Out
      // 4	Area
      // 5	Toko
      // 6	Event

      newItem = result.data;

      let strTypeName = '';
      if (result.beaconType && typeof result.beaconType.name === 'string') {
        strTypeName = result.beaconType.name.toLowerCase();
      }

      console.log(`type: ${strTypeName}, id: , ${result.data.id}`);

      const _isEventType = strTypeName === 'event';
      if (_isEventType) {
        const prof = await stateUpdateProfile();
        console.log('prof', prof);
      }
    }

    setModalEventVerification({ ...modalEventVerification, show: true, item: newItem, errorMessage: result.status ? '' : result.message });
  }

  const onPairingEvent = async () => {
    if (stateListEventUID.length === 0 || modalEventVerification.show) {
      return;
    }

    const body = {
      beacon_uid: stateListEventUID[0],
      beacon_type: 'event',
    };

    console.log('body event pairing', body);
    const result = await postAPI('user-activity', body);
    console.log('result event pairing', result);

    let newItem = null;

    if (result.status) {
      newItem = result.item;
      // console.log('event', result);

      // update profile
      const prof = await stateUpdateProfile();
      console.log('prof', prof);
    }

    setModalEventVerification({ ...modalEventVerification, show: true, item: newItem, errorMessage: result.status ? '' : result.message });
  }

  const onPayment = async () => {
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

  console.log('data', data);

  if (!data) return <View />

  let eventName = '';
  let eventImageUrl = '';

  let ticketName = '';
  let ticketRefund = '';

  let ticketType = '';

  let visitorTitle = '';
  let visitorName = '';
  let visitorEmail = '';
  let visitorIdNumber = '';
  let visitorPhone = '';

  if (data) {
    if (data.ticket) {
      if (data.ticket.name) ticketName = data.ticket.name;
      if (data.ticket.isRefundable) ticketRefund = 'Non-Refundable'; else ticketRefund = 'Refundable';

      if (data.ticket.event) {
        if (data.ticket.event.title) eventName = data.ticket.event.title;
        if (data.ticket.event.image) eventImageUrl = data.ticket.event.image;
      }

      if (data.ticket.type) {
        if (data.ticket.type.text) ticketType = data.ticket.type.text;
      }
    }

    if (data.visitor) {
      if (data.visitor.title_name && data.visitor.title_name.text) visitorTitle = data.visitor.title_name.text;
      if (data.visitor.name) visitorName = data.visitor.name;
      if (data.visitor.email) visitorEmail = data.visitor.email;
      if (data.visitor.ktp) visitorIdNumber = data.visitor.ktp;
      if (data.visitor.phone) visitorPhone = data.visitor.phone;
    }
  }

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
          title="Detail Tiket"
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
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 12, borderWidth: 1, borderColor: Color.text }}>
            <View style={{ width: 40, height: 40, backgroundColor: Color.secondary, borderRadius: 4 }}>
              <Image source={{ uri: eventImageUrl }} style={{ width: '100%', height: '100%', borderRadius: 4 }} />
            </View>
            <View style={{ paddingHorizontal: 10, width: '70%' }}>
              <Text numberOfLines={2} align='left' type='medium'>{eventName}</Text>
              <Divider height={4} />
              <Text align='left' size={10} color={Color.textSoft}>{moment(data.selected_date).format('DD MMM YYYY')}</Text>
            </View>
          </View>

          <Divider height={12} />

          <View style={{ alignItems: 'center', borderWidth: 1, borderColor: Color.text }}>
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 12, borderBottomWidth: 1, borderColor: Color.text }}>
              <View style={{ flex: 1, }}>
                <Text numberOfLines={2} align='left' type='bold'>{ticketName}</Text>
                <Divider height={4} />
                <Text align='left' size={10} color={Color.textSoft}>{ticketRefund}</Text>
              </View>
              <View style={{ backgroundColor: '#D6D6D6', paddingVertical: 5, paddingHorizontal: 9 }}>
                <Text size={12} type='medium'>Regular</Text>
              </View>
            </View>

            <Container paddingTop={12} paddingHorizontal={8} width='100%'>
              <Text align='left' type='medium'>● {ticketType}</Text>
            </Container>

            <Container paddingTop={12} paddingHorizontal={8} width='100%'>
              <Row>
                  <View style={{flex: 1}}>
                    <Text type='medium' size={10} align='left'>Fullname</Text>
                    <Divider height={4} />
                    <Text type='bold' size={14} align='left'>{visitorTitle} {visitorName}</Text>
                  </View>

                  <Divider width={8} />
                  
                  <View style={{flex: 1}}>
                    <Text type='medium' size={10} align='left'>Phone number</Text>
                    <Divider height={4} />
                    <Text type='medium' size={14} align='left'>{visitorPhone}</Text>
                  </View>
              </Row>
            </Container>

            <Container paddingTop={12} paddingHorizontal={8} width='100%'>
              <Row>
                  <View style={{flex: 1}}>
                    <Text type='medium' size={10} align='left'>Email</Text>
                    <Divider height={4} />
                    <Text type='medium' size={14} align='left'>{visitorEmail}</Text>
                  </View>

                  <Divider width={8} />

                  <View style={{flex: 1}}>
                    <Text type='medium' size={10} align='left'>ID Type</Text>
                    <Divider height={4} />
                    <Text type='medium' size={14} align='left'>KTP</Text>
                  </View>
              </Row>
            </Container>

            <Container paddingVertical={12} paddingHorizontal={8} width='100%'>
              <Row>
                  <View style={{flex: 1}}>
                    <Text type='medium' size={10} align='left'>ID Number</Text>
                    <Divider height={4} />
                    <Text type='medium' size={14} align='left'>{visitorIdNumber}</Text>
                  </View>

                  <Divider width={8} />
                  
                  <View style={{flex: 1}}>
                    
                  </View>
              </Row>
            </Container>

            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 12, borderTopWidth: 1, borderColor: Color.text }}>
              <View style={{ flex: 1, }}>
                
              </View>
              
              <TouchableOpacity
                onPress={() => {
                  setModalQRIndex(1);
                }}
                style={{ flexDirection: 'row', alignItems: 'center', padding: 9, backgroundColor: Color.text }}
              >
                <Text size={12} type='medium' align='left' color={Color.textInput}>Show QR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Container>
      </ScrollView>}

      {data && data.status === 0 && <Container padding={16}>
        <Button
          onPress={() => {
            onPayment();
          }}
        >
          Continue Payment
        </Button>
      </Container>}

      {/* modal qr */}
      <ModalQRBottom
        visible={modalQRIndex !== -1}
        value={data.qrValue}
        labelTitle='QR Ticket'
        labelCaption={`${visitorTitle} ${visitorName}`}
        labelDetail={`${ticketType} • ${data.invoice_id}`}
        onClose={() => {
          setModalQRIndex(-1);
        }}
      />

      {/* modal event */}
      <Modal
        isVisible={isCheckin && modalEventVerification.show}
        onBackdropPress={() => {

        }}
        animationIn="slideInDown"
        animationOut="slideOutDown"
        backdropColor={Color.semiwhite}>
        <View
          style={{ width: '100%', borderRadius: 16, backgroundColor: Color.theme, }}
        >
          {/* loading */}
          {modalEventVerification.item ?
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 16,
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                }}
              >
                <View style={{ flexDirection: 'row', backgroundColor: Color.successLight, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 120, alignItems: 'center' }}>
                  <Container width={14} height={14} radius={14} align='center' justify='center' color={Color.success}>
                    <Entypo name='check' size={8} color={Color.textInput} />
                  </Container>
                  <Divider width={8} />
                  <Text size={12} color={Color.success}>Verifikasi Berhasil</Text>
                </View>
                <Divider />
                <View
                  style={{
                    width: '100%',
                    aspectRatio: 16 / 9,
                  }}
                >
                  <Image
                    source={{ uri: 'https://anekatempatwisata.com/wp-content/uploads/2022/04/M-Bloc-Space.jpg' }}
                    style={{
                      height: '100%',
                      width: '100%',
                      borderRadius: 8,
                    }}
                  />
                </View>
              </View>

              <Container paddingTop={16}>
                <Text>Selamat datang di</Text>
                <Text size={16} type='medium'>EVENT</Text>
              </Container>

              <Container width='100%' paddingTop={16}>
                <Button
                  outline
                  color={Color.primaryMoreDark}
                  onPress={() => {
                    setModalEventVerification({
                      ...modalEventVerification,
                      show: false,
                    });
                  }}
                >
                  Tutup
                </Button>
              </Container>
            </View>
            : modalEventVerification.errorMessage !== '' ?
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: width / 7,
                    height: width / 7,
                    backgroundColor: Color.error,
                    borderRadius: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Entypo name={'cross'} size={36} color={Color.textInput} />
                </View>

                <Container paddingTop={16}>
                  <Text size={16} type='medium'>Verifikasi Gagal</Text>
                  {/* <Text size={11}>Nampaknya terjadi kesalahan. Lakukan verifikasi beberapa saat lagi</Text> */}
                  <Text size={11}>{modalEventVerification.errorMessage}</Text>
                </Container>

                <Container width='100%' paddingTop={16}>
                  <Button
                    outline
                    color={Color.primaryMoreDark}
                    onPress={() => {
                      setModalEventVerification({
                        ...modalEventVerification,
                        show: false,
                      });
                    }}
                  >
                    Tutup
                  </Button>
                </Container>
              </View>
              :
              <View
                style={{
                  padding: 32,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    height: height / 6,
                    aspectRatio: 4 / 3,
                    marginBottom: 24,
                  }}
                >
                  <Image
                    source={imageAssets.eventVerification}
                    style={{
                      height: '100%',
                      width: '100%',
                      resizeMode: 'contain'
                    }}
                  />
                </View>

                <View
                  style={{
                    alignItems: 'center',
                  }}
                >
                  <Text size={16} letterSpacing={0.15} type='medium'>Kamu ada di area event</Text>
                  <Divider height={4} />
                  <Text color={Color.placeholder}>Tunggu sebentar kami sedang melakukan verifikasi . . . </Text>
                </View>
              </View>
          }
        </View>
      </Modal>
    </Scaffold>
  );
};

export default OrderEventDetail;