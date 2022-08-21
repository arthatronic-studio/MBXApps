import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  ImageBackground,
  useWindowDimensions,
  Animated,
  RefreshControl,
  Platform,
  FlatList,
  Linking,
  DeviceEventEmitter,
  NativeEventEmitter,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from '@react-navigation/native';
import Modal from 'react-native-modal';
import Config from 'react-native-config';
import { io } from 'socket.io-client';
import RNShake from 'react-native-shake';

import ImagesPath from 'src/components/ImagesPath';
import {
  Text,
  TouchableOpacity,
  HeaderBig,
  useColor,
  Scaffold,
  Col,
  Button,
  Submit,
  useLoading,
  usePopup,
  Alert,
} from '@src/components';
import { Divider, Circle, Container, Line, Row, Column } from '@src/styled';
import { playNotificationSounds } from '@src/utils/notificationSounds';
import CarouselView from 'src/components/CarouselView';
import Banner from 'src/components/Banner';
import Client from '@src/lib/apollo';
import { queryBannerList } from '@src/lib/query/banner';
import ModalPosting from './ModalPosting';
import MusikTerbaru from 'src/components/MusikTerbaru';
import WidgetBalance from 'src/components/WidgetBalance';
import WidgetMenuHome from 'src/screens/MainHome/WidgetMenuHome';
import PostingHeader from 'src/components/Posting/PostingHeader';
import { shadowStyle } from 'src/styles';
import Geolocation from 'react-native-geolocation-service';
import { accessClient } from 'src/utils/access_client';
import FloatingMusicPlayer from 'src/components/FloatingMusicPlayer';
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import { getSizeByRatio } from 'src/utils/get_ratio';
import MusikAlbum from 'src/components/MusikAlbum';
import HighlightLelang from 'src/components/Card/HighlightLelang';
import HighlightContentProduct from 'src/components/Content/HighlightContentProduct';
import HighlightContentProductV2 from 'src/components/Content/HighlightContentProductV2';
import PushNotification, { Importance } from 'react-native-push-notification';
import { initSocket } from 'src/api-socket/currentSocket';
import { queryGetNotification } from "src/lib/query";
import client from "src/lib/apollo";
import MemberRank from "src/components/MemberRank";
import MyRank from 'src/components/MyRank';
import imageAssets from 'assets/images';
import WidgetHomeMenuStatic from './WidgetHomeMenuStatic';
import { statusBarHeight } from 'src/utils/constants';

import Kontakt, { KontaktModule } from 'react-native-kontaktio';
import ModalActions from 'src/components/Modal/ModalActions';
import FloatingBeaconDetection from 'src/components/Modal/FloatingBeaconDetection';
import { getAPI, postAPI } from 'src/api-rest/httpService';
import HighlightEvent from 'src/components/Event/HighlightEvent';
import { stateUpdateProfile } from 'src/api-rest/stateUpdateProfile';
const { connect, init, startDiscovery, startScanning } = Kontakt;

const kontaktEmitter = new NativeEventEmitter(KontaktModule);
const isAndroid = Platform.OS === 'android';

let tempShowPopupAds = true;
let tempShowFloatingBeacon = true;

const events = [Event.PlaybackTrackChanged];

const MainHome = ({ navigation, route }) => {
  const currentSocket = initSocket();

  // state
  const [chatNotifCount, setChatNotifCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [dataPopupAds, setDataPopupAds] = useState();
  const [showPopupAds, setShowPopupAds] = useState(false);
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [listBanner, setListBanner] = useState([]);
  const [visitorCount, setVisitorCount] = useState(0);

  const [animationValue] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const [thisTrack, setThisTrack] = useState();

  const user = useSelector(state => state['user.auth'].login.user);
  const auth = useSelector(state => state['auth']);

  const dispatch = useDispatch();
  const { Color } = useColor();
  const isFocused = useIsFocused();
  const modalPostingRef = useRef();
  const floatingMusicPlayerRef = useRef();
  const { width, height } = useWindowDimensions();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [popupProps, showPopup] = usePopup();

  const [listBeacon, setListBeacon] = useState([]);
  const [countPrevBeacon, setCountPrevBeacon] = useState(0);
  const [showListBeacon, setShowListBeacon] = useState(false);
  const [listMerchantType, setListMerchantType] = useState([]);
  const [tempAlreadyPairing, setTempAlreadyPairing] = useState([])

  const isCheckin = auth && auth.user && auth.user.isCheckin;

  useEffect(() => {
    beaconSetup();
    beaconFetch();
  }, []);

  useEffect(() => {
    const shakeSubs = RNShake.addListener(() => {
      if (!isCheckin) {
        onCheckin();
      }

      if (isCheckin) {
        setTempAlreadyPairing([]);
      }
    });

    return () => {
      shakeSubs.remove();
    }
  }, [listBeacon]);

  useEffect(() => {
    // const timeout = listBeacon.length > 0 && listBeacon.length !== countPrevBeacon && isCheckin ?
    //   setTimeout(() => {
    //     onPairingSetting();
    //     setCountPrevBeacon(listBeacon.length);
    //   }, 1000)
    // : null;

    // return () => {
    //   clearTimeout(timeout);
    // }

    if (isCheckin && listBeacon.length > 0 && listBeacon.length !== countPrevBeacon) {
      onPairingSetting();
      setCountPrevBeacon(listBeacon.length);
      setTimeout(() => {
        setCountPrevBeacon(0);
      }, 5000);
    }
  }, [listBeacon, countPrevBeacon]);

  const beaconSetup = async () => {
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
      DeviceEventEmitter.addListener('beaconsDidUpdate', ({ beacons, region }) => {
        // console.log('beaconsDidUpdate', beacons, region);
        // console.log('beaconsDidUpdate', beacons);

        if (Array.isArray(beacons)) {
          let newArr = [];

          beacons.map((e, i) => {
            newArr.push({
              ...e,
              productAddress: e.address,
              productAccuracy: e.accuracy,
              productRange: Math.round(e.accuracy),
              productName: e.name,
              productUUID: e.uuid,
            });
          });

          setListBeacon(newArr);
        }
      });

      DeviceEventEmitter.addListener('beaconDidDisappear', ({ beacons, region }) => {
        console.log('beaconDidDisappear', beacons, region);

        // klo beacon ilang, checkout
        // if (region && region.uuid) {
        //   onCheckout();
        // }

        // if (Array.isArray(beacons)) {
        //   let newArr = [];
        //   beacons.map((e, i) => {
        //     newArr.push({
        //       ...e,
        //       productAddress: e.address,
        //       productAccuracy: e.accuracy,
        //       productRange: Math.round(e.accuracy),
        //       productName: e.name,
        //       productUUID: e.uuid,
        //     });
        //   });
        //   setListBeacon(newArr);
        // }
      });
    } else {
      kontaktEmitter.addListener('didDiscoverDevices', ({ beacons }) => {
        console.log('didDiscoverDevices', beacons);
      });
    }
  };

  const beaconFetch = async () => {
    const result = await getAPI('beacon');
    console.log('api beacon', result);
    if (result.status) {
      dispatch({ type: 'AUTH.SET_STATE_BEACONS', data: result.data });
    }
  }

  // handle music analytics
  //
  useTrackPlayerEvents(events, event => {
    if (event.type === Event.PlaybackTrackChanged) {
      // console.log('home track changed', event);
      getCurrentPlaying();
    }
  });

  const getCurrentPlaying = async () => {
    const newCurrent = await TrackPlayer.getCurrentTrack();
    if (newCurrent != null) {
      setThisTrack(await TrackPlayer.getTrack(newCurrent));
    } else {
      setThisTrack();
    }
  };

  const onCheckin = async () => {
    // console.log('auth pas', auth);
    // console.log('listBeacon pas', listBeacon);

    if (listBeacon.length === 0) {
      showLoading('error', 'Tidak Ada perangkat disekitar');
      return;
    }

    // get listingan tipe gate dari storage
    let listAddressGateType = [];
    if (auth && Array.isArray(auth.stateBeacons)) {
      auth.stateBeacons.map((e) => {
        if (e.beacon_type && e.beacon_type.name === 'checkin') {
          listAddressGateType.push({
            beacon_uid: e.beacon_uid,
            beacon_type: e.beacon_type.name,
            range: parseInt(e.range),
          });
        }
      });
    } else {
      showLoading('error', 'Tidak Ada konfigurasi perangkat');
      return;
    }

    console.log('listAddressGateType', listAddressGateType);

    // cek uid di listen masuk tipe gate / checkin
    let nearbyBeaconGateAddress = ''; // 'FF:50:53:D3:6B:60'; // mustdelete
    for (let i = 0; i < listBeacon.length; i++) {
      const e = listBeacon[i];
      const isExist = listAddressGateType.filter((f) => f.beacon_uid === e.productAddress && e.productRange <= f.range)[0];
      console.log('isExist', isExist, e.productRange <= 2);
      if (isExist) {
        nearbyBeaconGateAddress = e.productAddress;
        break;
      }
    }

    if (nearbyBeaconGateAddress === '') {
      showLoading('error', 'Tidak Ada perangkat gerbang disekitar');
      return;
    }

    console.log('nearbyBeaconGateAddress', nearbyBeaconGateAddress);

    const body = {
      beacon_uid: nearbyBeaconGateAddress,
      beacon_type: 'checkin',
    };

    console.log('body', body);

    const result = await postAPI('user-activity', body);
    console.log('result checkin', result);
    if (result.status) {
      dispatch({ type: 'AUTH.SET_CHECKIN', data: result.data });

      const prof = await stateUpdateProfile();
      console.log('prof', prof);
    }

    showLoading(result.status ? 'success' : 'error', result.message);
  }

  const onPairingSetting = async() => {
    // console.log('auth pas', auth);
    console.log('listBeacon pas', listBeacon);

    if (listBeacon.length === 0) {
      return;
    }

    // get listingan tipe gate dari storage
    let listAddressPostCheckin = [];
    if (auth && Array.isArray(auth.stateBeacons)) {
      auth.stateBeacons.map((e) => {
        if (e.beacon_type && e.beacon_type.name !== 'checkin' && e.beacon_type.name !== 'checkout') {
          listAddressPostCheckin.push({
            beacon_uid: e.beacon_uid,
            beacon_type: e.beacon_type.name,
            range: parseInt(e.range),
          });
        }
      });
    } else {
      return;
    }

    console.log('listAddressPostCheckin', listAddressPostCheckin);

    // cek uid di listen masuk tipe gate / checkin
    let nearbyBeacons = [];
    for (let i = 0; i < listBeacon.length; i++) {
      const e = listBeacon[i];
      const isExist = listAddressPostCheckin.filter((f) => f.beacon_uid === e.productAddress && e.productRange <= f.range)[0];
      console.log('isExist', isExist);
      if (isExist) {
        nearbyBeacons.push(isExist);
      }
    }

    if (nearbyBeacons.length === 0) {
      return;
    }

    console.log('nearbyBeacons', nearbyBeacons);

    nearbyBeacons.map(async(itemBody) => {
      const body = {
        beacon_uid: itemBody.beacon_uid,
        beacon_type: itemBody.beacon_type,
      };

      if (tempAlreadyPairing.includes(itemBody.beacon_uid)) {
        console.log('tempAlreadyPairing', tempAlreadyPairing);
      } else {
        setTempAlreadyPairing(itemBody.beacon_uid);
  
        console.log('body', itemBody.beacon_uid, body);
    
        const result = await postAPI('user-activity', body);
        console.log('result itemBody', result);
        if (result.status) {
          setListMerchantType([result.data]);
        }
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

  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: "helpme-id", // (required)
        channelName: "Help Me", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: "warning_alarm.mp3", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }, []);

  useEffect(() => {
    const timeout = thisTrack
      ? setTimeout(() => {
        // console.log('thisTrack', thisTrack);
        GALogEvent(thisTrack.artist, {
          id: thisTrack.id,
          product_name: thisTrack.title,
          user_id: user.userId,
          method: analyticMethods.view,
        });
      }, 1000)
      : null;

    return () => clearTimeout(timeout);
  }, [thisTrack]);
  //
  // end handle music analytics

  useEffect(() => {
    fetchPopup();

    // currentSocket.emit('chat_notification');

    // currentSocket.on('chat_notification', res => {
    //   console.log('res chat_notification', res);
    //   if (res && res.status) {
    //     if (chatNotifCount > 0) {
    //       playNotificationSounds();
    //     }

    //     setChatNotifCount(res.data.count);
    //   }
    // });

    // currentSocket.on('location-tracker-user', res => {
    //   console.log('res location-tracker-user', res);
    // });

    // const successCallback = (res) => {
    //   const ltu = { userId: user.userId, lat: res.coords.latitude, long: res.coords.longitude };
    //   currentSocket.emit('location-tracker-user', ltu);
    // };

    // const errorCallback = err => {
    //   console.log('ini err', err);
    // };

    // const option = {
    //   enableHighAccuracy: true,
    //   timeout: 5000
    // };

    // Geolocation.watchPosition(successCallback, errorCallback, option);
  }, [refreshing]);

  useEffect(() => {
    const variables = {
      page: 0,
      itemPerPage: 9999
    }
    client.query({
      query: queryGetNotification,
      variables,
    })
      .then((respone) => {
        var response = respone['data']['getNotification'];
        var res = response.filter(function (el) {
          return el.status === 1 | el.status === 2;
        });
        setNotificationCount(res.length)
        console.log('ini ', res);
      })
      .catch((err) => {
        console.log('ini ', err);
        console.log(err);

      })
  }, [isFocused]);

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

  const fetchPopup = () => {
    // const variables = {
    //   categoryId: 2,
    // };

    // Client.query({
    //   query: queryBannerList,
    //   variables,
    // })
    //   .then(res => {
    //     console.log('res popup list', res);
    //     if (Array.isArray(res.data.bannerList)) {
    //       setDataPopupAds(res.data.bannerList[0]);
    //     }
    //     setShowPopupAds(true);
    //   })
    //   .catch(err => {
    //     console.log(err, 'err popup list');
    //   });
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

  const colorOutputRange = [Color[accessClient.ColorBgParallax], Color.theme];

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

  // console.log('listBeacon', listBeacon);

  // console.log('auth.checkin', auth);

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
        <View
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

          {/* hide balance */}
          {/* {accessClient.MainHome.showWidgetBalance && (
            <Container paddingVertical={16}>
              <WidgetBalance />
            </Container>
          )} */}

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

          {!isCheckin && listBeacon.length > 0 && <Container padding={16} paddingTop={8}>
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

          <Container paddingVertical={spaceContentSize}>
            <Banner
              showHeader={false}
              data={listBanner}
              loading={loadingBanner}
            />
          </Container>

          <Divider height={spaceContentSize} />

          {/* <Line color={Color.border} width={width} /> */}

          {/* <Container paddingVertical={spaceContentSize}>
            <MemberRank />
          </Container> */}

          {/* <Line color={Color.border} width={width} /> */}

          {/* {accessClient.MainHome.showMenuHome && <WidgetMenuHome
            showMore
            onPress={(item) => {
              console.log(item, 'item');

              if (item.code === 'CREATE_POST') {
                modalPostingRef.current.open();
                return;
              }
            }}
          />} */}

          {auth && auth.user && auth.user.role && auth.user.role.value === 0 && <Container padding={16} paddingTop={8}>
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

          {/* {accessClient.MainHome.showMenuHome && <Line color={Color.border} width={width} />} */}

          {/* <Divider height={spaceContentSize} /> */}

          {/* <HighlightContentProduct
            productCategory='FORUM'
            name='Forum'
            title='Thread Populer'
            nav='ForumScreen'
            refresh={refreshing || isFocused}
          /> */}

          {/* {accessClient.MainHome.showListAuction && (
            <HighlightLelang
              title={`Sedang Berlangsung`}
              nav='LiveLelangScreen'
              prodStatus='ONGOING'
            />
          )} */}

          {/* {accessClient.MainHome.showListSoonAuction && (
            <HighlightLelang
              title={`Akan Datang`}
              nav='LiveLelangScreen'
              prodStatus='WILLCOME'
            />
          )} */}

          {/* hide banner promo */}
          {/* {accessClient.MainHome.showListPromo && (
            <View style={{marginBottom: 40}}>
              <PostingHeader title="Promo Untukmu" showSeeAllText={false} />
              <Divider height={8} />
              <CarouselView
                delay={5000}
                showIndicator
                style={{
                  width,
                  height: getSizeByRatio({width: width - 32, ratio: 9 / 21})
                    .height,
                }}>
                {[0].map((e, idx) => {
                  return (
                    <View
                      key={idx}
                      style={{
                        width: '100%',
                        height: '100%',
                        paddingHorizontal: 16,
                      }}>
                      <Container
                        padding={16}
                        radius={16}
                        color={Color.textButtonInline}
                        style={{...shadowStyle}}>
                        <Row>
                          <Col size={5} align="flex-start">
                            <Image
                              source={ImagesPath.logolelanghome}
                              style={{height: width / 3, width: '100%'}}
                              resizeMode="contain"
                            />
                          </Col>
                          <Col
                            size={7}
                            align="flex-start"
                            justifyContent="center">
                            <Text size={12} align="left">
                              Sekarang di Tribes Social {'\n'} udah ada fitur{' '}
                              <Text type="bold">lelang</Text> loh !
                            </Text>
                            <Button
                              onPress={() => navigation.navigate('Lelang')}
                              style={{
                                backgroundColor: Color.primary,
                                minHeight: 25,
                                marginTop: 8,
                                borderRadius: 20,
                              }}>
                              <Row>
                                <Text color={Color.textButtonInline} size={10}>
                                  Selengkapnya
                                  <AntDesign
                                    name="arrowright"
                                    color={Color.textButtonInline}
                                    style={{alignSelf: 'center'}}
                                  />
                                </Text>
                              </Row>
                            </Button>
                          </Col>
                        </Row>
                      </Container>
                    </View>
                  );
                })}
              </CarouselView>
            </View>
          )} */}

          {/* <HighlightContentProduct
            productCategory='EMERGENCY'
            name='Help Me'
            title='Kondisi Darurat'
            nav='EmergencyScreen'
            refresh={refreshing || isFocused}
          /> */}

          {/* <HighlightContentProduct
            productCategory='Artikel'
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

          {/* <MusikTerbaru /> */}

          {/* <MusikAlbum /> */}

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

          {/* {accessClient.MainHome.showListEbookNewer && (
            <View style={{ paddingVertical: 12 }}>
              <PostingHeader
                title="Rilisan Terbaru"
                showSeeAllText
                onSeeAllPress={() => navigation.navigate('Ebook')}
                productCategory={'NEWEST_EBOOK'}
              />

              <FlatList
                data={[
                  { image: ImagesPath.ebook1 },
                  { image: ImagesPath.ebook2 },
                  { image: ImagesPath.ebook1 },
                ]}
                contentContainerStyle={{
                  marginTop: 8,
                  paddingHorizontal: 8,
                }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      toggleModal();
                    }}
                    style={{
                      width: width / 2.2,
                      aspectRatio: 14/20,
                      paddingHorizontal: 8,
                    }}
                  >
                    <Image
                      source={item.image}
                      style={{
                        borderRadius: 8,
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </TouchableOpacity>
                )}
                horizontal={true}
              />
            </View>
          )} */}
        </Container>
      </ScrollView>

      {/* android - untuk mencegah klik laundry bag yang belakang ikut ter klik */}
      {/* <Box size={70} style={{position: 'absolute', bottom: -40}} /> */}
      {/*  */}

      <FloatingMusicPlayer ref={floatingMusicPlayerRef} />

      <ModalPosting
        ref={modalPostingRef}
        selected={null}
        onPress={e => {
          navigation.navigate(e.nav, e.params);
          modalPostingRef.current.close();
        }}
      />

      {dataPopupAds && (
        <Modal
          isVisible={tempShowPopupAds && showPopupAds}
          onBackdropPress={() => {
            tempShowPopupAds = false;
            setShowPopupAds(false);
          }}
          animationIn="slideInDown"
          animationOut="slideOutDown"
          backdropColor={Color.semiwhite}>
          <View
            style={{ width: '100%', aspectRatio: 1, borderRadius: 16, backgroundColor: Color.primaryDark, }}
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
                      setShowPopupAds(false);
                    }}
                  >
                    I Understand
                  </Button>
                </Container>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <Modal
        isVisible={!isCheckin && tempShowFloatingBeacon && listBeacon.length > 0}
        onBackdropPress={() => {
          tempShowFloatingBeacon = false;
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
                  tempShowFloatingBeacon = false;
                }}
              >
                Tutup
              </Button>
            </Container>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={isCheckin && listMerchantType.length > 0}
        onBackdropPress={() => {
          setListMerchantType([]);
        }}
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
              <View style={{ width: '100%', flexDirection: 'row' }}>
                {listMerchantType.map((item, idx) => {
                  return (
                    <View key={idx} style={{ width: '100%', padding: 10, flexDirection: 'row', borderWidth: 1, borderColor: Color.textSoft, borderRadius: 8}}>
                      <View style={{aspectRatio: 1}}>
                        <Image
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 8,
                            backgroundColor: Color.border,
                          }}
                        />
                      </View>
                      <View style={{ flex: 1, padding: 10 }}>
                        <Text align='left' type='medium' letterSpacing={0.1}>{item.name}</Text>
                        <Text align='left' type='medium' size={10} color={Color.disabled}>{item.type}</Text>
                      </View>
                      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Fontisto
                          name={'angle-right'}
                          color={Color.primaryMoreDark}
                          size={15}
                        />
                      </View>
                    </View>
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

      <FloatingBeaconDetection
        visible={listBeacon.length > 0 && showListBeacon}
        onClose={() => {
          setShowListBeacon(false);
        }}
        data={listBeacon}
      />

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
    </Scaffold>
  );
};

export default MainHome;
