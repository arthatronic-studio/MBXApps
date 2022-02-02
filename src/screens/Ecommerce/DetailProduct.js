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
import {useIsFocused, useRoute} from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
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
import { queryAddCart, queryDetailProduct } from 'src/lib/query/ecommerce';
import Client from 'src/lib/apollo';
import { FormatMoney } from 'src/utils';

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
  const route = useRoute()
  console.log(route, 'route')
  const [detail, setDetail] = useState([]);
  const [liked, setLike] = useState(false);
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);
  const {Color} = useColor();
  const isFocused = useIsFocused();


    useEffect(() => {
      getDetail();
  // });
  }, [isFocused]);

    const getDetail = () => {
      // showLoading();
      let variables = {
        id: route.params.item.id,
      }
      Client.query({query: queryDetailProduct, variables})
        .then(res => {
          console.log(res)
          if (res.data.ecommerceProductDetail) {
            setDetail(res.data.ecommerceProductDetail[0]);
          }
        })
        .catch(reject => {
          console.log(reject);
        });
    };

    const addToCart = () => {
      console.log(route, 'props')
      showLoading();
      let variables = {
        productId: route.params.item.id,
        quantity: 1
      }
      console.log(variables)
      Client.mutate({mutation: queryAddCart, variables})
        .then(res => {
          hideLoading()
          console.log(res)
          if (res.data.ecommerceCartAdd) {
            alert('Success add to cart')
          }
        })
        .catch(reject => {
          hideLoading()
          alert(reject.message)
          console.log(reject.message, 'reject');
        });
    };

  return (
    <Scaffold
      loadingProps={loadingProps}
      header={
        <Header
          customIcon
          type="regular"
          centerTitle={false}
          searchbar
          cartIcon
          favoriteIcon
        />
      }
      onPressLeftButton={() => navigation.pop()}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            width: '100%',
            height: '50%',
            position: 'absolute',
            backgroundColor: Color.theme,
          }}>
          <ImageSlider />
        </View>
        <View
          style={{
            backgroundColor: Color.theme,
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
              backgroundColor: Color.theme,
              borderRadius: 15,
            }}></View>
          <View>
            <View
              style={{
                width: '100%',
                height: 5,
                backgroundColor: Color.theme,
              }}>
              {/* Mulai */}
            </View>
            <View style={{flexDirection: 'row', paddingHorizontal: 16, justifyContent: 'space-between'}}>
              <View>
                <Text type='bold' align='left'>
                  {detail.name}
                </Text>
                <Text align='left' size={11} color={Color.gray}>
                  Fashion
                </Text>
                <View style={{height: 15}}></View>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
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
                    4.0 
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Color.gray,
                      paddingHorizontal: 5,
                      fontWeight: 'bold',
                    }}>
                    {/* 120 Terjual */}
                  </Text>

                </View>
              </View>
              <View style={{paddingVertical: 8}}>
                <Text
                  style={{
                    color: Color.text,
                    fontWeight: 'bold',
                    fontSize: 20,
                  }}>
                  {FormatMoney.getFormattedMoney(detail.price)}
                </Text>

                <TouchableOpacity onPress={() => setLike(!liked)} style={{  marginTop: 25, alignItems: 'flex-end' }}>
                      <AntDesign name={liked ? 'heart' : 'hearto'} color={liked ? 'red' : '#111'} size={19} />
                  </TouchableOpacity>
              </View>
              
            </View>
          </View>
          {detail && <TopBar style={{borderRadius: 10}} detail={detail} />}
        </View>
      </ScrollView>
      <View
        style={{
          width: '100%',
          height: '10%',
          backgroundColor: Color.theme,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CheckoutScreen', {item: {...detail, qty: 1}})}
            style={{
              width: '40%',
              height: 40,
              borderWidth: 1,
              borderColor: Color.info,
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
                style={{paddingHorizontal: 5, color: Color.info}}
              />
              <Text
                style={{
                  fontSize: 13,
                  color: Color.info,
                  fontWeight: 'bold',
                  paddingHorizontal: 5,
                }}>
                Beli Langsung
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => addToCart()}
            style={{
              width: '50%',
              height: 40,
              backgroundColor: Color.info,
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
              style={{paddingHorizontal: 5, color: Color.theme}}
            />
            <Text
              style={{
                fontSize: 13,
                color: Color.textInput,
                fontWeight: 'bold',
                paddingHorizontal: 5,
              }}>
              Tambah Keranjang
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Scaffold>
  );
};

export default DetailProduct;
