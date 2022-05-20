import React, { useState, useEffect, useRef, Component } from 'react';
import { View, AppRegistry, FlatList, Platform, Image, SafeAreaView, TextInput, TouchableOpacity, Pressable } from 'react-native';
import Styled from 'styled-components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useColor} from '@src/components';
import {useNavigation} from '@react-navigation/native';


import {
	Text,
	// TouchableOpacity,
	Loading,
	useLoading,
	Scaffold,
	Row,
	Col,
	HeaderBig,
	Header
} from '@src/components';
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import { queryGetCartAuction } from 'src/lib/query/auction';
import Client from 'src/lib/apollo';
import ImagesPath from 'src/components/ImagesPath';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment';
import { Container, Divider } from 'src/styled';
import ModalFilter from 'src/components/Modal/ModalFilter';


const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      namaProduct: 'Pashmina Pink Nissa Sabyan',
      status: 'Menang',
      tanggal: 'rabu, 29 Desember 2021',
      penawaranmu: '160.000',
      hargaAkhir: '160.000',
      image: ImagesPath.produklelang2
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      namaProduct: 'Gazelle Hi Vintage - Green',
      status: 'Menang',
      tanggal: 'rabu, 29 Desember 2021',
      penawaranmu: '160.000',
      hargaAkhir: '160.000',
      image: ImagesPath.produklelang3
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      namaProduct: 'Zippo Original Armor Japan Special Edition . . .',
      status: 'Menang',
      tanggal: 'rabu, 29 Desember 2021',
      penawaranmu: '160.000',
      hargaAkhir: '160.000',
      image: ImagesPath.produklelang
    },
  ];


const AuctionHistory = () => {
    const {Color} = useColor();
    const navigation = useNavigation();
    
    const [data, setData] = useState();
    const modalFilterRef = useRef();
    const [filter, setFilter] = useState({});

    const onFilterChange = value => {
      setFilter(value);
      modalFilterRef.current.close();
    };

    const getCart = () => {
      // showLoading();
      let variables = {
        page: 1, 
        limit:20,
        cartType: 'RIWAYAT',
        orderDirection: 'DESC',
        orderBy: filter.value,
      };
      Client.query({query: queryGetCartAuction, variables})
        .then(res => {
          if (res.data.auctionCartList.id) {
            setData(res.data.auctionCartList.items)
          }
        })
        .catch(reject => {
          console.log(reject, 'reject auction');
        });
    };

    useEffect(() => {
      getCart();
    }, [filter]);

    const renderItem = ({ item }) => (
        <View style={{paddingHorizontal: 10, paddingVertical: 10,borderRadius: 5,alignSelf:'center',marginVertical: 10,width: '95%', backgroundColor: Color.theme, elevation: 5}}>
            <Row>
                <Image source={{ uri: item.image }} style={{width: '15%', height: 50, borderRadius: 10}}/>
                <Col style={{marginHorizontal: 10,}}>
                    <Text style={{lineHeight: 20,width: '72%', fontWeight: 'bold', textAlign: 'left'}}>{item.name}</Text>
                    <Text style={{marginVertical: 5,fontSize: 10, color: Color.secondary, textAlign: 'left'}}>{moment(item.dateStart).format('dddd, DD MMMM YYYY')}</Text>
                </Col>
                <View style={{backgroundColor: '#E7F5D0',borderColor: '#558617', borderWidth: 1, width: '15%', height: 25, alignItems: 'center', justifyContent: 'center', borderRadius: 20}}>
                    <Text style={{color: '#558617',fontSize: 10}}>{item.status}</Text>
                </View>
            </Row>
            <Divider/>
            <Row>
                <Col >
                    <Text style={{fontSize: 10, color: Color.secondary, textAlign: 'left'}}>Penawaranmu</Text>
                    <Text style={{fontSize: 12, fontWeight: 'bold', textAlign: 'left'}}>{item.userBidLatest.toLocaleString().replace(/,/g, '.')} <Text style={{fontSize: 8, fontWeight: 'bold'}}>Poin</Text></Text>
                </Col>
                <Col>
                    <Text style={{fontSize: 10, color: Color.secondary, textAlign: 'left'}}>Harga Akhir</Text>
                    <Text style={{fontSize: 12, fontWeight: 'bold', textAlign: 'left'}}>{item.latestBidPrice.toLocaleString().replace(/,/g, '.')} <Text style={{fontSize: 8, fontWeight: 'bold'}}>Poin</Text></Text>
                </Col>
                <TouchableOpacity onPress={() => navigation.navigate('DetailLelang', {iniId: item.auctionId, showButton: item.status == 'ONGOING' ? true : false})}>
                  <Text style={{fontSize: 10, marginHorizontal: 5, marginVertical: 8, color: Color.primary}}>Lihat Detail</Text>
                </TouchableOpacity>
                <AntDesign name={'arrowright'} size={11} style={{marginVertical: 9, marginRight: 15, color: Color.primary}}/>
            </Row>
        </View>
      );
  return (
    <Scaffold
      header={
        <Header
          type="bold"
          centerTitle={false}
          customIcon
          title="Riwayat"
        />
      }>
    <Row style={{ paddingHorizontal: 15 }}>
        <TouchableOpacity style={{paddingVertical: 6, paddingHorizontal: 12, borderRadius: 120, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderColor:Color.text, borderWidth: 1}} onPress={() => modalFilterRef.current.open()}>
            <MaterialIcons name={'sort'} size={12}/>
            <Divider width={5}/>
            <Text size={10}>{filter.name ? filter.name : 'Urutkan'}</Text>
            <Divider width={10}/>
            <MaterialIcons name={'keyboard-arrow-down'} size={16}/>
        </TouchableOpacity>
    </Row>
    <Divider/>
    <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      {/* modal */}
      <ModalFilter
        ref={modalFilterRef}
        selectedValue={filter}
        onPress={value => onFilterChange(value)}
      />
    </Scaffold>
  )
}

export default AuctionHistory