import React, {useState, useEffect, useRef} from 'react';
import {View, Image, useWindowDimensions, TextInput} from 'react-native';
import {Divider, Line} from 'src/styled';
import {connect, useDispatch, useStore} from 'react-redux';
import {TouchableOpacity} from '@src/components/Button';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Styled from 'styled-components';
import {useNavigation} from '@react-navigation/native';
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
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import ImagesPath from 'src/components/ImagesPath';
import {FormatMoney} from 'src/utils';
import {queryDetailProduct} from 'src/lib/query/ecommerce';
import client from 'src/lib/apollo';
import ImageSlider from 'src/components/ImageSlider';

const DirectOrder = () => {
  const {Color} = useColor();
  const navigation = useNavigation();
  return (
    <Scaffold
      style
      header={
        <Header customIcon title="Beli Langsung" type="bold" centerTitle={false} />
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
            <View style={{flexDirection: 'row', }}>
              <Text type="bold" size="24">
                15
                <Text type="bold" size="16">
                  .000.000
                </Text>
                <View >
                  <Text style={{marginHorizontal: 2}} size="10">
                  Poin
                </Text>
                </View>
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
            <Text style={{textAlign: 'justify'}}>
              Cupcake ipsum dolor sit amet biscuit caramels cupcake tootsie
              roll. Cake bonbon sweet dragée candy canes. Fruitcake powder
              tiramisu cake cupcake gummies donut. Jelly-o chocolate bar pastry
              pastry danish dragée chupa chups icing fruitcake. Bonbon sesame
              snaps carrot cake jelly jujubes topping liquorice ice cream sweet
              roll. Powder chupa chups toffee ice cream cotton candy sweet roll
              chocolate bar lemon drops. Muffin carrot cake sesame snaps soufflé
              fruitcake fruitcake. Gingerbread tart shortbread cake tart.
              {'\n'}{'\n'}
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
          <View style={{flexDirection: 'row', alignItems: 'flex-start', marginVertical: 5}}>
            <Text style={{width: 120, textAlign: 'left'}}>Berat Barang</Text>
            <Text style={{marginHorizontal: 24}}>:</Text>
            <Text>800gr</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'flex-start',marginVertical: 5}}>
            <Text style={{width: 120, textAlign: 'left'}}>Kondisi Barang</Text>
            <Text style={{marginHorizontal: 24}}>:</Text>
            <Text>Baru</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'flex-start',marginVertical: 5}}>
            <Text style={{width: 120, textAlign: 'left'}}>Stok Produk</Text>
            <Text style={{marginHorizontal: 24}}>:</Text>
            <Text>158 Tersisa</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'flex-start',marginVertical: 5}}>
            <Text style={{width: 120, textAlign: 'left'}}>Kategori Barang</Text>
            <Text style={{marginHorizontal: 24}}>:</Text>
            <Text>Tas Pria</Text>
          </View>
        </View>
      </ScrollView>
      <View style={{elevation: 5,flexDirection: 'row', width: '100%', height: 60, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity
          onPress={()=> navigation.navigate('')}
          style={{
            width: '45%',
            height: 40,
            borderColor: Color.primary,
            borderWidth: 1,
            backgroundColor: Color.theme,
            marginHorizontal: 5,
            borderRadius: 120,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row'
          }}>
            <MaterialCommunityIcons name={'shopping-outline'} color={Color.primary} size={14}/>
          <Text style={{color: Color.primary, fontSize: 12, marginHorizontal: 8}} type="medium">
            Beli Langsung
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=> navigation.navigate('CartScreen', {routeName: "Auction"})}
          style={{
            width: '45%',
            height: 40,
            borderColor: Color.primary,
            backgroundColor: Color.primary,
            marginHorizontal: 5,
            borderRadius: 120,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row'
          }}>
          <FontAwesome5 name={'shopping-cart'} color={Color.textInput} size={12}/>
          <Text style={{color: Color.theme, fontSize: 12,marginHorizontal: 10}} type="medium">
            Tambah Keranjang
          </Text>
        </TouchableOpacity>
      </View>
    </Scaffold>
  );
};

export default DirectOrder;
