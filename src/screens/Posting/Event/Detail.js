import React, {useState, useEffect, useRef} from 'react';
import {View, Image, ScrollView, Platform, Linking, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Header from '@src/components/Header';
import {useLoading, usePopup, useColor, Alert} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import {TouchableOpacity, Button} from '@src/components/Button';
import Client from '@src/lib/apollo';
import {queryAddLike} from '@src/lib/query';
import { Container, Divider, Padding } from 'src/styled';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';

import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'

const EventDetail = ({navigation, route}) => {
  const {Color} = useColor();
  const {item} = route.params;
  const modalOptionsRef = useRef();
  const user = useSelector(state => state['user.auth'].login.user);

  const [im_like, set_im_like] = useState(item.im_like);

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();

  // useEffect(() => {
  //     const timeout = trigger ? setTimeout(() => {
  //         fetchAddLike();
  //     }, 500) : null;

  //     return () => {
  //         clearTimeout(timeout);
  //     }
  // }, [trigger]);

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
            showLoading('success', 'Akan Hadir');
            set_im_like(true);
          } else {
            showLoading('info', 'Batal menghadiri');
            set_im_like(false);
          }
        }
      })
      .catch(err => {
        console.log(err, 'err add like');
        hideLoading();
      });
  };

  let eventDate = !isNaN(parseInt(item.eventDate)) ? parseInt(item.eventDate) : null;
  if (!eventDate) eventDate = !isNaN(parseInt(item.updated_date)) ? parseInt(item.updated_date) : null;

  let isPassedEventDate = true;
  if (moment(eventDate).isValid() && moment(eventDate).isAfter(moment())) {
    isPassedEventDate = false;
  }

  return (
    <Scaffold
      fallback={false}
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}
      header={
        <Header
          type="bold"
          centerTitle={false}
          title="Lelang"
          actions={
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity>
                <Feather name='bookmark' size={22} color={Color.text} style={{marginHorizontal: 15}} />
              </TouchableOpacity>
              <MaterialIcons onPress={() => {modalOptionsRef.current.open();}} 
              name='more-vert' size={22} color={Color.text} />
            </View>
          }
          customIcon
        />
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('GalleryDetailScreen', {
              id: item.id,
              image: item.image,
            });
          }}
        >
          <Image
            source={{uri: item.image}}
            style={{width: '100%', aspectRatio: 4/3, backgroundColor: Color.border}}
          />
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: Color.theme,
            width: '100%',
            height: '100%',
            paddingTop: 12,
          }}>
          <View>
            <Text
              style={{
                color: Color.info,
                fontWeight: 'bold',
                fontSize: 8,
                textAlign: 'left',
                paddingHorizontal: 20,
              }}>
              OFFICIAL EVENT
            </Text>
            <Divider height={10}/>
            <Text
              style={{
                color: Color.text,
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'justify',
                paddingHorizontal: 20,
                width: '70%'
              }}>
              {item.productName}
            </Text>
          </View>
          <View style={{flexDirection: 'row', paddingVertical: 18}}>
            {moment(eventDate).isValid() && <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 20,
                width: '30%',
                alignItems: 'center',
              }}>
              <AntDesign
                name={'calendar'}
                size={13}
                color={Color.secondary}
              />
              <Divider width={6} />
              <Text style={{fontSize: 10, color: Color.secondary, fontWeight: 'bold'}}>{moment(eventDate).format('DD MMM YYYY')}</Text>
            </View>}
            <View
              style={{
                flexDirection: 'row',
                width: '25%',
                alignItems: 'center',
              }}>
              <AntDesign
                name='clockcircleo'
                size={11}
                color={Color.secondary}
              />
              <Divider width={6} />
              <Text style={{fontSize: 10, color: Color.secondary, fontWeight: 'bold'}}>16.00 - 20.00</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '30%',
                alignItems: 'center',
              }}>
              <EvilIcons
                name='location'
                size={15}
                color={Color.secondary}
              />
              <Divider width={4} />
              <Text style={{fontSize: 10, color: Color.secondary, fontWeight: 'bold'}}>Jakarta Selatan</Text>
            </View>
            {/* <View
              style={{
                width: '60%',
                flexDirection: 'row',
              }}>
              <Entypo
                name={'location-pin'}
                size={20}
                style={{paddingHorizontal: 10}}
              />
              <Text style={{fontWeight: 'bold'}}>Jakarta Selatan</Text>
            </View> */}
          </View>

          {/* <Container paddingHorizontal={32} paddingVertical={16}>
            <Button
              onPress={() => {
                navigation.navigate('GalleryScreen', { item });
              }}
            >
              Lihat Event Galeri
            </Button>
          </Container>
          
          {item.like > 0 &&
            <Container paddingHorizontal={16}>
                <WidgetUserLikes id={item.id} title='Akan Hadir' />
            </Container>
          } */}

          <View>
            <Text
              style={{
                textAlign: 'left',
                paddingHorizontal: 20,
                fontWeight: 'bold',
                fontSize: 11,
                paddingVertical: 10,
              }}>
              Deskripsi
            </Text>
            <Text
              numberOfLines={12}
              style={{
                textAlign: 'justify',
                paddingHorizontal: 20,
                color: Color.secondary,
                marginBottom: 16,
              }}>
              {item.productDescription}
            </Text>
            <Pressable style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center',width: '100%', paddingHorizontal: 15}}>
              <Text style={{color: Color.primary}}>Selengkapnya</Text>
              <MaterialIcons name={'keyboard-arrow-down'} size={20} color={Color.primary} style={{marginHorizontal: 5}}/>
            </Pressable>
          </View>
          <Divider/>

          <View style={{paddingHorizontal: 20}}>
            <Text style={{fontWeight:'bold', fontSize: 11, textAlign: 'left'}}>Jenis Tiket</Text>
          </View>

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
                Tribesocial
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
      {/* <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16}}>
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
            alignItems: 'center'
          }}>
            <Ionicons name='chatbubble-ellipses-outline' color={Color.textInput} size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isPassedEventDate}
          onPress={() => {
            GALogEvent('Event', {
              id: item.id,
              product_name: item.productName,
              user_id: user.userId,
              method: analyticMethods.like,
            });

            if (im_like) {
              Alert(
                'Konfirmasi',
                'Apakah Anda yakin akan membatalkan?',
                () => fetchAddLike()
              );
              return;
            }

            fetchAddLike();
          }}
          style={{
            backgroundColor: isPassedEventDate ? Color.disabled : im_like ? Color.error : Color.primary,
            width: '40%',
            height: 45,
            borderRadius: 25,
            justifyContent: 'center',
          }}>
          <Text
            style={{color: Color.textInput, fontSize: 16, fontWeight: 'bold'}}
          >
            {im_like ? 'Batal Hadir' : 'Hadir'}
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
            style={{color: Color.textInput, fontSize: 16, fontWeight: 'bold'}}
          >
            Lokasi
          </Text>
        </TouchableOpacity>
      </View>

      */}

      <ModalContentOptions
          ref={modalOptionsRef}
          isOwner={user && user.userId === item.ownerId}
          item={item}
      /> 
    </Scaffold>
  );
};

export default EventDetail;