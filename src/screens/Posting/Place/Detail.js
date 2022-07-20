import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, Platform, Linking, useWindowDimensions, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { useLoading, usePopup, useColor, Alert } from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { TouchableOpacity } from '@src/components/Button';
import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import { Container, Divider, Line } from 'src/styled';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import {
  iconLocation,
  iconCategory,
  iconComment,
  iconLiked,
  iconLike,
  iconStar

} from '@assets/images/home';
import {
  iconRoute,


} from '@assets/images/place';
import TopBar from './TopTab';
const PlaceDetail = ({ navigation, route }) => {
  const { Color } = useColor();
  const { item } = route.params;
  const modalOptionsRef = useRef();
  const { width, height } = useWindowDimensions();
  const user = useSelector(state => state['user.auth'].login.user);

  const [state, changeState] = useState({
    im_like: item.im_like,
  });

  const setState = obj => changeState({ ...state, ...obj });

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();

  console.log(item);

  //   // useEffect(() => {
  //   //     const timeout = trigger ? setTimeout(() => {
  //   //         fetchAddLike();
  //   //     }, 500) : null;

  //   //     return () => {
  //   //         clearTimeout(timeout);
  //   //     }
  //   // }, [trigger]);

  const fetchAddLike = () => {
    showLoading();

    Client.query({
      query: queryAddLike,
      variables: {
        productId: item.id,
      },
    })
      .then(res => {
        console.log(res, 'res add like');
        if (res.data.contentAddLike.id) {
          if (res.data.contentAddLike.status === 1) {
            showLoading('success', 'Disukai');
            setState({ im_like: true });
          } else {
            showLoading('info', 'Batal menyukai');
            setState({ im_like: false });
          }
        }
      })
      .catch(err => {
        console.log(err, 'err add like');
        hideLoading();
      });
  };

  const renderHeader = () => {
    return (
      <>
        <View
          style={{
            position: 'absolute',

            width: '100%',
            height: height * 0.3,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        />

        <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8 }}>
          <View
            style={{ width: '75%', alignItems: 'center', justifyContent: 'center' }}
            onTouchStart={() => navigation.navigate('SearchResult')}
          >

          </View>

          <View style={{ width: '25%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', }}>
            {/* <Pressable onPress={() => navigation.navigate('Wishlist')}>
						<MaterialIcons name={'favorite-border'} size={26} style={{marginHorizontal: 3}}/>
						<View style={{marginHorizontal: 18,marginVertical: 1, position: 'absolute', width: 18, height: 10, backgroundColor: Color.error, borderRadius: 5}}>
							<Text style={{fontSize: 5, color: Color.textInput, alignSelf: 'center', paddingVertical: 1}}> +99</Text>
						</View>
						</Pressable> */}
            <Ionicons
              onPress={() => navigation.navigate('Saved')}
              name={'md-bookmarks-outline'}
              size={18}
              style={{ marginHorizontal: 12, }}
            />
            <Pressable onPress={() => modalOptionsRef.current.open()}>

              <Feather name="more-vertical" size={20} color={Color.text} />
            </Pressable>




          </View>
        </View>
      </>
    )
  }
  return (
    <Scaffold
      headerTitle="Detail"
      header={renderHeader()}
      useSafeArea={false}
      fallback={false}
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('GalleryDetailScreen', {
              id: item.id,
              image: item.image,
            });
          }}
        >
          <Image
            source={{ uri: item.image }}
            style={{ width: '95%', borderRadius: 12, marginHorizontal: 10, aspectRatio: 16 / 8, backgroundColor: Color.border }}
          />
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: Color.theme,
            width: '100%',
            height: '200%',
            paddingTop: 16,
          }}>


          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text
                style={{
                  color: Color.text,
                  fontSize: 18,
                  fontWeight: 'bold',
                  textAlign: 'justify',
                  paddingHorizontal: 20,
                  textTransform: 'capitalize'
                }}>
                {item.productName}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    color: Color.text,
                    fontSize: 12,
                    textAlign: 'justify',
                    paddingHorizontal: 15,
                    textTransform: 'capitalize'
                  }}>
                  Jakarta Selatan•
                </Text>
                <Text
                  style={{
                    color: Color.text,
                    fontSize: 12,
                    fontWeight: 'bold',
                    marginLeft: -15,
                  }}>
                  1.0 Km
                </Text>
              </View>

            </View>
            <View style={{ marginRight: 16, backgroundColor: Color.grayLight, padding: 10, borderRadius: 120 }}>
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Image
                  source={iconStar}
                  style={{ height: 20, width: 20 }}
                  resizeMode='contain'
                />
                <Text type='bold'>4.3</Text>
              </View>
              <Text style={{ color: Color.gray }}>1.2rb Ulasan</Text>
            </View>
          </View>

          <Divider />
          <Line color={Color.border} width={width} />
          <Line color={Color.border} width={width} />
          <Line color={Color.border} width={width} />
          <Divider />

          <View style={{ marginHorizontal: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Feather
                onPress={() => navigation.navigate('Saved')}
                name={'coffee'}
                size={18}
                style={{ marginHorizontal: 12, color: Color.gray }}
              />
              <Text style={{ color: Color.gray }}>Kafe</Text>
            </View>
            <Divider />
            <View style={{ flexDirection: 'row' }}>
              <Feather
                onPress={() => navigation.navigate('Saved')}
                name={'phone'}
                size={18}
                style={{ marginHorizontal: 12, color: Color.gray }}
              />
              <Text style={{ color: Color.gray }}>+62 851-1234-5678</Text>
            </View>
            <Divider />
            <View style={{ flexDirection: 'row' }}>
              <Feather
                onPress={() => navigation.navigate('Saved')}
                name={'clock'}
                size={18}
                style={{ marginHorizontal: 12, color: Color.gray }}
              />
              <Text style={{ color: Color.gray }}>08.00 - 22.00 (Hari ini)</Text>
            </View>
            <Divider />

            <View style={{ flexDirection: 'row' }}>
              <Feather
                onPress={() => navigation.navigate('Saved')}
                name={'dollar-sign'}
                size={18}
                style={{ marginHorizontal: 12, color: Color.gray }}
              />
              <Text style={{ color: Color.gray }}>Rp10.000 ~ Rp60.000</Text>
            </View>
            <Divider height={18} />
          </View>
          <Line color={Color.border} width={width} />
          <Line color={Color.border} width={width} />
          <Line color={Color.border} width={width} />
          <Divider />
          <View style={{ flexDirection: 'row', marginHorizontal: 10, justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12 }}>Jl. Tebet Barat I No.2, RT.1/RW.2, Tebet Barar, Kec. Tebet, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12810</Text>
            <Image
              source={iconRoute}
              style={{ height: 20, width: 20, marginRight: 20 }}
              resizeMode='contain'
            />

          </View>
          <Divider height={18} />
          <Line color={Color.border} width={width} />
          <Line color={Color.border} width={width} />
          <Line color={Color.border} width={width} />
          <Divider />
          <View style={{ marginHorizontal: 16 }}>
            <Text type="bold" align="left">Menu</Text>
            <Divider />
            <Image
              source={iconRoute}
              style={{ height: 100, width: 100, marginRight: 20 }}
              resizeMode='contain'
            />
          </View>
          <Divider />
          <Line color={Color.border} width={width} />
          <Line color={Color.border} width={width} />
          <Line color={Color.border} width={width} />
          <Divider />


          {/* {item.like > 0 && (
            <Container paddingHorizontal={16}>
              <WidgetUserLikes id={item.id} title="Disukai" />
            </Container>
          )} */}
          {/* 
          <View>
            <Text
              style={{
                textAlign: 'left',
                paddingHorizontal: 20,
                fontWeight: 'bold',
                fontSize: 15,
                paddingVertical: 10,
              }}>
              Deskripsi
            </Text>
            <Text
              style={{
                textAlign: 'justify',
                paddingHorizontal: 20,
                color: Color.secondary,
                marginBottom: 16,
              }}>
              {item.productDescription}
            </Text>
          </View> */}

          {/* <View>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 14,
                textAlign: 'left',
                paddingHorizontal: 20,
                color: Color.text,
              }}>
              Detail Acara
            </Text>
            <View style={{flexDirection: 'row', paddingVertical: 12}}>
              <Text
                style={{
                  color: Color.secondary,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  fontSize: 16,
                  paddingHorizontal: 20,
                  width: '36%',
                }}>
                Lokasi
              </Text>
              <Text
                style={{
                  color: Color.secondary,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  fontSize: 16,
                  width: '5%',
                }}>
                :
              </Text>
              <Text
                style={{
                  color: Color.primary,
                  fontWeight: 'bold',
                  textAlign: 'justify',
                  fontSize: 16,
                  width: '52%',
                  lineHeight: 23,
                }}>
                Jl. Casablanca Raya Kav. 88, Menteng Dalam, Kec. Tebet, Daerah
                Khusus Ibukota Jakarta 12870
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: Color.secondary,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  fontSize: 16,
                  paddingHorizontal: 20,
                  width: '36%',
                }}>
                Tanggal
              </Text>
              <Text
                style={{
                  color: Color.secondary,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  fontSize: 16,
                  width: '5%',
                }}>
                :
              </Text>
              <Text
                style={{
                  color: Color.secondary,
                  fontWeight: 'bold',
                  textAlign: 'justify',
                  fontSize: 16,
                  width: '52%',
                  lineHeight: 23,
                }}>
                08 Februari 2022
              </Text>
            </View>
            <View style={{flexDirection: 'row', paddingVertical: 10}}>
              <Text
                style={{
                  color: Color.secondary,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  fontSize: 16,
                  paddingHorizontal: 20,
                  width: '36%',
                }}>
                Penyelenggara
              </Text>
              <Text
                style={{
                  color: Color.secondary,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  fontSize: 16,
                  width: '5%',
                }}>
                :
              </Text>
              <Text
                style={{
                  color: Color.text,
                  fontWeight: 'bold',
                  textAlign: 'justify',
                  fontSize: 16,
                  width: '23%',
                  lineHeight: 23,
                }}>
                Tribes Social
              </Text>
              <Octions
                name={'verified'}
                size={20}
                style={{color: Color.blue}}
              />
            </View>
          </View> */}
       
        </View>
      </ScrollView>
      <View style={{ width: '100%',
              height: height / 2,}}>
         <TopBar style={{borderRadius: 10}} />
         </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CommentListScreen', { item });
          }}
          style={{
            backgroundColor: Color.info,
            width: '12%',
            height: 45,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            color={Color.text}
            size={24}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            GALogEvent('Tempat', {
              id: item.id,
              product_name: item.productName,
              user_id: user.userId,
              method: analyticMethods.like,
            });
            if (state.im_like) {
              Alert('Konfirmasi', 'Apakah Anda yakin akan membatalkan?', () =>
                fetchAddLike(),
              );
              return;
            }

            fetchAddLike();
          }}
          style={{
            backgroundColor: state.im_like ? Color.error : Color.primary,
            width: '40%',
            height: 45,
            borderRadius: 25,
            justifyContent: 'center',
          }}>
          <Text
            style={{ color: Color.textInput, fontSize: 16, fontWeight: 'bold' }}>
            {state.im_like ? 'Batal Suka' : 'Suka'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            let daddr = `-6.311272,106.793541`;

            if (!item.latitude || !item.longitude) {
              alert('Alamat tidak valid');
              return;
            }

            daddr = item.latitude + ',' + item.longitude;

            if (Platform.OS === 'ios') {
              Linking.openURL('http://maps.apple.com/maps?daddr=' + daddr);
            } else {
              Linking.openURL('http://maps.google.com/maps?daddr=' + daddr);
            }
          }}
          style={{
            backgroundColor: Color.secondary,
            width: '40%',
            height: 45,
            borderRadius: 25,
            justifyContent: 'center',
          }}>
          <Text
            style={{ color: Color.textInput, fontSize: 16, fontWeight: 'bold' }}>
            Lokasi
          </Text>
        </TouchableOpacity>
      </View>

      <ModalContentOptions
        ref={modalOptionsRef}
        isOwner={user && user.userId === item.ownerId}
        item={item}
      />
      
    </Scaffold>
  );
};

export default PlaceDetail;
