import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Image, TouchableOpacity, FlatList, ScrollView, Platform, Linking, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Moment from 'moment';
import Header from '@src/components/Header';
import { useLoading, usePopup, useColor, Alert, Col } from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import HighlightContentProduct from 'src/components/Content/HighlightContentProduct';
import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import { Container, Divider, Row } from 'src/styled';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import ImagesPath from 'src/components/ImagesPath';
import AntDesign from 'react-native-vector-icons/AntDesign'
import IonIcons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import ModalFilterEvent from './ModalFilterEvent';
import moment from 'moment';
import { fetchContentProduct, fetchContentUserProduct } from 'src/api/content';
import { fetchEventList } from 'src/api/event/event';
import ModalActions from 'src/components/Modal/ModalActions';
import { useSelector, useDispatch } from 'react-redux';
import ListContentProductV2 from 'src/components/Content/ListContentProductV2';
import { initialItemState, statusBarHeight } from 'src/utils/constants';
import { async } from 'validate.js';
import SearchBar from 'src/components/SearchBar';
const SearchEvent = ({ navigation }) => {

  const { Color } = useColor();
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [found, setFound] = useState(false);
  const [listData, setListData] = useState({
    data: [],
    loading: true,
    page: 0,
    loadNext: false,
    refresh: false
  });
  const [listDataFavorite, setListDataFavorite] = useState({
    data: [],
    loading: true,
    page: 0,
    loadNext: false,
    refresh: false
  });

  console.log('ini newDataFavorite', listDataFavorite);

  const modalOptionsRef = useRef();
  const [search, setSearch] = useState('');
  const [pencarian, setPencarian] = useState(false);
  const [filter, setFilter] = useState('TERBARU');
  const [category, setCategory] = useState('ALL');
  const [visible, setVisible] = useState(false);
  const [showRecomed, setRecomend] = useState(true);
  const dispatch = useDispatch();
  const history = useSelector((state) => state['history.event'].data);

  console.log('ini history event', history);

  useEffect(() => {
    fectRekomendasi();
  }, []);
  useEffect(() => {
    if (history.length > 0 && listData.length == 0) {
      setPencarian(true);
    } else {
      setPencarian(false);
    }
  }, [history]);


  const itemPerPage = 6;
  useEffect(() => {
    if (listData.refresh) {
      fetchData(search);
    }
  }, [listData.refresh]);
  console.log('ini search', category);

  const onCategory = value => {

    console.log('value', value);
    if (value == '') {

      setCategory(value);
      setListData({
        data: [],
        loading: true,
        page: 0,
        loadNext: false,
        refresh: false
      })
    } else {
      setCategory(value)

      setListData({ ...listData, refresh: true })


    }
  }
  const onFilter = value => {

    console.log('value', value);
    if (value == '') {

      setFilter(value);
      setListData({
        data: [],
        loading: true,
        page: 0,
        loadNext: false,
        refresh: false
      })
    } else {
      setFilter(value)

      setListData({ ...listData, refresh: true })


    }
  }
  const onSearch = (value) => {

    if (value == '') {

      setSearch(value);
      setListData({
        data: [],
        loading: true,
        page: 0,
        loadNext: false,
        refresh: false
      });
      setPencarian(false);

    } else {
      setSearch(value)
      setPencarian(true);
      setListData({ ...listData, refresh: true })
    }
  }

  const fectRekomendasi = async () => {
    let variables = {
      page: 0,
      itemPerPage: 5,
      isFavorite: true,

    };

    const result = await fetchEventList(variables);
    let newData = [];
    if (Array.isArray(result.data)) {
      newData = result.data;
    }
    console.log('ini varaibel  fav', variables);


    setListDataFavorite({
      ...listDataFavorite,
      data: listDataFavorite.refresh ? newData : listDataFavorite.data.concat(newData),
      page: newData.length === itemPerPage ? listDataFavorite.page + 1 : -1,
      loading: false,
      loadNext: false,
      refresh: false,
    });

  }
  const fetchData = async search => {
    let variables = {
      page: 0,
      itemPerPage: 10,
      search: search,
      category: category,
      sort: filter
    };

    console.log('ini variables', variables);


    const result = await fetchEventList(variables);
    let newData = [];
    if (Array.isArray(result.data)) {
      newData = result.data;
    }
    console.log('ini newData', listData);

    setListData({
      ...listData,
      data: listData.refresh ? newData : listData.data.concat(newData),
      page: newData.length === itemPerPage ? listData.page + 1 : -1,
      loading: false,
      loadNext: false,
      refresh: false,
    });


    // setListData(result);
  };
  const renderSearch = ({ item }) => (


    <Pressable
      onPress={() => {
        navigation.navigate('EventDetail', { item });

        GALogEvent('Event', {
          id: item.id,
          product_name: item.name,
          user_id: item.userId,
          method: analyticMethods.view,
        });
      }}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: Color.border,
        paddingVertical: 12,
        backgroundColor: Color.theme,
        width: '100%',
        paddingHorizontal: 16,
      }}>
      <View style={{ flexDirection: 'row' }}>
        {
          item.images &&
            item.images.length > 0 ?
            <Image
              source={{ uri: item.images[0] }}
              style={{ width: '35%', aspectRatio: 10 / 16, borderTopLeftRadius: 4, borderBottomLeftRadius: 4, backgroundColor: Color.border }}
            />
            : <View style={{ width: '35%', aspectRatio: 10 / 16, borderTopLeftRadius: 4, borderBottomLeftRadius: 4, backgroundColor: Color.border }}></View>
        }

        <View style={{ width: '65%', paddingHorizontal: 15, paddingVertical: 10, borderTopRightRadius: 4, borderBottomRightRadius: 4, backgroundColor: Color.textInput }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ width: 70, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, borderWidth: 1, borderRadius: 20, borderColor: '#2C70F7', backgroundColor: '#2C70F766' }}>
              <Text size={8} color={'#2C70F7'}>{item.category}</Text>
            </View>

            {/* <Ionicons name='bookmark-outline' size={20} color={Color.primary} /> */}
          </View>

          <View style={{ paddingTop: 8 }}>
            <Text type='bold' align='left' numberOfLines={3} style={{ lineHeight: 20 }}>{item.name}</Text>
            <Divider height={12} />
            <Row>
              <AntDesign name={'clockcircleo'} color={Color.secondary} size={9} style={{ marginRight: 8 }} />
              {Moment(item.date).isValid() && <>
                <Text size={10} color={Color.secondary} align='left' numberOfLines={2}>{Moment(item.date).format('DD MMM YYYY')}</Text>
              </>}
            </Row>
            <Divider height={3} />
            <Row>
              <AntDesign name={'user'} size={10} color={Color.secondary} style={{ marginRight: 7 }} />
              <Text size={10} color={Color.secondary} align='left' numberOfLines={2}>{item.author}</Text>
            </Row>
            <Divider height={12} />
            {/* Difference */}
            {item.category == "MyEvent" ?
              <>
                <Row>
                  <View style={{ width: '50%' }}>
                    <Text size={8} color={Color.secondary} align='left' numberOfLines={2} style={{ marginBottom: 2 }}>Tiket Dimiliki</Text>
                    <Text type='bold' align='left' numberOfLines={3}>{item.qty} Tiket</Text>
                  </View>
                  <Pressable style={{ backgroundColor: Color.primary, width: 110, borderRadius: 25, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 11, color: Color.textInput, fontWeight: 'bold' }}>Lihat Detail</Text>
                  </Pressable>
                </Row>
              </>
              :
              <>
                <Text size={8} color={Color.secondary} align='left' numberOfLines={2} style={{ marginBottom: 2 }}>Mulai dari</Text>
                <Row>
                  <Text type='bold' align='left' numberOfLines={3}>Rp 100.000</Text>
                  <Text style={{ fontSize: 8, color: Color.secondary, marginLeft: 5, textDecorationLine: 'line-through' }}>Rp 75.000</Text>
                </Row>
              </>}
          </View>

          {/* <View style={{paddingTop: 24, flexDirection: 'row'}}>
                            <Foundation name='calendar' color={Color.yellow} style={{marginRight: 8}} />
                            <Text size={10} align='left'>3 Bulan</Text>
                        </View> */}

          {/* <View style={{paddingTop: 6, flexDirection: 'row'}}>
                            <Ionicons name='location' color={Color.error} style={{marginRight: 8}} />
                            <Text size={10} align='left'>Cilandak, Jakarta Selatan</Text>
                        </View> */}

          {/* <View style={{paddingTop: 6, flexDirection: 'row'}}>
                            <Ionicons name='information-circle-outline' color={Color.error} style={{marginRight: 8}} />
                            <Text size={10} align='left'>3 Hari lagi Pendaftaran Ditutup</Text>
                        </View> */}
        </View>

      </View>
    </Pressable>
  );

  return (
    <Scaffold
      header={
        <View
          style={{
            width: '100%',
            height: 60,
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View
            style={{
              paddingLeft: 16,
            }}>
            <AntDesign
              onPress={() => navigation.goBack()}
              name={'arrowleft'}
              size={22}
              color={Color.text}
            />
          </View>
          <View
            style={{
              flex: 1,
            }}>
            <SearchBar
              type='input'
              value={search}
              onChangeText={(value) => onSearch(value)}
              textInputProps={{
                onSubmitEditing: () => {
                  search !== '' ? dispatch({ type: 'EVENT.ADD_HISTORY', search: { history: search } }) : {};
                },
              }}
            />
          </View>
        </View>
      }
    >
      <Container padding={16}>
        <Row justify='space-between'>
          <Text>Now Playing Fest</Text>
          <Container color={Color.text} radius={50} padding={2}>
            <Ionicons name='close' color={Color.theme} size={16} onPress={() => { }} />
          </Container>
        </Row>
      </Container>
      <Container padding={16}>
        <Row justify='space-between'>
          <Text>Kick Fest Banfug</Text>
          <Container color={Color.text} radius={50} padding={2}>
            <Ionicons name='close' color={Color.theme} size={16} onPress={() => { }} />
          </Container>
        </Row>
      </Container>
      <Container padding={16}>
        <Row justify='space-between'>
          <Text>Synchronize Festival</Text>
          <Container color={Color.text} radius={50} padding={2}>
            <Ionicons name='close' color={Color.theme} size={16} onPress={() => { }} />
          </Container>
        </Row>
      </Container>
      {/* Recent Search */}
      {/* {
        pencarian == true ?
          <View>
            <Text style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'left', paddingHorizontal: 10 }}>Pencarian Sebelumnya</Text>
            <FlatList
              data={history}
              renderItem={({ item }) =>
                <Pressable onPress={() => onSearch(item.history)} style={{ width: '95%', paddingVertical: 12, alignSelf: 'center', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Color.border }}>
                  <Text style={{ fontSize: 10, width: '95%', textAlign: 'left' }}>{item.history}</Text>

                  <TouchableOpacity
                    onPress={() => onSearch(item.history)}
                  >
                    <Feather name={'arrow-up-right'} color={Color.primary} />
                  </TouchableOpacity>
                </Pressable>}
            />
          </View>
          :
          <View onTouchEnd={(e) => {
            e.stopPropagation()
          }}>
            <Text style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'left', paddingHorizontal: 10 }}>Pencarian Sebelumnya</Text>
            <FlatList
              data={history}
              renderItem={({ item }) =>
                <Pressable onPress={() => onSearch(item.history)} style={{ width: '95%', paddingVertical: 12, alignSelf: 'center', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Color.border }}>

                  <Text style={{ fontSize: 10, width: '95%', textAlign: 'left' }}>{item.history}</Text>

                  <TouchableOpacity
                    onPress={() => dispatch({ type: 'EVENT.REMOVE_HISTORY', data: item.history })}
                  >
                    <MaterialIcons name='cancel' size={14} color={Color.secondary} />
                  </TouchableOpacity>
                </Pressable>}
            />
          </View>
      } */}
      {/* <View style={{ borderTopColor: Color.border, borderTopWidth: 0, borderBottomColor: Color.border, borderBottomWidth: 1, paddingVertical: 15, marginTop: 5 }}>
        {history.length == 0 &&

          <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', height: 150 }}>
            <Image source={ImagesPath.Magnifying} />
            <Text style={{ fontSize: 8, color: Color.secondary, width: '100%', marginTop: 10 }}>Kamu belum pernah melakukan pencarian apapun</Text>
          </View>
        }
      </View> */}

      {/* {!pencarian &&
        <FlatList
          data={listDataFavorite.data}
          renderItem={({ item }) =>
            <Pressable onPress={() => onSearch(item.name)} style={{ width: '95%', flexDirection: 'row', paddingVertical: 10, alignItems: 'center', alignSelf: 'center', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Color.border }}>
              <View style={{ width: 35, height: 35, borderRadius: 5, backgroundColor: Color.secondary }}>
                <Image source={{ uri: item.images[0] }} style={{ width: '100%', height: '100%' }} />
              </View>
              <View style={{ paddingHorizontal: 10, justifyContent: 'center', width: '85%' }}>
                <Text style={{ fontSize: 8, textAlign: 'left', color: Color.secondary, fontWeight: 'bold' }}>{item.category}</Text>
                <Text numberOfLines={1} style={{ fontSize: 11, textAlign: 'left', fontWeight: 'bold' }}>{item.name}</Text>
              </View>
              <TouchableOpacity
                onPress={() => onSearch(item.name)}
              >
                <Feather name={'arrow-up-right'} color={Color.primary} />
              </TouchableOpacity>
            </Pressable>}
        />
      } */}

      {/* Hasil Pencarian */}
      {/* {
        listData.data && listData.data.length != 0 ? (
          <View style={{ backgroundColor: Color.theme }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 14,
              }}>
              <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Text size={14}>{search}</Text>
                <Divider height={4} />
                <Text size={6} color={Color.secondary}>
                  {listData.data.length} hasil pencarian ditemukan
                </Text>
              </View>
              <TouchableOpacity onPress={() => setVisible(true)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Color.text, width: 95, borderRadius: 30, height: 30 }}>
                <Text style={{ fontSize: 10, marginRight: 10, textTransform: 'capitalize' }}>{filter}</Text>
                <MaterialIcons name={'keyboard-arrow-down'} size={15} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 15, marginVertical: 10 }}>

              <Pressable onPress={() => {
                onCategory('ALL');
              }} style={{ backgroundColor: category == 'ALL' ? '#07181F' : Color.textInput, marginRight: 8, alignItems: 'center', justifContent: 'center', borderWidth: 1, borderColor: Color.secondary, paddingVertical: 7, borderRadius: 20, paddingHorizontal: 17 }}>
                <Text style={{ fontSize: 10, color: category == 'ALL' ? Color.textInput : Color.text }}>Semua</Text>
              </Pressable>

              <Pressable onPress={() => {
                onCategory('OFFICIAL');
              }} style={{ backgroundColor: category == 'OFFICIAL' ? '#07181F' : Color.textInput, marginRight: 8, alignItems: 'center', justifContent: 'center', borderWidth: 1, borderColor: Color.secondary, paddingVertical: 7, borderRadius: 20, paddingHorizontal: 17 }}>
                <Text style={{ fontSize: 10, color: category == 'OFFICIAL' ? Color.textInput : Color.text }}>Official</Text>
              </Pressable>
              <Pressable onPress={() => {
                onCategory('UNOFFICIAL');
              }} style={{ backgroundColor: category == 'UNOFFICIAL' ? '#07181F' : Color.textInput, marginRight: 8, alignItems: 'center', justifContent: 'center', borderWidth: 1, borderColor: Color.secondary, paddingVertical: 7, borderRadius: 20, paddingHorizontal: 17 }}>
                <Text style={{ fontSize: 10, color: category == 'UNOFFICIAL' ? Color.textInput : Color.text }}>Komunitas</Text>
              </Pressable>
            </View>
            <View
              style={{ width: '100%', height: 1, backgroundColor: Color.border }}
            />

            <FlatList
              data={listData.data}
              renderItem={renderSearch}
              keyExtractor={item => item.id}
            />
          </View>
        ) : (
          history.length > 0 &&
          <View style={{ backgroundColor: Color.theme }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 14,
              }}>
              <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Text size={14}>{search}</Text>
                <Divider height={4} />
                <Text size={6} color={Color.secondary}>
                  {listData.data.length} hasil pencarian ditemukan
                </Text>
              </View>
              <TouchableOpacity onPress={() => setVisible(true)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Color.text, width: 95, borderRadius: 30, height: 30 }}>
                <Text style={{ fontSize: 10, marginRight: 10, textTransform: 'capitalize' }}>{filter}</Text>
                <MaterialIcons name={'keyboard-arrow-down'} size={15} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 15, marginVertical: 10 }}>
              <Pressable onPress={() => {
                onCategory('ALL');
              }} style={{ marginRight: 8, alignItems: 'center', justifContent: 'center', borderWidth: 1, borderColor: Color.secondary, paddingVertical: 7, borderRadius: 20, paddingHorizontal: 17 }}>
                <Text style={{ fontSize: 10, color: Color.secondary }}>Semua</Text>
              </Pressable>
              <Pressable onPress={() => {
                onCategory('OFFICIAL');
              }} style={{ marginRight: 8, alignItems: 'center', justifContent: 'center', borderWidth: 1, borderColor: Color.secondary, paddingVertical: 7, borderRadius: 20, paddingHorizontal: 17 }}>
                <Text style={{ fontSize: 10, color: Color.secondary }}>Official</Text>
              </Pressable>
              <Pressable onPress={() => {
                onCategory('UNOFFICIAL');
              }} style={{ alignItems: 'center', justifContent: 'center', borderWidth: 1, borderColor: Color.secondary, paddingVertical: 7, borderRadius: 20, paddingHorizontal: 17 }}>
                <Text style={{ fontSize: 10, color: Color.secondary }}>Komunitas</Text>
              </Pressable>
            </View>
            <View
              style={{ width: '100%', height: 1, backgroundColor: Color.border }}
            />

            <View style={{
              marginTop: 100, alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Image source={ImagesPath.nounwind} />
              <Text
                style={{
                  marginVertical: 15,
                  fontWeight: 'bold',
                  color: Color.secondary,
                }}>
                Pencarian tidak ditemukan
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('EventScreen');
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: Color.primary,
                  height: 35,
                  width: '40%',
                  borderRadius: 30,
                }}>
                <Text style={{ fontSize: 12, color: Color.textInput }}>Kembali</Text>
              </TouchableOpacity>
            </View>
          </View>
        )} */}

      <ModalActions
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
        data={[
          {
            id: 1,
            name: 'Terbaru',
            onPress: () => {
              setVisible(false)
              onFilter('TERBARU')
            },
          },
          {
            id: 2,
            name: 'Termurah',
            onPress: () => {
              setVisible(false)
              onFilter('TERMURAH')
            },
          },
          {
            id: 3,
            name: 'Termahal',
            onPress: () => {
              setVisible(false)
              onFilter('TERMAHAL')
            },
          },
          {
            id: 4,
            name: 'Terdekat',
            onPress: () => {
              setVisible(false)
              onFilter('TERDEKAT')
            },
          },
        ]}
      />
      {/* <ModalFilterEvent
        ref={modalOptionsRef}
        selectedValue={filter}
        onPress={value => {setFilter(value);
          modalOptionsRef.current.close();}}
    />  */}
    </Scaffold>
  )
}

export default SearchEvent