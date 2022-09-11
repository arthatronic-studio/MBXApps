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
import { getAPI } from 'src/api-rest/httpService';
import CardComponentEvent from 'src/components/Content/CardComponentEvent';

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

  const fetchData = async (search) => {
    let baseEndpoint = `event?q=${search}`;
    
    const result = await getAPI(baseEndpoint);
    console.log(baseEndpoint, result);

    let newData = [];
    if (result.status && Array.isArray(result.data)) {
      newData = result.data;
    }

    setListData({
      ...listData,
      data: listData.refresh ? newData : listData.data.concat(newData),
      page: newData.length === itemPerPage ? listData.page + 1 : -1,
      loading: false,
      loadNext: false,
      refresh: false,
    });
  };

  return (
    <Scaffold
      empty={listData.data.length === 0}
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
      {/* <Container padding={16}>
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
      </Container> */}

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
      {
        listData.data && listData.data.length != 0 ? (
          <View style={{ backgroundColor: Color.theme }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 14,
              }}>
              <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Text size={12} color={Color.secondary}>
                  {listData.data.length} hasil pencarian ditemukan
                </Text>
              </View>
              {/* <TouchableOpacity onPress={() => setVisible(true)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Color.text, width: 95, borderRadius: 30, height: 30 }}>
                <Text style={{ fontSize: 10, marginRight: 10, textTransform: 'capitalize' }}>{filter}</Text>
                <MaterialIcons name={'keyboard-arrow-down'} size={15} />
              </TouchableOpacity> */}
            </View>
            {/* <View style={{ flexDirection: 'row', paddingHorizontal: 15, marginVertical: 10 }}>
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
            </View> */}
            
            {/* <View
              style={{ width: '100%', height: 1, backgroundColor: Color.border }}
            /> */}

            <FlatList
              keyExtractor={item => item.id}
              data={listData.data}
              contentContainerStyle={{
                paddingHorizontal: 8,
              }}
              renderItem={({ item }) => {
                return (
                  <CardComponentEvent item={item} />
                )
              }}
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
        )}

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