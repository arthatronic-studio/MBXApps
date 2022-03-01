import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  HeaderBig,
  Loading,
  useLoading,
  useColor,
  Scaffold,
  Row,
  Col,
  Button,
} from '@src/components';

const DATA = [
  {
    id: 1,
    title: 'DARURAT! MOTOR KENA BEGAL!',
    status: 'Tinggi',
    lokasi: 'Kebon Jeruk, Jakarta',
    deskripsi:
      'TOLONG! SAYA KEBEGALAN! TKP ada di sekitaran Kebon Jeruk. Kondisi saya tidak apa-apa hanya motor yang digondol . . .',
    share: '12,',
    comment: '56',
    image: ImagesPath.bantu1,
  },
  {
    id: 2,
    title: 'DARURAT! MOTOR KENA BEGAL!',
    status: 'Tinggi',
    lokasi: 'Kebon Jeruk, Jakarta',
    deskripsi:
      'TOLONG! SAYA KEBEGALAN! TKP ada di sekitaran Kebon Jeruk.Kondisi saya tidak apa-apa hanya motor yang digondol . . .',
    share: '12,',
    comment: '56',
    image: ImagesPath.bantu2,
  },
  {
    id: 3,
    title: 'DARURAT! MOTOR KENA BEGAL!',
    status: 'Tinggi',
    lokasi: 'Kebon Jeruk, Jakarta',
    deskripsi:
      'TOLONG! SAYA KEBEGALAN! TKP ada di sekitaran Kebon Jeruk. Kondisi saya tidak apa-apa hanya motor yang digondol . . .',
    share: '12,',
    comment: '56',
    image: ImagesPath.bantu1,
  },
];

const Darurat = () => {
  const {Color} = useColor();
  const renderItem = ({item}) => (
    <View
      style={{
        marginVertical: 15,
        marginHorizontal: 15,
      }}>
      <TouchableOpacity
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
          width: '100%',
          height: 220,
          elevation: 3,
          flexDirection: 'row',
          paddingVertical: 20,
        }}>
        <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
          <Image source={item.image} />
        </View>
        <View style={{paddingVertical: 10}}>
          <Text style={{fontSize: 18, paddingHorizontal: 10}}>
            {item.title}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                width: 10,
                height: 10,
                backgroundColor: 'red',
                borderRadius: 50,
                marginVertical: 5,
                marginHorizontal: 10,
              }}></View>
            <Text style={{color: Color.gray, fontSize: 12}}>{item.status}</Text>
            <View style={{flexDirection: 'row', paddingHorizontal: 10}}>
              <Entypo
                name={'location-pin'}
                size={16}
                style={{color: 'red', paddingHorizontal: 3, paddingVertical: 1}}
              />
              <Text style={{color: Color.gray, fontSize: 12}}>
                {item.lokasi}
              </Text>
            </View>
          </View>

          <View style={{marginVertical: 10}}>
            <Text style={{width: '40%', paddingHorizontal: 10}}>
              {item.deskripsi}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 25,
              marginVertical: 25,
            }}>
            <View style={{flexDirection: 'row', marginHorizontal: 25}}>
              <AntDesign name={'rocket1'} size={19} />
              <Text style={{paddingHorizontal: 5, fontSize: 16}}>
                {item.share}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <FontAwesome
                name={'commenting-o'}
                size={19}
                style={{paddingHorizontal: 5}}
              />
              <Text style={{paddingHorizontal: 5, fontSize: 16}}>
                {item.comment}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
  return (
    <View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={DATA}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Darurat;
