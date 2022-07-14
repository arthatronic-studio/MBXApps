import React, {useState, useEffect, useRef} from 'react';
import {View, TextInput,Image,TouchableOpacity, FlatList,ScrollView, Platform, Linking, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import Header from '@src/components/Header';
import {useLoading, usePopup, useColor, Alert, Row, Col} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import HighlightContentProduct from 'src/components/Content/HighlightContentProduct';
import Client from '@src/lib/apollo';
import {queryAddLike} from '@src/lib/query';
import { Container, Divider, Padding } from 'src/styled';
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
import {fetchContentProduct, fetchContentUserProduct} from 'src/api/content';
const DocumentasiSearchEvent = ({navigation}) => {

const {Color} = useColor();
const [popupProps, showPopup] = usePopup();
const [loadingProps, showLoading, hideLoading] = useLoading();
const [found, setFound] = useState(false);


const modalOptionsRef = useRef();
const [filter, setFilter] = useState({name: 'Nama', value: 'NAME'});

const [listData, setListData] = useState([]);
const [search, setSearch] = useState('');

console.log('ini search',search);
const onSearch = (value) => {
  if(value == ''){
    setSearch(value);
    setListData([]);
  }else{
    setSearch(value)
    fetchData(value);
  }
}


const fetchData = async search => {
  let variables = {
    page: 1,
    itemPerPage: 10,
    productName: search,
  };
  variables.productCategory = 'EVENT';

  Client.query({
    query: queyGetDokumentasiEnventList,
  
  })
  .then((res) => {
   
      console.log('ini res',res);
    const data = res.data.eventDocumentationList;
    

    if (data) {
      setListData(result);
    }
   
  })
  .catch((err) => {
    console.log('err YOUTUBE_VIDEO', err);
  });
  
};
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
    <ScrollView style={{backgroundColor: Color.theme}}>
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
            placeholder="Cari Documentasi Event"
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

    {/* Recent Search */}
    {/* <View style={{borderTopColor: Color.border, borderTopWidth: 1, borderBottomColor: Color.border, borderBottomWidth: 1, paddingVertical: 15, marginTop: 5}}>
      {search == false
      ?
        <View style={{width: '100%', alignItems: 'center', justifyContent: 'center', height: 150}}>
          <Image source={ImagesPath.Magnifying}/>
          <Text style={{fontSize: 8, color: Color.secondary, width: '100%', marginTop: 10}}>Kamu belum pernah melakukan pencarian apapun</Text>
        </View>
      :
        <View>
          <Text style={{fontSize: 11, fontWeight: 'bold', textAlign: 'left', paddingHorizontal: 10}}>Pencarian Sebelumnya</Text>
          <FlatList
          data={[
            {search: 'Gathering'},
            {search: 'Workshop'},
            {search: 'Seminar'},
            {search: 'TribesSocial'},
            {search: 'Tribes'},
          ]}
          renderItem={({item}) => 
          <Pressable style={{width: '95%', paddingVertical: 12, alignSelf: 'center',flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Color.border}}>
            <Text style={{fontSize: 10, width: '95%', textAlign: 'left'}}>{item.search}</Text>
            <Feather name={'arrow-up-right'} color={Color.primary}/>
          </Pressable>}
        />
        </View>}
    </View>
    <View>
          <Divider/>
          <Text style={{fontSize: 11, fontWeight: 'bold', textAlign: 'left', paddingHorizontal: 10}}>Rekomendasi</Text>
          <FlatList
          data={[
            {image: ImagesPath.produklelang6, kategori: 'OFFICIAL', judul: 'Geek Con by TRIBESOCIAL at Kota Kasablanka'},
            {image: ImagesPath.produklelang6, kategori: 'OFFICIAL', judul: 'Geek Con by TRIBESOCIAL at Kota Kasablanka'},
            {image: ImagesPath.produklelang6, kategori: 'OFFICIAL', judul: 'Geek Con by TRIBESOCIAL at Kota Kasablanka'},
            {image: ImagesPath.produklelang6, kategori: 'OFFICIAL', judul: 'Geek Con by TRIBESOCIAL at Kota Kasablanka'},
            {image: ImagesPath.produklelang6, kategori: 'OFFICIAL', judul: 'Geek Con by TRIBESOCIAL at Kota Kasablanka'},
          ]}
          renderItem={({item}) => 
          <Pressable style={{width: '95%', flexDirection: 'row',paddingVertical: 10, alignItems:'center',alignSelf: 'center',flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Color.border}}>
            <View style={{width: 35, height: 35, borderRadius: 5, backgroundColor: Color.secondary}}>
              <Image source={item.image} style={{width: '100%', height: '100%'}}/>
            </View>
            <View style={{paddingHorizontal: 10, justifyContent: 'center', width: '85%'}}>
              <Text style={{fontSize: 8, textAlign: 'left', color: Color.secondary, fontWeight: 'bold'}}>{item.kategori}</Text>
              <Text numberOfLines={1} style={{fontSize: 11, textAlign: 'left', fontWeight: 'bold'}}>{item.judul}</Text>
            </View>
            <Feather name={'arrow-up-right'} color={Color.primary}/>
          </Pressable>}
        />
    </View> */}

    {/* Hasil Pencarian */}


    <View>
  </View>
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
            <TouchableOpacity onPress={() => modalOptionsRef.current.open()} style={{flexDirection: 'row',alignItems: 'center', justifyContent: 'center',borderWidth: 1, borderColor: Color.text, width: 95, borderRadius: 30, height: 30}}>
        <Text style={{fontSize: 10, marginRight: 10}}>Terbaru</Text>
        <MaterialIcons name={'keyboard-arrow-down'} size={15}/>
      </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', paddingHorizontal: 15,marginVertical:10}}>
          <Pressable style={{marginRight: 8,alignItems: 'center', justifContent: 'center',borderWidth: 1, borderColor: Color.secondary, paddingVertical: 7, borderRadius: 20,paddingHorizontal: 17}}>
            <Text style={{fontSize: 10, color: Color.secondary}}>Semua</Text>
          </Pressable>
          <Pressable style={{marginRight: 8,alignItems: 'center', justifContent: 'center',borderWidth: 1, borderColor: Color.secondary, paddingVertical: 7, borderRadius: 20,paddingHorizontal: 17}}>
            <Text style={{fontSize: 10, color: Color.secondary}}>Official</Text>
          </Pressable>
          <Pressable style={{alignItems: 'center', justifContent: 'center',borderWidth: 1, borderColor: Color.secondary, paddingVertical: 7, borderRadius: 20,paddingHorizontal: 17}}>
            <Text style={{fontSize: 10, color: Color.secondary}}>Komunitas</Text>
          </Pressable>
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
            marginBottom:500,
            
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
    

    <ModalFilterEvent
        ref={modalOptionsRef}
        selectedValue={filter}
        onPress={value => {setFilter(value);
          modalOptionsRef.current.close();}}
    /> 
</ScrollView>
  )
}

export default DocumentasiSearchEvent