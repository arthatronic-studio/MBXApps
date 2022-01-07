import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import ImagesPath from '../ImagesPath';
import {
  Row,
  Col,
  // TouchableOpacity,
  useColor,
} from '@src/components';
import { navigationRef } from 'App';

const DATA = [
  {
    id: 1,
    image: ImagesPath.produklelang,
    title: 'Pashmina Pink Nissa Sabyan',
    firstPrice: '50.000',
    time: '02:25',
  },
  {
    id: 2,
    image: ImagesPath.produklelang2,
    title: 'Gazelle Hi Vintage - Green',
    firstPrice: '20.000',
    time: '02:25',
  },
  {
    id: 3,
    image: ImagesPath.produklelang3,
    title: 'ZIPPO Pemantik Armor 5 Sisi ...',
    firstPrice: '20.000',
    time: '02:25',
  },
  {
    id: 4,
    image: ImagesPath.produklelang2,
    title: 'Gazelle Hi Vintage - Green',
    firstPrice: '20.000',
    time: '02:25',
  },
  {
    id: 4,
    image: ImagesPath.produklelang5,
    title: 'Limited Edition Figure - Monkey ...',
    firstPrice: '60.000',
    time: '02:25',
  },
  {
    id: 4,
    image: ImagesPath.produklelang6,
    title: 'PlayStation 4 Pro 500 Million ...',
    firstPrice: '50.000',
    time: '02:25',
  },
];

const CardListLelang = (props) => {
  const {Color} = useColor();
  const renderItem = ({item}) => (
    <View
      style={{
        width: '46%',
        height: 260,
        marginHorizontal: 5,
        marginVertical: 5,
      }}>
      <TouchableOpacity style={styles.btnCategory}>
        <Image
          source={item.image}
          style={{
            width: 160,
            height: 150,
            borderRadius: 10,
            alignSelf: 'center',
          }}
        />

        <View
          style={{
            width: '100%',
            height: '45%',
          }}>
          <View style={{paddingVertical: 8}}>
            <Text style={styles.txtTitle}>{item.title}</Text>
          </View>
          <View style={{marginVertical: 5}}>
            <Text style={styles.txtCategory}>Harga Awal</Text>
            <Text style={styles.txtPrice}>Rp {item.firstPrice}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          width: '17%',
          position: 'absolute',
          marginVertical: 14,
          marginHorizontal: 20,
        }}>
        <TouchableOpacity
          style={{
            width: 53,
            height: 23,
          }}>
          <View>
            <View
              style={{
                backgroundColor: '#FF3434',
                width: 53,
                height: 23,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontSize: 10}}>{item.time}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <View style={{alignItems: 'center'}}>
      <FlatList
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        data={DATA}
        renderItem={renderItem}
      />
    </View>
  );
};

export default CardListLelang;

const styles = StyleSheet.create({
  btnCategory: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  txtTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
  txtCategory: {
    color: '#666666',
    fontWeight: '400',
    fontSize: 11,
  },
  txtRating: {
    color: '#A39CA0',
    fontWeight: '400',
    fontSize: 11,
    paddingRight: 5,
  },
  txtSold: {
    color: '#A39CA0',
    fontWeight: '400',
    fontSize: 11,
    paddingLeft: 5,
  },
  txtPrice: {
    color: 'black',
    fontWeight: '700',
    fontSize: 14,
  },
});
