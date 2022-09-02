import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  useWindowDimensions,
  Animated,
  RefreshControl,
  Platform,
  DeviceEventEmitter,
  NativeEventEmitter,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from '@react-navigation/native';
import Modal from 'react-native-modal';
import Kontakt, { KontaktModule } from 'react-native-kontaktio';
import RNShake from 'react-native-shake';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

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
import { statusBarHeight } from 'src/utils/constants';
import FloatingBeaconDetection from 'src/components/Modal/FloatingBeaconDetection';
import { getAPI, postAPI } from 'src/api-rest/httpService';
import HighlightEvent from 'src/components/Event/HighlightEvent';
import { stateUpdateProfile } from 'src/api-rest/stateUpdateProfile';
const { connect, init, startDiscovery, startScanning, isScanning } = Kontakt;

const kontaktEmitter = new NativeEventEmitter(KontaktModule);
const isAndroid = Platform.OS === 'android';

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

  const [stateListAllBeacons, setStateListAllBeacons] = useState([]);
  const [stateListCheckinUID, setStateListCheckinUID] = useState([]);
  const [stateListMerchUID, setStateListMerchUID] = useState([]);
  const [stateListArtUID, setStateListArtUID] = useState([]);
  const [stateListOtherUID, setStateListOtherUID] = useState([]);
  const [stateListOtherType, setStateListOtherType] = useState([]);

  const [listMerchantType, setListMerchantType] = useState([]);
  const [tempAlreadyPairing, setTempAlreadyPairing] = useState([]);

  const [listResultArtType, setListResultArtType] = useState([]);
  const [tempCurrentArtPairing, setTempCurrentArtPairing] = useState([]);

  const [hasPermissionBluetooth, setHasPermissionBluetooth] = useState(false);
  const [isActiveBluetooth, setIsActiveBluetooth] = useState(false);

  const [modalLoading, setModalLoading] = useState(false);
  const [modalFloatingBeacon, setModalFloatingBeacon] = useState(true);
  const [modalSuccessCheckin, setModalSuccessCheckin] = useState(false);
  const [modalNeedUpdateProfile, setModalNeedUpdateProfile] = useState(false);

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
    initialConfig();
    requestBluetoothPermission();
    // beaconSetup();
  }, []);

  const initialConfig = async () => {
    if (Platform.OS === 'android' && Platform.Version < 31) {
      await BluetoothStateManager.requestToEnable();
    }

    // const _scanning = await isScanning();
    // console.log('_scanning', _scanning);
    // if (!_scanning) {
    //   beaconSetup();
    // }
  }

  useEffect(() => {
    // const cond = (
    //   localStoragBeacons
      // &&
      // Array.isArray(localStoragBeacons.listCheckinUID) && localStoragBeacons.listCheckinUID.length > 0 && 
      // Array.isArray(localStoragBeacons.listCheckinRange) && localStoragBeacons.listCheckinRange.length > 0 && 
      // Array.isArray(localStoragBeacons.listMerchUID) && localStoragBeacons.listMerchUID.length > 0 && 
      // Array.isArray(localStoragBeacons.listMerchRange) && localStoragBeacons.listMerchRange.length > 0
      // Array.isArray(localStoragBeacons.listArtUID) && localStoragBeacons.listArtUID.length > 0 && 
      // Array.isArray(localStoragBeacons.listArtRange) && localStoragBeacons.listArtRange.length > 0 && 
      // Array.isArray(localStoragBeacons.listOtherUID) && localStoragBeacons.listOtherUID.length > 0 && 
      // Array.isArray(localStoragBeacons.listOtherRange) && localStoragBeacons.listOtherRange.length > 0 && 
      // Array.isArray(localStoragBeacons.listOtherType) && localStoragBeacons.listOtherType.length > 0
    // );

    beaconSetup();
  }, [isActiveBluetooth]);

  useEffect(() => {
    const shakeSubs = RNShake.addListener(() => {
      if (isCheckin) {
        onPairingMerchant();
      } else {
        onPairingCheckin();
      }
    });

    return () => {
      shakeSubs.remove();
    }
  }, [isCheckin, stateListCheckinUID, stateListMerchUID]);

  useEffect(() => {
    const timeout = isCheckin && stateListArtUID.length > 0 && isFocused && listMerchantType.length === 0 && !modalLoading ?
      setTimeout(() => {
        onPairingArt();
      }, 3000)
      : null;

    return () => {
      clearTimeout(timeout);
    }
  }, [isCheckin, stateListArtUID, isFocused, listMerchantType, modalLoading]);

  useEffect(() => {
    const timeout = isCheckin && stateListOtherUID.length > 0 ?
      setTimeout(() => {
        onPairingOther();
      }, 10000)
      : null;

    return () => {
      clearTimeout(timeout);
    }
  }, [isCheckin, stateListOtherUID]);

  const beaconSetup = async () => {
    console.log('beaconSetup');
    if (isAndroid) {
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
    if (isAndroid) {
      DeviceEventEmitter.addListener('beaconDidAppear', ({ beacons, region }) => {
        console.log('beaconDidAppear', beacons);
      });

      DeviceEventEmitter.addListener('beaconsDidUpdate', ({ beacons, region }) => {
        // console.log('beaconsDidUpdate', beacons, region);
        // console.log('beaconsDidUpdate', beacons);

        if (Array.isArray(beacons)) {
          let newArr = [];
          let newCheckinUID = [];
          let newMerchUID = [];
          let newArtUID = [];
          let newOtherUID = [];
          let newOtherType = [];

          beacons.map((e, i) => {
            // console.log('full info beacon', e);

            const strength = 4;
            const rumusRSSI = ((-69 - (e.rssi)) / (10 * strength));
            const productRange = Math.pow(10, rumusRSSI) * 100;

            const rangeForCompare = productRange - 50;

            newArr.push({
              productAddress: e.address,
              productRange,
              productName: e.name,
              productUUID: e.uuid,
            });

            const isCheckinType = localStoragBeacons.listCheckinUID.indexOf(e.address);
            const isMerchType = localStoragBeacons.listMerchUID.indexOf(e.address);
            const isArtType = localStoragBeacons.listArtUID.indexOf(e.address);
            const isOtherType = localStoragBeacons.listOtherUID.indexOf(e.address);

            // type beacon yang masuk kondisi checkin (harus checkin dulu)
            if (isCheckin) {
              if (isMerchType !== -1 && rangeForCompare < localStoragBeacons.listMerchRange[isMerchType]) {
                // newArr.push({
                //   productAddress: e.address,
                //   productRange,
                //   productName: e.name,
                //   productUUID: e.uuid,
                // });

                newMerchUID.push(e.address);
              }

              if (isArtType !== -1 && rangeForCompare < localStoragBeacons.listArtRange[isArtType]) {
                // newArr.push({
                //   productAddress: e.address,
                //   productRange,
                //   productName: e.name,
                //   productUUID: e.uuid,
                // });

                newArtUID.push(e.address);
              }

              if (isOtherType !== -1 && rangeForCompare < localStoragBeacons.listOtherRange[isOtherType]) {
                // newArr.push({
                //   productAddress: e.address,
                //   productRange,
                //   productName: e.name,
                //   productUUID: e.uuid,
                // });

                newOtherUID.push(e.address);
                newOtherType.push(localStoragBeacons.listOtherType[isOtherType]);
              }
            }
            // type beacon yang masuk kondisi non checkin
            else {
              if (isCheckinType !== -1 && rangeForCompare < localStoragBeacons.listCheckinRange[isCheckinType]) {
                // newArr.push({
                //   productAddress: e.address,
                //   productRange,
                //   productName: e.name,
                //   productUUID: e.uuid,
                // });

                newCheckinUID.push(e.address);
              }
            }
          });

          setStateListCheckinUID(newCheckinUID);
          setStateListMerchUID(newMerchUID);
          setStateListArtUID(newArtUID);
          setStateListOtherUID(newOtherUID);
          setStateListOtherType(newOtherType);

          setStateListAllBeacons(newArr);
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

  // console.log('PermissionsAndroid.PERMISSIONS', PermissionsAndroid.PERMISSIONS);

  const requestBluetoothPermission = async () => {
    // try {
    //   const granted = await PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    //     {
    //       title: "Cool Photo App Camera Permission",
    //       message:
    //         "Cool Photo App needs access to your camera " +
    //         "so you can take awesome pictures.",
    //       buttonNeutral: "Ask Me Later",
    //       buttonNegative: "Cancel",
    //       buttonPositive: "OK"
    //     }
    //   );
    //   console.log('granted', granted);
    //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //     console.log("You can use the camera");
    //   } else {
    //     console.log("Camera permission denied");
    //   }
    // } catch (err) {
    //   console.warn(err);
    // }
  };

  const onPairingCheckin = async () => {
    if (auth && auth.user && !auth.user.dob) {
      setModalNeedUpdateProfile(true);
    }
    
    if (stateListCheckinUID.length === 0) {
      showLoading('error', 'Tidak Ada perangkat disekitar');
      return;
    }

    setModalLoading(true);

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
      console.log('prof', prof);
    }

    setModalLoading(false);

    showLoading(result.status ? 'success' : 'error', result.message);
  }

  const onPairingMerchant = async () => {
    if (stateListMerchUID.length === 0) {
      return;
    }

    let newListMerchant = [];

    setModalLoading(true);

    stateListMerchUID.map(async (uid, idx) => {
      const body = {
        beacon_uid: uid,
        beacon_type: 'merch',
      };

      console.log('body merch pairing', body);

      const result = await postAPI('user-activity', body);
      console.log('result merch pairing', result);
      if (result.status) {
        newListMerchant.push(result.data);
      }
    });

    setModalLoading(false);

    setListMerchantType(newListMerchant);
  }

  const onPairingArt = async () => {
    let isRefetch = false;
    let newArr = [];
    let newTempUID = [];

    // stateListArtUID.map((i) => {
    //   if (tempCurrentArtPairing.includes(i)) {

    //   } else {
    //     isRefetch = true;
    //   }
    // });

    // if (!isRefetch) {
    //   return;
    // }

    // setModalLoading(true);

    // stateListArtUID.map(async(uid, idx) => {
    //   const body = {
    //     beacon_uid: uid,
    //     beacon_type: 'art',
    //   };

    //   console.log('body art pairing', body);
    //   const result = await postAPI('user-activity', body);
    //   console.log('result art pairing', result);

    //   if (result.status) {
    //     newArr.push(result.data);
    //     newTempUID.push(uid);
    //   }
    // })

    // ini select ONE
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
    // end

    // setModalLoading(false);

    // setListResultArtType(newArr);
    // setTempCurrentArtPairing(newTempUID);
  }

  const onPairingOther = async () => {
    if (stateListOtherUID.length === 0) {
      return;
    }

    stateListOtherUID.map(async (uid, idx) => {
      const body = {
        beacon_uid: uid,
        beacon_type: stateListOtherType[idx],
      };

      if (tempAlreadyPairing.includes(uid)) {
        console.log('tempAlreadyPairing', tempAlreadyPairing);
      } else {
        setTempAlreadyPairing(uid);

        console.log('body other pairing', body);

        const result = await postAPI('user-activity', body);
        console.log('result other pairing', result);
      }
    });
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

  // useEffect(() => {
  //   PushNotification.createChannel(
  //     {
  //       channelId: "helpme-id", // (required)
  //       channelName: "Help Me", // (required)
  //       channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
  //       playSound: true, // (optional) default: true
  //       soundName: "warning_alarm.mp3", // (optional) See `soundName` parameter of `localNotification` function
  //       importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
  //       vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  //     },
  //     (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  //   );
  // }, []);

  useEffect(() => {
    if (isFocused) {
      dispatch({ type: 'BOOKING.CLEAR_BOOKING' });
      fetchBannerList();
      fetchData();
    }
  }, [isFocused]);

  const testApi = async () => {
    const test = await getAPI('user-activity');
    console.log('test', test);
  }

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

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const colorOutputRange = [Color.theme, Color.theme];

  const backgroundInterpolate = animationValue.interpolate({
    inputRange: [0, 100],
    outputRange: colorOutputRange,
    extrapolate: 'clamp',
  });

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

  const spaceContentSize = 8;

  // console.log('localStoragSetting', localStoragSetting);
  // console.log('localStoragBeacons', localStoragBeacons);
  // console.log('auth.checkin', auth);
  // console.log('eaaaa', stateListMerchUID);

  return (
    <Scaffold
      translucent={Platform.OS === 'ios' ? true : false}
      useSafeArea={Platform.OS === 'ios' ? false : true}
      // statusBarAnimatedStyle={
      //   Platform.OS === 'ios'
      //     ? {backgroundColor: backgroundInterpolate}
      //     : isFocused
      //     ? {backgroundColor: backgroundInterpolate}
      //     : {}
      // }
      statusBarColor={Color.theme}
      loadingProps={loadingProps}
      header={
        <HeaderBig
          type='MAIN_HOME'
          // useAnimated
          style={{
            paddingTop: 8,
            // backgroundColor: backgroundInterpolate,
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
                  testApi();
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

              <TouchableOpacity
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
              </TouchableOpacity>
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
          // style={{backgroundColor: colorOutputRange[0]}}
          />
        }
      // style={{
      //   backgroundColor: colorOutputRange[0]
      // }}
      >
        <Container color={Color.theme} paddingTop={8} paddingBottom={statusBarHeight * 3}>
          <Animated.View
            style={{
              width,
              height: width / 3,
              position: 'absolute',
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
              // backgroundColor: backgroundInterpolate,
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
                      <Text size={12} type='medium' letterSpacing={0.5}>{auth.checkin && auth.checkin.location ? auth.checkin.location.name : ''}</Text>
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
                    <Text size={10} letterSpacing={0.15} color={Color.placeholder}>Goyangkan Handphonemu untuk masuk kedalam area</Text>
                  </Column>
                </Row>
              </Row>
            </Container>
          </Container>}

          {showDebug && <>
            <View>
              <Text>Beacon All</Text>
              {stateListAllBeacons.map((i, idx) => {
                return (
                  <View key={idx} style={{ width: '100%', marginBottom: 4, backgroundColor: Color.primarySoft }}>
                    <Text size={12} aling='left'>Address: {i.productAddress}</Text>
                    <Text size={12} aling='left'>Name: {i.productName}</Text>
                    <Text size={12} aling='left'>Range: {i.productRange} cm</Text>
                  </View>
                )
              })}
            </View>

            <Divider />

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
              <Text>Beacon Other</Text>
              {stateListOtherUID.map((i, idx) => {
                return (
                  <View key={idx} style={{ width: '100%', marginBottom: 4, backgroundColor: Color.primarySoft }}>
                    <Text size={12} aling='left'>{i}</Text>
                  </View>
                )
              })}
            </View>
          </>}

          <Container paddingVertical={spaceContentSize}>
            <Banner
              showHeader={false}
              data={listBanner}
              loading={loadingBanner}
            />
          </Container>

          <Divider height={spaceContentSize} />

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

          <Divider />

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

      <Modal
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
      </Modal>

      {/* modal merch */}
      <Modal
        isVisible={isFocused && isCheckin && listMerchantType.length > 0}
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
      </Modal>

      {/* modal success checkin */}
      <Modal
        isVisible={isCheckin && modalSuccessCheckin}
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
              <Text size={22} letterSpacing={0.15} type='medium'>{auth.checkin && auth.checkin.location ? auth.checkin.location.name : ''}</Text>
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
                  setModalSuccessCheckin(false);
                }}
              >
                Tutup
              </Button>
            </Container>
          </View>
        </View>
      </Modal>

      {/* modal art */}
      {/* {isFocused && isCheckin && listMerchantType.length === 0 && listResultArtType.length > 0 && <Modal
        isVisible={true}
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
              <Text size={16} letterSpacing={0.15} type='medium'>Kamu sedang berada di pameran</Text>
            </View>

            <Container width='100%' paddingTop={16}>
              <View style={{ width: '100%' }}>
                {listResultArtType.map((item, idx) => {
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => {
                        navigation.navigate('DetailArtScreen', { item });
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
                      <View style={{aspectRatio: 1}}>
                        <Image
                          source={{ uri: Array.isArray(item.img) && item.img.length > 0 ? item.img[0] : '' }}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 8,
                            backgroundColor: Color.border,
                          }}
                        />
                      </View>
                      <View style={{ flex: 1, padding: 10 }}>
                        <Text align='left' type='medium' numberOfLines={2} letterSpacing={0.1}>{item.title}</Text>
                        <Text align='left' type='medium' numberOfLines={2} size={10} color={Color.disabled}>{item.description}</Text>
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
                  setListResultArtType([]);
                  setTempCurrentArtPairing([]);
                }}
              >
                Tutup
              </Button>
            </Container>
          </View>
        </View>
      </Modal>} */}

      <Modal
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
      </Modal>

      {/* modal need update profile */}
      <Modal
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
      </Modal>

      {/* modal loading */}
      <Modal
        isVisible={modalLoading}
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
      </Modal>
    </Scaffold>
  );
};

export default MainHome;
