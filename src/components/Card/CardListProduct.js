import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import ImagesPath from '../ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  Row,
  Col,
  // TouchableOpacity,
  useColor,
} from '@src/components';
import { useNavigation } from '@react-navigation/native';
import { shadowStyle } from 'src/styles';

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

const CardListProduk = (props) => {
  const {Color} = useColor();
  const navigation = useNavigation();
  const { height, width } = useWindowDimensions();

  const renderItem = ({item}) => (
    <View
      style={{
        width: '50%',
        aspectRatio: 10/16,
        paddingHorizontal: 8,
        marginBottom: 16,
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailProduct')}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 10,
          paddingBottom: 10,
          backgroundColor: Color.theme,
          ...shadowStyle,
        }}
      >
        <View
          style={{
            width: '100%',
            height: (width - 16) / 2,
          }}
        >
          <Image
            source={item.image}
            style={{
              width: '100%',
              height: (width - 16) / 2,
              borderRadius: 10,
              alignSelf: 'center',
            }}
          />

          <View
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
            }}>
            <TouchableOpacity
              style={{
                width: 30,
                height: 30,
              }}>
              <View>
                <View
                  style={{
                    backgroundColor: Color.gray,
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

        <View
          style={{
            width: '100%',
            paddingHorizontal: 8,
          }}>
          <View style={{marginTop: 8}}>
            <Text style={[styles.txtTitle, { color: Color.text }]}>{item.title}</Text>
            <Text style={[styles.txtCategory, { color: Color.gray }]}>{item.category}</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.txtRating, { color: Color.gray }]}>{item.rating}</Text>
              <Entypo name={'star'} style={{color: Color.secondary}} />
              <Text style={[styles.txtSold, { color: Color.gray }]}>{item.sold} Terjual</Text>
            </View>
          </View>
          <View style={{marginVertical: 8}}>
            <Text style={{fontSize: 10}}>Harga</Text>
            <Text style={[styles.txtPrice, { color: Color.text }]}>Rp {item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{alignItems: 'center'}}>
      <FlatList
        numColumns={2}
        keyExtractor={(item, index) => (Math.random() + 1).toString(36).substring(7) + index.toString()}
        showsHorizontalScrollIndicator={false}
        data={DATA}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingBottom: (width - 32) / 2,
        }}
      />
    </View>
  );
};

export default CardListProduk;

const styles = StyleSheet.create({
  txtTitle: {
    fontWeight: '700',
    fontSize: 14,
  },
  txtCategory: {
    fontWeight: '400',
    fontSize: 11,
  },
  txtRating: {
    fontWeight: '400',
    fontSize: 11,
    paddingRight: 5,
  },
  txtSold: {
    fontWeight: '400',
    fontSize: 11,
    paddingLeft: 5,
  },
  txtPrice: {
    fontWeight: '700',
    fontSize: 14,
  },
});
