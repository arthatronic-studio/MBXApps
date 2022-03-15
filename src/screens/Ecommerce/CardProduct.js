import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Platform,
  SafeAreaView,
  TextInput as TextInputs,
  Image,
} from 'react-native';
import Styled from 'styled-components';
import {useSelector} from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagesPath from 'src/components/ImagesPath';

import {
  Text,
  // TouchableOpacity,
  Loading,
  useLoading,
  Scaffold,
  Row,
  Col,
  HeaderBig,
  useColor,
  Header,
} from '@src/components';
import {TouchableOpacity} from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';

import {shadowStyle} from '@src/styles';

import Client from '@src/lib/apollo';
import {queryContentProduct} from '@src/lib/query';
import {TextInput} from 'src/components/Form';
import CardListProduk from 'src/components/Card/CardListProduct';
import TopTabShop from './TopTabShop';
import Filter from 'src/components/Filter';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;
let filter = [
  {id: 1, name: 'Category'},
  {id: 2, name: 'Rating'},
];
const CardProduct = ({data}) => {


  // selector
  const {Color} = useColor();
  const onSelect = item => {
    setSelectedItem(item);
  };

  const [selectedItem, setSelectedItem] = useState(null);
  useEffect(() => {}, []);

  return (
    <View style={{alignItems: 'center'}}> 


    <TouchableOpacity
      style={{
        width: '92%',
        padding: 10,
        borderRadius: 8,
        backgroundColor: Color.textInput,
        ...shadowStyle,
        marginBottom: 13,
      }}>
      <View style={{flexDirection: 'row'}}>
        <Image
        source={data.image}
          style={{
            height: 48,
            width: 48,
            borderRadius: 4,
            backgroundColor: Color.grayLight,
            marginRight: 16,
          }}
        />
        <View style={{alignItems: 'flex-start'}}>
          <Text type="bold">{data.title}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 4,
              marginBottom: 16,
            }}>
            <Image
              style={{marginRight: 5, width: 10, height: 10}}
              source={ImagesPath.starRate}
            />
            <Text size="10" style={{color: Color.gray}}>
              {data.rating} | {data.sold}k terjual
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{marginRight: 15}}>
              <Text size="8" style={{color: Color.gray}}>
                Harga Barang
              </Text>
              <Text size="10">{data.price} poin</Text>
            </View>
            <View style={{marginRight: 15}}>
              <Text size="8" style={{color: Color.gray}}>
                Stok Barang
              </Text>
              <Text size="10">{data.stock} Buah</Text>
            </View>
            <View>
              <Text size="8" style={{color: Color.gray}}>
                Etalase
              </Text>
              <Text size="10">{data.category}</Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-end',
          marginTop: 16,
          marginBottom: 16,
        }}>
        <Image source={ImagesPath.trash} />
        <TouchableOpacity
          style={{
            borderRadius: 20,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderWidth: 2,
            borderColor: Color.primary,
            marginLeft: 20,
          }}>
          <Text size="12" type="bold" style={{color: Color.primary}}>
            Edit Produk
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
    </View>
  );
};

export default CardProduct;
