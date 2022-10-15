import React, { useState, useEffect } from 'react';
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
import imageAssets from 'assets/images';
import WidgetHomeMenuStatic from './WidgetHomeMenuStatic';
import { getAPI, postAPI } from 'src/api-rest/httpService';
import HighlightEvent from 'src/components/Event/HighlightEvent';
import { stateUpdateProfile } from 'src/api-rest/stateUpdateProfile';
import HighlightTenant from 'src/screens/Tenant/HighlightTenant';
import { stateBeaconSetting } from 'src/api-rest/stateBeaconSetting';
import { androidBluetoothPermission } from 'src/lib/androidPermissions';
import { shadowStyle } from 'src/styles';
import ModalBeaconPromo from './ModalBeaconPromo';
import ModalLoading from './ModalLoading';
import ModalNeedUpdateProfile from './ModalNeedUpdateProfile';
import ModalBeaconCheckin from './ModalBeaconCheckin';
import DraggableButton from './DraggableButton';
import ListContenEvent from 'src/components/Event/ListContenEvent';
import PostingHeader from 'src/components/Posting/PostingHeader';
import { redirectTo } from 'src/utils';
import HighlightArticle from '../Article/HighlightArticle';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const scanUUIDs = []; // ['fda50693-a4e2-4fb1-afcf-c6eb07647825'];
const scanTimeout = 70;

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
  const [beaconScanning, setBeaconScanning] = useState(false);

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

  // useEffect(() => {
  //   const timeout = !beaconScanning ?
  //     setTimeout(() => {
  //       console.log('scannn kale');
  //       // BleManager.scan(scanUUIDs, scanTimeout, true).then(() => {
  //       //   setBeaconScanning(true);
  //       // });
  //     }, 6000) : null;

  //   return () => {
  //     clearTimeout(timeout);
  //   }
  // }, [beaconScanning]);

  useEffect(() => {
    initialConfig();

    androidBluetoothPermission().then((status) => {
      console.log('status bluetooth', status);
      if (status) {
        BleManager.start({ showAlert: false });
        // BleManager.scan(scanUUIDs, scanTimeout, true).then(() => {
        //   setBeaconScanning(true);
        // });
      }
    });

    bleManagerEmitter.addListener("BleManagerDiscoverPeripheral", (args) => {
      peripherals.set(args.id, args);
      const beacons = Array.from(peripherals.values());
      // console.log('beacons per', beacons);
      setListPeripheral(beacons);
    });

    bleManagerEmitter.addListener('BleManagerStopScan', () => {
      setBeaconScanning(false);
    });

    return () => {
      if (typeof bleManagerEmitter.removeAllListeners === 'function') {
        bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
        bleManagerEmitter.removeAllListeners('BleManagerStopScan');
      }
    }
  }, []);

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

  const onScan = () => {
    androidBluetoothPermission().then((status) => {
      console.log('status bluetooth', status);
      if (status) {
        BleManager.scan(scanUUIDs, scanTimeout, true).then(() => {
          setBeaconScanning(true);
        });
      }
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);

    setTempAlreadyPairing([]);
    await stateBeaconSetting();
    onScan();
    // androidBluetoothPermission().then((status) => {
    //   console.log('status bluetooth', status);
    //   if (status) {
    //     BleManager.scan(scanUUIDs, scanTimeout, true).then(() => {
    //       setBeaconScanning(true);
    //     });
    //   }
    // });

    setRefreshing(false);
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

  const isPromo = false;

  return (
    <Scaffold
      translucent={Platform.OS === 'ios' ? true : false}
      useSafeArea={Platform.OS === 'ios' ? false : true}
      statusBarColor={Color.theme}
      loadingProps={loadingProps}
      header={
        <HeaderBig
          type='MAIN_HOME'
          titleRight={auth.user && auth.user.isGuest ? 'LOGIN' : ''}
          onPressRightButton={() => {
            if (auth.user && auth.user.isGuest) {
              redirectTo('LoginScreenV2');
            }
          }}
          actions={
            auth.user && !auth.user.isGuest && <View>
              <Text size={11} type='medium' align='right'>Hi,</Text>
              <Text size={17} type='medium' align='right'>{auth.user.name.toUpperCase()}</Text>
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
        isSecurity ? <View
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
        : isPromo ? 
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate('SpecialOfferScreen')}
            style={{ 
              padding: 12,
              backgroundColor: Color.black
             }}
          >
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
                borderRadius: 24 
               }}
            >
              <Text size={12} type="mdium" color={Color.white} lineHeight={14}>
                2
              </Text>
            </View> 
        </View>
        : <></>
      }
    >
      {/* <DraggableButton> */}
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

          {isCheckin &&
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
          }

          {!isCheckin && stateListCheckinUID.length > 0 && <Container padding={16} paddingTop={8}>
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
          </Container>}

          {/* {beaconScanning ?
            <View style={{ width: '100%', paddingHorizontal: 16, paddingBottom: 16 }}>
              <View
                style={{
                  paddingHorizontal: 8,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 50,
                }}
              >
                <ActivityIndicator size='small' />
                <Divider width={6} />
                <Text type='medium'>Scanning</Text>
              </View>
            </View>
          :
            <View style={{ width: '100%', paddingHorizontal: 16, paddingBottom: 16 }}>
              <Button
                onPress={() => {
                  onScan();
                }}
              >
                Scan Now
              </Button>
            </View>
          } */}

          {showDebug && renderDebug()}

          {auth.user && auth.user.isRegister && <TouchableOpacity
            onPress={() => navigation.navigate('CompleteProfile')}
            style={{ 
              marginHorizontal: 16,
              borderWidth: 1,
              padding: 10
             }}
          >
            <AntDesign name="exclamationcircleo" size={20} color={"#1C1B1F"} />
            <Divider height={10}/>
            <Text type="semibold" size={12} lineHeight={22} align='left'>
              Looks like you didn't complete your profile
            </Text>
            <Text align='left' size={12} type="medium" lineHeight={14}>
              Complete your profile to get the full experience inside the app
            </Text>
            <Divider height={18}/>
            <Text
              type="medium"
              lineHeight={14}
              align='left'
              onPress={() => {}}
              size={12}
              color={Color.primaryDark}
            >
              Complete Now{' '}
              <Ionicons name="arrow-forward" size={12} color={Color.primaryDark} />
            </Text>
          </TouchableOpacity>}

          <Divider height={spaceContentSize * 2} />

          <ListContenEvent
            productCategory='EVENT'
            name='Event'
            title='● SECURE YOUR TICKET NOW'
            productType='highlight'
            showHeader
            horizontal
            showSeeAllText={false}
          />

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

          {/* <Divider /> */}

          <HighlightTenant
            title='● TENANTS'
            numColumns={1}
            tenantType='eat'
          />

          <Divider />

          <HighlightArticle
            title='● ARTICLES'
            numColumns={1}
            type="HIGHLIGHT"
          />

          {/* <HighlightTenant
            title=''
            tenantType='shop'
          /> */}

          <View>
            <Divider />

            <PostingHeader
              title='● SPARK YOUR IDEAS'
              showSeeAllText={false}
            />

            <Container paddingHorizontal={16} paddingTop={11} paddingBottom={11}>
              <Text size={29} align='left' lineHeight={38}>
                Customers as Industrial Age
                phenomenon will be
                replaced by <Text size={29} type='semibold'>Creative Prosumers</Text>,
                people who produce many of their own
                goods and services.{' '}
                <View>
                  <Text size={11} type='medium' align='left'>Philip Kotler</Text>
                  <Text size={11} type='medium' align='left'>-1986</Text>
                </View>
              </Text>

              <Divider height={11} />

              <Text size={16} type='medium' align='left'>
                We believe colaboration make us stronger,
                join and be part of our movement!
              </Text>

                {/* <TouchableOpacity
                  style={{width: '50%', marginTop: 24, alignSelf: 'flex-end', paddingVertical: 12, borderWidth: 1, borderColor: Color.text}}
                >
                  <Text>Spark Ideas</Text>
                </TouchableOpacity> */}
            </Container>
          </View>
        </Container>
      </ScrollView>
      {/* </DraggableButton> */}

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
                        navigation.navigate('TenantDetailScreen', { item });
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
        <ModalBeaconPromo
          item={null}
          visible
          onClose={() => {

          }}
        />
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
      {modalLoading && isFocused && (
        <ModalLoading
          visible
        />
      )}
    </Scaffold>
  );
};

export default MainHome;
