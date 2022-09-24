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
import FormInput from 'src/components/FormInput';
import { fetchEatCartAdd } from 'src/api-rest/fetchEatCartAdd';
import { fetchEatCartRemove } from 'src/api-rest/fetchEatCartRemove';
import { fetchEatCartOrder } from 'src/api-rest/fetchEatCartOrder';

const EatDetailPesananScreen = ({ navigation, route }) => {
  const { params } = route;
  const items = params.item;

  const { Color } = useColor();
  const modalOptionsRef = useRef();
  const flatlistRef = useRef();
  const auth = useSelector(state => state['auth']);

  const [currentSelected, setCurrentSelected] = useState(-1);
  const [listProducts, setListProducts] = useState(Array.isArray(items.products) ? items.products : []);
  const [cartId, setCartId] = useState(params.cartId);
  const [namaPemesan, setNamaPemesan] = useState(params.namaPemesan);
  const [ringkasanPembayaran, setRingkasanPembayaran] = useState(params.ringkasanPembayaran);
  const [updateIndex, setUpdateIndex] = useState(-1);

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const isFocused = useIsFocused();

  const { height, width } = useWindowDimensions();

  useEffect(() => {
    getDetail();
  }, [isFocused]);
  
  useEffect(() => {
    const timeout = updateIndex !== -1 ?
      setTimeout(() => {
        onUpdateQty(listProducts[updateIndex], updateIndex);
      }, 1000) : null;

    return () => {
      clearTimeout(timeout);
    }
  }, [updateIndex, listProducts]);

  useEffect(() => {
    const timeout = namaPemesan !== '' ?
      setTimeout(() => {
        onUpdateQty();
      }, 1000) : null;

    return () => {
      clearTimeout(timeout);
    }
  }, [namaPemesan]);

  const getDetail = () => {
    
  };

  const onUpdateQty = async(item, index) => {
    let body = {
      nama_pelanggan: namaPemesan,
    }

    if (item) {
      body = {
        product_id: item.id,
        quantity: item.qty,
        catatan: item.note,
      };
    }

    setUpdateIndex(-1);
    setCurrentSelected(-1);

    const result = await fetchEatCartAdd(body);
    if (result.status) {
      if (Array.isArray(result.data) && result.data.length > 0) {
        setCartId(result.data[0].id);
        if (result.data[0].nama_pelanggan) {
          setNamaPemesan(result.data[0].nama_pelanggan);
        }
      }

      if (result.ringkasan_pembayaran && Array.isArray(result.ringkasan_pembayaran)) {
        setRingkasanPembayaran(result.ringkasan_pembayaran);
      }
    }
  }

  const renderItem = ({ item, index }) => {
    if (item.show === false || !item.selected) return null;

    let qty = item.qty || 1;
    const disabledDecrease = qty < 2;
    const disabledIncrease = qty > 9;

    return (
      <View
        style={{
          width,
          marginBottom: 12,
          paddingHorizontal: 16,
        }}
      >
        <Container borderWidth={0.5} borderColor={Color.placeholder} radius={8}>
          <View
            style={{
              width: '100%',
              padding: 16,
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
                flex: 1,
                paddingHorizontal: 8,
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}
            >
              <Text align='left' size={14} letterSpacing={0.1} numberOfLines={1} type='medium'>{item.name}</Text>
              <Divider height={2} />
              <Text align='left' size={12} letterSpacing={0.4}>{FormatMoney.getFormattedMoney(item.price)}</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                Alert(
                  'Konfirmasi',
                  'Kamu yakin mau menghapus pesanan?',
                  async() => {
                    const body = {
                      cart_detail_id: item.id,
                    }
                    const result = await fetchEatCartRemove(body);
                    if (result.status) {
                      let newArr = [...listProducts];
                      newArr[index].selected = false;
                      newArr[index].qty = 1;
                      setListProducts(newArr);
                    } else {
                      showLoading('error', result.message);
                    }
                  }
                );
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Container padding={12} radius={120} borderWidth={0.5} borderColor={Color.error}>
                <Text align='right' size={11} color={Color.error} type='medium'>Hapus</Text>
              </Container>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: '100%',
              paddingHorizontal: 16,
              paddingBottom: 16,
              alignItems: 'flex-start',
            }}
          >
            <Text size={11} letterSpacing={0.4}>Catatan</Text>
            <Text size={11} letterSpacing={0.4}>{item.note}</Text>
          </View>

          <View
            style={{
              width: '100%',
              paddingHorizontal: 16,
              paddingBottom: 16,
              flexDirection: 'row',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setCurrentSelected(index);
              }}
              style={{
                width: '50%',
                flexDirection: 'row',
              }}
            >
              <Container width='100%' paddingVertical={8} borderWidth={0.5} borderColor={Color.placeholder} radius={120} align='center' justify='center' style={{ flexDirection: 'row' }}>
                <Image
                  source={imageAssets.addNote}
                  style={{
                    width: 16,
                    height: 16,
                    marginRight: 8,
                  }}
                  resizeMode='contain'
                />
                <Text size={11} type='medium' letterSpacing={0.5} numberOfLines={1}>Tambah Catatan</Text>
              </Container>
            </TouchableOpacity>

            <View
              style={{
                width: '50%',
                justifyContent: 'center',
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => {
                    if (disabledDecrease) return;
                    let newArr = [...listProducts];
                    newArr[index].qty = qty - 1;
                    setListProducts(newArr);
                    setUpdateIndex(index);
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
                    setUpdateIndex(index);
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
          </View>
        </Container>
      </View>
    )
  };

  const renderFooter = () => {
    return (
      <>
        <Line height={8} width='100%' color='#F4F4F4' />
        <Container paddingHorizontal={16}>

          <Container paddingVertical={16}>
            <Text align='left' type='medium'>
              Ringkasan Pembayaran
            </Text>
          </Container>

          {ringkasanPembayaran.map((item, index) => {
            const isLast = (ringkasanPembayaran.length - 1) == index;
            return (
              <>
                {isLast &&
                  <Container paddingBottom={12}>
                    <Line height={0.5} width='100%' color={Color.text} />
                  </Container>
                }

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 12,
                  }}>
                  <Text size={12} letterSpacing={0.4}>{item.name}</Text>
                  <Text size={12} letterSpacing={0.4}>{item.amount}</Text>
                </View>
              </>
            )
          })}
        </Container>
      </>
    )
  }

  const renderModalNote = (item, index) => {
    let note = item.note || '';

    return (
      <Modal
        isVisible={true}
        swipeDirection={['down']}
        onBackdropPress={() => { setCurrentSelected(-1); }}
        onSwipeComplete={() => { setCurrentSelected(-1); }}
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

          <Container>
            <Text align='left' size={16} type='medium'>Tambah Catatan</Text>
            <Divider />

            <FormInput
              label='Catatan'
              value={note}
              onChangeText={(val) => {
                let newArr = [...listProducts];
                newArr[index].note = val;
                setListProducts(newArr);
              }}
              placeholder='Tuliskan sesuatu'
              multiline
            />

            <Container>
              <Button
                onPress={() => {
                  onUpdateQty(item, index);
                }}
              >
                Simpan
              </Button>
            </Container>
          </Container>
        </View>
      </Modal>
    )
  }

  console.log('params', params);

  return (
    <Scaffold
      fallback={false}
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}
      header={
        <Header
          title='Detail Pesanan'
          centerTitle={false}
          actions={
            <TouchableOpacity
              onPress={() => {
                Alert(
                  'Konfirmasi',
                  'Kamu yakin mau hapus semua pesanan?',
                  async() => {
                    const body = {
                      cart_id: cartId,
                    }
                    const result = await fetchEatCartRemove(body);
                    if (result.status) {
                      let newArr = [...listProducts];
                      listProducts.map((e, index) => {
                        if (e.selected) {
                          newArr[index].selected = false;
                          newArr[index].qty = 1;
                        }
                      });
                      setListProducts(newArr);

                      setTimeout(() => {
                        navigation.pop();
                      }, 2500);
                    } else {
                      showLoading('error', result.message);
                    }
                  }
                );
              }}
              style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-end' }}
            >
              <Text color={Color.error} size={12} type='medium'>Hapus Pesanan</Text>
            </TouchableOpacity>
          }
        />
      }
    >
      <FlatList
        ref={flatlistRef}
        data={listProducts || [{ show: false }]}
        keyExtractor={(item, index) => item.id + index.toString()}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={
          <View
            style={{
              paddingBottom: 0,
            }}
          >
            <Line height={8} width='100%' color='#F4F4F4' />

            <Container padding={16}>
              <View
                style={{
                  width: '100%',
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
                    source={Array.isArray(items.images) && items.images.length > 0 ? { uri: items.images[0] } : ''}
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
                    width: '85%',
                    paddingHorizontal: 10,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}
                >
                  <Text size={14} numberOfLines={1} letterSpacing={0.1} type='medium'>{items.name}</Text>
                  <Divider height={2} />
                  <Text size={12} numberOfLines={1} color={Color.textSoft}>{items.category.name}</Text>
                </View>
              </View>
            </Container>

            <Line height={8} width='100%' color='#F4F4F4' />

            <Container padding={16}>
              <Container paddingBottom={12}>
                <Text type='medium' align='left'>Nama Pemesan</Text>
              </Container>
              <FormInput
                value={namaPemesan}
                onChangeText={(val) => setNamaPemesan(val)}
                borderColor={Color.placeholder}
                hideErrorHint
              />
            </Container>

            <Line height={8} width='100%' color='#F4F4F4' />

            <Container padding={16}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text align='left' size={16} type='medium'>Pesanan</Text>
              </View>
            </Container>
          </View>
        }
      />

      <Container padding={16}>
          <TouchableOpacity
            onPress={() => {
              Alert(
                'Konfirmasi',
                'Pesan sekarang?',
                async() => {
                  const result = await fetchEatCartOrder({ cartId });
                  showLoading(
                    result.status ? 'success' : 'error',
                    result.message,
                    () => result.status ? navigation.navigate('EatScreen') : {}
                  );
                })
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Color.primary,
              paddingVertical: 16,
              borderRadius: 120,
            }}
          >
            <Text type='medium' size={12}>Pesan Sekarang</Text>
            <AntDesign
              name={'arrowright'}
              color={Color.text}
              size={14}
              style={{
                marginLeft: 4
              }}
            />
          </TouchableOpacity>
      </Container>

      {/* modal menu */}
      {currentSelected !== -1 && renderModalNote(listProducts[currentSelected], currentSelected)}
    </Scaffold>
  );
};

export default EatDetailPesananScreen;