import React, { useState, useEffect, useRef } from 'react';
import { View, Image, FlatList, ScrollView, Platform, Linking, Pressable, useWindowDimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Accordion from 'react-native-collapsible/Accordion';
import Modal from 'react-native-modal';

import Header from '@src/components/Header';
import { useLoading, usePopup, useColor, Alert, Row, Col } from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { TouchableOpacity, Button } from '@src/components/Button';
import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import { Container, Divider, Line, Padding } from 'src/styled';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import { accessClient } from 'src/utils/access_client';
import ImagesPath from 'src/components/ImagesPath';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { getDetailEvent } from 'src/lib/query/event';
import { fetchSaveEvent } from 'src/api/event/saveEvent';
import { FormatMoney } from 'src/utils';
import imageAssets from 'assets/images';
import { isIphoneNotch, statusBarHeight } from 'src/utils/constants';

const DetailTenantScreen = ({ navigation, route }) => {
  const { Color } = useColor();
  const items = route.params.item;
  const modalOptionsRef = useRef();
  const flatlistRef = useRef();
  const user = useSelector(state => state['user.auth'].login.user);

  const [im_like, set_im_like] = useState(items.im_like);
  const [heightHeader, setHeightHeader] = useState(0);

  const [loading, setLoading] = useState(true);
  const [bookmark, setBookmark] = useState(false);
  const [desc, setDesc] = useState(false);
  const [data, setData] = useState(null);
  const [activeSections, setActiveSections] = useState([]);
  const [currentSelected, setCurrentSelected] = useState();
  const [qty, setQty] = useState(1);

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const isFocused = useIsFocused();

  const { height, width } = useWindowDimensions();

  useEffect(() => {
    getDetail();
  }, [isFocused]);

  const getDetail = () => {
    // showLoading();
    let variables = {
      id: items.id,
    };
    console.log(variables);
    Client.query({ query: getDetailEvent, variables })
      .then(res => {
        // hideLoading()
        if (res.data.eventDetail) {
          console.log(res.data)
          setData(res.data.eventDetail)
          setBookmark(res.data.eventDetail.bookmarked);
        }
        setLoading(false);
      })
      .catch(reject => {
        // hideLoading()
        // alert(reject.message)
        console.log(reject.message, 'reject');
        setLoading(false);
      });
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        width,
        marginBottom: 12,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setCurrentSelected(item);
        }}
        style={{
          width: '100%',
          paddingHorizontal: 16,
          flexDirection: 'row',
        }}
      >
        <View
          style={{
            width: '15%',
            aspectRatio: 1,
          }}
        >
          <Image
            source={Array.isArray(item.images) && item.images.length > 0 ? { uri: item.images[0] } : ''}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 8,
              backgroundColor: Color.border,
            }}
          />
        </View>

        <View
          style={{
            width: '55%',
            paddingHorizontal: 8,
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <Text size={14} numberOfLines={1}>{item.name}</Text>
          <Text size={12} numberOfLines={1}>{item.category}</Text>
        </View>

        <View
          style={{
            width: '30%',
            justifyContent: 'center',
          }}
        >
          <Text align='right' size={16} type='medium'>{FormatMoney.getFormattedMoney(item.price)}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const fetchAddLike = () => {
    showLoading();

    Client.query({
      query: queryAddLike,
      variables: {
        productId: items.id,
      },
    })
      .then(res => {
        console.log(res, 'res add like');
        if (res.data.contentAddLike.id) {
          if (res.data.contentAddLike.status === 1) {
            showLoading('success', 'Akan Hadir');
            set_im_like(true);
          } else {
            showLoading('info', 'Batal menghadiri');
            set_im_like(false);
          }
        }
      })
      .catch(err => {
        console.log(err, 'err add like');
        hideLoading();
      });
  };

  let eventDate = !isNaN(parseInt(items.eventDate)) ? parseInt(items.eventDate) : null;
  if (!eventDate) eventDate = !isNaN(parseInt(items.updated_date)) ? parseInt(items.updated_date) : null;

  let isPassedEventDate = true;
  if (moment(eventDate).isValid() && moment(eventDate).isAfter(moment())) {
    isPassedEventDate = false;
  }

  const openGps = (lat, lng) => {
    // var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    // var url = scheme + `${lat},${lng}`;
    const latLng = `${lat},${lng}`;
    // return `google.navigation:q=${latLng}`;
    Linking.openURL(`google.navigation:q=${latLng}`);
  }

  const closest = data ? data.tickets ? data.tickets.reduce(
    (acc, loc) =>
      acc.price < loc.price
        ? acc
        : loc
  ) : 0 : 0;

  let descriptionProps = { numberOfLines: 12 };
  if (desc) descriptionProps = {};
  const labelDesctiption = items.description;

  const renderHeader = () => {
    return (
      <View
        onLayout={(e) => {
          setHeightHeader(e.nativeEvent.layout.height);
        }}
        style={{
          paddingBottom: 0,
        }}
      >
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          {Array.isArray(items.images) && items.images.length > 0 ? items.images.map((i, idx) => {
            return (
              <TouchableOpacity
                key={idx}
                // onPress={() => {
                //   data ? data.images.length == 0 ? console.log() :
                //     navigation.navigate('GalleryDetailScreen', {
                //       id: data.id,
                //       image: data.images[0],
                //     })
                //     : console.log()
                // }}
                style={{
                  width,
                  aspectRatio: 16 / 9,
                  paddingHorizontal: 16,
                }}
              >
                <Image
                  source={{ uri: i }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 8,
                    backgroundColor: Color.border,
                  }}
                />
              </TouchableOpacity>
            )
          })
            :
            <TouchableOpacity
              // onPress={() => {
              //   data ? data.images.length == 0 ? console.log() :
              //     navigation.navigate('GalleryDetailScreen', {
              //       id: data.id,
              //       image: data.images[0],
              //     })
              //     : console.log()
              // }}
              style={{
                width,
                aspectRatio: 16 / 9,
                paddingHorizontal: 16,
              }}
            >
              <Image
                // source={{ uri: '' }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 8,
                  backgroundColor: Color.border,
                }}
              />
            </TouchableOpacity>
          }
        </ScrollView>

        <Container paddingHorizontal={16} marginTop={8} marginBottom={16}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View>
              <View>
                <Text
                  size={20}
                  align='left'
                >
                  {items.name}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 4 }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={imageAssets.location}
                    style={{
                      width: 16,
                      height: 16,
                    }}
                  />
                  <Divider width={4} />
                  <Text size={10} type='medium'>{items.type}</Text>
                </View>
              </View>
            </View>

            <View style={{ paddingHorizontal: 10, marginVertical: 4, justifyContent: 'center', backgroundColor: Color.primarySoft, borderRadius: 120 }}>
              <Text size={12} type='medium' color={Color.textButtonInline}>Menuju Lokasi</Text>
            </View>
          </View>
        </Container>

        <Line height={8} width='100%' color='#F4F4F4' />

        <Container paddingHorizontal={16} marginTop={16} marginBottom={16}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={imageAssets.calendar}
              style={{
                width: 16,
                height: 16,
              }}
            />
            <Divider width={4} />
            <Text size={10} type='medium'>{moment().format('DD - DD MMM YYYY')}</Text>
          </View>

          <Divider />

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={imageAssets.clock}
              style={{
                width: 16,
                height: 16,
              }}
            />
            <Divider width={4} />
            <Text size={10} type='medium'>{items.time_from} - {items.time_to}</Text>
          </View>

          <Divider />

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={imageAssets.location}
              style={{
                width: 16,
                height: 16,
              }}
            />
            <Divider width={4} />
            <Text size={10} type='medium'>{FormatMoney.getFormattedMoney(10000)} - {FormatMoney.getFormattedMoney(60000)}</Text>
          </View>
        </Container>

        <Line height={8} width='100%' color='#F4F4F4' />

        <Container padding={16}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text align='left' size={16}>Menu</Text>
            <View style={{ padding: 8, backgroundColor: Color.error, borderRadius: 120 }}>
              <Text size={12} type='medium' color={Color.textInput}>Daftar Menu</Text>
            </View>
          </View>
        </Container>

        {/* <Container paddingHorizontal={32} paddingVertical={16}>
          <Button
            onPress={() => {
              navigation.navigate('GalleryScreen', {  });
            }}
          >
            Lihat Event Galeri
          </Button>
        </Container> */}

        {/* {items.like > 0 &&
            <Container paddingHorizontal={16}>
                <WidgetUserLikes id={items.id} title='Akan Hadir' />
            </Container>
          } */}

        {/* {data && data.ordered && <Row style={{ backgroundColor: '#FAF3ED', marginHorizontal: 10, padding: 13, borderRadius: 8 }}>
          <Col>
            <Text size={11} type='bold' align='left'>Kamu telah memiliki tiket untuk event ini</Text>
          </Col>
          <Col style={{ alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={() => navigation.navigate('MyTicket', { item: data })} style={{ backgroundColor: '#F3771D', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 20 }}>
              <Row style={{ alignItems: 'center' }}>
                <Text size={10} color='#fff' style={{ marginRight: 8 }}>Lihat Tiket</Text>
                <AntDesign name='arrowright' color='#fff' />
              </Row>
            </TouchableOpacity>
          </Col>
        </Row>} */}

        {/* <Container paddingHorizontal={16} marginTop={0}>
          <Text
            align='left'
            type='medium'
            letterSpacing={0.1}
          >
            Deskripsi
          </Text>
          <Divider height={8} />
          <Text
            align='left'
            {...descriptionProps}
          >
            {labelDesctiption}
          </Text>

          <Pressable
            onPress={() => setDesc(!desc)}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}
          >
            <Text color={Color.primaryDark}>{desc ? 'Lebih sedikit' : 'Selengkapnya'}</Text>
            <MaterialIcons name={'keyboard-arrow-down'} size={22} color={Color.primaryDark} />
          </Pressable>
        </Container> */}
      </View>
    )
  }

  const renderFooter = () => {
    return (
      <Container paddingHorizontal={16} marginTop={8}>
        <Text align='left'>Detail Lokasi</Text>
        <Divider height={8} />
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 18, borderRadius: 8, backgroundColor: Color.theme }}>
          <Image
            source={ImagesPath.LocationEvent}
            style={{
              width: 48,
              height: 48,
              borderRadius: 4,
            }}
          />
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <Text size={12} align='left' lineHeight={16} letterSpacing={0.4}>Jl. Tebet Barat I No.2, RT.1/RW.2, Tebet Bar., Kec. Tebet, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12810</Text>
          </View>
          <TouchableOpacity
            onPress={() => false && openGps(data.lat, data.lng)}
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <Image
              source={imageAssets.direction}
              style={{
                width: 40,
                height: 40,
              }}
            />
          </TouchableOpacity>
        </View>
        <Divider />
        <View>
          <Text size={12} style={{ textAlign: 'left', fontWeight: 'bold' }}>Informasi Lainnya</Text>
          <Divider height={8} />

          <Accordion
            sections={[
              {
                title: 'Pengembalian Tiket',
                content: labelDesctiption,
                imageAsset: imageAssets.ticketRefund,
              },
              {
                title: 'Syarat & Ketentuan',
                content: labelDesctiption,
                imageAsset: imageAssets.terms,
              },
            ]}
            activeSections={activeSections}
            renderHeader={(section) => (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', height: 40, width: '100%', borderColor: Color.border, backgroundColor: Color.theme, borderTopWidth: 0.5, alignSelf: 'center' }}
              >
                <Image
                  source={section.imageAsset}
                  style={{
                    width: 14,
                    height: 10,
                    marginRight: 12,
                    tintColor: Color.textSoft,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text size={12} style={{ fontWeight: '500', textAlign: 'left' }}>{section.title}</Text>
                </View>
                <MaterialIcons name={'keyboard-arrow-down'} size={18} color={Color.text} />
              </View>
            )}
            renderContent={(section) => (
              <Container paddingVertical={8}>
                <Text align='left' size={12}>{section.content}</Text>
              </Container>
            )}
            onChange={(val) => {
              setActiveSections(val);
            }}
          />
          <View style={{ width: '100%', paddingHorizontal: 16, backgroundColor: Color.border, height: 0.5 }} />
        </View>
      </Container>
    )
  }

  console.log('route', route);

  return (
    <Scaffold
      fallback={false}
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}
      header={
        <Header
          type="bold"
          actions={
            <View style={{ flexDirection: 'row' }}>
              {/* <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={async () => {
                  const res = await fetchSaveEvent({ eventId: data.id, type: bookmark ? 'UNBOOKMARK' : 'BOOKMARK' });
                  if (res.status == true) {
                    setBookmark(!bookmark);
                  }
                }}>
                {bookmark == true ? (
                  <FontAwesome name={'bookmark'} size={24} color={Color.text} />
                ) : (
                  <FontAwesome name={'bookmark-o'} size={24} color={Color.text} />
                )}
              </TouchableOpacity> */}
              <MaterialIcons
                onPress={() => {
                  // modalOptionsRef.current.open();
                }}
                name='more-vert' size={22} color={Color.text} />
            </View>
          }
        />
      }
    >
      <FlatList
        ref={flatlistRef}
        data={Array.isArray(items.products) && items.products.length > 0 ? items.products : ['init']}
        keyExtractor={(item, index) => item.id + index.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
      // ListFooterComponent={renderFooter}
      />

      {/* <Row style={{ padding: 16, backgroundColor: Color.theme }}>
        <Col style={{ justifyContent: 'center' }}>
          <Text type='medium' style={{ textAlign: 'left', fontSize: 8 }}>Mulai dari</Text>
          <Divider height={4} />
          <Text size={18} type='semibold' style={{ textAlign: 'left' }}>{FormatMoney.getFormattedMoney(closest ? closest.price : 0)}</Text>
        </Col>
        <TouchableOpacity
          onPress={() => {
            flatlistRef.current.scrollToOffset({
              offset: heightHeader,
              animated: true
            })
          }}
          style={{ justifyContent: 'center', backgroundColor: Color.primary, borderRadius: 8, height: 45, paddingHorizontal: 14 }}
        >
          <Text type='medium' color={Color.textButtonInline}>Cari Tiket</Text>
        </TouchableOpacity>
      </Row> */}

      {/* modal menu */}
      {currentSelected && <Modal
        isVisible={true}
        swipeDirection={['down']}
        onBackdropPress={() => { setCurrentSelected(); }}
        onSwipeComplete={() => { setCurrentSelected(); }}
        style={{
          justifyContent: 'flex-end', // the keys of bottom half
          margin: 0,
        }}
      >
        <View
          style={{
            backgroundColor: Color.theme,
            paddingTop: 16,
            paddingHorizontal: 16,
            paddingBottom: isIphoneNotch() ? statusBarHeight : 16,
          }}
        >
          {/* handle */}
          <View>
            <Line color={Color.primary} height={4} width={width / 6} radius={2} />
          </View>

          <Divider />

          <View
            style={{
              width: '100%',
              aspectRatio: 1,
            }}
          >
            <Image
              source={Array.isArray(currentSelected.images) && currentSelected.images.length > 0 ? { uri: currentSelected.images[0] } : ''}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: Color.border,
                borderRadius: 8,
              }}
            />
          </View>

          <Divider />

          <Container>
            <Text align='left' size={22} numberOfLines={2}>{currentSelected.name}</Text>
            <Divider height={2} />
            <Text align='left' size={11}  numberOfLines={4} type='medium'>{currentSelected.description}</Text>
            <Divider />
            <Text align='left' size={11}>Harga</Text>
            <Divider height={2} />
            <Text align='left' size={16} type='medium'>{FormatMoney.getFormattedMoney(currentSelected.price || 0)}</Text>
            <Divider />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text align='left' type='medium'>Jumlah Pesanan</Text>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <TouchableOpacity
                    // onPress={() => {
                    //     if (disabledDecrease) return;
                    //     setQty(qty - 1);
                    // }}
                    style={{ marginLeft: 24 }}
                >
                    <AntDesign
                        name="minuscircleo"
                        color={Color.primary}
                        size={20}
                        style={{
                          // opacity: disabledDecrease ? 0.5 : 1,
                        }}
                    />
                </TouchableOpacity>
                <View style={{minWidth: 40}}>
                    <Text color={Color.text} type='bold' size={18} style={{ marginHorizontal: 8 }}>{qty}</Text>
                </View>
                <TouchableOpacity
                    // onPress={() => {
                    //     if (disabledIncrease) return;
                    //     setQty(qty + 1);
                    // }}
                >
                    <AntDesign
                        name="pluscircleo"
                        color={Color.primary}
                        size={20}
                        style={{
                            // opacity: disabledIncrease ? 0.5 : 1,
                        }}
                    />
                </TouchableOpacity>
              </View>
            </View>
            <Divider />
            <Container>
              <Button>
                Tambah Keranjang
              </Button>
            </Container>
          </Container>
        </View>
      </Modal>}

      <ModalContentOptions
        ref={modalOptionsRef}
        event={true}
        isOwner={user && user.userId === items.ownerId}
        item={data}
      />
    </Scaffold>
  );
};

export default DetailTenantScreen;