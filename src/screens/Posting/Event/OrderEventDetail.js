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
import Kontakt, { KontaktModule } from 'react-native-kontaktio';
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

const Content = styled(View)`
    elevation: 2px
    margin: 1px
    marginBottom: 16px
    borderRadius: 10px
    paddingHorizontal: 10px
    paddingVertical: 16px
    backgroundColor: #fff 
`;

const { connect, init, startDiscovery, startScanning, isScanning } = Kontakt;
const kontaktEmitter = new NativeEventEmitter(KontaktModule);

const OrderEventDetail = ({ navigation, route }) => {
  const items = route.params.item;

  const auth = useSelector(state => state['auth']);
  const localStoragBeacons = useSelector(state => state['beacons']);

  const { Color } = useColor();
  const modalOptionsRef = useRef();
  const dispatch = useDispatch();
  const {height, width} = useWindowDimensions();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(items);
  const [stateListEventUID, setStateListEventUID] = useState([]);
  const [modalEventVerification, setModalEventVerification] = useState({
    show: false,
    error: true,
    item: null,
  });
  const [isActiveBluetooth, setIsActiveBluetooth] = useState(false);

  const [modalQRIndex, setModalQRIndex] = useState(-1);

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const isFocused = useIsFocused();

  const isCheckin = auth && auth.user && auth.user.isCheckin;

  useEffect(() => {
    initialConfig();

    BluetoothStateManager.onStateChange((bluetoothState) => {
      console.log('bluetoothState', bluetoothState);
      if (bluetoothState === 'PoweredOn') {
        setIsActiveBluetooth(true);
      } else {
        setIsActiveBluetooth(false);
      }
    }, true);
  }, []);

  const initialConfig = async () => {
    if (Platform.OS === 'android' && Platform.Version < 31) {
      await BluetoothStateManager.requestToEnable();
    }
  }

  useEffect(() => {
    beaconSetup();
  }, [isActiveBluetooth]);

  useEffect(() => {
    if (isCheckin && stateListEventUID.length > 0) {
      setModalEventVerification({ ...modalEventVerification, show: true });
    }
  }, [isCheckin, stateListEventUID]);

  useEffect(() => {
    const timeout = isFocused ?
      setTimeout(() => {
        onPairingEvent();
      }, 3000)
      : null;

    return () => {
      clearTimeout(timeout);
    }
  }, [isCheckin, isFocused, stateListEventUID]);

  const beaconSetup = async () => {
    console.log('beaconSetup');
    if (Platform.OS === 'android') {
      // Android
      // const granted = await requestLocationPermission();

      // if (granted) {
      await connect();
      await startScanning();
      // } else {
      //   Alert.alert(
      //     'Permission error',
      //     'Location permission not granted. Cannot scan for beacons',
      //     [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      //     {cancelable: false},
      //   );
      // }
    } else {
      // iOS
      await init();
      await startDiscovery();
    }

    // Add beacon listener
    if (Platform.OS === 'android') {
      DeviceEventEmitter.addListener('beaconDidAppear', ({ beacons, region }) => {
        console.log('beaconDidAppear', beacons);
      });

      DeviceEventEmitter.addListener('beaconsDidUpdate', ({ beacons, region }) => {
        // console.log('beaconsDidUpdate', beacons, region);
        // console.log('beaconsDidUpdate', beacons);

        if (Array.isArray(beacons)) {
          let newEventUID = [];

          beacons.map((e, i) => {
            // console.log('full info beacon', e);

            const strength = 4;
            const rumusRSSI = ((-69 - (e.rssi)) / (10 * strength));
            const productRange = Math.pow(10, rumusRSSI) * 100;

            const rangeForCompare = productRange - 50;

            const isEventType = localStoragBeacons.listEventUID.indexOf(e.address);

            // type beacon yang masuk kondisi checkin (harus checkin dulu)
            if (isCheckin) {
              if (isEventType !== -1 && rangeForCompare < localStoragBeacons.listEventRange[isEventType]) {
                newEventUID.push(e.address);
              }
            }
          });

          setStateListEventUID(newEventUID);
        }
      });

      DeviceEventEmitter.addListener('beaconDidDisappear', ({ beacons, region }) => {
        console.log('beaconDidDisappear', beacons, region);
        // klo beacon ilang
      });
    } else {
      kontaktEmitter.addListener('didDiscoverDevices', ({ beacons }) => {
        console.log('didDiscoverDevices', beacons);
      });
    }
  };

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
      newItem = result.status;
      // console.log('event', result);

      // update profile
      const prof = await stateUpdateProfile();
      console.log('prof', prof);
    }

    setModalEventVerification({ ...modalEventVerification, show: true, item: newItem, error: !result.status });
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

        {data.visitor && <Container padding={16}>
          {[data.visitor].map((val, id) => (
            <TouchableOpacity
              key={id}
              onPress={() => {
                // navigation.navigate('MyTicket', { item: data });
              }}
              style={{ width: '100%', aspectRatio: 2.6/1, marginBottom: 10 }}
            >
              <ImageBackground
                source={imageAssets.voucherSubtract}
                imageStyle={{
                  borderRadius: 8,
                }}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <Container padding={10} justify='space-between' height='100%'>
                  <Container>
                    <Container marginBottom={8}>
                      <Text align='left' type='medium'>{val.title === 0 ? "Mr." : val === 1 ? "Mrs." : "Ms."} {val.name}</Text>
                    </Container>
                    <Row>
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
                  </Container>

                  <Container>
                    <Row style={{justifyContent: 'space-between', alignItems: 'center'}}>
                      <Text type='medium' align='left'>Regular Ticket</Text>

                      <TouchableOpacity
                        onPress={() => {
                          setModalQRIndex(id);
                        }}
                        style={{flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 120, borderWidth: 0.5, borderColor: Color.text}}
                      >
                        <Image
                          source={imageAssets.qr}
                          style={{
                            width: 15,
                            height: 15,
                            marginRight: 8,
                          }}
                        />
                        <Text size={12} type='medium' align='left' color={Color.primaryDark}>QR Code</Text>
                      </TouchableOpacity>
                    </Row>
                  </Container>
                </Container>
              </ImageBackground>

              <ModalQRBottom
                visible={modalQRIndex !== -1}
                value={data.qrValue}
                labelTitle='QR Ticket'
                labelCaption={`${val.title_name.text} ${val.name}`}
                labelDetail={`Regular • ${data.invoice_id}`}
                onClose={() => {
                  setModalQRIndex(-1);
                }}
              />
            </TouchableOpacity>
          ))}
        </Container>}

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

      {data && data.status === 0 && <Container paddingHorizontal={16}>
        <Button
          onPress={() => {
            onPayment();
          }}
        >
          Lanjut
        </Button>
      </Container>}
      
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
                  aspectRatio: 16/9,
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
          : modalEventVerification.error ?
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
                <Text size={11}>Nampaknya terjadi kesalahan. Lakukan verifikasi beberapa saat lagi</Text>
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