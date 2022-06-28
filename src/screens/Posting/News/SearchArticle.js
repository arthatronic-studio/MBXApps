import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Pressable,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import Banner from 'src/components/Banner';
import {useColor, Text} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import {queryBannerList} from 'src/lib/query/banner';
import {Row, Divider} from 'src/styled';
import {accessClient} from 'src/utils/access_client';
import ListContentProduct from 'src/components/Content/ListContentProduct';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import client from 'src/lib/apollo';
import ImagesPath from 'src/components/ImagesPath';
import {fetchContentProduct, fetchContentUserProduct} from 'src/api/contentV2';
import moment from 'moment';
import { fetchViewProduct } from 'src/api/viewProduct';
import { async } from 'validate.js';

const DATA = [
  {
    id: '1',
    title: 'Comic',
  },
  {
    id: '2',
    title: '3D Designer',
  },
  {
    id: '3',
    title: 'Juventus',
  },
];

const REKOMENDASI = [
  {
    id: '1',
    title: 'Thor 4 Trailer Features One of the Most Comic Book',
    image: ImagesPath.productImage,
    author: 'Adang Susanyo',
  },
  {
    id: '2',
    title:
      'PKB Soal Honor Nyanyi DNA Pro Disita: Terus Siapa Ganti Kerugian . . .',
    image: ImagesPath.productImage,
    author: 'Adang Susanyo',
  },
  {
    id: '3',
    title:
      'PKB Soal Honor Nyanyi DNA Pro Disita: Terus Siapa Ganti Kerugian . . .',
    image: ImagesPath.productImage,
    author: 'Adang Susanyo',
  },
];

const PENCARIAN = [
  {
    id: '1',
    title: 'Ikan Iblis Merah, Predator Rakus yang Merusak Ekosistem Dan . . .',
    image: ImagesPath.productImage,
    author: 'Adang Susanyo',
    date: '12 Apr 2021',
    description:
      'Ekosistem di Danau Toba, Sumatera Utara rusak akibat keberadaan ikan iblis merah atau red . . .',
  },
  {
    id: '2',
    title: 'Thor 4 Trailer Features One of the Most Comic Book',
    image: ImagesPath.productImage,
    author: 'Adang Susanyo',
    date: '12 Apr 2021',
    description:
      'Ekosistem di Danau Toba, Sumatera Utara rusak akibat keberadaan ikan iblis merah atau red . . .',
  },
  {
    id: '3',
    title: 'Thor 4 Trailer Features One of the Most Comic Book',
    image: ImagesPath.productImage,
    author: 'Adang Susanyo',
    date: '12 Apr 2021',
    description:
      'Ekosistem di Danau Toba, Sumatera Utara rusak akibat keberadaan ikan iblis merah atau red . . .',
  },
];

const SearchArticle = ({navigation}) => {
  const {Color} = useColor();
  const [pencarian, setPencarian] = useState(false);
  const [rekomendasi, setRekomendasi] = useState(false);
  const [searchArticle, setSearchArticle] = useState(false);
  const [listData, setListData] = useState([]);
  const [search, setSearch] = useState('');

  const onSearch = (value) => {
    if(value == ''){
      setSearch(value);
      setListData([]);
    }else{
      setSearch(value)
      fetchData(value);
    }
  }

  console.log(listData.data, "data");

  const fetchData = async search => {
    let variables = {
      page: 1,
      itemPerPage: 10,
      productName: search,
    };
    variables.productCategory = 'ARTIKEL';

    const result = await fetchContentProduct(variables);
    setListData(result);
  };

  const renderItem = ({item}) => (
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Color.theme,
        width: '100%',
        height: 45,
      }}>
      <Text style={{fontWeight: 'bold', width: '92%'}}>{item.title}</Text>
      <TouchableOpacity>
        <Text style={{fontSize: 10, color: Color.primary}}>Lihat</Text>
      </TouchableOpacity>
    </Pressable>
  );

  const render = ({item}) => (
    <Pressable
      style={{
        paddingVertical: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Color.theme,
        width: '100%',
        height: 72,
      }}>
      <View style={{width: '13%'}}>
        <Image
          source={item.image}
          style={{width: 50, height: 50, borderRadius: 10}}
        />
      </View>
      <View style={{width: '82%', paddingHorizontal: 10}}>
        <Text style={{fontSize: 12, fontWeight: 'bold', width: '80%'}}>
          {item.title}
        </Text>
        <Text style={{fontSize: 8, marginVertical: 3}}>{item.author}</Text>
      </View>
      <View style={{width: '17%'}}>
        <Feather name={'arrow-up-right'} color={Color.primary} size={16} />
      </View>
    </Pressable>
  );

  const renderSearch = ({item}) => (
    <Pressable
      onPress={async() => {
        await fetchViewProduct({productId: item.id});
        navigation.navigate('NewsDetail', {code: item.code});
        }
      }
      style={{
        borderBottomWidth: 1,
        borderBottomColor: Color.border,
        paddingVertical: 12,
        backgroundColor: Color.theme,
        width: '100%',
        paddingHorizontal: 16,
      }}>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={{ uri: item.image }}
          style={{width: 80, aspectRatio: 1, borderRadius: 4}}
        />
        <Divider width={10} />
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            maxWidth: '75%',
          }}>
          <Text numberOfLines={2} align="left" size={14} type="bold">
            {item.productName}
          </Text>
          <Divider height={4} />
          <Text numberOfLines={2} size={10} align="left">
            {item.productDescription}
          </Text>
        </View>
      </View>
      <Divider height={10} />
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text size={10} color={'#121212'} style={{opacity: 0.8}}>
          {item.fullname} | {moment(+item.created_date).format('DD MMM YYYY')}
        </Text>
        <Text size={10} color={Color.primary}>
          Baca Selengkapnya
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View
      style={{width: '100%', height: '100%', backgroundColor: Color.border}}>
      <View
        style={{
          width: '100%',
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Color.theme,
          flexDirection: 'row',
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '12%',
            height: '100%',
          }}>
          <AntDesign
            onPress={() => navigation.goBack()}
            name={'arrowleft'}
            size={20}
          />
        </View>
        <View
          style={{
            paddingRight: 12,
            width: '88%',
            height: '80%',
            justifyContent: 'center',
          }}>
          <TextInput
            placeholder="Cari artikel apa hari ini..."
            value={search}
            onChangeText={(value) => onSearch(value)}
            style={{
              width: '100%',
              height: '80%',
              backgroundColor: Color.theme,
              fontSize: 12,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: Color.border,
              paddingHorizontal: 10,
            }}
          />
          <TouchableOpacity>
            <AntDesign
              size={14}
              name={'search1'}
              style={{
                position: 'absolute',
                color: Color.secondary,
                alignSelf: 'flex-end',
                top: -25,
                right: 10,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Pencarian Terakhir */}
      {pencarian == true ? (
        <View style={{backgroundColor: Color.theme, paddingHorizontal: 10}}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              color: Color.secondary,
              marginVertical: 5,
            }}>
            Pencarian Terakhir
          </Text>
          <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      ) : null}

      {/* Artikel Rekomendasi */}
      {rekomendasi == true ? (
        <View style={{backgroundColor: Color.theme, paddingVertical: 15}}>
          <Text
            style={{
              paddingHorizontal: 12,
              paddingBottom: 5,
              fontSize: 12,
              fontWeight: 'bold',
              color: Color.secondary,
            }}>
            Rekomendasi Artikel
          </Text>
          <FlatList
            data={REKOMENDASI}
            renderItem={render}
            keyExtractor={item => item.id}
          />
        </View>
      ) : null}

      {/* Search Artikel */}
      {listData.data && listData.data.length != 0 ? (
        <View style={{backgroundColor: Color.theme}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 14,
            }}>
            <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
              <Text size={14}>{search}</Text>
              <Divider height={4} />
              <Text size={6} color={Color.secondary}>
                {listData.data.length} hasil pencarian ditemukan
              </Text>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: Color.text,
                width: 90,
                borderRadius: 30,
                height: 30,
              }}>
              <Text style={{fontSize: 10, marginHorizontal: 8}}>Terbaru</Text>
              <MaterialIcons name={'keyboard-arrow-down'} size={16} />
            </TouchableOpacity>
          </View>

          <View
            style={{width: '100%', height: 1, backgroundColor: Color.border}}
          />

          <FlatList
            data={listData.data}
            renderItem={renderSearch}
            keyExtractor={item => item.id}
          />
        </View>
      ) : (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}>
          <Image source={ImagesPath.articleEmpty} />
          <Text
            style={{
              marginVertical: 15,
              fontWeight: 'bold',
              color: Color.secondary,
            }}>
            Pencarian tidak ditemukan
          </Text>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Color.primary,
              height: 35,
              width: '40%',
              borderRadius: 30,
            }}>
            <Text style={{fontSize: 12, color: Color.textInput}}>Kembali</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SearchArticle;
