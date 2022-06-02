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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';
import Modal from 'react-native-modal';
import Config from 'react-native-config';
import {io} from 'socket.io-client';

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
import {Divider, Circle, Container} from '@src/styled';
import {playNotificationSounds} from '@src/utils/notificationSounds';
import CarouselView from 'src/components/CarouselView';
import Banner from 'src/components/Banner';
import Client from '@src/lib/apollo';
import {queryBannerList} from '@src/lib/query/banner';
import ModalPosting from './ModalPosting';
import MusikTerbaru from 'src/components/MusikTerbaru';
import WidgetBalance from 'src/components/WidgetBalance';
import WidgetMenuHome from './WidgetMenuHome';
import PostingHeader from 'src/components/Posting/PostingHeader';
import {shadowStyle} from 'src/styles';
import Geolocation from 'react-native-geolocation-service';
import {accessClient} from 'src/utils/access_client';
import FloatingMusicPlayer from 'src/components/FloatingMusicPlayer';
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {analyticMethods, GALogEvent} from 'src/utils/analytics';
import {getSizeByRatio} from 'src/utils/get_ratio';
import MusikAlbum from 'src/components/MusikAlbum';
import HighlightLelang from 'src/components/Card/HighlightLelang';
import HighlightContentProduct from 'src/components/Content/HighlightContentProduct';
import ModalMenuHome from 'src/components/Modal/ModalMenuHome';

let tempShowPopupAds = true;

export let currentSocket;

const events = [Event.PlaybackTrackChanged];

const MainHome = ({navigation, route}) => {
  // state
  const [chatNotifCount, setChatNotifCount] = useState(0);
  const [dataPopupAds, setDataPopupAds] = useState();
  const [showPopupAds, setShowPopupAds] = useState(false);
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [listBanner, setListBanner] = useState([]);

  const [animationValue] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const [thisTrack, setThisTrack] = useState();

  const modalMenuHome = useRef();
  const user = useSelector(state => state['user.auth'].login.user);
  const dispatch = useDispatch();
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const modalPostingRef = useRef();
  const floatingMusicPlayerRef = useRef();
  const {width} = useWindowDimensions();
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

    currentSocket = io(Config.SOCKET_API_URL, {
      extraHeaders: {
        // Authorization: "Bearer authorization_token_here"
        // 'Control-Allow-Credentials': true
      },
    });

    currentSocket.emit('auth', {id: user ? user.userId : 0});
    currentSocket.on('auth', res => {
      console.log('res auth', res);

      currentSocket.emit('chat_notification');
    });

    currentSocket.on('chat_notification', res => {
      console.log('res chat_notification', res);
      if (res && res.status) {
        if (chatNotifCount > 0) {
          playNotificationSounds();
        }

        setChatNotifCount(res.data.count);
      }
    });

    const successCallback = (res) => {
      const ltu = { userId: user.userId, lat: res.coords.latitude, long: res.coords.longitude };
      currentSocket.emit('location-tracker-user', ltu );

      currentSocket.on('location-tracker-user', res => {
        console.log('res location-tracker-user', res);
      });
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
    if (isFocused) {
      dispatch({type: 'BOOKING.CLEAR_BOOKING'});
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
        console.log('res banner list', res);
        if (Array.isArray(res.data.bannerList)) {
          setDataPopupAds(res.data.bannerList[0]);
        }
        setShowPopupAds(true);
      })
      .catch(err => {
        console.log(err, 'err banner list');
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
      loadingProps={loadingProps}
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
                  navigation.navigate('Chat');
                }}
                style={{
                  width: '20%',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-end',
                }}>
                <Ionicons name="chatbox-outline" size={22} color={Color.text} />
                {chatNotifCount > 0 && (
                  <Circle
                    size={12}
                    color={Color.error}
                    style={{position: 'absolute', top: -4, right: -4}}>
                    <Text size={8} color={Color.textInput}>
                      {chatNotifCount > 99 ? '99' : chatNotifCount}
                    </Text>
                  </Circle>
                )}
              </TouchableOpacity>

              {accessClient.isKomoto && <TouchableOpacity
                onPress={() => {
                  navigation.navigate('MainProfile');
                }}
                style={{
                  width: '20%',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-end',
                }}>
                <Ionicons
                  name="person"
                  size={22}
                  color={Color.text}
                />
              </TouchableOpacity>}
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
                          title: 'Emergency Area',
                          productType: Config.PRODUCT_TYPE,
                          productCategory: '',
                          productSubCategory: 'EMERGENCY', 
                      });
                  }}
                  style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}
              >
                  <MaterialIcons
                    name='vibration'
                    color={Color.textInput}
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

          <TouchableOpacity
            // onPress={() => modalMenuHome.current.open()}
            onPress={() => navigation.navigate('SurveyPasarScreen')}
          >
            <Text>Buka Survey</Text>
          </TouchableOpacity>

          {accessClient.MainHome.showWidgetBalance && (
            <>
              <WidgetBalance />
              <Divider />
            </>
          )}

          {accessClient.MainHome.showMenuHome && <WidgetMenuHome
            onPress={item => {
              console.log(item, 'item');

              if (item.code === 'post') {
                modalPostingRef.current.open();
              }
            }}
          />}

          <View style={{flex: 1}}>
            <Modal
              isVisible={isModalVisible}
              onBackdropPress={() => setIsModalVisible(false)}
              animationIn="slideInDown"
              animationOut="slideOutDown"
              style={{borderRadius: 16}}>
              <View style={{backgroundColor: Color.theme}}>
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
            showHeader={accessClient.MainHome.showBannerHeader}
            data={listBanner}
            loading={loadingBanner}
          />

          {accessClient.MainHome.showListAuction && (
            <HighlightLelang
              title={`Pelelangan\nSedang Berlangsung`}
              nav='LiveLelangScreen'
              prodStatus='ONGOING'
            />
          )}

          {accessClient.MainHome.showListSoonAuction && (
            <HighlightLelang
              title={`Pelelangan\nYang Akan Datang`}
              nav='LiveLelangScreen'
              prodStatus='WILLCOME'
            />
          )}

          <Divider />

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
                                backgroundColor: Color.primary,
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
            </View>
          )} */}

          <HighlightContentProduct
            productCategory='EMERGENCY'
            name='Help Me'
            title='Help Me'
            nav='EmergencyScreen'
            refresh={refreshing}
          />

          <HighlightContentProduct
            productCategory='POSTING'
            name='Artikel'
            title='Postingan Artikel'
            nav='NewsScreen'
            refresh={refreshing}
          />

          <HighlightContentProduct
            productCategory='NEARBY_PLACE'
            name='Tempat'
            title='Tempat Favorit'
            nav='PlaceScreen'
            refresh={refreshing}
          />

          <HighlightContentProduct
            productCategory='EVENT'
            name='Event'
            title='Event Terbaru'
            nav='EventScreen'
            refresh={refreshing}
          />
          
          <HighlightContentProduct
            productCategory='JOBS'
            name='Loker'
            title='Lowongan Pekerjaan'
            nav='JobScreen'
            refresh={refreshing}
          />

          {accessClient.MainHome.showListMusicNewer && <MusikTerbaru />}

          <Divider />

          <MusikAlbum />

          <Divider />

          {/* isFocused handle android navigate crash from home */}
          {isFocused && <HighlightContentProduct
            productCategory='YOUTUBE_VIDEO'
            name='Live'
            title='Sedang Berlangsung'
            nav='YoutubeScreen'
            refresh={refreshing}
            style={{paddingHorizontal: 0}}
          />}

          <Divider />

          <HighlightContentProduct
            productCategory='NEWEST_VIDEO'
            name='Video'
            title='Video Terbaru'
            nav='VideoScreen'
            refresh={refreshing}
            style={{paddingHorizontal: 0}}
          />

          {accessClient.MainHome.showListEbookNewer && (
            <View style={{marginTop: 32}}>
              <PostingHeader
                title="Rilisan Terbaru"
                showSeeAllText
                onSeeAllPress={() => navigation.navigate('Ebook')}
              />
              <FlatList
                data={[
                  {image: ImagesPath.ebook1},
                  {image: ImagesPath.ebook2},
                  {image: ImagesPath.ebook1},
                  {image: ImagesPath.ebook2},
                  {image: ImagesPath.ebook1},
                  {image: ImagesPath.ebook2},
                ]}
                contentContainerStyle={{
                  marginTop: 16,
                }}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => {
                      toggleModal();
                    }}>
                    <Image source={item.image} style={{marginHorizontal: 15}} />
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

      <ModalMenuHome
        ref={modalMenuHome}
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
            style={{width: '90%', aspectRatio: 9 / 16, alignSelf: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                tempShowPopupAds = false;
                setShowPopupAds(false);
                // navigation.navigate('DetailPromo', {item});
              }}>
              <ImageBackground
                source={{uri: dataPopupAds.image}}
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
      )}
    </Scaffold>
  );
};

export default MainHome;
