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
import { currentSocket } from '@src/screens/MainHome/MainHome';
import TouchableDebounce from 'src/components/Button/TouchableDebounce';

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
import { async } from 'validate.js';

const DetailProduct = ({navigation, route}) => {
  const [detail, setDetail] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [liked, setLike] = useState(false);
  const [cart, setCart] = useState(0);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const user = useSelector(state => state['user.auth'].login.user);
  console.log(user, "useeer");
  const loading = useSelector(state => state['user.auth'].loading);
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const {width, height} = useWindowDimensions();
  const [targetRoomId, setTargetRoomId] = useState(null);

  useEffect(() => {
    getDetail();
    getCart();
  }, [isFocused]);

  // useEffect(() => {
  //   if(detail){
      
  //   }
  // }, [detail]);

  useEffect(() => {
    const ChatRoom = () => {
      console.log("siniii");
      const community_chat_user_params = [
        { user_id: user.userId, room_type: 'ECOMMERCE', room_user_type: 'USER' },
        { user_id: detail.merchant.userId, room_type: 'ECOMMERCE', room_user_type: 'MERCHANT' },
      ];
      const bodyMessage = {community_chat_user_params: community_chat_user_params, chat_room_id: targetRoomId.data.chat_room_id, user_id:  user.userId, chat_type: 'TAGGED_ECOMMERCE_PRODUCT', tagged_id: detail.id, tagged_name: detail.name, tagged_price: detail.price, tagged_image: detail.imageUrl, chat_message: detail.name};
      // currentSocket.emit('create_community_chat_message', bodyMessage);
      navigation.navigate('ChatDetailBuyer', {id: targetRoomId.data.chat_room_id, merchant: detail.merchant, users: targetRoomId.data.users, bodyTagged: bodyMessage});
    }

    if(targetRoomId) ChatRoom();
  }, [targetRoomId]);

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
    console.log(variables, "varrrrr");
    Client.query({query: queryDetailProduct, variables})
      .then(res => {
        console.log(res);
        if (res.data.ecommerceProductDetail) {
          setDetail(res.data.ecommerceProductDetail[0]);
        }

        setIsLoading(false);
      })
      .catch(reject => {
        console.log(reject);
        setIsLoading(false);
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


  const get_room = () => {
    console.log('get_community_chat_room_id');
    currentSocket.emit('get_community_chat_room_id', { user_id: user.userId, user_id_target: detail.merchant.userId, admin_ids: [detail.merchant.userId]});
    currentSocket.on('get_community_chat_room_id', (res) => {
      console.log('get_community_chat_room_id', res);
      console.log("merchant", detail);
      if(res.data.chat_room_id){
        setTargetRoomId(res);
      }else{
        console.log("sinii")
        create_room();
      }
    });
  }

  const create_room = () => {
    const community_chat_user_params = [
			{ user_id: user.userId, room_type: 'ECOMMERCE', room_user_type: 'USER' },
			{ user_id: detail.merchant.userId, room_type: 'ECOMMERCE', room_user_type: 'MERCHANT' },
		];
    const body = {community_chat_user_params: community_chat_user_params, room_name: 'Chat_ECOMMERCE', room_type: 'ECOMMERCE', user_ids: [user.userId.toString(), detail.merchant.userId.toString()], admin_ids: [detail.merchant.userId.toString()]}
    console.log(body, "boddy")
    currentSocket.emit('create_community_chat_room', body);
    currentSocket.emit('get_community_chat_room_id', { room_type: 'ECOMMERCE', user_id: user.userId, user_id_target: detail.merchant.userId});
  }

  console.log(detail, "detail");

  return (
    <Scaffold
      loadingProps={loadingProps}
      header={<DetailProductHeader navigation cart={cart} />}
      onPressLeftButton={() => navigation.pop()}
      isLoading={isLoading}
      empty={!detail}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {detail && <>
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
                  <Col size={12}>
                    <Text
                      style={{
                        textAlign: 'left',
                        lineHeight: 20,
                      }}>
                      {detail.name}
                    </Text>
                    {/* hide category */}
                    {/* <Text
                      style={{
                        textAlign: 'left',
                        color: Color.secondary,
                        marginVertical: 8,
                      }}>
                      Fashion
                    </Text> */}
                  </Col>

                  <Container paddingVertical={8}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        textAlign: 'right',
                      }}>
                      {FormatMoney.getFormattedMoney(detail.price)}
                    </Text>
                  </Container>
                </Row>

                <Row style={{justifyContent: 'space-between', marginTop: 8}}>
                  <Row>
                    <Entypo name={'star'} style={{color: Color.yellow}} />
                    <Text
                      style={{
                        fontSize: 12,
                        color: Color.secondary,
                        marginHorizontal: 5,
                      }}>
                      {detail.rating || 0}
                    </Text>
                    <Text style={{fontSize: 10, color: Color.secondary}}>|</Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: Color.secondary,
                        textAlign: 'left',
                        marginHorizontal: 5,
                      }}>
                      {detail.sold || 0} Terjual
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
                        size={19}
                        color={liked ? Color.error : Color.secondary}
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
                    backgroundColor: '#f2f2f2', // Color.semiwhite,
                    width: '100%',
                    alignSelf: 'center',
                    paddingVertical: 10,
                    borderRadius: 5,
                  }}>
                  <Image
                    source={{ uri: detail.merchant ? detail.merchant.profileImg : '' }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      resizeMode: 'cover',
                      marginHorizontal: 10,
                    }}
                  />
                  <Col>
                    <Text
                      style={{fontSize: 11, fontWeight: 'bold', textAlign: 'left'}}>
                      {detail.merchant ? detail.merchant.name : ''}
                    </Text>
                    {/* hide lihat detail toko */}
                    {/* <Text
                      style={{
                        fontSize: 10,
                        color: Color.primary,
                        textAlign: 'left',
                      }}>
                      Lihat Detail Toko
                    </Text> */}
                  </Col>
                </Row>
              </Container>
            </View>

            {detail && <TopBar style={{borderRadius: 10}} detail={detail} />}
          </View>
        </>}
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
          {/* refactor ChatRoomsScreen */}
          <TouchableDebounce
            // onPress={() => navigation.navigate('ChatRoomsScreen' || 'ChatRoom', {item: detail})}
            onPress={() => get_room()}
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
          </TouchableDebounce>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CheckoutScreen', {
                item: {tempData: [{...detail, qty: 1, quantity: 1, note: '', profileImg: detail.merchant ? detail.merchant.profileImg : '' }]},
                list: [{name: detail.merchant ? detail.merchant.name : '', profileImg: detail.merchant ? detail.merchant.profileImg : '', alamat: detail.merchant ? detail.merchant.alamat : '', products: [{...detail, qty: 1,quantity: 1, note: ''}]}],
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