import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useIsFocused} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Modal from 'react-native-modal';
import Config from 'react-native-config';
import ImagesPath from 'src/components/ImagesPath';

import {
  Text,
  TouchableOpacity,
  HeaderBig,
  useColor,
  Scaffold,
  Row,
  Col,
  Button,
} from '@src/components';
import ListAuction from 'src/components/Posting/ListAuction';
import ListSoonAuction from 'src/components/Posting/ListSoonAuction';
import ListNews from 'src/components/Posting/ListNews';
import ListPlace from 'src/components/Posting/ListPlace';
import ListEvent from 'src/components/Posting/ListEvent';
import ListJob from 'src/components/Posting/ListJob';
import {Box, Divider, Circle, Container} from '@src/styled';
import {playNotificationSounds} from '@src/utils/notificationSounds';
import CarouselView from 'src/components/CarouselView';
import BannerHome from 'src/components/BannerHome';
import Client from '@src/lib/apollo';
import {queryContentProduct, queryBannerList} from '@src/lib/query';
import ModalPosting from './ModalPosting';
import ListEmergency from 'src/components/Posting/ListEmergency';
import {usePreviousState} from 'src/hooks';
import MusikTerbaru from 'src/components/MusikTerbaru';
import MondayAccoustic from './MondayAccoustic';
import WidgetBalance from 'src/components/WidgetBalance';
import WidgetMenuHome from './WidgetMenuHome';

const dataSabyan = {
  productName: 'New Sabyan Album',
  productCategory: 'Promo',
  image: ImagesPath.popUpSabyan,
  productDescription:
    'Cupcake ipsum dolor sit amet tart. Cookie carrot cake bear claw jujubes muffin. Cotton candy sweet candy chocolate muffin bonbon. Tart donut apple pie cupcake tart tart. Jelly-o chocolate cake ice cream shortbread biscuit chupa chups dessert. Macaroon cotton candy lollipop marshmallow dragée toffee shortbread macaroon dessert. Bear claw gummi bears pie apple pie tiramisu soufflé bonbon. Tiramisu tart candy croissant jujubes marshmallow lemon drops. Ice cream muffin pastry halvah chocolate bar bear claw. Tart icing pudding jelly-o fruitcake fruitcake. Tiramisu sweet pastry caramels sugar plum sweet gingerbread. Macaroon powder gummies tootsie roll muffin. Cookie danish candy jelly beans biscuit. Soufflé cake pudding fruitcake macaroon jelly beans.',
};

let tempShowPopupAds = true;

const MainHome = ({navigation, route}) => {
  // state
  const [firebaseData, setFirebaseData] = useState([]);
  const [firebaseNotifierLastChatCount, setFirebaseNotifierLastChatCount] =
    useState(0);
  const [notifierCount, setNotifierCount] = useState(0);
  const [showPopupAds, setShowPopupAds] = useState(true);

  const [loadingAuction, setLoadingAuction] = useState(true);

  const [loadingSoonAuction, setLoadingSoonAuction] = useState(true);

  const [loadingEmergency, setLoadingEmergency] = useState(true);
  const [listEmergencyArea, setListEmergencyArea] = useState([]);

  const [loadingTampil, setLoadingTampil] = useState(true);
  const [listTampil, setListTampil] = useState([]);

  const [loadingJalanJalan, setLoadingJalanJalan] = useState(true);
  const [listJalanJalan, setListJalanJalan] = useState([]);

  const [loadingBelajar, setLoadingBelajar] = useState(true);
  const [listBelajar, setListBelajar] = useState([]);

  const [loadingKerja, setLoadingKerja] = useState(true);
  const [listKerja, setListKerja] = useState([]);

  const [loadingBanner, setLoadingBanner] = useState(true);
  const [listBanner, setListBanner] = useState([]);

  const user = useSelector(state => state['user.auth'].login.user);
  const dispatch = useDispatch();

  const {Color} = useColor();
  const isFocused = useIsFocused();
  const modalPostingRef = useRef();
  const prevFirebaseNotifierLastChatCount = usePreviousState(
    firebaseNotifierLastChatCount,
  );

  useEffect(() => {
    const subscriber = firestore()
      .collection('contentChatNotifier')
      .orderBy('id', 'desc')
      .where('member', 'array-contains-any', [user.userId.toString()])
      .onSnapshot(
        res => {
          // console.log('res chat notifier', res);

          if (res) {
            let newData = [];

            res.docs.map(i => {
              newData.push(i.data());
            });

            setFirebaseData(newData);
          }
        },
        error => {
          console.log('error fstore', error);
        },
      );

    return () => subscriber();
  }, []);

  useEffect(() => {
    if (firebaseData.length > 0) {
      let result = 0;
      let lastChatCount = 0;

      if (firebaseData.length > 0) {
        for (let i = 0; i < firebaseData.length; i++) {
          const idxOf =
            firebaseData[i].read &&
            firebaseData[i].read.indexOf(user.userId.toString());

          if (idxOf === -1) {
            result += 1;
          }

          lastChatCount += firebaseData[i].lastChatCount;
        }
      }

      if (result > 0) setFirebaseNotifierLastChatCount(lastChatCount);
      setNotifierCount(result);
    }
  }, [firebaseData]);

  useEffect(() => {
    if (
      firebaseNotifierLastChatCount > 0 &&
      prevFirebaseNotifierLastChatCount !== firebaseNotifierLastChatCount
    ) {
      playNotificationSounds();
    }
  }, [firebaseNotifierLastChatCount]);

  useEffect(() => {
    if (isFocused) {
      dispatch({type: 'BOOKING.CLEAR_BOOKING'});
      fetchData();
    }
  }, [isFocused]);

  useEffect(() => {
    Client.query({
      query: queryBannerList,
    })
      .then(res => {
        console.log(res);
        console.log(res.data.bannerList);
        setListBanner(res.data.bannerList);
        setLoadingBanner(false);
      })
      .catch(err => {
        console.log(err, 'err banner list');
      });
  }, []);

  const fetchData = async () => {
    const result = await Promise.all([
      await fetchContentProduct(Config.PRODUCT_TYPE, 'EMERGENCY', ''),
      await fetchContentProduct(Config.PRODUCT_TYPE, 'POSTING', ''),
      await fetchContentProduct(Config.PRODUCT_TYPE, 'NEARBY_PLACE', ''),
      await fetchContentProduct(Config.PRODUCT_TYPE, 'EVENT', ''),
      await fetchContentProduct(Config.PRODUCT_TYPE, 'JOBS', ''),
    ]);

    setLoadingAuction(false);

    setLoadingSoonAuction(false);

    setLoadingEmergency(false);
    setListEmergencyArea(result[0]);

    setLoadingTampil(false);
    setListTampil(result[1]);

    setLoadingJalanJalan(false);
    setListJalanJalan(result[2]);

    setLoadingBelajar(false);
    setListBelajar(result[3]);

    setLoadingKerja(false);
    setListKerja(result[4]);
  };

  const fetchContentProduct = async (
    productType,
    productCategory,
    productSubCategory,
  ) => {
    const variables = {
      page: 0,
      itemPerPage: 6,
    };

    if (productType) {
      variables.productType = productType;
    }

    if (productCategory) {
      variables.productCategory = productCategory;
    }

    if (productSubCategory) {
      variables.productSubCategory = productSubCategory;
    }

    const result = await Client.query({
      query: queryContentProduct,
      variables,
    });

    if (
      result &&
      result.data &&
      result.data.contentProduct &&
      Array.isArray(result.data.contentProduct)
    ) {
      return result.data.contentProduct;
    } else {
      return [];
    }
  };

  return (
    <Scaffold
      header={
        <HeaderBig
          style={{paddingTop: 8}}
          actions={
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
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
                  color={Color.text}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ChatRoomsScreen');
                }}
                style={{
                  width: '20%',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-end',
                }}>
                <Ionicons name="chatbox-outline" size={22} color={Color.text} />
                {notifierCount > 0 && (
                  <Circle
                    size={12}
                    color={Color.error}
                    style={{position: 'absolute', top: -4, right: -4}}>
                    <Text size={8}>
                      {notifierCount > 99 ? '99' : notifierCount}
                    </Text>
                  </Circle>
                )}
              </TouchableOpacity>
            </View>
          }
        />
      }>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            paddingVertical: 20,
          }}>
          <View style={{paddingLeft: 16, alignItems: 'flex-start'}}>
            <Text lineHeight={18} letterSpacing={0.45}>
              Halo,
            </Text>
            <Divider height={4} />
            <Text size={24} type="bold" letterSpacing={0.45}>
              {user && !user.guest
                ? user.firstName.trim() +
                  (user.lastName ? ' ' + user.lastName.trim() : '')
                : 'Tamu'}
              !
            </Text>
          </View>
        </View>

        <WidgetBalance />

        <Divider />

        <BannerHome data={listBanner} loading={loadingBanner} />

        <WidgetMenuHome />

        <Divider height={24} />

        <ListAuction
          // use the listBelajar for the test
          data={listBelajar}
          loading={loadingAuction}
          horizontal
          showHeader
          onPress={item => {
            navigation.navigate('AuctionDetail', {item});
          }}
          style={{paddingLeft: 8}}
        />

        <ListSoonAuction
          // use the listBelajar for the test
          data={listBelajar}
          loading={loadingSoonAuction}
          horizontal
          showHeader
          onPress={item => {
            navigation.navigate('AuctionDetail', {item});
          }}
          style={{paddingLeft: 8}}
        />

        <ListEmergency
          data={listEmergencyArea}
          loading={loadingEmergency}
          horizontal
          showHeader
          onPress={item => {
            // navigation.navigate('EmergencyDetail', {item});
            navigation.navigate('PostingDetail', {item});
          }}
          style={{paddingLeft: 8}}
        />

        <ListNews
          data={listTampil}
          loading={loadingTampil}
          horizontal
          showHeader
          onPress={item => {
            // navigation.navigate('NewsDetail', {item});
            navigation.navigate('PostingDetail', {item});
          }}
          style={{paddingLeft: 8}}
        />

        <View style={{marginBottom: 30}}>
          <Row>
            <Col size={6}>
              <Image
                resizeMode="contain"
                source={ImagesPath.logolelanghome}
                style={{height: 150, width: 140, marginLeft: 15}}
              />
            </Col>
            <Col justifyContent="center">
              <Text size={12} align="left">
                Sekarang di TRIBESOCIAL {'\n'} udah ada fitur{' '}
                <Text type="bold">lelang</Text> loh !
              </Text>
              <Button
                onPress={() => navigation.navigate('Lelang')}
                style={{
                  backgroundColor: '#f58645',
                  minHeight: 25,
                  width: 120,
                  marginTop: 8,
                  borderRadius: 20,
                }}>
                <Row>
                  <Text color={Color.textInput} size={10}>
                    Selengkapnya
                  </Text>
                  <View style={{justifyContent: 'center'}}>
                    <AntDesign
                      name="arrowright"
                      color={Color.textInput}
                      style={{marginLeft: 8}}
                    />
                  </View>
                </Row>
              </Button>
            </Col>
          </Row>
        </View>

        <ListPlace
          data={listJalanJalan}
          loading={loadingJalanJalan}
          horizontal
          showHeader
          onPress={item => {
            // navigation.navigate('PlaceDetail', {item});
            navigation.navigate('PostingDetail', {item});
          }}
          style={{paddingLeft: 8}}
        />

        <ListEvent
          data={listBelajar}
          loading={loadingBelajar}
          horizontal
          showHeader
          onPress={item => {
            // navigation.navigate('EventDetail', {item});
            navigation.navigate('PostingDetail', {item});
          }}
          style={{paddingLeft: 8}}
        />

        <ListJob
          data={listKerja}
          loading={loadingKerja}
          horizontal
          showHeader
          onPress={item => {
            // navigation.navigate('JobDetail', {item});
            navigation.navigate('PostingDetail', {item});
          }}
          style={{paddingLeft: 8}}
        />

        <MusikTerbaru />

        <Divider />
        
        <MondayAccoustic />
      </ScrollView>

      {/* android - untuk mencegah klik laundry bag yang belakang ikut ter klik */}
      <Box size={70} style={{position: 'absolute', bottom: -40}} />
      {/*  */}

      <ModalPosting
        ref={modalPostingRef}
        selected={null}
        onPress={e => {
          navigation.navigate(e.nav, e.params);
          modalPostingRef.current.close();
        }}
      />

      <Modal
        isVisible={tempShowPopupAds && showPopupAds}
        onBackdropPress={() => {
          tempShowPopupAds = false;
          setShowPopupAds(false);
        }}
        animationIn="slideInUp"
        animationOut="slideOutDown">
        <View style={{height: '75%'}}>
          <TouchableOpacity
            onPress={() => {
              tempShowPopupAds = false;
              setShowPopupAds(false);
              navigation.navigate('DetailPromo', {item: dataSabyan});
            }}>
            <ImageBackground
              source={ImagesPath.popUpTribes}
              imageStyle={{borderRadius: 13}}
              style={{height: '100%', resizeMode: 'contain', width: '100%'}}>
              <TouchableOpacity
                onPress={() => {
                  tempShowPopupAds = false;
                  setShowPopupAds(false);
                }}
                style={{
                  alignSelf: 'flex-end',
                  padding: 3,
                  margin: 10,
                  backgroundColor: Color.gray,
                  borderRadius: 12,
                }}>
                <Image
                  source={ImagesPath.icClose}
                  style={{width: 20, height: 20, top: 0}}></Image>
              </TouchableOpacity>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </Modal>
    </Scaffold>
  );
};

export default MainHome;
