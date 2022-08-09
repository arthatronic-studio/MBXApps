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
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from '@react-navigation/native';
import Modal from 'react-native-modal';
import Config from 'react-native-config';
import { io } from 'socket.io-client';

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
  Submit,
  useLoading,
} from '@src/components';
import { Divider, Circle, Container, Line } from '@src/styled';
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

let tempShowPopupAds = true;

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

  const [animationValue] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const [thisTrack, setThisTrack] = useState();

  const user = useSelector(state => state['user.auth'].login.user);
  const dispatch = useDispatch();
  const { Color } = useColor();
  const isFocused = useIsFocused();
  const modalPostingRef = useRef();
  const floatingMusicPlayerRef = useRef();
  const { width } = useWindowDimensions();
  const [loadingProps, showLoading] = useLoading();

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

    currentSocket.emit('chat_notification');

    currentSocket.on('chat_notification', res => {
      console.log('res chat_notification', res);
      if (res && res.status) {
        if (chatNotifCount > 0) {
          playNotificationSounds();
        }

        setChatNotifCount(res.data.count);
      }
    });

    currentSocket.on('location-tracker-user', res => {
      console.log('res location-tracker-user', res);
    });

    const successCallback = (res) => {
      const ltu = { userId: user.userId, lat: res.coords.latitude, long: res.coords.longitude };
      currentSocket.emit('location-tracker-user', ltu);
    };

    const errorCallback = err => {
      console.log('ini err', err);
    };

    const option = {
      enableHighAccuracy: true,
      timeout: 5000
    };

    Geolocation.watchPosition(successCallback, errorCallback, option);
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
        // console.log('ini ', res);
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

  const fetchBannerList = () => {
    const variables = {
      categoryId: 1,
    };

    Client.query({
      query: queryBannerList,
      variables,
    })
      .then(res => {
        console.log('res banner list', res);
        setListBanner(res.data.bannerList);
        setLoadingBanner(false);
      })
      .catch(err => {
        console.log(err, 'err banner list');
        setLoadingBanner(false);
      });
  };

  const fetchPopup = () => {
    const variables = {
      categoryId: 2,
    };

    Client.query({
      query: queryBannerList,
      variables,
    })
      .then(res => {
        console.log('res popup list', res);
        if (Array.isArray(res.data.bannerList)) {
          setDataPopupAds(res.data.bannerList[0]);
        }
        setShowPopupAds(true);
      })
      .catch(err => {
        console.log(err, 'err popup list');
      });
  };

  const fetchData = async () => {

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
      statusBarColor={Color.primary}
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

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Chat');
                  // navigation.navigate('ChatRoomsScreen');
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
              </TouchableOpacity>
            </View>
          }
        />
      }
      floatingActionButton={
        accessClient.isKomoto ?
          <View
            style={{
              bottom: -16,
              height: width / 5 - 8,
              width: width / 5 - 8,
              borderRadius: width / 5 - 8,
              backgroundColor: Color.primary,
              alignSelf: 'center',
              ...shadowStyle,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                const isJoinMember = user && user.organizationId;

                if (!isJoinMember) {
                  showLoading('error', 'Fitur ini hanya untuk anggota komunitas');
                  return;
                }

                navigation.navigate('CreateEmergencyScreen', {
                  routeIndex: 1,
                  title: 'Help Me',
                  productType: Config.PRODUCT_TYPE,
                  productCategory: '',
                  productSubCategory: 'EMERGENCY',
                });
              }}
              style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
            >
              <MaterialIcons
                name='vibration'
                color={Color.textButtonInline}
                size={32}
              />
            </TouchableOpacity>
          </View> : <View />
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
        <Container color={Color.theme} paddingTop={8}>
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

          {/* <Divider /> */}

          {/* <MyRank /> */}

          <Container paddingVertical={spaceContentSize}>
            <Banner
              showHeader={false}
              data={listBanner}
              loading={loadingBanner}
            />
          </Container>

          <Divider height={spaceContentSize} />

          {accessClient.MainHome.showMemberRank && <Line color={Color.border} width={width} />}

          {accessClient.MainHome.showMemberRank && <Container paddingVertical={spaceContentSize}>
            <MemberRank />
          </Container>}

          {accessClient.MainHome.showMenuHome && <Line color={Color.border} width={width} />}

          {accessClient.MainHome.showMenuHome && <WidgetMenuHome
            showMore
            onPress={(item) => {
              console.log(item, 'item');

              if (item.code === 'CREATE_POST') {
                modalPostingRef.current.open();
                return;
              }
            }}
          />}

          <Divider height={spaceContentSize} />

          <HighlightContentProduct
            productCategory='FORUM'
            name='Forum'
            title='Thread Populer'
            nav='ForumTopicScreen'
            refresh={refreshing || isFocused}
          />

          {accessClient.MainHome.showListAuction && (
            <HighlightLelang
              title={`Sedang Berlangsung`}
              nav='LiveLelangScreen'
              prodStatus='ONGOING'
            />
          )}

          {accessClient.MainHome.showListSoonAuction && (
            <HighlightLelang
              title={`Akan Datang`}
              nav='LiveLelangScreen'
              prodStatus='WILLCOME'
            />
          )}

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

          <HighlightContentProduct
            productCategory='EMERGENCY'
            name='Help Me'
            title='Kondisi Darurat'
            nav='EmergencyScreen'
            refresh={refreshing || isFocused}
          />

          {/* <HighlightContentProduct
            productCategory='POSTING'
            name='Artikel'
            title='Artikel Populer'
            nav='NewsScreen'
            refresh={refreshing || isFocused}
          /> */}

          <HighlightContentProductV2
            productCategory='ARTIKEL'
            name='Artikel'
            title='Artikel Populer'
            nav='NewsScreenV2'
            refresh={refreshing || isFocused}
            orderBy="like"
          />

          <HighlightContentProduct
            productCategory='NEARBY_PLACE'
            name='Tempat'
            title='Tempat Terdekat'
            nav='PlaceScreen'
            horizontal
            refresh={refreshing || isFocused}
          />

          <HighlightContentProduct
            productCategory='EVENT'
            name='Event'
            title='Event Terbaru'
            nav='EventScreen'
            refresh={refreshing || isFocused}
          />

          <HighlightContentProduct
            productCategory='JOBS'
            name='Loker'
            title='Lowongan Pekerjaan'
            nav='JobScreen'
            refresh={refreshing || isFocused}
          />

          <MusikTerbaru />

          <MusikAlbum />

          {/* isFocused handle android navigate crash from home */}
          {/* {isFocused && <HighlightContentProduct
            productCategory='YOUTUBE_VIDEO'
            name='Live'
            title='Siaran Langsung'
            nav='YoutubeScreen'
            refresh={refreshing}
            style={{paddingHorizontal: 0}}
          />} */}

          <HighlightContentProduct
            productCategory='NEWEST_VIDEO'
            name='Video'
            title='Video Terbaru'
            nav='VideoScreen'
            refresh={refreshing || isFocused}
            style={{ paddingHorizontal: 0 }}
          />

          {accessClient.MainHome.showListEbookNewer && (
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
          )}
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
            style={{ width: '90%', aspectRatio: 9 / 16, alignSelf: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                tempShowPopupAds = false;
                setShowPopupAds(false);
                // navigation.navigate('DetailPromo', {item});
                if (accessClient.isSurvey) {
                  const linkDownload = 'https://docs.google.com/presentation/d/12PCLiMUDLxFh_C-3JGsXmLQLhn4UEyaQ/edit?usp=sharing&ouid=107664437226771955569&rtpof=true&sd=true';
                  Linking.openURL(linkDownload);
                }
              }}>
              <ImageBackground
                source={{ uri: dataPopupAds.image }}
                imageStyle={{ borderRadius: 12 }}
                style={{ height: '100%', resizeMode: 'contain', width: '100%' }}>
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
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

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
