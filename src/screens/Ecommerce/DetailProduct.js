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
import IonIcons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Text,
  // TouchableOpacity,
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
import DetailProductHeader from './DetailProductHeader';
import Share from 'react-native-share';
import { Divider } from 'src/styled';

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
        productId: detail.id,
        quantity: 1
      }
      console.log(variables)
      Client.mutate({mutation: queryAddCart, variables})
        .then(res => {
          hideLoading()
          console.log(res)
          if (res.data.ecommerceCartAdd) {
            alert('Success add to cart')
            // navigation.navigate('CartScreen')
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
        <DetailProductHeader navigation />
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
          <ImageSlider data={[detail.imageUrl,detail.imageUrl,detail.imageUrl]} />
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
                <Text type='regular' align='left'>
                  {detail.name}
                </Text>
                <Text align='left' size={11} color={Color.gray}>
                  Fashion
                </Text>
                <View style={{height: 15}}></View>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 5,
                  }}>
                  <Entypo name={'star'} style={{color: Color.yellow}} />
                  <Entypo name={'star'} style={{color: Color.yellow}} />
                  <Entypo name={'star'} style={{color: Color.yellow}} />
                  <Entypo name={'star'} style={{color: Color.yellow}} />
                  <Entypo name={'star'} style={{color: Color.gray}} />
                  <Text
                    style={{
                      fontSize: 12,
                      color: Color.secondary,
                      paddingHorizontal: 5,
                    }}>
                    4.0 
                  </Text>
                  <Text style={{fontSize: 10, color: Color.secondary}}>|</Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Color.secondary,
                      paddingHorizontal: 5,
                      width: '50%'
                    }}>
                    120 Terjual
                  </Text>

                </View>
              </View>
              <View>
                <Text
                  style={{
                    color: Color.text,
                    fontWeight: 'bold',
                    fontSize: 20,
                  }}>
                  {FormatMoney.getFormattedMoney(detail.price)}
                </Text>
                <View style={{flexDirection: 'row', marginVertical: 26, marginLeft: 35}}>
                    <TouchableOpacity style={{marginHorizontal: 5}} onPress={() => setLike(!liked)}>
                    <AntDesign name={liked ? 'heart' : 'hearto'} color={liked ? 'red' : '#111'} size={19} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={async() => {
                        await Share.open({
                            url: detail.share_link || 'Belum ada Linknya',
                        });
                    }} style={{marginHorizontal: 5}}>
                    <AntDesign name={'sharealt'} size={19}/>
                  </TouchableOpacity>
                </View>
              </View>
              
            </View>
            <Row style={{backgroundColor: Color.border, width: '93%', height: 50, alignSelf: 'center', paddingVertical: 10, borderRadius: 5}}>
                    <Image source={ImagesPath.avatar1} style={{width: 30, height: 30, resizeMode: 'cover', marginHorizontal: 10}}/>
                    <Col>
                      <Text style={{fontSize: 11, fontWeight: 'bold', textAlign: 'left'}}>Toko Sumber Makmur</Text>
                      <Text style={{fontSize: 10, color: Color.primary, textAlign: 'left'}}>Lihat Detail Toko</Text>
                    </Col>
            </Row>
          </View>
          <Divider/>
          {detail && <TopBar style={{borderRadius: 10,}} detail={detail} />}
        </View>
      </ScrollView>
      <View
        style={{
          width: '100%',
          height: '8%',
          borderTopColor: Color.border,
          borderTopWidth: 1,
          justifyContent: 'center'
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ChatRoom', {item: detail } )}
            style={{
              width: '12%',
              height: 40,
              borderWidth: 1,
              borderColor: Color.primary,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
              marginHorizontal: 10,
            }}>
              <MaterialCommunityIcons size={25} name={'message-processing-outline'} style={{color: Color.primary}}/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('CheckoutScreen', {item: { tempData:[{...detail, qty: 1}] }, list: [{name: '', alamat: '', products: [{...detail, qty: 1}]}] })}
            style={{
              width: '30%',
              height: 40,
              borderWidth: 1,
              borderColor: Color.primary,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
              marginHorizontal: 10,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: 10,
                  color: Color.primary,
                  paddingHorizontal: 5,
                }}>
                Beli Langsung
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => addToCart()}
            style={{
              width: '35%',
              height: 40,
              backgroundColor: Color.primary,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
              marginHorizontal: 10,
              flexDirection: 'row',
            }}>
            <IonIcons
              name={'add'}
              size={13}
              style={{color: Color.theme}}
            />
            <Text
              style={{
                fontSize: 12,
                color: Color.textInput,
                paddingHorizontal: 3,
              }}>
              Keranjang
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Scaffold>
  );
};

export default DetailProduct;
