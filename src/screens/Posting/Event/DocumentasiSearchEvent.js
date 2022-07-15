import React, {useState, useEffect, useRef} from 'react';
import {View, TextInput,Image,TouchableOpacity, FlatList,ScrollView, Platform, Linking, Pressable,ImageBackground} from 'react-native';
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
import { fetchEventDocumentList } from 'src/api/event/eventDocumentList';
const DocumentasiSearchEvent = ({navigation}) => {

const {Color} = useColor();
const [popupProps, showPopup] = usePopup();
const [loadingProps, showLoading, hideLoading] = useLoading();
const [found, setFound] = useState(false);


const modalOptionsRef = useRef();
const [filter, setFilter] = useState({name: 'Nama', value: 'NAME'});

const [listData, setListData] = useState([]);
const [search, setSearch] = useState('');

console.log('ini listData',listData);
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
    search: search,
    
  };
  const result = await fetchEventDocumentList(variables);
  setListData(result);
  
};
const renderSearch = ({item}) => (
  <View style={{
    flex: 1,
    width: '48%', 
    minHeight: 225,
    padding: 10, 
    
  }}>
     <Pressable onPress={()=> navigation.navigate('DocumentasiEventDetail',{id: item.id,cImage: item.mediaCounts.image,cVideo: item.mediaCounts.video})}>
<ImageBackground source={{uri: item.latestMedia !== null ? item.latestMedia : item.images[0]}} resizeMode="cover"  imageStyle={{ borderRadius: 6}} style={{
flex: 1,
justifyContent: "flex-end",
borderRadius: 4,
minHeight: 225,
marginBottom: 0, 
padding: 10,
borderRadius: 9, 
// borderWidth: 1,
backgroundColor: 'grey'
}}> 


<View style={{position: 'absolute',left:88,top:0,flexDirection:'row',marginVertical:5,}}>
<Text size={10} align='center'  type="bold" color={Color.border}>{item.mediaCounts.image}</Text>
<IonIcons
  name='image-outline'
  color={Color.border}
  size={15}
  style={{marginHorizontal: 3}}
 
/>
<Text size={10} align='center'  type="bold" color={Color.border}>{item.mediaCounts.video}</Text>
<IonIcons
  name='play-outline'
  color={Color.border}
  size={15}
  style={{marginHorizontal: 3}}
 
/>
</View>
  <Text color={Color.border} align='left' style={{ marginBottom: 4,  }} type={'bold'}>{item.name}</Text>
  <Text size={9} align='left' color={Color.border}>{item.category} • {Moment(item.date).format('DD MMM YYYY')}</Text>
</ImageBackground>
</Pressable>
</View>
  // <Pressable
  //   onPress={async() => {
  //     await fetchViewProduct({productId: item.id});
  //     navigation.navigate('NewsDetail', {code: item.code});
  //     }
  //   }
  //   style={{
  //     borderBottomWidth: 1,
  //     borderBottomColor: Color.border,
  //     paddingVertical: 12,
  //     backgroundColor: Color.theme,
  //     width: '100%',
  //     paddingHorizontal: 16,
  //   }}>
  //   <View style={{flexDirection: 'row'}}>
  //     <Image
  //       source={{ uri: item.image }}
  //       style={{width: 80, aspectRatio: 1, borderRadius: 4}}
  //     />
  //     <Divider width={10} />
  //     <View
  //       style={{
  //         flexDirection: 'column',
  //         alignItems: 'flex-start',
  //         maxWidth: '75%',
  //       }}>
  //       <Text numberOfLines={2} align="left" size={14} type="bold">
  //         {item.productName}
  //       </Text>
  //       <Divider height={4} />
  //       <Text numberOfLines={2} size={10} align="left">
  //         {item.productDescription}
  //       </Text>
  //     </View>
  //   </View>
  //   <Divider height={10} />
  //   <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
  //     <Text size={10} color={'#121212'} style={{opacity: 0.8}}>
  //       {item.fullname} | {moment(+item.created_date).format('DD MMM YYYY')}
  //     </Text>
  //     <Text size={10} color={Color.primary}>
  //       Baca Selengkapnya
  //     </Text>
  //   </View>
  // </Pressable>
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
          
          </View>
    
          <View
            style={{width: '100%', height: 1, backgroundColor: Color.border}}
          />

          <FlatList
            data={listData.data}
             numColumns={2}
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