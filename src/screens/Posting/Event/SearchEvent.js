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

const SearchEvent = ({navigation}) => {

const {Color} = useColor();
const [popupProps, showPopup] = usePopup();
const [loadingProps, showLoading, hideLoading] = useLoading();
const [search, setSearch] = useState(true);
const [found, setFound] = useState(false);


const modalOptionsRef = useRef();
const [filter, setFilter] = useState({name: 'Nama', value: 'NAME'});

  return (
    <ScrollView style={{backgroundColor: Color.theme}}>
      <Pressable 
    style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10,}}
    >
          <AntDesign onPress={()=> navigation.goBack()}
           name={'arrowleft'} size={20} style={{marginHorizontal: 15}}/>
          <TextInput
          placeholder='Cari jadwal acara . . .'
          style={{paddingHorizontal: 10, fontSize: 12,backgroundColor: Color.theme, width: '85%',height: 40, borderRadius: 8, borderWidth: 1, borderColor: Color.border}}>
          
          </TextInput>
          <IonIcons
          name='search'
          color={Color.border}
          size={18}
          onPress={() => navigation.navigate('')}
          style={{position: 'absolute', alignSelf: 'flex-end', right: 25, top: 10}}
        />
    </Pressable>

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
    <Divider/>
    <View style={{flexDirection: 'row'}}>
      <View style={{width: '70%', paddingHorizontal: 15,}}>
        <Text style={{textAlign: 'left', fontWeight: 'bold'}}>Gathering</Text>
        <Text style={{textAlign: 'left', fontSize: 8, color: Color.secondary}}>2 hasil ditemukan</Text>
      </View>
      <TouchableOpacity onPress={() => modalOptionsRef.current.open()} style={{flexDirection: 'row',alignItems: 'center', justifyContent: 'center',borderWidth: 1, borderColor: Color.text, width: 95, borderRadius: 30, height: 30}}>
        <Text style={{fontSize: 10, marginRight: 10}}>Terbaru</Text>
        <MaterialIcons name={'keyboard-arrow-down'} size={15}/>
      </TouchableOpacity>
    </View>
    <Divider/>
    <View style={{flexDirection: 'row', paddingHorizontal: 15}}>
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
    <Divider height={22}/>
  </View>
    {found == true
    ?
    <HighlightContentProduct
      productCategory='EVENT'
      name='Event'
      nav='EventScreen'
      showHeader={false}
      category="MyEvent"
    />
    :
    <View style={{backgroundColor: Color.theme, height: '100%', alignItems: 'center'}}>
      <Divider height={120}/>
      <Image source={ImagesPath.nounwind}/>
      <Text style={{fontWeight: 'bold', color: Color.secondary}}>Pencarian tidak ditemukan</Text>
      <Divider/>
      <TouchableOpacity style={{backgroundColor: Color.primary, width: 150, alignItems: 'center', justifyContent: 'center',borderRadius: 20, height: 30}}>
        <Text style={{fontSize: 11, color: Color.textInput}}>Kembali</Text>
      </TouchableOpacity>
    </View>}

    <ModalFilterEvent
        ref={modalOptionsRef}
        selectedValue={filter}
        onPress={value => {setFilter(value);
          modalOptionsRef.current.close();}}
    /> 
</ScrollView>
  )
}

export default SearchEvent