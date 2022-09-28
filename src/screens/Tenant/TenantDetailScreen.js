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
import { useLoading, usePopup, useColor, Col } from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { TouchableOpacity, Button } from '@src/components/Button';
import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import { Container, Divider, Line, Padding, Row, } from 'src/styled';
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
import { fetchEatCartAdd } from 'src/api-rest/fetchEatCartAdd';
import { fetchEatCartDetail } from 'src/api-rest/fetchEatCartDetail';

const TenantDetailScreen = ({ navigation, route }) => {
  const { params } = route;
  const items = params.item;

  const { Color } = useColor();
  const modalOptionsRef = useRef();
  const flatlistRef = useRef();
  const auth = useSelector(state => state['auth']);

  const [loading, setLoading] = useState(true);
  const [bookmark, setBookmark] = useState(false);
  const [desc, setDesc] = useState(false);
  const [data, setData] = useState(null);
  const [activeSections, setActiveSections] = useState([]);
  const [currentIndexProduct, setCurrentIndexProduct] = useState(-1);
  const [listProducts, setListProducts] = useState(Array.isArray(items.products) ? items.products : []);
  const [cartId, setCartId] = useState();
  const [namaPemesan, setNamaPemesan] = useState(auth.user.name);
  const [cartAmount, setCartAmount] = useState(0);
  const [ringkasanPembayaran, setRingkasanPembayaran] = useState([
    {name: 'Harga', amount: 'Rp -'},
    {name: 'PPN 11%', amount: 'Rp -'},
    {name: 'Diskon', amount: 'Rp -'},
    {name: 'Total Pembayaran', amount: 'Rp -'},
  ]);

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const isFocused = useIsFocused();

  const { height, width } = useWindowDimensions();

  useEffect(() => {
    getDetail();
  }, [isFocused]);

  console.log('params', params);

  const getDetail = async() => {
    const result = await fetchEatCartDetail({ location_id: items.id });
    console.log('result cart detail', result);
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          width,
          marginBottom: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setCurrentIndexProduct(index);
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
    )
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

  let descriptionProps = { numberOfLines: 12 };
  if (desc) descriptionProps = {};
  const labelDesctiption = items.description;

  const renderHeader = (
    <View
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
                aspectRatio: 1,
              }}
            >
              <Image
                source={{ uri: i }}
                style={{
                  width: '100%',
                  height: '100%',
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
              aspectRatio: 1,
            }}
          >
            <Image
              // source={{ uri: '' }}
              style={{
                width: '100%',
                height: '100%',
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
                {/* <Image
                  source={imageAssets.location}
                  style={{
                    width: 16,
                    height: 16,
                  }}
                />
                <Divider width={4} /> */}
                <Text size={12} type='medium'>{items.type}</Text>
              </View>
            </View>
          </View>

          {/* <View style={{ paddingHorizontal: 10, marginVertical: 4, justifyContent: 'center', backgroundColor: Color.primarySoft, borderRadius: 120 }}>
            <Text size={12} type='medium' color={Color.textButtonInline}>Menuju Lokasi</Text>
          </View> */}
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
            source={imageAssets.call}
            style={{
              width: 16,
              height: 16,
            }}
          />
          <Divider width={4} />
          <Text size={10} type='medium'>{items.phone}</Text>
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
            source={imageAssets.dollar}
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
          <Text align='left' size={16} type='medium'>Menu</Text>
          {/* <View style={{ flexDirection: 'row', padding: 8, backgroundColor: Color.error, borderRadius: 120 }}>
            <Image
              source={imageAssets.menu}
              style={{
                width: 12,
                height: 12,
                marginRight: 6,
              }}
            />
            <Text size={12} type='medium' color={Color.textInput}>Daftar Menu</Text>
          </View> */}
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

  const renderModalProduct = (item, index) => {
    const qty = item.qty || 1;
    const disabledDecrease = qty < 2;
    const disabledIncrease = qty > 9;

    console.log('qty', qty);

    return (
      <Modal
        isVisible={true}
        swipeDirection={['down']}
        onBackdropPress={() => { setCurrentIndexProduct(-1); }}
        onSwipeComplete={() => { setCurrentIndexProduct(-1); }}
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
              source={
                Array.isArray(item.images) && item.images.length > 0 ? { uri: item.images[0] } : ''
              }
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
            <Text align='left' size={22} numberOfLines={2}>{item.name}</Text>
            <Divider height={2} />
            <Text align='left' size={11} numberOfLines={4} type='medium'>{item.description}</Text>
            <Divider />
            <Text align='left' size={11}>Harga</Text>
            <Divider height={2} />
            <Text align='left' size={16} type='medium'>{FormatMoney.getFormattedMoney(item.price || 0)}</Text>
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
                  onPress={() => {
                    if (disabledDecrease) return;
                    let newArr = [...listProducts];
                    newArr[index].qty = qty - 1;
                    setListProducts(newArr);
                  }}
                  style={{ marginLeft: 24 }}
                >
                  <AntDesign
                    name="minuscircleo"
                    color={Color.primaryDark}
                    size={20}
                    style={{
                      opacity: disabledDecrease ? 0.3 : 1,
                    }}
                  />
                </TouchableOpacity>
                <View style={{ minWidth: 40 }}>
                  <Text color={Color.text} type='bold' size={18} style={{ marginHorizontal: 8 }}>{qty}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    if (disabledIncrease) return;
                    let newArr = [...listProducts];
                    newArr[index].qty = qty + 1;
                    setListProducts(newArr);
                  }}
                >
                  <AntDesign
                    name="pluscircleo"
                    color={Color.primaryDark}
                    size={20}
                    style={{
                      opacity: disabledIncrease ? 0.3 : 1,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Divider />

            <Row>
              <Container style={{ flex: 1 }}>
                <Button
                  onPress={async() => {
                    let newArr = [...listProducts];
                    newArr[index].selected = true;
                    newArr[index].qty = qty;
                    setListProducts(newArr);
                    setCurrentIndexProduct(-1);

                    const body = {
                      product_id: item.id,
                      quantity: qty,
                      catatan: null,
                      nama_pelanggan: null,
                    }

                    const result = await fetchEatCartAdd(body);
                    if (result.status) {
                      if (Array.isArray(result.data) && result.data.length > 0) {
                        setCartId(result.data[0].cart_id);
                        if (result.data[0].nama_pelanggan) {
                          setNamaPemesan(result.data[0].nama_pelanggan);
                        }
                      }

                      console.log('result add', result, Array.isArray(result.ringkasan_pembayaran));

                      if (result.ringkasan_pembayaran && Array.isArray(result.ringkasan_pembayaran)) {
                        setRingkasanPembayaran(result.ringkasan_pembayaran);
                      }

                      if (result.amount) {
                        setCartAmount(result.amount);
                      }
                    }
                  }}
                >
                  Tambah Keranjang
                </Button>
              </Container>
              {/* <Container paddingLeft={16}>
                <TouchableOpacity
                  onPress={() => {
                    let newArr = [...listProducts];
                    newArr[currentIndexProduct].selected = false;
                    setListProducts(newArr);
                  }}
                >
                  <FontAwesome
                    name="trash-o"
                    size={28}
                    color={Color.error}
                  />
                </TouchableOpacity>
              </Container> */}
            </Row>
          </Container>
        </View>
      </Modal>
    )
  }

  console.log('params', params);

  let selectedProductCount = 0;
  listProducts.map((e) => {
    if (e.selected) {
      selectedProductCount += 1;
    }
  });

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
              <Image
                source={imageAssets.moreOutline}
                style={{
                  height: 24,
                  width: 24,
                }}
                resizeMode='contain'
              />
            </View>
          }
        />
      }
      floatingActionButton={
        selectedProductCount > 0 && <Container width={width - 32} paddingBottom={16}>
          <Row style={{ paddingVertical: 12, paddingHorizontal: 24, backgroundColor: Color.primary, borderRadius: 120 }}>
            <Col style={{ justifyContent: 'center' }}>
              <Text type='medium' size={11} align='left'>{selectedProductCount} Produk</Text>
              <Divider height={4} />
              <Text type='medium' size={14} align='left'>{cartAmount}</Text>
            </Col>
            <TouchableOpacity
              onPress={() => {
                if (selectedProductCount <= 0) {
                  showLoading(
                    'error',
                    'Silakan tambah pesanan terlebih dulu',
                  );
                  return;
                }

                navigation.navigate('TenantCheckoutScreen', {
                  ...params,
                  cartId,
                  namaPemesan,
                  ringkasanPembayaran,
                });
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text type='medium' size={12}>Checkout</Text>
              <AntDesign
                name={'arrowright'}
                color={Color.text}
                size={14}
                style={{
                  marginLeft: 4
                }}
              />
            </TouchableOpacity>
          </Row>
        </Container>
      }
    >
      <FlatList
        ref={flatlistRef}
        data={listProducts}
        keyExtractor={(item, index) => item.id + index.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
      // ListFooterComponent={renderFooter}
        contentContainerStyle={{
          paddingBottom: 76,
        }}
      />

      {/* modal menu */}
      {currentIndexProduct !== -1 && renderModalProduct(listProducts[currentIndexProduct], currentIndexProduct)}
    </Scaffold>
  );
};

export default TenantDetailScreen;