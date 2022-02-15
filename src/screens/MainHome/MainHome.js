import React, {useState, useEffect, useRef} from 'react';
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
  PopupEbook,
  Submit,
} from '@src/components';
import ListAuction from 'src/components/Posting/ListAuction';
import ListSoonAuction from 'src/components/Posting/ListSoonAuction';
import ListNews from 'src/components/Posting/ListNews';
import ListPlace from 'src/components/Posting/ListPlace';
import ListEvent from 'src/components/Posting/ListEvent';
import ListJob from 'src/components/Posting/ListJob';
import {Divider, Circle, Container} from '@src/styled';
import {playNotificationSounds} from '@src/utils/notificationSounds';
import CarouselView from 'src/components/CarouselView';
import Banner from 'src/components/Banner';
import Client from '@src/lib/apollo';
import {queryContentProduct} from '@src/lib/query';
import {queryBannerList, queryPromoBanners} from '@src/lib/query/banner';
import ModalPosting from './ModalPosting';
import ListEmergency from 'src/components/Posting/ListEmergency';
import {usePreviousState} from 'src/hooks';
import MusikTerbaru from 'src/components/MusikTerbaru';
import MondayAccoustic from './MondayAccoustic';
import WidgetBalance from 'src/components/WidgetBalance';
import WidgetMenuHome from './WidgetMenuHome';
import PostingHeader from 'src/components/Posting/PostingHeader';
import {shadowStyle} from 'src/styles';
import {adsPopup} from 'assets/images/popup';
import {listDummyBanner} from 'assets/images/banner';

import Geolocation from 'react-native-geolocation-service';
import { accessClient } from 'src/utils/access_client';

const dataPromoDummy = {
  productName: 'Halo selamat datang!',
  productCategory: 'Promo',
  image: adsPopup,
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
  const [dataPopupAds, setDataPopupAds] = useState();
  const [showPopupAds, setShowPopupAds] = useState(false);

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

  const [animationValue] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);

  const [firebaseLocationDocId, setFirebaseLocationDocId] = useState('');

  const prevFirebaseNotifierLastChatCount = usePreviousState(
    firebaseNotifierLastChatCount,
  );

  const user = useSelector(state => state['user.auth'].login.user);
  const dispatch = useDispatch();
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const modalPostingRef = useRef();
  const {width} = useWindowDimensions();

  useEffect(() => {
    fetchPromoBanners();

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
      fetchBannerList();
      fetchData();
    }
  }, [isFocused]);

  useEffect(() => {
    setTimeout(() => {
      const successCallback = res => {
        firestore()
          .collection('location-community')
          .where('userId', '==', user.userId)
          .limit(1)
          .get()
          .then(snap => {
            if (snap) {
              const values = {
                position: [res.coords.latitude, res.coords.longitude],
                userId: user.userId,
              };
              console.log('res gettttt', snap);

              if (snap.docs.length > 0) {
                docID = snap._docs[0]._ref._documentPath._parts[1];
                setFirebaseLocationDocId(docID);

                console.log('doc', docID);
                firestore()
                  .collection('location-community')
                  .doc(firebaseLocationDocId)
                  .update(values)
                  .then(
                    console.log(
                      'ini update',
                      res.coords.latitude,
                      firebaseLocationDocId,
                    ),
                  )
                  .catch(err => console.log('error', err));
              } else {
                firestore()
                  .collection('location-community')
                  .add(values)
                  .then(console.log('ini add'))
                  .catch(err => console.log('error', err));
              }
            }
          });
      };

      const errorCallback = err => {
        console.log('ini err', err);
      };

      const option = {
        enableHighAccuracy: true,
      };
      Geolocation.watchPosition(successCallback, errorCallback, option);
    }, 5000);
  }, []);

  const fetchBannerList = () => {
    Client.query({
      query: queryBannerList,
    })
      .then(res => {
        console.log('res banner list', res);
        setListBanner(res.data.bannerList);
        setLoadingBanner(false);
      })
      .catch(err => {
        console.log(err, 'err banner list');
      });
  };

  // Popup Banners
  const fetchPromoBanners = () => {
    Client.query({
      query: queryPromoBanners,
    })
      .then(res => {
        console.log('res Promo Banners', res);
        setDataPopupAds(res.data.promoBanners);
        setShowPopupAds(true);
      })
      .catch(err => {
        console.log(err, 'err Promo Banners');
        setDataPopupAds();
        setShowPopupAds(true);
      });
  };

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

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const colorOutputRange = [
    accessClient.MainHome.type === 'komoto' ? Color.theme : Color.primarySoft,
    Color.theme
  ];

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

  // const ModalPopupEbook = () => {
  //     return (
  //       <View style={{flex: 1}}>
  //         <Modal isVisible='true'>

  //         </Modal>
  //       </View>
  //     )
  // }

  return (
    <Scaffold
      translucent={Platform.OS === 'ios' ? true : isFocused}
      // useSafeArea={Platform.OS === 'ios' ? false : isFocused ? false : true}
      useSafeArea={Platform.OS === 'ios' ? false : true}
      statusBarAnimatedStyle={
        Platform.OS === 'ios'
          ? {backgroundColor: backgroundInterpolate}
          : isFocused
          ? {backgroundColor: backgroundInterpolate}
          : {}
      }
      header={
        <HeaderBig
          useAnimated
          style={{
            paddingTop: 8,
            backgroundColor: backgroundInterpolate,
          }}
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
                    <Text size={8} color={Color.textInput}>
                      {notifierCount > 99 ? '99' : notifierCount}
                    </Text>
                  </Circle>
                )}
              </TouchableOpacity>
            </View>
          }
        />
      }>
      <ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {y: animationValue},
              },
            },
          ],
          {useNativeDriver: false},
        )}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            style={{backgroundColor: colorOutputRange[0]}}
          />
        }
        // style={{
        //   backgroundColor: colorOutputRange[0]
        // }}
      >
        <Container color={Color.theme}>
          <Animated.View
            style={{
              width,
              height: width / 3,
              position: 'absolute',
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
              backgroundColor: backgroundInterpolate,
            }}
          />

          <View
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
          </View>

          {accessClient.MainHome.showWidgetBalance && 
            <>
              <WidgetBalance />
              <Divider />
            </>
          }

          <WidgetMenuHome
            onPress={item => {
              console.log(item, 'item');

              if (item.code === 'post') {
                modalPostingRef.current.open();
              }
            }}
          />

          <Text onPress={() => navigation.navigate('AddProduct')}>E-commerce</Text>

          {accessClient.MainHome.showListEbookNewer && <Text
            color={Color.red}
            style={{marginTop: 24}}
            onPress={() => toggleModal()}>
            Popup E book
          </Text>}

          <View style={{flex: 1}}>
            <Modal
              isVisible={isModalVisible}
              onBackdropPress={() => setIsModalVisible(false)}
              animationIn="slideInDown"
              animationOut="slideOutDown"
              style={{borderRadius: 16}}>
              <View style={{backgroundColor: '#fff'}}>
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
                      style={{width: 16, height: 16}}
                    />
                  </TouchableOpacity>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{marginRight: 16}}>
                      <Image source={ImagesPath.eBook} />
                    </View>
                    <View>
                      <View style={{width: '86%'}}>
                        <Text
                          align="left"
                          size={14}
                          style={{fontWeight: 'bold'}}>
                          Seni Berlorem Ipsum Dulur Sit Amet
                        </Text>
                      </View>
                      <Text align="left" size={10}>
                        Karya Esa Riski Hari Utama
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: 12,
                            marginRight: 20,
                          }}>
                          <Image
                            source={ImagesPath.eye}
                            style={{width: 16, height: 16, marginRight: 9}}
                          />
                          <Text align="left" size={10}>
                            1.7K
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 12}}>
                          <Image
                            source={ImagesPath.thumbsUp}
                            style={{width: 16, height: 16, marginRight: 9}}
                          />
                          <Text align="left" size={10}>
                            240
                          </Text>
                        </View>
                      </View>
                      <View style={{marginTop: 16}}>
                        <Text
                          align="left"
                          size={11}
                          style={{fontWeight: 'bold'}}>
                          Sinopsis
                        </Text>
                      </View>
                      <View style={{width: '80%'}}>
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
                        style={{width: 22, height: 22}}
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
          </View>

          <Divider />

          <Banner
            isDummy
            showHeader={accessClient.MainHome.showBannerHeader}
            data={listDummyBanner || listBanner}
            loading={loadingBanner}
          />

          <Divider height={24} />

          {accessClient.MainHome.showListAuction && <ListAuction
            // use the listBelajar for the test
            data={listBelajar}
            loading={loadingAuction}
            horizontal
            showHeader
            onPress={item => {
              navigation.navigate('AuctionDetail', {item});
            }}
            style={{paddingLeft: 8}}
          />}

          {accessClient.MainHome.showListSoonAuction && <ListSoonAuction
            // use the listBelajar for the test
            data={listBelajar}
            loading={loadingSoonAuction}
            horizontal
            showHeader
            onPress={item => {
              navigation.navigate('AuctionDetail', {item});
            }}
            style={{paddingLeft: 8}}
          />}

          <ListEmergency
            data={listEmergencyArea}
            loading={loadingEmergency}
            horizontal
            showHeader
            onPress={item => {
              navigation.navigate('EmergencyDetail', {item});
            }}
            style={{paddingLeft: 8}}
          />

          <ListNews
            data={listTampil}
            loading={loadingTampil}
            horizontal
            showHeader
            onPress={item => {
              navigation.navigate('NewsDetail', {item});
            }}
            style={{paddingLeft: 8}}
          />

          {accessClient.MainHome.showListPromo && <View style={{marginBottom: 40}}>
            <PostingHeader title="Promo Untukmu" showSeeAllText={false} />
            <Divider height={8} />
            <CarouselView
              delay={5000}
              showIndicator
              style={{width, aspectRatio: 21 / 9}}>
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
                      color={Color.textInput}
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
                            Sekarang di TRIBESOCIAL {'\n'} udah ada fitur{' '}
                            <Text type="bold">lelang</Text> loh !
                          </Text>
                          <Button
                            onPress={() => navigation.navigate('Lelang')}
                            style={{
                              backgroundColor: '#f58645',
                              minHeight: 25,
                              marginTop: 8,
                              borderRadius: 20,
                            }}>
                            <Row>
                              <Text color={Color.textInput} size={10}>
                                Selengkapnya
                                <AntDesign
                                  name="arrowright"
                                  color={Color.textInput}
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
          </View>}

          <ListPlace
            data={listJalanJalan}
            loading={loadingJalanJalan}
            horizontal
            showHeader
            onPress={item => {
              navigation.navigate('PlaceDetail', {item});
            }}
            style={{paddingLeft: 8}}
          />

          <ListEvent
            data={listBelajar}
            loading={loadingBelajar}
            horizontal
            showHeader
            onPress={item => {
              navigation.navigate('EventDetail', {item});
            }}
            style={{paddingLeft: 8}}
          />

          {accessClient.MainHome.showListJob && (
            <ListJob
              data={listKerja}
              loading={loadingKerja}
              horizontal
              showHeader
              onPress={item => {
                navigation.navigate('JobDetail', {item});
              }}
              style={{paddingLeft: 8}}
            />
          )}

          {accessClient.MainHome.showListMusicNewer && <MusikTerbaru />}

          <Divider />

          {accessClient.MainHome.showListYoutube && <MondayAccoustic />}

          {accessClient.MainHome.showListEbookNewer && <View>
            <View>
              <Text
                style={{
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: 18,
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                }}>
                Rilisan Terbaru
              </Text>
              <FlatList
                data={[
                  {image: ImagesPath.ebook1},
                  {image: ImagesPath.ebook2},
                  {image: ImagesPath.ebook1},
                  {image: ImagesPath.ebook2},
                  {image: ImagesPath.ebook1},
                  {image: ImagesPath.ebook2},
                ]}
                renderItem={({item}) => (
                  <TouchableOpacity>
                    <Image source={item.image} style={{marginHorizontal: 15}} />
                  </TouchableOpacity>
                )}
                horizontal={true}
              />
            </View>
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('Ebook')}>
                <Text
                  style={{
                    color: Color.info,
                    paddingVertical: 20,
                    textAlign: 'right',
                    paddingHorizontal: 20,
                  }}>
                  Selengkapnya
                </Text>
              </TouchableOpacity>
            </View>
          </View>}
        </Container>
      </ScrollView>

      {/* android - untuk mencegah klik laundry bag yang belakang ikut ter klik */}
      {/* <Box size={70} style={{position: 'absolute', bottom: -40}} /> */}
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
        animationIn="slideInDown"
        animationOut="slideOutDown"
        backdropColor={Color.semiwhite}>
        <View style={{width: '90%', aspectRatio: 9 / 16, alignSelf: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              tempShowPopupAds = false;
              setShowPopupAds(false);
              // navigation.navigate('DetailPromo', {item: dataPromoDummy});
            }}>
            <ImageBackground
              source={
                dataPopupAds && dataPopupAds.picture && dataPopupAds.picture.url
                  ? {uri: dataPopupAds.picture.url}
                  : adsPopup
              }
              imageStyle={{borderRadius: 12}}
              style={{height: '100%', resizeMode: 'contain', width: '100%'}}>
              <TouchableOpacity
                onPress={() => {
                  tempShowPopupAds = false;
                  setShowPopupAds(false);
                }}
                style={{
                  alignSelf: 'flex-end',
                  padding: 4,
                  margin: 8,
                  backgroundColor: Color.error,
                  borderRadius: 50,
                }}>
                <Image
                  source={ImagesPath.icClose}
                  style={{width: 20, height: 20}}
                />
              </TouchableOpacity>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </Modal>
    </Scaffold>
  );
};

export default MainHome;
