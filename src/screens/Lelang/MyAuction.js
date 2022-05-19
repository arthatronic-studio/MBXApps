import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Image,
  FlatList,
  TextInput as TextInputs,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import Styled from 'styled-components';
import {useSelector} from 'react-redux';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {
  Text,
  // TouchableOpacity,
  useLoading,
  Scaffold,
  useColor,
  Header,
} from '@src/components';
import {TouchableOpacity} from '@src/components/Button';

import {Divider, Circle, Container, Row} from '@src/styled';
import Client from '@src/lib/apollo';
import ImagesPath from 'src/components/ImagesPath';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';
import {queryGetAuction} from 'src/lib/query/auction';
import CardMyAuction from 'src/components/Card/CardMyAuction';
import moment from 'moment';

const DATA = [
  {
    id: 1,
    image: ImagesPath.produklelang,
    title: 'Pashmina Pink Nissa Sabyan',
    date: '05 Apr 2022',
    time: '25:43',
    duration: 30,
    price: '1.000',
  },
  {
    id: 2,
    image: ImagesPath.produklelang,
    title: 'Pashmina Pink Nissa Sabyan',
    date: '05 Apr 2022',
    time: '25:43',
    duration: 30,
    price: '1.000',
  },
  {
    id: 3,
    image: ImagesPath.produklelang,
    title: 'Pashmina Pink Nissa Sabyan',
    date: '05 Apr 2022',
    time: '25:43',
    duration: 30,
    price: '1.000',
  },
];

const MyAuction = () => {
  const {Color} = useColor();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [render, setRender] = useState();

  const getAuction = () => {
    let variables = {
      type: 'PROFILE',
    };
    Client.query({query: queryGetAuction, variables})
      .then(res => {
        console.log(res, 'auction');
        if (res.data.auctionProduct) {
          setData(res.data.auctionProduct);
        }
      })
      .catch(reject => {
        console.log(reject);
      });
  };

  useEffect(() => {
    getAuction();
  }, [isFocused, render]);

  const renderItem = ({item}) => {
    return <CardMyAuction item={item} onDelete={(value) => setRender(value)}/>;
  };

  return (
    <Scaffold
      style={{backgroundColor: Color.semiwhite}}
      header={
        <Header
          title={'Lelang Produk'}
          customIcon
          type="bold"
          centerTitle={false}
        />
      }
      onPressLeftButton={() => navigation.pop()}>
      <TouchableOpacity
        style={{
          backgroundColor: Color.theme,
          marginVertical: 15,
          width: '22%',
          flexDirection: 'row',
          height: 30,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 10,
          borderWidth: 1,
          borderColor: Color.border,
        }}>
        <Text style={{fontSize: 10, marginHorizontal: 5}}>Semua</Text>
        <MaterialIcons
          name={'keyboard-arrow-down'}
          size={15}
          style={{marginHorizontal: 8}}
        />
      </TouchableOpacity>
      <ScrollView>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </ScrollView>
      <Row
        style={{
          backgroundColor: Color.theme,
          height: 70,
          elevation: 5,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddProductAuction')}
          style={{
            flexDirection: 'row',
            backgroundColor: Color.primary,
            width: '95%',
            height: '60%',
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <IonIcons
            name={'add-circle-outline'}
            size={18}
            color={Color.textInput}
          />
          <Text
            style={{marginHorizontal: 5, fontSize: 12, color: Color.textInput}}>
            Tambah Produk Lelang
          </Text>
        </TouchableOpacity>
      </Row>
    </Scaffold>
  );
};

export default MyAuction;
