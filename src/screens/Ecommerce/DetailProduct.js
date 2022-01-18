import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Platform,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Styled from 'styled-components';
import {useSelector} from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import ImageSlider from '../../components/ImageSlider';
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

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const images = [
  ImagesPath.productImage,
  ImagesPath.productImage,
  ImagesPath.productImage,
  ImagesPath.productImage,
  ImagesPath.productImage,
];
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const DetailProduct = ({navigation}) => {
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
          backgroundColor="primary"
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
            width: '100%',
            height: '50%',
            position: 'absolute',
            backgroundColor: 'white',
          }}>
          <ImageSlider />
        </View>
        <View
          style={{
            backgroundColor: Color.white,
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
              backgroundColor: Color.white,
              borderRadius: 15,
            }}></View>
          <View>
            <View
              style={{
                width: '100%',
                height: 5,
                backgroundColor: Color.white,
              }}>
              {/* Mulai */}
            </View>
            <View style={{flexDirection: 'row'}}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    color: Color.black,
                    fontWeight: 'bold',
                    width: 128,
                    paddingHorizontal: 11,
                  }}>
                  Pashmina Pink
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: Color.gray,
                    fontWeight: 'bold',
                    textAlign: 'left',
                    paddingHorizontal: 15,
                  }}>
                  Fashion
                </Text>
                <View style={{height: 15}}></View>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                  }}>
                  <Entypo name={'star'} style={{color: Color.yellow}} />
                  <Entypo name={'star'} style={{color: Color.yellow}} />
                  <Entypo name={'star'} style={{color: Color.yellow}} />
                  <Entypo name={'star'} style={{color: Color.yellow}} />
                  <Entypo name={'star'} style={{color: Color.gray}} />
                  <Text
                    style={{
                      fontSize: 12,
                      color: Color.gray,
                      paddingHorizontal: 5,
                      fontWeight: 'bold',
                    }}>
                    4.0 |
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Color.gray,
                      paddingHorizontal: 5,
                      fontWeight: 'bold',
                    }}>
                    120 Terjual
                  </Text>
                </View>
              </View>
              <View style={{paddingVertical: 8}}>
                <Text
                  style={{
                    width: 300,
                    color: Color.black,
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
          backgroundColor: Color.white,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CheckoutScreen')}
            style={{
              width: '40%',
              height: 40,
              borderWidth: 1,
              borderColor: Color.blue,
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
                style={{paddingHorizontal: 5, color: Color.blue}}
              />
              <Text
                style={{
                  fontSize: 13,
                  color: Color.blue,
                  fontWeight: 'bold',
                  paddingHorizontal: 5,
                }}>
                Beli Langsung
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('CartScreen')}
            style={{
              width: '50%',
              height: 40,
              backgroundColor: Color.blue,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
              marginHorizontal: 10,
              flexDirection: 'row',
            }}>
            <FontAwesome5
              name={'shopping-cart'}
              size={13}
              style={{paddingHorizontal: 5, color: Color.white}}
            />
            <Text
              style={{
                fontSize: 13,
                color: Color.white,
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
