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
import {FormatMoney} from 'src/utils';
import {queryDetailProduct} from 'src/lib/query/ecommerce';
import client from 'src/lib/apollo';
import ImageSlider from 'src/components/ImageSlider';

const DirectOrder = () => {
  const {Color} = useColor();
  return (
    <Scaffold
      style
      header={
        <Header customIcon title="Detail" type="regular" centerTitle={false} />
      }
      onPressLeftButton={() => navigation.pop()}>
      <ScrollView style={{}}>
      <View
          style={{
            width: '100%',
            aspectRatio: 4/3,
          }}>
          <ImageSlider
            data={["http://dev.api.tribesocial.id:7070/assets/images/20220407231515.png","http://dev.api.tribesocial.id:7070/assets/images/20220407231516.png","http://dev.api.tribesocial.id:7070/assets/images/20220407231517.png"]}
          />
        </View>
        <View
          style={{
            
            paddingHorizontal: 16,
            paddingVertical: 24,
            alignItems: 'flex-start',
            borderTopLeftRadius:20,
            borderTopRightRadius:20,
            backgroundColor:Color.theme,
            marginTop:-20
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'left',
            }}>
            <Text
              style={{
                width: '50%',
                textAlign: 'left',
              }}
              type="semibold">
              Pashmina Pink Nissa Sabyan
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <Text type="bold" size="24">
                15
                <Text type="bold" size="16">
                  .000.000
                </Text>
              </Text>
              <Text style={{marginLeft: 5}} size="10">
                Poin
              </Text>
            </View>
          </View>
          <Text
            style={{textAlign: 'left', color: Color.secondary, marginTop: 4}}
            size="10">
            Fashion
          </Text>
          <View>
            <Text
              size="10"
              type="medium"
              style={{textAlign: 'left', marginTop: 16, marginBottom: 4}}>
              Deskripsi
            </Text>
            <Text style={{textAlign: 'left'}}>
              Cupcake ipsum dolor sit amet biscuit caramels cupcake tootsie
              roll. Cake bonbon sweet dragée candy canes. Fruitcake powder
              tiramisu cake cupcake gummies donut. Jelly-o chocolate bar pastry
              pastry danish dragée chupa chups icing fruitcake. Bonbon sesame
              snaps carrot cake jelly jujubes topping liquorice ice cream sweet
              roll. Powder chupa chups toffee ice cream cotton candy sweet roll
              chocolate bar lemon drops. Muffin carrot cake sesame snaps soufflé
              fruitcake fruitcake. Gingerbread tart shortbread cake tart.
            </Text>
          </View>
          <Text style={{marginVertical: 16}} type="semibold">
            Spesifikasi
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
            <Text style={{width: 120, textAlign: 'left'}}>Berat Barang</Text>
            <Text style={{marginHorizontal: 24}}>:</Text>
            <Text>800gr</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
            <Text style={{width: 120, textAlign: 'left'}}>Kondisi Barang</Text>
            <Text style={{marginHorizontal: 24}}>:</Text>
            <Text>Baru</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
            <Text style={{width: 120, textAlign: 'left'}}>Stok Produk</Text>
            <Text style={{marginHorizontal: 24}}>:</Text>
            <Text>158 Tersisa</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
            <Text style={{width: 120, textAlign: 'left'}}>Kategori Barang</Text>
            <Text style={{marginHorizontal: 24}}>:</Text>
            <Text>Tas Pria</Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={{
          paddingVertical: 13,
          paddingHorizontal: 124,
          borderColor: Color.primary,
          backgroundColor: Color.primary,
          margin: 16,
          borderRadius: 120,
        }}>
        <Text style={{color: Color.theme}} type="medium">
          Beli Langsung
        </Text>
      </TouchableOpacity>
    </Scaffold>
  );
};

export default DirectOrder;
