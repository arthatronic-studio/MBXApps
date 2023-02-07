import React, {useState, useEffect, useRef} from 'react';
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
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';
import Modal from 'react-native-modal';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import BleManager from 'react-native-ble-manager';

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
import {Divider, Circle, Container, Row, Column} from '@src/styled';
import Banner from 'src/components/Banner';
import imageAssets from 'assets/images';
import WidgetHomeMenuStatic from './WidgetHomeMenuStatic';
import {getAPI, postAPI} from 'src/api-rest/httpService';
import HighlightEvent from 'src/components/Event/HighlightEvent';
import {stateUpdateProfile} from 'src/api-rest/stateUpdateProfile';
import HighlightTenant from 'src/screens/Tenant/HighlightTenant';
import {stateBeaconSetting} from 'src/api-rest/stateBeaconSetting';
import {androidBluetoothPermission} from 'src/lib/androidPermissions';
import {shadowStyle} from 'src/styles';
import ModalBeaconPromo from './ModalBeaconPromo';
import ModalLoading from './ModalLoading';
import ModalNeedUpdateProfile from './ModalNeedUpdateProfile';
import ModalBeaconCheckin from './ModalBeaconCheckin';
import DraggableButton from './DraggableButton';
import ListContenEvent from 'src/components/Event/ListContenEvent';
import PostingHeader from 'src/components/Posting/PostingHeader';
import {redirectTo} from 'src/utils';
import HighlightArticle from '../Article/HighlightArticle';
import {useInterval} from 'src/hooks/useInterval';
import ModalChangeLocation from 'src/components/Modal/ModalChangeLocation';
import HighlightPicuWujudkan from '../PicuWujudkan/HighlightPicuWujudkan';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const scanUUIDs = []; // ['fda50693-a4e2-4fb1-afcf-c6eb07647825'];
const scanTimeout = 60 * 60 * 24 * 365;
const pairingInterval = 2000;

const MainHome = ({navigation, route}) => {
  const auth = useSelector(state => state['auth']);
  const localStoragSetting = useSelector(state => state['setting']);
  const modalChangeLocationRef = useRef();

  const dispatch = useDispatch();
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const {width, height} = useWindowDimensions();
  const [loadingProps, showLoading] = useLoading();

  const [loadingBanner, setLoadingBanner] = useState(true);
  const [listBanner, setListBanner] = useState([]);

  const peripherals = new Map();
  const bodyBeaconsRef = useRef();
  const [allRegisteredBeacon, setAllRegisteredBeacon] = useState([]);
  const [lastRespMerchID, setLastRespMerchID] = useState(-1);
  const [lastRespArtID, setLastRespArtID] = useState(-1);

  const [listMerchantType, setListMerchantType] = useState([]);
  const [listPromo, setListPromo] = useState([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSuccessCheckin, setModalSuccessCheckin] = useState(false);
  const [modalNeedUpdateProfile, setModalNeedUpdateProfile] = useState(false);

  const isCheckin = auth && auth.user && auth.user.isCheckin;
  const isSecurity =
    auth && auth.user && auth.user.role && auth.user.role.value === 0;
  const showDebug =
    localStoragSetting && localStoragSetting.showDebug ? true : false;

  // useInterval(() => {
  //   // console.log('focus : ', isFocused, ', beaconCount: ' , allRegisteredBeacon.length);
  //   console.log(`last merch id: ${lastRespMerchID}, last art id: ${lastRespArtID}`);
  //   onPairingAllBeacon();
  // }, pairingInterval);

  useInterval(() => {
    // console.log('focus : ', isFocused, ', beaconCount: ' , allRegisteredBeacon.length);
    // console.log(`last merch id: ${lastRespMerchID}, last art id: ${lastRespArtID} mata => `, Array.isArray(timeout.current) ? timeout.current.length : 'waiting');
    onForceAllBeacon(bodyBeaconsRef.current);
  }, pairingInterval);

  // did mount
  useEffect(() => {
    stateUpdateProfile();

    const initAsync = async () => {
      if (Platform.OS === 'android' && Platform.Version < 31) {
        await BluetoothStateManager.requestToEnable();
      }

      const status = await androidBluetoothPermission();

      BluetoothStateManager.onStateChange(bluetoothState => {
        console.log('bluetoothState', bluetoothState);
        if (bluetoothState === 'PoweredOn') {
          if (status) {
            BleManager.start({showAlert: false}).then(() => {
              setTimeout(() => {
                onBleScan();
              }, 5000);
            });
          }
        } else if (bluetoothState === 'PoweredOff') {
          onBleStopScan();
          bodyBeaconsRef.current = null;
        }
      }, true);
    };

    initAsync();

    const regisDiscover = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      args => {
        const strength = 4;
        const rumusRSSI = (-69 - args.rssi) / (10 * strength);
        const productRange = Math.pow(10, rumusRSSI) * 100;
        const rangeForCompare = productRange - 50;

        const newArgs = {
          beacon_uid: args.id,
          range: rangeForCompare,
          gues_id: auth.guest_id ? auth.guest_id : 0,
        };

        // console.log('newArgs', newArgs);

        peripherals.set(newArgs.beacon_uid, newArgs);
        // const arrBeacons = Array.from(peripherals.values());
        // console.log('arrBeacons', arrBeacons.length);

        // onForceAllBeacon(arrBeacons)

        bodyBeaconsRef.current = Array.from(peripherals.values());

        // setAllRegisteredBeacon(arrBeacons);
      },
    );

    // const regisStopScan = bleManagerEmitter.addListener('BleManagerStopScan', () => {
    //   console.log('STOP!!!');
    // });

    return () => {
      // if (typeof bleManagerEmitter.removeAllListeners === 'function') {
      //   bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
      //   bleManagerEmitter.removeAllListeners('BleManagerStopScan');
      // }
      regisDiscover.remove();
      // regisStopScan.remove();
    };
  }, []);

  // did focus
  useEffect(() => {
    if (isFocused) {
      dispatch({type: 'BOOKING.CLEAR_BOOKING'});
      fetchBannerList();
      fetchData();
    } else {
      // onBleStopScan();
    }
  }, [isFocused]);

  const fetchBannerList = async () => {
    const result = await getAPI('banner');

    console.log('result banner', result);

    let newArr = [];
    if (result.status) {
      result.data.map(e => {
        newArr.push({
          ...e,
          image: e.file,
        });
      });
    }
    setListBanner(newArr);
    setLoadingBanner(false);
  };

  const onPairingAllBeacon = async () => {
    if (auth && auth.user && !auth.user.isRegistered) {
      setModalNeedUpdateProfile(true);
      return;
    }

    if (allRegisteredBeacon.length <= 0) return;

    const body = allRegisteredBeacon;
    const result = await postAPI('user-activity/beacons', body);
    // console.log(`enhance body: ${body}, enhance resp:', ${result}`);

    if (result.status) {
      // 1	Mural
      // 2	Gate In
      // 3	Gate Out
      // 4	Area
      // 5	Toko
      // 6	Event

      let strTypeName = '';
      if (result.beaconType && typeof result.beaconType.name === 'string') {
        strTypeName = result.beaconType.name.toLowerCase();
      }

      console.log(`${isFocused} type: ${strTypeName}, id: , ${result.data.id}`);

      const _isArtType = strTypeName === 'mural';
      const _isCheckinType = strTypeName === 'gate in';
      const _isCheckoutType = strTypeName === 'gate out';
      const _isMerchType = strTypeName === 'toko';
      const _isEventType = strTypeName === 'event';
      const _listPromo = Array.isArray(result.promo) ? result.promo : [];

      // type update profile
      if (_isCheckinType || _isCheckoutType || _isEventType) {
        const prof = await stateUpdateProfile();
        console.log('prof', prof);
      }

      // == type promo
      setListPromo(_listPromo);

      // === type checkin
      if (_isCheckinType) {
        // dispatch({ type: 'AUTH.SET_CHECKIN', data: result.data });
        setModalSuccessCheckin(true);
        return;
      }

      // === type merchant
      if (isFocused && _isMerchType && result.data.id !== lastRespMerchID) {
        setListMerchantType([result.data]);
        setLastRespMerchID(result.data.id);
        return;
      }

      // === type art
      if (isFocused && _isArtType && result.data.id !== lastRespArtID) {
        setLastRespArtID(result.data.id);
        navigation.navigate('DetailArtScreen', {item: result.data});
        return;
      }
    }
  };

  const onForceAllBeacon = async body => {
    // console.log(`every ${pairingInterval} miliseconds`);

    // TODO: nanti ini buat di halaman OrderEventDetail setelah data disimpan di redux or scan di halaman OrderEventDetail matiin scan di home
    // const resultD = await postAPI('user-activity/beacons-event', body);
    // console.log('result beacon event', resultD);

    if (auth && auth.user && !auth.user.isRegistered) {
      setModalNeedUpdateProfile(true);
      return;
    }

    if (!Array.isArray(body)) {
      return;
    }

    if (body.length <= 0) return;

    const result = await postAPI('user-activity/beacons', body);
    // console.log(`enhance body: ${body}, enhance resp:`, result);
    // console.log(`enhance resp:`, result);

    if (result.status) {
      // 1	Mural
      // 2	Gate In
      // 3	Gate Out
      // 4	Area
      // 5	Toko
      // 6	Event

      let strTypeName = '';
      if (result.beaconType && typeof result.beaconType.name === 'string') {
        strTypeName = result.beaconType.name.toLowerCase();
      }

      console.log(`${isFocused} type: ${strTypeName}, id: , ${result.data.id}`);

      const _isArtType = strTypeName === 'mural';
      const _isCheckinType = strTypeName === 'gate in';
      const _isCheckoutType = strTypeName === 'gate out';
      const _isMerchType = strTypeName === 'toko';
      const _isEventType = strTypeName === 'event';
      const _listPromo = Array.isArray(result.promo) ? result.promo : [];

      // type update profile
      if (_isCheckinType || _isCheckoutType || _isEventType) {
        const prof = await stateUpdateProfile();
        console.log('prof', prof);
      }

      // == type promo
      setListPromo(_listPromo);

      // === type checkin
      if (_isCheckinType) {
        // dispatch({ type: 'AUTH.SET_CHECKIN', data: result.data });
        setModalSuccessCheckin(true);
        return;
      }

      // === type merchant
      if (isFocused && _isMerchType && result.data.id !== lastRespMerchID) {
        setListMerchantType([result.data]);
        setLastRespMerchID(result.data.id);
        return;
      }

      // === type art
      if (isFocused && _isArtType && result.data.id !== lastRespArtID) {
        setLastRespArtID(result.data.id);
        navigation.navigate('DetailArtScreen', {item: result.data});
        return;
      }
    }
  };

  const onCheckout = async uuid => {
    const body = {
      beacon_uid: 'D5:60:C9:67:6F:70',
      beacon_type: 'checkout',
      gues_id: auth.guest_id ? auth.guest_id : 0,
    };

    const result = await postAPI('user-activity', body);

    console.log('result checkout', result);

    if (result.status) {
      dispatch({type: 'AUTH.SET_CHECKIN', data: null});

      const prof = await stateUpdateProfile();
      console.log('prof', prof);

      setLastRespArtID(-1);
      setLastRespMerchID(-1);

      showLoading('success', result.message);
    } else {
      showLoading('error', result.message);
    }
  };

  const onEventCheckout = async activeEvent => {
    // console.log('activeEvent', activeEvent);

    const body = {
      event_id: activeEvent.id,
    };

    console.log('body', body);

    const result = await postAPI('user-activity/event-checkout', body);

    console.log('result event-checkout', result);

    if (result.status) {
      const prof = await stateUpdateProfile();
      // console.log('prof', prof);

      showLoading('success', result.message);
    } else {
      showLoading('error', result.message);
    }
  };

  const fetchData = async () => {
    const result = await getAPI('user-activity');
    // console.log('user-activity', result);
    if (result.status) {
      setVisitorCount(result.data.totalPengunjung);
    }
  };

  const onBleScan = () => {
    // if (auth.user && auth.user.isGuest) {
    //   return;
    // }

    androidBluetoothPermission().then(status => {
      if (status) {
        BleManager.scan(scanUUIDs, scanTimeout, false).then(() => {});
      }
    });
  };

  const onBleStopScan = () => {
    androidBluetoothPermission().then(status => {
      if (status) {
        BleManager.stopScan().then(res => {});
      }
    });
  };

  const onRefresh = async () => {
    // setRefreshing(true);
    // setRefreshing(false);
  };

  const renderDebug = () => {
    return (
      <View>
        <Text>Beacon List</Text>
        {allRegisteredBeacon.map((i, idx) => {
          return (
            <View
              key={idx}
              style={{
                width: '100%',
                alignItems: 'flex-start',
                paddingHorizontal: 16,
                marginBottom: 4,
                backgroundColor: Color.blueLight,
              }}>
              <Text size={12} aling="left">
                UID: {i.beacon_uid}
              </Text>
              <Text size={12} aling="left">
                Range: {i.range}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const spaceContentSize = 8;

  return (
    <Scaffold
      translucent={Platform.OS === 'ios' ? true : false}
      useSafeArea={Platform.OS === 'ios' ? false : true}
      statusBarColor={Color.theme}
      loadingProps={loadingProps}
      header={
        <HeaderBig
          type="MAIN_HOME"
          titleRight={auth.user && auth.user.isGuest ? 'LOGIN' : ''}
          onPressRightButton={() => {
            if (auth.user && auth.user.isGuest) {
              redirectTo('LoginScreenV2');
            }
          }}
          actions={
            <View>
              {auth.user && !auth.user.isGuest && (
                <>
                  <Text size={11} type="medium" align="right" lineHeight={13.2}>
                    Hi,
                  </Text>
                  <Text size={17} type="medium" align="right" lineHeight={20.4}>
                    {auth.user.name.toUpperCase()}
                  </Text>
                </>
              )}
              {isCheckin && (
                <>
                  <Divider height={2} />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <Text
                      size={10}
                      type="semibold"
                      lineHeight={14.4}
                      letterSpacing={0.04}>
                      {auth.user &&
                      auth.user.activityInfo &&
                      auth.user.activityInfo.location
                        ? auth.user.activityInfo.location.name
                        : ''}
                    </Text>
                    <Divider width={8} />
                    <TouchableOpacity
                      onPress={() => {
                        if (isCheckin) {
                          Alert('Konfirmasi', 'Keluar dari Area?', () =>
                            onCheckout(),
                          );
                        } else {
                          if (modalChangeLocationRef) {
                            modalChangeLocationRef.current.open();
                          }
                        }
                      }}>
                      <Text
                        size={10}
                        lineHeight={14.4}
                        type="medium"
                        letterSpacing={0.04}
                        color="#E50000">
                        Disconnect
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          }
          // actions={
          //   <View style={{ flexDirection: 'row' }}>
          //     {/* <TouchableOpacity
          //       onPress={() => {
          //         navigation.navigate('NotificationScreen');
          //       }}
          //       style={{
          //         width: '20%',
          //         justifyContent: 'flex-start',
          //         alignItems: 'flex-end',
          //       }}>
          //       <Ionicons
          //         name="notifications-outline"
          //         size={22}
          //         color={Color.textButtonInline}
          //       />
          //       {notificationCount > 0 && (
          //         <Circle
          //           size={12}
          //           color={Color.error}
          //           style={{ position: 'absolute', top: -4, right: -4 }}>
          //           <Text size={8} color={Color.textButtonInline}>
          //             {notificationCount > 99 ? '99' : notificationCount}
          //           </Text>
          //         </Circle>
          //       )}
          //     </TouchableOpacity> */}

          //     {/* <TouchableOpacity
          //       onPress={() => {
          //         navigation.navigate('Chat');
          //       }}
          //       style={{
          //         width: '20%',
          //         justifyContent: 'flex-start',
          //         alignItems: 'flex-end',
          //       }}>
          //       <Ionicons name="chatbox-outline" size={22} color={Color.textButtonInline} />
          //       {chatNotifCount > 0 && (
          //         <Circle
          //           size={12}
          //           color={Color.error}
          //           style={{ position: 'absolute', top: -4, right: -4 }}>
          //           <Text size={8} color={Color.textButtonInline}>
          //             {chatNotifCount > 99 ? '99' : chatNotifCount}
          //           </Text>
          //         </Circle>
          //       )}
          //     </TouchableOpacity> */}

          //     {/* <TouchableOpacity
          //       onPress={() => {
          //         navigation.navigate('EventHistory');
          //       }}
          //       style={{
          //         justifyContent: 'flex-start',
          //         alignItems: 'flex-end',
          //       }}>
          //       <Image
          //         source={imageAssets.ticket}
          //         style={{
          //           height: 20,
          //           width: 20,
          //           tintColor: Color.text,
          //         }}
          //       />
          //     </TouchableOpacity> */}

          //     {/* <TouchableOpacity
          //       onPress={() => {
          //         navigation.navigate('MainProfile');
          //       }}
          //       style={{
          //         width: '20%',
          //         justifyContent: 'flex-start',
          //         alignItems: 'flex-end',
          //       }}>
          //       <Image
          //         source={imageAssets.profile}
          //         style={{
          //           height: 20,
          //           width: 20,
          //           tintColor: Color.text,
          //         }}
          //       />
          //     </TouchableOpacity> */}
          //   </View>
          // }
        />
      }
      floatingActionButton={
        isSecurity ? (
          <View
            style={{
              bottom: -16,
              height: width / 5 - 8,
              width: width / 5 - 8,
              borderRadius: width / 5 - 8,
              backgroundColor: Color.primary,
              alignSelf: 'center',
              // borderWidth: 1,
              // borderColor: Color.textButtonInline,
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ScanQRScreen');
              }}
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MaterialIcons
                name="qr-code-scanner"
                color={Color.textButtonInline}
                size={38}
              />
            </TouchableOpacity>
          </View>
        ) : listPromo.length > 0 ? (
          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SpecialOfferScreen', {listPromo})
              }
              style={{
                padding: 12,
                backgroundColor: Color.black,
              }}>
              <Text type="bold" size={14} lineHeight={17} color={Color.white}>
                SPECIAL OFFER
              </Text>
            </TouchableOpacity>
            <View
              style={{
                position: 'absolute',
                backgroundColor: '#E00F00',
                right: -10,
                top: -10,
                paddingVertical: 5,
                paddingHorizontal: 8,
                borderRadius: 24,
              }}>
              <Text size={12} type="mdium" color={Color.white} lineHeight={14}>
                {listPromo.length}
              </Text>
            </View>
          </View>
        ) : (
          <></>
        )
      }>
      {/* <DraggableButton> */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
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

          {/* checkin new design */}
          {!isCheckin && (
            <Container paddingHorizontal={16} marginVertical={8}>
              <Container
                paddingVertical={8}
                style={{borderWidth: 1, bordeerColor: Color.text, padding: 16}}>
                <Row
                  justify="space-between"
                  align={isCheckin ? 'flex-end' : 'center'}>
                  <Column>
                    <Text size={10} type="medium" color={Color.placeholder}>
                      {isCheckin ? "YOU'RE CONNECT TO" : 'Current Selection'}
                    </Text>
                    <Text size={14} lineHeight={18.6} type="medium">
                      {isCheckin
                        ? auth.user &&
                          auth.user.activityInfo &&
                          auth.user.activityInfo.location
                          ? auth.user.activityInfo.location.name
                          : ''
                        : auth.selectedLocation && auth.selectedLocation.name
                        ? auth.selectedLocation.name
                        : 'Select Location'}
                    </Text>
                  </Column>

                  <TouchableOpacity
                    onPress={() => {
                      if (isCheckin) {
                        Alert('Konfirmasi', 'Keluar dari Area?', () =>
                          onCheckout(),
                        );
                      } else {
                        if (modalChangeLocationRef) {
                          modalChangeLocationRef.current.open();
                        }
                      }
                    }}>
                    {isCheckin ? (
                      <Text color={Color.error} size={8} type="semibold">
                        {'Disconnect'.toUpperCase()}
                      </Text>
                    ) : (
                      <Image
                        source={imageAssets.arrowRight}
                        style={{
                          height: 14,
                          width: 14,
                          resizeMode: 'contain',
                        }}
                      />
                    )}
                  </TouchableOpacity>
                </Row>
              </Container>
            </Container>
          )}

          <Container>
            <Banner
              showHeader={false}
              data={listBanner}
              loading={loadingBanner}
            />
          </Container>

          <Divider height={spaceContentSize * 2} />

          {/* checkin old design */}
          {/* {isCheckin &&
            <Container padding={16} paddingTop={8}>
              <Container paddingVertical={16} style={{borderTopWidth: 1, borderBottomWidth: 1, bordeerColor: Color.text}}>
                <Row justify='space-between' align='flex-end'>
                  <Row>
                    <Container padding={10} radius={50} color={Color.primary}>
                      <Image
                        source={imageAssets.building}
                        style={{
                          width: 24,
                          height: 24,
                        }}
                      />
                    </Container>

                    <Container paddingHorizontal={8}>
                      <Column>
                        <Text size={11} type='medium' color={Color.placeholder}>YOU'RE CONNECT TO</Text>
                        <Divider height={2} />
                        <Text size={22} type='medium'>{auth.user && auth.user.activityInfo && auth.user.activityInfo.location ? auth.user.activityInfo.location.name : ''}</Text>
                      </Column>
                    </Container>
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
                    <Text color={Color.error} size={9} type='semibold'>
                      {'Disconnect'.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                </Row>
              </Container>
            </Container>
          } */}

          {/* takeout verify */}
          {/* {!isCheckin && <Container padding={16} paddingTop={8}>
            <Container paddingVertical={16} style={{borderTopWidth: 1, borderBottomWidth: 1, bordeerColor: Color.text}}>
              <Row justify='space-between'>
                <Row>
                  <Container padding={10} radius={50} color={Color.primary}>
                    <Image
                      source={imageAssets.airdrop}
                      style={{
                        width: 24,
                        height: 24,
                      }}
                    />
                  </Container>

                  <Container paddingHorizontal={8}>
                    <Column>
                      <Text type='medium' size={11} color={Color.placeholder}>{'Checkpoint'.toUpperCase()}</Text>
                      <Divider height={2} />
                      <Text type='medium' size={22} numberOfLines={1}>Verifying, Please wait . . .</Text>
                    </Column>
                  </Container>
                </Row>
              </Row>
            </Container>
          </Container>} */}

          {showDebug && renderDebug()}

          {auth.user && !auth.user.isRegistered && (
            <TouchableOpacity
              onPress={() => navigation.navigate('CompleteProfile')}
              style={{
                marginHorizontal: 16,
                borderWidth: 1,
                padding: 10,
              }}>
              <AntDesign
                name="exclamationcircleo"
                size={20}
                color={'#1C1B1F'}
              />
              <Divider height={10} />
              <Text type="semibold" size={12} lineHeight={22} align="left">
                Looks like you didn't complete your profile
              </Text>
              <Text align="left" size={12} type="medium" lineHeight={14}>
                Complete your profile to get the full experience inside the app
              </Text>
              <Divider height={18} />
              <Text
                type="medium"
                lineHeight={14}
                align="left"
                onPress={() => {}}
                size={12}
                color={Color.primaryDark}>
                Complete Now{' '}
                <Ionicons
                  name="arrow-forward"
                  size={12}
                  color={Color.primaryDark}
                />
              </Text>
            </TouchableOpacity>
          )}

          {isSecurity && (
            <Container paddingHorizontal={16}>
              <Container padding={14} borderWidth={1}>
                <Row justify="space-between">
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
                      <Text
                        color={Color.textSoft}
                        type="medium"
                        size={11}
                        letterSpacing={0.5}>
                        Total Pengunjung
                      </Text>
                      <Divider height={2} />
                      <Text type="medium" size={16} letterSpacing={0.15}>
                        {visitorCount} Orang
                      </Text>
                    </Column>
                  </Row>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('VisitorScreen');
                    }}>
                    <Text
                      color={Color.primaryDark}
                      type="medium"
                      size={12}
                      letterSpacing={0.5}>
                      Lihat Detail
                    </Text>
                  </TouchableOpacity>
                </Row>
              </Container>
            </Container>
          )}

          <Divider height={spaceContentSize * 2} />

          <ListContenEvent
            productCategory="EVENT"
            name="Event"
            title="● SECURE YOUR TICKET NOW"
            productType="highlight"
            showHeader
            horizontal
            showSeeAllText={false}
          />

          {/* event ticket */}
          {isCheckin && auth.user && auth.user.activeEvent && (
            <Container paddingHorizontal={16} paddingTop={16}>
              <Container borderWidth={1} borderColor={Color.text}>
                <Row justify="space-between">
                  <Row style={{flex: 1}}>
                    <Container width="22%" style={{aspectRatio: 1}}>
                      <Image
                        source={{uri: auth.user.activeEvent.imageUrl}}
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                      />
                    </Container>

                    <Container paddingHorizontal={12} width="78%">
                      <Text
                        align="left"
                        size={11}
                        lineHeight={13.2}
                        type="medium"
                        color={'#797979'}
                        letterSpacing={0.4}>
                        Active Ticket
                      </Text>
                      <Divider height={2} />
                      <Text
                        color={Color.text}
                        align="left"
                        size={18}
                        lineHeight={21.6}
                        type="medium"
                        numberOfLines={2}
                        letterSpacing={0.5}>
                        {auth?.user?.activeEvent?.title}
                      </Text>
                    </Container>
                  </Row>

                  <TouchableOpacity
                    onPress={() => {
                      Alert('Konfirmasi', 'Keluar dari Event?', () =>
                        onEventCheckout(auth.user.activeEvent),
                      );
                    }}
                    style={{
                      marginRight: 10,
                      aspectRatio: 1,
                      justifyContent: 'center',
                    }}>
                    <Text color={Color.error} size={11} type="semibold">
                      {'Exit '.toUpperCase()}
                      <MaterialCommunityIcons
                        name="arrow-up-thick"
                        color={Color.error}
                        size={12}
                      />
                    </Text>
                  </TouchableOpacity>
                </Row>
                <Container height={32}>
                  <Image
                    style={{width: '100%', height: '100%'}}
                    source={imageAssets.reboundEvoria}
                  />
                </Container>
              </Container>
            </Container>
          )}

          <WidgetHomeMenuStatic />

          {/* <Divider /> */}

          <HighlightTenant
            title={'● Most Loved'.toUpperCase()}
            numColumns={1}
            tenantType="eat"
            productCategory="EAT"
          />

          <Divider />

          <HighlightArticle
            title="● EXPERIENCE"
            numColumns={1}
            type="HIGHLIGHT"
          />

          {/* <HighlightTenant
            title=''
            tenantType='shop'
          /> */}

          {/* <HighlightPicuWujudkan
            title="● PICU WUJUDKAN"
            showSeeAllText={true}
            type="HIGHLIGHT"
            numColumns={1}
          /> */}

          <View>
            <Divider />

            <PostingHeader title="● PICU WUJUDKAN" showSeeAllText={true} onSeeAllPress={()=>navigation.navigate('PicuWujudkanScreen')}/>

            <Container
              paddingHorizontal={16}
              paddingTop={11}
              paddingBottom={11}>
              <Text size={29} align="left" lineHeight={38}>
                Laboratorium ide dan ruang diskusi untuk memicu lahirnya gagasan-gagasan kreatif.
              </Text>

              <Divider height={11} />

            </Container>
          </View>
        </Container>
      </ScrollView>
      {/* </DraggableButton> */}

      {/* modal merch */}
      {isFocused && isCheckin && listMerchantType.length > 0 && (
        <Modal
          isVisible
          animationIn="slideInDown"
          animationOut="slideOutDown"
          backdropColor={Color.semiwhite}>
          <View
            style={{
              width: '100%',
              borderRadius: 16,
              backgroundColor: Color.theme,
            }}>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 16,
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: height / 8,
                  aspectRatio: 1,
                  marginBottom: 16,
                }}>
                <Image
                  source={imageAssets.connectMerchant}
                  style={{
                    height: '100%',
                    width: '100%',
                    resizeMode: 'contain',
                  }}
                />
              </View>

              <View
                style={{
                  alignItems: 'center',
                }}>
                <Text size={16} letterSpacing={0.15} type="medium">
                  {listMerchantType.length > 1
                    ? 'Ada beberapa tenant deket kamu nih!'
                    : 'Ada tenant dekat kamu nih!'}
                </Text>
              </View>

              <Container width="100%" paddingTop={16}>
                <View style={{width: '100%'}}>
                  {listMerchantType.map((item, idx) => {
                    return (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => {
                          navigation.navigate('TenantDetailScreen', {item});
                        }}
                        style={{
                          width: '100%',
                          padding: 10,
                          flexDirection: 'row',
                          borderWidth: 1,
                          borderColor: Color.textSoft,
                          borderRadius: 8,
                          marginBottom: 8,
                        }}>
                        <View style={{aspectRatio: 1}}>
                          <Image
                            source={{
                              uri:
                                Array.isArray(item.images) &&
                                item.images.length > 0
                                  ? item.images[0]
                                  : '',
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: 8,
                              backgroundColor: Color.border,
                            }}
                          />
                        </View>
                        <View style={{flex: 1, padding: 10}}>
                          <Text
                            align="left"
                            type="medium"
                            numberOfLines={2}
                            letterSpacing={0.1}>
                            {item.name}
                          </Text>
                          <Text
                            align="left"
                            type="medium"
                            numberOfLines={2}
                            size={10}
                            color={Color.disabled}>
                            {item.type}
                          </Text>
                        </View>
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Fontisto
                            name={'angle-right'}
                            color={Color.primaryMoreDark}
                            size={15}
                          />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Container>

              <Container width="100%" paddingTop={16}>
                <Button
                  outline
                  color={Color.primaryMoreDark}
                  onPress={() => {
                    setListMerchantType([]);
                  }}>
                  Tutup
                </Button>
              </Container>
            </View>
          </View>
        </Modal>
      )}

      {/* modal beacon checkin */}
      {isFocused && isCheckin && modalSuccessCheckin && (
        <ModalBeaconCheckin
          visible
          onClose={() => {
            setModalSuccessCheckin(false);
          }}
        />
      )}

      {/* modal beacon promo */}
      {false && isFocused && (
        <ModalBeaconPromo item={null} visible onClose={() => {}} />
      )}

      {/* modal need update profile */}
      {modalNeedUpdateProfile && isFocused && (
        <ModalNeedUpdateProfile
          visible
          onSubmit={() => {
            setModalNeedUpdateProfile(false);
            navigation.navigate('MainProfile');
          }}
        />
      )}

      {/* modal loading */}
      {modalLoading && isFocused && <ModalLoading visible />}

      {/* modal change location */}
      <ModalChangeLocation ref={modalChangeLocationRef} />
    </Scaffold>
  );
};

export default MainHome;
