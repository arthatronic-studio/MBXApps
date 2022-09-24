import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  useWindowDimensions,
  Animated,
  RefreshControl,
  Platform,
  NativeEventEmitter,
  ActivityIndicator,
  NativeModules,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from '@react-navigation/native';
import Modal from 'react-native-modal';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import BleManager from 'react-native-ble-manager';

import ImagesPath from 'src/components/ImagesPath';
import {
  Text,
  TouchableOpacity,
  HeaderBig,
  useColor,
  Scaffold,
  Button,
  Submit,
  useLoading,
  Alert,
} from '@src/components';
import { Divider, Circle, Container, Row, Column } from '@src/styled';
import Banner from 'src/components/Banner';
import ModalPosting from './ModalPosting';
import imageAssets from 'assets/images';
import WidgetHomeMenuStatic from './WidgetHomeMenuStatic';
import { getAPI, postAPI } from 'src/api-rest/httpService';
import HighlightEvent from 'src/components/Event/HighlightEvent';
import { stateUpdateProfile } from 'src/api-rest/stateUpdateProfile';
import HighlightTenant from 'src/components/Tenant/HighlightTenant';
import { stateBeaconSetting } from 'src/api-rest/stateBeaconSetting';
import { androidBluetoothPermission } from 'src/lib/androidPermissions';
import { shadowStyle } from 'src/styles';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const scanTimeout = 7;

let tempShowPopupAds = true;

const MainHome = ({ navigation, route }) => {
  const auth = useSelector(state => state['auth']);
  const localStoragBeacons = useSelector(state => state['beacons']);
  const localStoragSetting = useSelector(state => state['setting']);

  const [loadingBanner, setLoadingBanner] = useState(true);
  const [listBanner, setListBanner] = useState([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [animationValue] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();
  const { Color } = useColor();
  const isFocused = useIsFocused();
  const modalPostingRef = useRef();
  const { width, height } = useWindowDimensions();
  const [loadingProps, showLoading, hideLoading] = useLoading();

  const peripherals = new Map();
  const [listPeripheral, setListPeripheral] = useState([]);

  const [stateListCheckinUID, setStateListCheckinUID] = useState([]);
  const [stateListMerchUID, setStateListMerchUID] = useState([]);
  const [stateListArtUID, setStateListArtUID] = useState([]);
  const [stateListEventUID, setStateListEventUID] = useState([]);
  const [stateListOtherUID, setStateListOtherUID] = useState([]);
  const [stateListOtherType, setStateListOtherType] = useState([]);

  const [listMerchantType, setListMerchantType] = useState([]);

  const [tempAlreadyPairing, setTempAlreadyPairing] = useState([]);

  const [isActiveBluetooth, setIsActiveBluetooth] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalFloatingBeacon, setModalFloatingBeacon] = useState(true);
  const [modalSuccessCheckin, setModalSuccessCheckin] = useState(false);
  const [modalNeedUpdateProfile, setModalNeedUpdateProfile] = useState(false);
  const [modalEventVerification, setModalEventVerification] = useState({
    show: false,
    error: true,
    item: null,
  });
  const [beaconScanning, setBeaconScanning] = useState(true);

  const isCheckin = auth && auth.user && auth.user.isCheckin;
  const isSecurity = auth && auth.user && auth.user.role && auth.user.role.value === 0;
  const showDebug = localStoragSetting && localStoragSetting.showDebug ? true : false;

  useEffect(() => {
    BluetoothStateManager.onStateChange((bluetoothState) => {
      console.log('bluetoothState', bluetoothState);
      if (bluetoothState === 'PoweredOn') {
        setIsActiveBluetooth(true);
      } else {
        setIsActiveBluetooth(false);
      }
    }, true);
  }, []);

  useEffect(() => {
    const timeout = listPeripheral.length > 0 ?
      setTimeout(() => {
        remapBeacon(listPeripheral);
      }, 500) : null;

    return () => {
      clearTimeout(timeout);
    }
  }, [listPeripheral]);

  useEffect(() => {
    const timeout = !beaconScanning ?
      setTimeout(() => {
        console.log('scannn kale');
        // BleManager.scan([], scanTimeout, true).then(() => {
        //   setBeaconScanning(true);
        // });
      }, 6000) : null;

    return () => {
      clearTimeout(timeout);
    }
  }, [beaconScanning]);

  useEffect(() => {
    initialConfig();
    beaconSetup();
  }, []);

  console.log('listPeripheral', listPeripheral);

  const beaconSetup = async() => {
    const permissionAndroidStatus = await androidBluetoothPermission();

    console.log('status aaa', permissionAndroidStatus);

    if (permissionAndroidStatus) {
      await BleManager.start({ showAlert: false });
      await BleManager.scan([], scanTimeout, true);
      setBeaconScanning(true);
    }

    bleManagerEmitter.addListener("BleManagerDiscoverPeripheral", (args) => {
      peripherals.set(args.id, args);
      const beacons = Array.from(peripherals.values());
      // console.log('beacons per', beacons);
      setListPeripheral(beacons);
    });

    bleManagerEmitter.addListener('BleManagerStopScan', () => {
      setBeaconScanning(false);
    });
  }

  const initialConfig = async () => {
    if (Platform.OS === 'android' && Platform.Version < 31) {
      await BluetoothStateManager.requestToEnable();
    }

    const prof = await stateUpdateProfile();
    console.log('prof', prof);
  }

  // effect pairing art
  useEffect(() => {
    const timeout = setTimeout(() => {
      onPairingCheckin();
    }, 3000)

    return () => {
      clearTimeout(timeout);
    }
  }, [isFocused, isCheckin, stateListCheckinUID]);

  // effect pairing art
  useEffect(() => {
    const timeout = setTimeout(() => {
      onPairingArt();
    }, 3000);

    return () => {
      clearTimeout(timeout);
    }
  }, [isFocused, isCheckin, stateListArtUID]);

  // pairing pairing merchant
  useEffect(() => {
    const timeout = setTimeout(() => {
      onPairingMerchant();
    }, 3000);

    return () => {
      clearTimeout(timeout);
    }
  }, [isFocused, isCheckin, stateListMerchUID]);

  // effect pairing other
  useEffect(() => {
    const timeout = setTimeout(() => {
      onPairingOther();
    }, 10000);

    return () => {
      clearTimeout(timeout);
    }
  }, [isFocused, isCheckin, stateListOtherUID]);

  const remapBeacon = (beacons) => {
    console.log('xxx beacons', beacons);
    if (Array.isArray(beacons)) {
      let newCheckinUID = [];
      let newMerchUID = [];
      let newArtUID = [];
      let newEventUID = [];
      let newOtherUID = [];
      let newOtherType = [];

      beacons.map((e, i) => {
        // console.log('full info beacon', e);

        const productId = e.id;
        const strength = 4;
        const rumusRSSI = ((-69 - (e.rssi)) / (10 * strength));
        const productRange = Math.pow(10, rumusRSSI) * 100;
        const rangeForCompare = productRange - 50;

        const isCheckinType = localStoragBeacons.listCheckinUID.indexOf(productId);
        const isMerchType = localStoragBeacons.listMerchUID.indexOf(productId);
        const isArtType = localStoragBeacons.listArtUID.indexOf(productId);
        const isEventType = localStoragBeacons.listEventUID.indexOf(productId);
        const isOtherType = localStoragBeacons.listOtherUID.indexOf(productId);

        // type beacon yang masuk kondisi checkin (harus checkin dulu)
        // if (isCheckin) {
          if (isMerchType !== -1 && rangeForCompare < localStoragBeacons.listMerchRange[isMerchType]) {
            newMerchUID.push(productId);
          }

          if (isArtType !== -1 && rangeForCompare < localStoragBeacons.listArtRange[isArtType]) {
            newArtUID.push(productId);
          }

          if (isEventType !== -1 && rangeForCompare < localStoragBeacons.listEventRange[isEventType]) {
            newEventUID.push(productId);
          }

          if (isOtherType !== -1 && rangeForCompare < localStoragBeacons.listOtherRange[isOtherType]) {
            newOtherUID.push(productId);
            newOtherType.push(localStoragBeacons.listOtherType[isOtherType]);
          }
        // }
        // type beacon yang masuk kondisi non checkin
        // else {
          if (isCheckinType !== -1 && rangeForCompare < localStoragBeacons.listCheckinRange[isCheckinType]) {
            newCheckinUID.push(productId);
          }
        // }
      });

      setStateListCheckinUID(newCheckinUID);
      setStateListMerchUID(newMerchUID);
      setStateListArtUID(newArtUID);
      setStateListEventUID(newEventUID);
      setStateListOtherUID(newOtherUID);
      setStateListOtherType(newOtherType);
    }
  }

  const onPairingCheckin = async () => {
    if (!isFocused) {
      return;
    }

    if (isCheckin) {
      return;
    }
    
    if (stateListCheckinUID.length === 0) {
      return;
    }

    if (auth && auth.user && !auth.user.isRegistered) {
      setModalNeedUpdateProfile(true);
    }

    const body = {
      beacon_uid: stateListCheckinUID[0],
      beacon_type: 'checkin',
    };

    console.log('body', body);

    const result = await postAPI('user-activity', body);

    console.log('result checkin', result);

    if (result.status) {
      dispatch({ type: 'AUTH.SET_CHECKIN', data: result.data });

      setModalSuccessCheckin(true);

      const prof = await stateUpdateProfile();
    }
    // ios freeze
    // showLoading(result.status ? 'success' : 'error', result.message);
  }

  const onPairingMerchant = async () => {
    if (!isFocused) {
      return;
    }

    if (!isCheckin) {
      return;
    }

    if (stateListMerchUID.length === 0) {
      return;
    }

    let newTemp = [...tempAlreadyPairing];
    let newListMerchant = [];

    await Promise.all(
      stateListMerchUID.map(async (uid, idx) => {
        if (tempAlreadyPairing.includes(uid)) {

        } else {
          const body = {
            beacon_uid: uid,
            beacon_type: 'merch',
          };
    
          console.log('body merch pairing', body);

          const result = await postAPI('user-activity', body);

          console.log('result merch pairing', result);

          if (result.status) {
            newListMerchant.push(result.data);
            newTemp.push(uid);
          }
        }
      })
    );

    setListMerchantType(newListMerchant);
    setTempAlreadyPairing(newTemp);
  }

  const onPairingArt = async () => {
    if (!isFocused) {
      return;
    }

    if (!isCheckin) {
      return;
    }

    if (listMerchantType.length > 0) {
      return;
    }

    if (stateListArtUID.length === 0) {
      return;
    }
    
    if (tempAlreadyPairing.includes(stateListArtUID[0])) {
      return;
    }

    const body = {
      beacon_uid: stateListArtUID[0],
      beacon_type: 'art',
    };

    console.log('body art pairing', body);
    const result = await postAPI('user-activity', body);
    console.log('result art pairing', result);

    if (result.status) {
      navigation.navigate('DetailArtScreen', { item: result.data });
    }

    let newTemp = [...tempAlreadyPairing];
    newTemp.push(stateListArtUID[0]);
    setTempAlreadyPairing(newTemp);
  }

  const onPairingOther = async () => {
    if (!isFocused) {
      return;
    }

    if (!isCheckin) {
      return;
    }

    if (stateListOtherUID.length === 0) {
      return;
    }

    let newArr = [...tempAlreadyPairing];

    await Promise.all(
      stateListOtherUID.map(async (uid, idx) => {  
        if (tempAlreadyPairing.includes(uid)) {
          console.log('tempAlreadyPairing', tempAlreadyPairing);
        } else {
          const body = {
            beacon_uid: uid,
            beacon_type: stateListOtherType[idx],
          };

          newArr.push(uid);
  
          console.log('body other pairing', body);
  
          const result = await postAPI('user-activity', body);
          console.log('result other pairing', body, result);
        }
      })
    )

    setTempAlreadyPairing(newArr);
  }

  const onCheckout = async (uuid) => {
    const body = {
      beacon_uid: 'D5:60:C9:67:6F:70',
      beacon_type: 'checkout',
    };

    const result = await postAPI('user-activity', body);

    console.log('result checkout', result);

    if (result.status) {
      dispatch({ type: 'AUTH.SET_CHECKIN', data: null });

      const prof = await stateUpdateProfile();
      console.log('prof', prof);

      showLoading('success', result.message);
    } else {
      showLoading('error', result.message);
    }
  }

  useEffect(() => {
    if (isFocused) {
      dispatch({ type: 'BOOKING.CLEAR_BOOKING' });
      fetchBannerList();
      fetchData();
    }
  }, [isFocused]);

  const fetchBannerList = async () => {
    const result = await getAPI('banner');

    console.log('result banner', result);

    let newArr = [];
    if (result.status) {
      result.data.map((e) => {
        newArr.push({
          ...e,
          image: e.file,
        })
      })
    }
    setListBanner(newArr);
    setLoadingBanner(false);
  };

  const fetchData = async () => {
    const result = await getAPI('user-activity');
    console.log('user-activity', result);
    if (result.status) {
      setVisitorCount(result.data.totalPengunjung);
    }
  };

  const onRefresh = async() => {
    setRefreshing(true);

    setTempAlreadyPairing([]);
    await stateBeaconSetting();
    androidBluetoothPermission().then((status) => {
      console.log('status bluetooth', status);
      if (status) {
        BleManager.scan([], scanTimeout, true).then(() => {
          setBeaconScanning(true);
        });
      }
    })

    setRefreshing(false);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const onClickBaca = () => {
    setIsModalVisible(!isModalVisible);
    navigation.navigate('PDFReaderScreen', {
      file: 'http://samples.leanpub.com/thereactnativebook-sample.pdf',
    });
  };

  const renderDebug = () => {
    return (
      <>
        <View>
          <Text>Beacon Checkin</Text>
          {stateListCheckinUID.map((i, idx) => {
            return (
              <View key={idx} style={{ width: '100%', marginBottom: 4, backgroundColor: Color.primarySoft }}>
                <Text size={12} aling='left'>{i}</Text>
              </View>
            )
          })}
        </View>

        <Divider />

        <View>
          <Text>Beacon Merch</Text>
          {stateListMerchUID.map((i, idx) => {
            return (
              <View key={idx} style={{ width: '100%', marginBottom: 4, backgroundColor: Color.primarySoft }}>
                <Text size={12} aling='left'>{i}</Text>
              </View>
            )
          })}
        </View>

        <Divider />

        <View>
          <Text>Beacon Art</Text>
          {stateListArtUID.map((i, idx) => {
            return (
              <View key={idx} style={{ width: '100%', marginBottom: 4, backgroundColor: Color.primarySoft }}>
                <Text size={12} aling='left'>{i}</Text>
              </View>
            )
          })}
        </View>

        <Divider />

        <View>
          <Text>Beacon Event</Text>
          {stateListEventUID.map((i, idx) => {
            return (
              <View key={idx} style={{ width: '100%', marginBottom: 4, backgroundColor: Color.primarySoft }}>
                <Text size={12} aling='left'>{i}</Text>
              </View>
            )
          })}
        </View>

        <Divider />

        <View>
          <Text>Beacon Other</Text>
          {stateListOtherUID.map((i, idx) => {
            return (
              <View key={idx} style={{ width: '100%', marginBottom: 4, backgroundColor: Color.primarySoft }}>
                <Text size={12} aling='left'>{i}</Text>
              </View>
            )
          })}
        </View>
      </>
    )
  }

  const spaceContentSize = 8;

  // console.log('beaconScanning', beaconScanning);
  // console.log('localStoragBeacons', localStoragBeacons);
  // console.log('listMerchantType', listMerchantType);
  // console.log('stateListMerchUID', stateListMerchUID);
  // console.log('stateListEventUID', stateListEventUID);
  // console.log('stateListArtUID', stateListArtUID);
  // console.log('stateListCheckinUID', stateListCheckinUID);
  // console.log('stateListOtherUID', stateListOtherUID);

  return (
    <Scaffold
      translucent={Platform.OS === 'ios' ? true : false}
      useSafeArea={Platform.OS === 'ios' ? false : true}
      statusBarColor={Color.theme}
      loadingProps={loadingProps}
      header={
        <HeaderBig
          type='MAIN_HOME'
          style={{
            paddingTop: 8,
          }}
          actions={
            <View style={{ flexDirection: 'row' }}>
              {/* <TouchableOpacity
                onPress={() => {
                  navigation.navigate('NotificationScreen');
                }}
                style={{
                  width: '20%',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-end',
                }}>
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color={Color.textButtonInline}
                />
                {notificationCount > 0 && (
                  <Circle
                    size={12}
                    color={Color.error}
                    style={{ position: 'absolute', top: -4, right: -4 }}>
                    <Text size={8} color={Color.textButtonInline}>
                      {notificationCount > 99 ? '99' : notificationCount}
                    </Text>
                  </Circle>
                )}
              </TouchableOpacity> */}

              {/* <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Chat');
                }}
                style={{
                  width: '20%',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-end',
                }}>
                <Ionicons name="chatbox-outline" size={22} color={Color.textButtonInline} />
                {chatNotifCount > 0 && (
                  <Circle
                    size={12}
                    color={Color.error}
                    style={{ position: 'absolute', top: -4, right: -4 }}>
                    <Text size={8} color={Color.textButtonInline}>
                      {chatNotifCount > 99 ? '99' : chatNotifCount}
                    </Text>
                  </Circle>
                )}
              </TouchableOpacity> */}

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('EventHistory');
                }}
                style={{
                  width: '20%',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-end',
                }}>
                <Image
                  source={imageAssets.ticket}
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: Color.text,
                  }}
                />
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={() => {
                  navigation.navigate('MainProfile');
                }}
                style={{
                  width: '20%',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-end',
                }}>
                <Image
                  source={imageAssets.profile}
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: Color.text,
                  }}
                />
              </TouchableOpacity> */}
            </View>
          }
        />
      }
      floatingActionButton={
        isSecurity && <View
          style={{
            bottom: -16,
            height: width / 5 - 8,
            width: width / 5 - 8,
            borderRadius: width / 5 - 8,
            backgroundColor: Color.primary,
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: Color.textButtonInline,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ScanQRScreen');
            }}
            style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
          >
            <MaterialIcons
              name='qr-code-2'
              color={Color.textButtonInline}
              size={38}
            />
          </TouchableOpacity>
        </View>
      }
    >
      <ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: animationValue },
              },
            },
          ],
          { useNativeDriver: false },
        )}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Container color={Color.theme} paddingTop={8} paddingBottom={8}>
          <Animated.View
            style={{
              width,
              height: width / 3,
              position: 'absolute',
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
            }}
          />

          {/* hide user greetings */}
          {/* <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              paddingTop: 16,
              paddingBottom: 24,
            }}>
            <View style={{paddingLeft: 16, alignItems: 'flex-start'}}>
              <Text
                size={10}
                type="medium"
                lineHeight={18}
                letterSpacing={0.45}>
                Halo
              </Text>
              <Text size={18} type="bold" letterSpacing={0.45}>
                {user && !user.guest
                  ? user.firstName.trim() +
                    (user.lastName ? ' ' + user.lastName.trim() : '')
                  : 'Tamu'}
                !
              </Text>
            </View>
          </View> */}

          {isCheckin &&
            <Container padding={16} paddingTop={8}>
              <Container padding={14} color={Color.successLight} radius={8}>
                <Row justify='space-between'>
                  <Row>
                    <Container paddingRight={16}>
                      <Image
                        source={imageAssets.building}
                        style={{
                          width: 24,
                          height: 24,
                        }}
                      />
                    </Container>

                    <Column>
                      <Text size={10} color={Color.placeholder} letterSpacing={0.4}>Telah masuk di</Text>
                      <Divider height={2} />
                      <Text size={12} type='medium' letterSpacing={0.5}>{auth.user && auth.user.activityInfo && auth.user.activityInfo.location ? auth.user.activityInfo.location.name : ''}</Text>
                    </Column>
                  </Row>

                  <TouchableOpacity
                    onPress={() => {
                      Alert(
                        'Konfirmasi',
                        'Keluar dari Area?',
                        () => onCheckout(),
                      );
                    }}
                  >
                    <Text color={Color.error} size={12} type='medium'>
                      Keluar
                    </Text>
                  </TouchableOpacity>
                </Row>
              </Container>
            </Container>
          }

          {!isCheckin && stateListCheckinUID.length > 0 && <Container padding={16} paddingTop={8}>
            <Container padding={14} color={Color.warningLight} radius={8}>
              <Row justify='space-between'>
                <Row>
                  <Container paddingRight={16}>
                    <Image
                      source={imageAssets.airdrop}
                      style={{
                        width: 24,
                        height: 24,
                      }}
                    />
                  </Container>

                  <Column>
                    <Text type='medium' size={12} letterSpacing={0.5}>Checkpoint Disekitar</Text>
                    <Divider height={2} />
                    <Text size={10} letterSpacing={0.15} color={Color.placeholder} numberOfLines={1}>Sedang memverifikasi untuk masuk kedalam area</Text>
                  </Column>
                </Row>
              </Row>
            </Container>
          </Container>}

          {(beaconScanning) &&
            <View style={{ width: '100%', padding: 16 }}>
              <View
                style={{
                  padding: 8,
                  borderRadius: 16,
                  backgroundColor: Color.textInput,
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...shadowStyle,
                }}
              >
                <ActivityIndicator size='large' />
                <Divider height={8} />
                <Text>Scanning</Text>
              </View>
            </View>
          }

          {showDebug && renderDebug()}

          <Container>
            <Banner
              showHeader={false}
              data={listBanner}
              loading={loadingBanner}
            />
          </Container>

          <Divider height={spaceContentSize * 2} />

          {auth.user && auth.user.activeEvent && <Container paddingHorizontal={16} paddingBottom={16}>
            <Container padding={10} radius={8} color='#F0FBFF'>
              <Row justify='space-between'>
                <Row>
                  <Container width='14%' style={{ aspectRatio: 1 }}>
                    <Image
                      source={{ uri: auth.user.activeEvent.imageUrl }}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 8,
                      }}
                    />
                  </Container>

                  <Container paddingHorizontal={12} width='86%'>
                    <Text align='left' size={10} color={Color.placeholder} letterSpacing={0.4}>Tiket Aktif</Text>
                    <Divider height={2} />
                    <Text align='left' size={12} type='medium' numberOfLines={2} letterSpacing={0.5}>{auth.user.activeEvent.title}</Text>
                  </Container>
                </Row>
              </Row>
            </Container>
          </Container>}

          {isSecurity && <Container padding={16} paddingTop={8}>
            <Container padding={14} color={Color.border} radius={8}>
              <Row justify='space-between'>
                <Row>
                  <Container paddingRight={16}>
                    <Image
                      source={imageAssets.people}
                      style={{
                        width: 32,
                        height: 32,
                      }}
                    />
                  </Container>
                  <Column>
                    <Text color={Color.placeholder} type='medium' size={11} letterSpacing={0.5}>Total Pengunjung</Text>
                    <Divider height={2} />
                    <Text type='medium' size={16} letterSpacing={0.15}>{visitorCount} Orang</Text>
                  </Column>
                </Row>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('VisitorScreen');
                  }}
                >
                  <Text color={Color.primaryDark} type='medium' size={12} letterSpacing={0.5}>Lihat Detail</Text>
                </TouchableOpacity>
              </Row>
            </Container>
          </Container>}

          <WidgetHomeMenuStatic />

          <Divider height={24} />

          <HighlightTenant

          />

          <HighlightEvent
            productCategory='EVENT'
            name='Event'
            title='Event Yang Akan Datang'
            nav='EventScreen'
            refresh={refreshing || isFocused}
            // showHeader={false}
            showSeeAllText={false}
          />

          {/* <HighlightContentProduct
            productCategory='FORUM'
            name='Forum'
            title='Thread Populer'
            nav='ForumTopicScreen'
            refresh={refreshing || isFocused}
          /> */}

          {/* <HighlightContentProduct
            productCategory='EMERGENCY'
            name='Help Me'
            title='Kondisi Darurat'
            nav='EmergencyScreen'
            refresh={refreshing || isFocused}
          /> */}

          {/* <HighlightContentProduct
            productCategory='POSTING'
            name='Artikel'
            title='Artikel Populer'
            nav='NewsScreen'
            refresh={refreshing || isFocused}
          /> */}

          {/* <HighlightContentProductV2
            productCategory='ARTIKEL'
            name='Artikel'
            title='Artikel Populer'
            nav='NewsScreenV2'
            refresh={refreshing || isFocused}
            orderBy="like"
          /> */}

          {/* <HighlightContentProduct
            productCategory='NEARBY_PLACE'
            name='Tempat'
            title='Tempat Terdekat'
            nav='PlaceScreen'
            horizontal
            refresh={refreshing || isFocused}
          /> */}

          {/* <Divider height={8} /> */}

          {/* <HighlightContentProduct
            productCategory='EVENT'
            name='Event'
            title='Event Yang Akan Datang'
            nav='EventScreen'
            refresh={refreshing || isFocused}
            // showHeader={false}
            showSeeAllText={false}
          /> */}

          {/* <HighlightContentProduct
            productCategory='JOBS'
            name='Loker'
            title='Lowongan Pekerjaan'
            nav='JobScreen'
            refresh={refreshing || isFocused}
          /> */}

          {/* isFocused handle android navigate crash from home */}
          {/* {isFocused && <HighlightContentProduct
            productCategory='YOUTUBE_VIDEO'
            name='Live'
            title='Siaran Langsung'
            nav='YoutubeScreen'
            refresh={refreshing}
            style={{paddingHorizontal: 0}}
          />} */}

          {/* <HighlightContentProduct
            productCategory='NEWEST_VIDEO'
            name='Video'
            title='Video Terbaru'
            nav='VideoScreen'
            refresh={refreshing || isFocused}
            style={{ paddingHorizontal: 0 }}
          /> */}
        </Container>
      </ScrollView>

      <ModalPosting
        ref={modalPostingRef}
        selected={null}
        onPress={e => {
          navigation.navigate(e.nav, e.params);
          modalPostingRef.current.close();
        }}
      />

      {/* <Modal
        isVisible={tempShowPopupAds}
        onBackdropPress={() => {
          tempShowPopupAds = false;
        }}
        animationIn="slideInDown"
        animationOut="slideOutDown"
        backdropColor={Color.semiwhite}>
        <View
          style={{ width: '100%', aspectRatio: 1, borderRadius: 16, backgroundColor: Color.primarySoft, }}
        >
          <View
            style={{
              flex: 1,
              padding: 32,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flex: 1
              }}
            >
              <View
                style={{
                  height: '100%',
                  aspectRatio: 1,
                }}
              >
                <Image
                  source={imageAssets.shake}
                  style={{
                    height: '100%',
                    width: '100%',
                  }}
                />
              </View>
            </View>

            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-evenly',
              }}
            >
              <Text>Shake your device to verify the tickets</Text>
              <Container width='50%'>
                <Button
                  onPress={() => {
                    tempShowPopupAds = false;
                  }}
                >
                  I Understand
                </Button>
              </Container>
            </View>
          </View>
        </View>
      </Modal> */}

      {/* modal checkin */}
      {/* <Modal
        isVisible={!isCheckin && modalFloatingBeacon && stateListCheckinUID.length > 0}
        onBackdropPress={() => {
          setModalFloatingBeacon(false);
        }}
        animationIn="slideInDown"
        animationOut="slideOutDown"
        backdropColor={Color.semiwhite}>
        <View
          style={{ width: '100%', borderRadius: 16, backgroundColor: Color.theme, }}
        >
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
                source={imageAssets.connecting}
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
              <Text size={16} letterSpacing={0.15} type='medium'>Deket Checkpoint Nih~</Text>
              <Divider height={4} />
              <Text color={Color.placeholder}>Disekitar kamu ada Checkpoint. Goyangkan handphonemu untuk masuk kedalam area</Text>
            </View>

            <Container width='100%' paddingHorizontal={16} paddingTop={16}>
              <Button
                outline
                color={Color.text}
                onPress={() => {
                  setModalFloatingBeacon(false);
                }}
              >
                Tutup
              </Button>
            </Container>
          </View>
        </View>
      </Modal> */}

      {/* modal merch */}
      {isFocused && isCheckin && listMerchantType.length > 0 && <Modal
        isVisible
        animationIn="slideInDown"
        animationOut="slideOutDown"
        backdropColor={Color.semiwhite}>
        <View
          style={{ width: '100%', borderRadius: 16, backgroundColor: Color.theme, }}
        >
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                height: height / 8,
                aspectRatio: 1,
                marginBottom: 16,
              }}
            >
              <Image
                source={imageAssets.connectMerchant}
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
              <Text size={16} letterSpacing={0.15} type='medium'>{listMerchantType.length > 1 ? 'Ada beberapa tenant deket kamu nih!' : 'Ada tenant dekat kamu nih!'}</Text>
            </View>

            <Container width='100%' paddingTop={16}>
              <View style={{ width: '100%' }}>
                {listMerchantType.map((item, idx) => {
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => {
                        navigation.navigate('DetailTenantScreen', { item });
                      }}
                      style={{
                        width: '100%',
                        padding: 10,
                        flexDirection: 'row',
                        borderWidth: 1,
                        borderColor: Color.textSoft,
                        borderRadius: 8,
                        marginBottom: 8,
                      }}
                    >
                      <View style={{ aspectRatio: 1 }}>
                        <Image
                          source={{ uri: Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '' }}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 8,
                            backgroundColor: Color.border,
                          }}
                        />
                      </View>
                      <View style={{ flex: 1, padding: 10 }}>
                        <Text align='left' type='medium' numberOfLines={2} letterSpacing={0.1}>{item.name}</Text>
                        <Text align='left' type='medium' numberOfLines={2} size={10} color={Color.disabled}>{item.type}</Text>
                      </View>
                      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Fontisto
                          name={'angle-right'}
                          color={Color.primaryMoreDark}
                          size={15}
                        />
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </Container>

            <Container width='100%' paddingTop={16}>
              <Button
                outline
                color={Color.primaryMoreDark}
                onPress={() => {
                  setListMerchantType([]);
                }}
              >
                Tutup
              </Button>
            </Container>
          </View>
        </View>
      </Modal>}

      {/* modal success checkin */}
      {isFocused && isCheckin && modalSuccessCheckin && <Modal
        isVisible
        onBackdropPress={() => {
          setModalSuccessCheckin(false);
        }}
        animationIn="slideInDown"
        animationOut="slideOutDown"
        backdropColor={Color.semiwhite}>
        <View
          style={{ width: '100%', borderRadius: 16, backgroundColor: Color.theme, }}
        >
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
              <Text size={12}>Selamat Datang di</Text>
              <Divider height={4} />
              <Text size={22} letterSpacing={0.15} type='medium'>{auth.user && auth.user.activityInfo && auth.user.activityInfo.location ? auth.user.activityInfo.location.name : ''}</Text>
              <Divider />
              <View
                style={{
                  width: '100%',
                  aspectRatio: 1,
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

            <Container width='100%' paddingTop={16}>
              <Button
                outline
                color={Color.primaryMoreDark}
                onPress={() => {
                  console.log('tutup');
                  setModalSuccessCheckin(false);
                }}
              >
                Tutup
              </Button>
            </Container>
          </View>
        </View>
      </Modal>}

      {/* modal event */}
      {isCheckin && modalEventVerification.show && <Modal
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
      </Modal>}

      {isModalVisible && <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        animationIn="slideInDown"
        animationOut="slideOutDown"
        style={{ borderRadius: 16 }}>
        <View style={{ backgroundColor: Color.theme }}>
          <View
            style={{
              width: '100%',
              paddingHorizontal: 16,
              paddingVertical: 24,
            }}>
            <TouchableOpacity
              onPress={() => {
                toggleModal();
              }}
              style={{
                alignSelf: 'flex-end',
                backgroundColor: Color.error,
                borderRadius: 50,
                marginBottom: 12,
              }}>
              <Image
                source={ImagesPath.icClose}
                style={{ width: 16, height: 16 }}
              />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ marginRight: 16 }}>
                <Image source={ImagesPath.eBook} />
              </View>
              <View>
                <View style={{ width: '86%' }}>
                  <Text
                    align="left"
                    size={14}
                    style={{ fontWeight: 'bold' }}>
                    Seni Berlorem Ipsum Dulur Sit Amet
                  </Text>
                </View>
                <Text align="left" size={10}>
                  Karya Esa Riski Hari Utama
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 12,
                      marginRight: 20,
                    }}>
                    <Image
                      source={ImagesPath.eye}
                      style={{ width: 16, height: 16, marginRight: 9 }}
                    />
                    <Text align="left" size={10}>
                      1.7K
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 12 }}>
                    <Image
                      source={ImagesPath.thumbsUp}
                      style={{ width: 16, height: 16, marginRight: 9 }}
                    />
                    <Text align="left" size={10}>
                      240
                    </Text>
                  </View>
                </View>
                <View style={{ marginTop: 16 }}>
                  <Text
                    align="left"
                    size={11}
                    style={{ fontWeight: 'bold' }}>
                    Sinopsis
                  </Text>
                </View>
                <View style={{ width: '80%' }}>
                  <Text align="left" size={10} numberOfLines={4}>
                    Cookie toffee pie cupcake sesame snaps. Cupcake
                    cupcake soufflé gummies croissant jelly beans candy
                    canes fruitcake. Dessert cotton candy tart donut
                    tiramisu cookie dragée wafer marzipan.
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 21,
                  borderWidth: 0.3,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={ImagesPath.thumbsUp}
                  style={{ width: 22, height: 22 }}
                />
              </View>

              <Submit
                buttonLabel="Baca Sekarang"
                buttonColor={Color.primary}
                type="bottomSingleButton"
                buttonBorderTopWidth={0}
                style={{
                  backgroundColor: Color.theme,
                  paddingTop: 25,
                  paddingBottom: 25,
                  width: 250,
                }}
                onPress={() => onClickBaca()}
              />
            </View>
          </View>
        </View>
      </Modal>}

      {/* modal need update profile */}
      {modalNeedUpdateProfile && <Modal
        isVisible={modalNeedUpdateProfile}
        onBackdropPress={() => {
          setModalNeedUpdateProfile(false);
        }}
        animationIn="slideInDown"
        animationOut="slideOutDown"
        backdropColor={Color.semiwhite}>
        <View
          style={{ width: '100%', borderRadius: 16, backgroundColor: Color.theme, }}
        >
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
              <Text size={22} letterSpacing={0.15} type='medium'>Profile kamu belum lengkap</Text>
              <Divider height={4} />
              <Text size={12}>Untuk menggunakan layanan ini silakan lengkapi data diri di menu profile</Text>
              <Divider />
              <View
                style={{
                  width: '70%',
                  aspectRatio: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  source={imageAssets.shake}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 8,
                  }}
                  resizeMode='contain'
                />
              </View>
            </View>

            <Container width='100%' paddingTop={16}>
              <Button
                outline
                color={Color.primaryMoreDark}
                onPress={() => {
                  setModalNeedUpdateProfile(false);
                  navigation.navigate('MainProfile');
                }}
              >
                Profile
              </Button>
            </Container>
          </View>
        </View>
      </Modal>}

      {/* modal loading */}
      {modalLoading && <Modal
        isVisible
        animationIn="slideInDown"
        animationOut="slideOutDown"
        backdropColor={Color.semiwhite}>
        <View
          style={{ width: '100%', borderRadius: 16, backgroundColor: Color.theme, }}
        >
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                height: height / 12,
                aspectRatio: 1,
                justifyContent: 'center',
              }}
            >
              <ActivityIndicator
                size={'large'}
              />
            </View>

            <View
              style={{
                alignItems: 'center',
              }}
            >
              <Text
                size={16}
                letterSpacing={0.15}
                type='medium'
              >
                Mohon tunggu
              </Text>
            </View>
          </View>
        </View>
      </Modal>}
    </Scaffold>
  );
};

export default MainHome;
