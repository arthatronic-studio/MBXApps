import React, {useState, useEffect, useRef} from 'react';
import {View, ScrollView, Platform, SafeAreaView, Image, TouchableOpacity, Dimensions} from 'react-native';
import Styled from 'styled-components';
import {useSelector} from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
import TopBar from './TopTab';
import ImagesPath from 'src/components/ImagesPath';
import Carousel from 'react-native-snap-carousel';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const images = [
  ImagesPath.productImage,
  ImagesPath.productImage,
  ImagesPath.productImage,
  ImagesPath.productImage,
  ImagesPath.productImage,
]
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;



const DetailProduct = () => {
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);
  const {Color} = useColor();



  return (
    <Scaffold
      header={
        <Header
          customIcon
          type="regular"
          color={Color.white}
          backgroundColor="blackContent"
          centerTitle={false}
          searchbar
          cartIcon
          favoriteIcon
        />
      }
      color="black"
      onPressLeftButton={() => navigation.pop()}>
      <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
        <View
          style={{
            flex: 1,
          }}>
        </View>
        <View
          style={{
            backgroundColor: '#252525',
            borderRadius: 25,
            width: '100%',
            height: 700,
            marginTop: '95%',
          }}>
          <View
            style={{
              marginTop: 10,
              width: '100%',
              height: 20,
              backgroundColor: '#252525',
              borderRadius: 15,
            }}></View>
          <View>
            <View
              style={{
                width: '100%',
                height: 5,
                backgroundColor: '#252525',
              }}>
              {/* Mulai */}
            </View>
            <View style={{flexDirection: 'row'}}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    color: Color.white,
                    fontWeight: 'bold',
                    width: 128,
                    paddingHorizontal: 11,
                    paddingVertical: 5,
                  }}>
                  Pashmina Pink
                </Text>
                <View style={{flexDirection: 'row', paddingHorizontal: 10}}>
                  <Text
                    style={{
                      fontSize: 11,
                      color: Color.gray,
                      paddingHorizontal: 5,
                      fontWeight: 'bold',
                    }}>
                    Hijab |
                  </Text>
                  <Image
                    source={ImagesPath.star}
                    style={{width: 15, height: 15}}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: Color.gray,
                      paddingHorizontal: 5,
                      fontWeight: 'bold',
                    }}>
                    4.5
                  </Text>
                </View>
              </View>
              <View style={{paddingVertical: 8}}>
                <Text
                  style={{
                    width: 370,
                    color: Color.white,
                    fontWeight: 'bold',
                    fontSize: 20,
                  }}>
                  Rp. 150.000
                </Text>
              </View>
            </View>
          </View>
          <TopBar style={{borderRadius: 10}} />
        </View>
      </ScrollView>
      <View
        style={{
          width: '100%',
          height: '10%',
          backgroundColor: '#363636',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
          }}>
          <TouchableOpacity
            style={{
              width: '40%',
              height: 40,
              borderWidth: 1,
              borderColor: '#FAC255',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
              marginHorizontal: 10,
            }}>
            <View style={{flexDirection: 'row'}}>
              <MaterialCommunityIcons
                name={'shopping-outline'}
                size={17}
                style={{paddingHorizontal: 5, color: '#FAC255'}}
              />
              <Text
                style={{
                  fontSize: 13,
                  color: '#FAC255',
                  fontWeight: 'bold',
                  paddingHorizontal: 5,
                }}>
                Beli Langsung
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '50%',
              height: 40,
              backgroundColor: '#FAC255',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
              marginHorizontal: 10,
              flexDirection: 'row'
            }}>
            <FontAwesome5 name={"shopping-cart"} size={13} style={{paddingHorizontal: 5}} />
            <Text
              style={{
                fontSize: 13,
                color: Color.blackContent,
                fontWeight: 'bold',
                paddingHorizontal: 5,
              }}>
              Tambah Keranjang
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <View
        style={{backgroundColor: 'white', width: '100%', height: 50}}></View> */}
    </Scaffold>
  );
};

export default DetailProduct;
