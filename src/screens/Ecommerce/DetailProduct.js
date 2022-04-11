import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Platform,
  SafeAreaView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Styled from 'styled-components';
import {useSelector} from 'react-redux';
import {useIsFocused, useRoute} from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImageSlider from '../../components/ImageSlider';
import IonIcons from 'react-native-vector-icons/Ionicons';
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
import {queryAddCart, queryDetailProduct, queryGetCart, queryUpdateItemCart, queryWishlistManage} from 'src/lib/query/ecommerce';
import Client from 'src/lib/apollo';
import {FormatMoney} from 'src/utils';
import DetailProductHeader from './DetailProductHeader';
import Share from 'react-native-share';
import {Container, Divider} from 'src/styled';

const DetailProduct = ({navigation, route}) => {
  const [detail, setDetail] = useState([]);
  const [liked, setLike] = useState(false);
  const [cart, setCart] = useState(0);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const {width, height} = useWindowDimensions();

  useEffect(() => {
    getDetail();
    getCart()
  }, [isFocused]);

  const getCart = () => {
		// showLoading();
		let variables = {
			page: 1,
			limit: 10
		};
		console.log(variables);
		Client.query({ query: queryGetCart, variables })
			.then((res) => {
				console.log(res);
				if (res.data.ecommerceCartList) {
					setCart(res.data.ecommerceCartList.totalProducts ? res.data.ecommerceCartList.totalProducts : 0);
				}
			})
			.catch((reject) => {
				// hideLoading()
				console.log(reject.message, 'reject');
			});
	};

  const getDetail = () => {
    // showLoading();
    let variables = {
      id: route.params.item.id,
    };
    Client.query({query: queryDetailProduct, variables})
      .then(res => {
        console.log(res);
        if (res.data.ecommerceProductDetail) {
          setDetail(res.data.ecommerceProductDetail[0]);
          console.log("data detailllll")
          console.log(res.data.ecommerceProductDetail[0]);
        }
      })
      .catch(reject => {
        console.log(reject);
      });
  };

  const addToWishList = () => {
    showLoading()

    let variables = {
      productId: detail.id
    };

    Client.mutate({mutation: queryWishlistManage, variables})
      .then(res => {
        if(liked==false){
          showLoading('success', 'Success add to wishlist')
        } else {
          showLoading('success', 'Success remove from wishlist')
        }
        console.log(`data wishlisttt ${res}`)
      }).catch(reject => {
        showLoading('error', 'Failed add to wishlist')
        console.log(reject)
      })
  }

  const addToCart = () => {
    console.log(route, 'props');
    showLoading();
    let variables = {
      productId: detail.id,
      quantity: 1,
      checked: false,
      updateType: "ADD"
    };
    console.log(variables);
    Client.mutate({mutation: queryUpdateItemCart, variables})
      .then(res => {
        hideLoading();
        console.log(res);
        getCart()
        if (res.data.ecommerceCartUpdate) {
          alert('Success add to cart');
          // navigation.navigate('CartScreen')
        }
      })
      .catch(reject => {
        hideLoading();
        alert(reject.message);
        console.log(reject.message, 'reject');
      });
  };

  return (
    <Scaffold
      loadingProps={loadingProps}
      header={<DetailProductHeader navigation cart={cart} />}
      onPressLeftButton={() => navigation.pop()}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            width: '100%',
            aspectRatio: 5/6,
          }}>
          <ImageSlider
            data={detail.imageProducts ? detail.imageProducts : [detail.imageUrl, detail.imageUrl, detail.imageUrl]}
          />
        </View>
        
        <View
          style={{
            width: '100%',
            height: height / 1.5,
          }}
        >
          <View style={{paddingTop: 16, paddingHorizontal: 16, paddingBottom: 8}}>
            <View>
              <Row>
                <Col size={6}>
                  <Text
                    style={{
                      textAlign: 'left',
                      lineHeight: 20,
                    }}>
                    {detail.name}
                  </Text>
                  <Text
                    style={{
                      textAlign: 'left',
                      color: Color.secondary,
                      marginVertical: 8,
                    }}>
                    Fashion Harcode
                  </Text>
                </Col>
                <Col size={6}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    textAlign: 'right',
                  }}>
                  {FormatMoney.getFormattedMoney(detail.price)}
                </Text>
                </Col>
              </Row>

              <Row style={{justifyContent: 'space-between'}}>
                <Row>
                  <Entypo name={'star'} style={{color: Color.yellow}} />
                  <Text
                    style={{
                      fontSize: 12,
                      color: Color.secondary,
                      marginHorizontal: 5,
                    }}>
                    4 Harcode
                  </Text>
                  <Text style={{fontSize: 10, color: Color.secondary}}>|</Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Color.secondary,
                      textAlign: 'left',
                      marginHorizontal: 5,
                    }}>
                    120 Terjual Harcode
                  </Text>
                </Row>

                <Row>
                  <TouchableOpacity
                    style={{marginHorizontal: 3}}
                    onPress={() => {
                      setLike(!liked)
                      addToWishList()
                    }}
                  >
                    <AntDesign
                      name={liked ? 'heart' : 'hearto'}
                      color={liked ? 'red' : '#111'}
                      size={19}
                      style={{color: Color.secondary}}
                    />
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    onPress={async () => {
                      await Share.open({
                        url: detail.share_link || 'Belum ada Linknya',
                      });
                    }}
                    style={{marginHorizontal: 3}}>
                    <AntDesign
                      name={'sharealt'}
                      size={19}
                      style={{color: Color.secondary}}
                    />
                  </TouchableOpacity> */}
                </Row>
              </Row>
            </View>
            
            <Divider />

            <Container>
              <Row
                style={{
                  backgroundColor: Color.border,
                  width: '100%',
                  alignSelf: 'center',
                  paddingVertical: 10,
                  borderRadius: 5,
                }}>
                <Image
                  source={ImagesPath.avatar1}
                  style={{
                    width: 30,
                    height: 30,
                    resizeMode: 'cover',
                    marginHorizontal: 10,
                  }}
                />
                <Col>
                  <Text
                    style={{fontSize: 11, fontWeight: 'bold', textAlign: 'left'}}>
                    {detail.merchant ? detail.merchant.name : ''}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: Color.primary,
                      textAlign: 'left',
                    }}>
                    Lihat Detail Toko
                  </Text>
                </Col>
              </Row>
            </Container>
          </View>

          {detail && <TopBar style={{borderRadius: 10}} detail={detail} />}
        </View>
      </ScrollView>
      
      <View
        style={{
          width: '100%',
          height: '8%',
          borderTopColor: Color.border,
          borderTopWidth: 1,
          justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ChatRoom', {item: detail})}
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
            <MaterialCommunityIcons
              size={23}
              name={'message-processing-outline'}
              style={{color: Color.primary}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CheckoutScreen', {
                item: {tempData: [{...detail, qty: 1, profileImg: detail.merchant ? detail.merchant.profileImg : '' }]},
                list: [{name: detail.merchant ? detail.merchant.name : '', alamat: detail.merchant ? detail.merchant.alamat : '', products: [{...detail, qty: 1}]}],
              })
            }
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
            <IonIcons name={'add'} size={13} style={{color: Color.theme}} />
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
