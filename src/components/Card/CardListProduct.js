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

const DATA = [
  {
    id: 1,
    image: ImagesPath.productImage,
    title: 'Pashmina Pink',
    category: 'Hijab',
    rating: 5,
    sold: 16,
    price: '150.000',
    favorite: false,
  },
  {
    id: 2,
    image: ImagesPath.productImage,
    title: 'Pashmina Pink',
    category: 'Fashion',
    rating: 5,
    sold: 16,
    price: '150.000',
    favorite: false,
  },
  {
    id: 3,
    image: ImagesPath.productImage,
    title: 'Pashmina Pink',
    category: 'Instrument',
    rating: 5,
    sold: 16,
    price: '150.000',
    favorite: false,
  },
  {
    id: 4,
    image: ImagesPath.productImage,
    title: 'Pashmina Pink',
    category: 'Kacamata',
    rating: 5,
    sold: 16,
    price: '150.000',
    favorite: false,
  },
  {
    id: 4,
    image: ImagesPath.productImage,
    title: 'Pashmina Pink',
    category: 'Kacamata',
    rating: 5,
    sold: 16,
    price: '150.000',
    favorite: false,
  },
  {
    id: 4,
    image: ImagesPath.productImage,
    title: 'Pashmina Pink',
    category: 'Kacamata',
    rating: 5,
    sold: 16,
    price: '150.000',
    favorite: false,
  },
  {
    id: 4,
    image: ImagesPath.productImage,
    title: 'Pashmina Pink',
    category: 'Kacamata',
    rating: 5,
    sold: 16,
    price: '150.000',
    favorite: false,
  },
  {
    id: 4,
    image: ImagesPath.productImage,
    title: 'Pashmina Pink',
    category: 'Kacamata',
    rating: 5,
    sold: 16,
    price: '150.000',
    favorite: false,
  },
];

const CardListProduk = () => {
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
            height: 120,
            borderRadius: 10,
            alignSelf: 'center',
          }}
        />

        <View
          style={{
            width: '100%',
            height: '45%',
            marginVertical: 10,
          }}>
          <View style={{paddingVertical: 15}}>
            <Text style={styles.txtTitle}>{item.title}</Text>
            <Text style={styles.txtCategory}>{item.category}</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.txtRating}>{item.rating}</Text>
              <Image source={ImagesPath.star} style={{width: 13, height: 13}} />
              <Text style={styles.txtSold}>{item.sold} Terjual</Text>
            </View>
          </View>
          <View style={{marginVertical: 5}}>
            <Text style={styles.txtPrice}>Rp {item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          width: '17%',
          position: 'absolute',
          flexDirection: 'row',
          marginVertical: 110,
          alignSelf: 'flex-end',
        }}>
        <TouchableOpacity
          style={{
            width: 30,
            height: 30,
          }}>
          <View>
            <View
              style={{
                backgroundColor: 'grey',
                width: 30,
                height: 30,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={ImagesPath.unfavorited}
                style={{width: 20, height: 20}}
              />
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

export default CardListProduk;

const styles = StyleSheet.create({
  btnCategory: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    backgroundColor: '#363636',
  },
  txtTitle: {
    color: 'white',
    fontWeight: '700',
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
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
});
