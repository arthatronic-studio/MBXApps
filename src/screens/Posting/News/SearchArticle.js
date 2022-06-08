import React, {useEffect, useState} from 'react';
import {View, TextInput, Text, Pressable, TouchableOpacity, FlatList, Image} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import Config from 'react-native-config';
import Banner from 'src/components/Banner';
import { useColor  } from '@src/components';
import Scaffold from '@src/components/Scaffold';
import { queryBannerList } from 'src/lib/query/banner';
import { Row, Divider } from 'src/styled';
import { accessClient } from 'src/utils/access_client';
import ListContentProduct from 'src/components/Content/ListContentProduct';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import client from 'src/lib/apollo';
import ImagesPath from 'src/components/ImagesPath';


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
      author: 'Adang Susanyo'
    },
    {
        id: '2',
        title: 'PKB Soal Honor Nyanyi DNA Pro Disita: Terus Siapa Ganti Kerugian . . .',
        image: ImagesPath.productImage,
        author: 'Adang Susanyo'
    },
    {
        id: '3',
        title: 'PKB Soal Honor Nyanyi DNA Pro Disita: Terus Siapa Ganti Kerugian . . .',
        image: ImagesPath.productImage,
        author: 'Adang Susanyo'
    },
  ];
  
const SearchArticle = ({navigation}) => {
    const {Color} = useColor();
    const [pencarian, setPencarian] = useState(true)
    const [rekomendasi, setRekomendasi] = useState(true)

    const renderItem = ({ item }) => (
        <Pressable style={{flexDirection: 'row', alignItems: 'center',backgroundColor: Color.theme, width: '100%', height: 45}}>
            <Text style={{fontWeight: 'bold', width: '92%'}}>{item.title}</Text>
            <TouchableOpacity>
                <Text style={{fontSize: 10, color: Color.primary}}>Lihat</Text>
            </TouchableOpacity>
        </Pressable>
      );
    
      const render = ({ item }) => (
        <Pressable style={{paddingVertical: 5,paddingHorizontal: 10,flexDirection: 'row', alignItems: 'center',backgroundColor: Color.theme, width: '100%', height: 72}}>
            <View style={{width: '13%'}}>
                <Image source={item.image} style={{width: 50, height: 50, borderRadius: 10}}/>
            </View>
            <View style={{width: '82%', paddingHorizontal: 10}}>
                <Text style={{fontSize: 12, fontWeight: 'bold', width:'80%'}}>{item.title}</Text>
                <Text style={{fontSize: 8, marginVertical: 3}}>Adang Susanyo</Text>
            </View>
            <View style={{width: '17%'}}>
                <Feather name={'arrow-up-right'} color={Color.primary} size={16}/>
            </View>
        </Pressable>
      );

  return (
    <View style={{width: '100%', height: '100%', backgroundColor: Color.border}}>
        <View style={{width: '100%', height: 60, justifyContent: 'center', alignItems: 'center',backgroundColor: Color.theme, flexDirection: 'row'}}>
            <View style={{alignItems: 'center', justifyContent: 'center',width: '12%', height: '100%',}}>
                <AntDesign onPress={() => navigation.goBack()} name={'arrowleft'} size={20}/>
            </View>
            <TouchableOpacity style={{paddingRight: 12,width: '88%', height: '80%' ,justifyContent: 'center'}}>
                <TextInput placeholder='Cari artikel apa hari ini . . .' style={{width: '100%',height: '80%',backgroundColor: Color.theme, fontSize: 12, borderRadius: 6,borderWidth: 1, borderColor: Color.border, paddingHorizontal: 10}}></TextInput>
                <AntDesign size={14} name={'search1'} style={{position: 'absolute', color: Color.secondary, alignSelf: 'flex-end', right: 22}}/>
            </TouchableOpacity>
        </View>
        {pencarian == true ?
            <View style={{backgroundColor: Color.theme, paddingHorizontal: 10}}>
                <Text style={{fontSize: 12, fontWeight: 'bold', color: Color.secondary, marginVertical: 5}}>Pencarian Terakhir</Text>
                <FlatList
                    data={DATA}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </View>
        :
        null}
        {rekomendasi == true ?
            <View style={{backgroundColor: Color.theme, paddingVertical: 15,}}>
                <Text style={{paddingHorizontal: 12, paddingBottom: 5,fontSize: 12, fontWeight: 'bold', color: Color.secondary}}>Rekomendasi Artikel</Text>
                <FlatList
                    data={REKOMENDASI}
                    renderItem={render}
                    keyExtractor={item => item.id}
                />
            </View>
        :
        null}

        
    </View>
  )
}

export default SearchArticle