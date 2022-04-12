import React, {useState, useEffect, useRef} from 'react';
import {View, Image, useWindowDimensions, TextInput} from 'react-native';
import {Divider, Line} from 'src/styled';
import {connect, useDispatch, useStore} from 'react-redux';
import {TouchableOpacity} from '@src/components/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  ModalListAction,
} from '@src/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import ImagesPath from 'src/components/ImagesPath';

const EditProduct = ({navigation,route}) => {
  const {Color} = useColor();
  return (
    <Scaffold
      style
      header={
        <Header
          customIcon
          title="Edit Produk"
          type="regular"
          centerTitle={false}
        />
      }
      onPressLeftButton={() => navigation.pop()}>
      <View style={{paddingHorizontal: 14, paddingVertical: 16}}>
        <View
          style={{
            padding: 16,
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: Color.border,
            borderRadius: 8,
          }}>
          <Image
          source={{uri:route.params.item.imageUrl}}
            style={{
              borderRadius: 4,
              backgroundColor: Color.secondary,
              width: 48,
              height: 48,
            }}
          />
          <View style={{marginLeft: 8, alignItems: 'flex-start'}}>
            <Text type="bold">Pashmina Pink Nissa Sabyan</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: 120,
                marginVertical: 4,
              }}>
              <Text style={{color: Color.secondary}} size="10">
                Hijab
              </Text>
              <Text style={{color: Color.secondary}} size="10">
                •
              </Text>
              <Text style={{color: Color.secondary}} size="10">
                250gr
              </Text>
              <Text style={{color: Color.secondary}} size="10">
                •
              </Text>
              <Text style={{color: Color.secondary}} size="10">
                120 Stok
              </Text>
            </View>
            <Text type="bold">Rp15.000</Text>
          </View>
        </View>
        <View style={{marginTop: 24, alignItems: 'flex-start'}}>
          <Text size="11" type="semibold">
            Detail
          </Text>
          {console.log(route,"route edit")}
          <TouchableOpacity
          onPress={()=>{navigation.navigate('AddProduct',route.params)}}
            style={{
              paddingVertical: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
            <Text>Informasi Produk</Text>
            <Image source={ImagesPath.arrowRight} />
          </TouchableOpacity>
          <View
            style={{
              paddingVertical: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
            <Text>Detail Produk</Text>
            <Image source={ImagesPath.arrowRight} />
          </View>
          <View
            style={{
              paddingVertical: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
            <Text>Harga Produk</Text>
            <Image source={ImagesPath.arrowRight} />
          </View>
        </View>
      </View>
    </Scaffold>
  );
};

export default EditProduct;
