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
  }, [isFocused]);

  const renderItem = ({item}) => {
    let remainingTime = 0;
    if (item.auctionStatus === 'BELUM SELESAI') {
      // remainingTime = moment(new Date("2022-05-04 02:00:00") - new Date()).format("hh:mm");
      remainingTime = moment(new Date(item.dateEnd)).fromNow('HH:mm');
    }
    return (
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 10,
          backgroundColor: Color.theme,
          borderRadius: 8,
          marginVertical: 5,
          marginHorizontal: 16,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={{uri: item.product.imageUrl}}
              style={{height: 48, aspectRatio: 1, borderRadius: 5}}
            />
            <View
              style={{
                marginLeft: 16,
                flexDirection: 'column',
                maxWidth: '70%',
              }}>
              <Text
                style={{fontWeight: 'bold', textAlign: 'left'}}
                numberOfLines={2}>
                {item.product.name}
              </Text>
              <Divider height={10} />
              <View
                style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                <View style={{flexDirection: 'column'}}>
                  <Text
                    style={{
                      textAlign: 'left',
                      fontSize: 8,
                      color: Color.secondary,
                    }}>
                    Tanggal Lelang
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 10,
                      textAlign: 'left',
                    }}>
                    {moment(item.dateStart).format('DD MMM YYYY')}
                  </Text>
                </View>
                <Divider width={16} />
                <View style={{flexDirection: 'column'}}>
                  <Text
                    style={{
                      textAlign: 'left',
                      fontSize: 8,
                      color: Color.secondary,
                    }}>
                    Durasi Lelang
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 10,
                      textAlign: 'left',
                    }}>
                    {item.duration} Menit
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: item.auctionStatus === 'BELUM SELESAI' ? '#3C58C1' : '#07181F',
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
              alignSelf: 'flex-start',
            }}>
            <Text style={{fontSize: 8, color: Color.textInput}}>
              {item.auctionStatus === 'BELUM SELESAI'
                ? remainingTime
                : item.auctionStatus}
            </Text>
          </View>
        </View>
        <Divider />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'column'}}>
            <Text
              style={{fontSize: 8, color: Color.secondary, textAlign: 'left'}}>
              Harga Awal
            </Text>
            <Text style={{fontWeight: 'bold', fontSize: 10, textAlign: 'left'}}>
              {item.startPrice.toLocaleString().replace(/,/g, '.')} Poin
            </Text>
          </View>
          <View
            style={{
              width: '20%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Color.theme,
              borderWidth: 1,
              borderColor: Color.primary,
              height: 30,
              borderRadius: 20,
            }}>
            <Text style={{fontSize: 11, color: Color.primary}}>Lihat</Text>
          </View>
        </View>
      </View>
    );
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
