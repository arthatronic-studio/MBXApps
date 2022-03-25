import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  TextInput as TextInputs,
  Image,
  FlatList,
} from 'react-native';
import Styled from 'styled-components';

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

import Filter from 'src/components/Filter';
import CardProduct from './CardProduct';
import ImagesPath from 'src/components/ImagesPath';

import {MainView} from 'src/styled';
import {shadowStyle} from '@src/styles';

let filter = [
  {id: 1, name: 'Category'},
  {id: 2, name: 'Rating'},
];

const DATA = [
  {
    id: 1,
    image: ImagesPath.productImage,
    title: 'Pashmina Pink Nissa Sabyan',
    category: 'Fashion',
    stock: 150,
    rating: 5,
    sold: 1,
    price: '10.000',
  },
  {
    id: 2,
    image: ImagesPath.productImage,
    title: 'Pashmina Pink Nissa Sabyan',
    category: 'Fashion',
    stock: 150,
    rating: 5,
    sold: 1,
    price: '10.000',
  },
  {
    id: 3,
    image: ImagesPath.productImage,
    title: 'Pashmina Pink Nissa Sabyan',
    category: 'Fashion',
    stock: 150,
    rating: 5,
    sold: 1,
    price: '10.000',
  },
  {
    id: 4,
    image: ImagesPath.productImage,
    title: 'Pashmina Pink Nissa Sabyan',
    category: 'Fashion',
    stock: 150,
    rating: 5,
    sold: 1,
    price: '10.000',
  },
];

const MyProduct = ({navigation, route}) => {
  // selector
  const {Color} = useColor();
  const onSelect = item => {
    setSelectedItem(item);
  };

  const [selectedItem, setSelectedItem] = useState(null);
  useEffect(() => {}, []);

  return (
    <Scaffold
      header={
        <Header
          customIcon
          title="Produk Kamu"
          type="regular"
          centerTitle={false}
        />
      }
      onPressLeftButton={() => navigation.pop()}>
      <MainView style={{backgroundColor: Color.semiwhite}}>
        <View style={{marginTop: 12, marginBottom: 10}}>
          <Filter
            title={'semua'}
            value={selectedItem}
            data={filter}
            onSelect={onSelect}
          />
        </View>
        <View style={{flex: 1}}>
          <FlatList
            data={DATA}
            keyExtractor={(item, index) => item.toString() + index}
            renderItem={({item}) => {
              return <CardProduct data={item} />;
            }}
          />
        </View>

        {/* <Loading {...loadingProps} /> */}
      </MainView>
      <View
        style={{
          ...shadowStyle,
          height: 77,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Color.textInput,
        }}>
        <View
          style={{
            width: '92%',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              borderWidth: 1.5,
              borderColor: Color.danger,
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 120,
            }}>
            <Image source={ImagesPath.trash} />
          </TouchableOpacity>
          <TouchableOpacity
          onPress={() => navigation.navigate('AddProduct')}
            style={{
              flexDirection: 'row',
              backgroundColor: Color.primary,
              paddingVertical: 10,
              flex: 2,
              marginLeft: 10,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image source={ImagesPath.plusCircle} />
            <Text style={{color: Color.textInput, marginLeft: 11}}>
              Tambah Produk
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Scaffold>
  );
};

export default MyProduct;
