import React, {useState, useEffect, useRef} from 'react';
import {View, Image, ScrollView, Platform, Linking} from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useLoading, usePopup, useColor, Alert} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import {TouchableOpacity} from '@src/components/Button';
import {shadowStyle} from '@src/styles';
import Client from '@src/lib/apollo';
import {queryAddLike} from '@src/lib/query';
import ImagesPath from 'src/components/ImagesPath';
import Foundation from 'react-native-vector-icons/Foundation';
import Entypo from 'react-native-vector-icons/Entypo';
import Octions from 'react-native-vector-icons/Octicons';
import moment from 'moment';
import { Container, Divider } from 'src/styled';
import { useSelector } from 'react-redux';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';

export default ({navigation, route}) => {
  const {Color} = useColor();
  const {item} = route.params;

  const user = useSelector(state => state['user.auth'].login.user);

  const [state, changeState] = useState({
    im_like: item.im_like,
  });

  const setState = obj => changeState({...state, ...obj});

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
            showLoading('success', 'Berhasil dipesan');
            setState({im_like: true});
          } else {
            showLoading('info', 'Berhasil membatalkan');
            setState({im_like: false});
          }
        }
      })
      .catch(err => {
        console.log(err, 'err add like');
        hideLoading();
      });
  };

  return (
    // <Scaffold
    //   headerTitle=""
    //   fallback={false}
    //   empty={false}
    //   popupProps={popupProps}
    //   loadingProps={loadingProps}>
    //   <ScrollView contentContainerStyle={{paddingBottom: 16}}>
    //     {/* <Image
    //                 source={{uri: item.image}}
    //                 style={{width: '100%', aspectRatio: 1.5, backgroundColor: Color.border}}
    //             />

    //             <View style={{padding: 24, marginTop: -16, borderTopLeftRadius: 24, borderTopRightRadius: 24, flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: Color.theme}} />

    //             <View style={{paddingHorizontal: 24}}>
    //                 <View style={{paddingBottom: 12}}>
    //                     <Text size={24} type='bold' align='left'>
    //                         {item.productName}
    //                     </Text>
    //                 </View>

    //                 <View style={{paddingBottom: 8}}>
    //                     <Text align='left'>
    //                         {item.productDescription}
    //                     </Text>
    //                 </View>

    //                 <View style={{paddingBottom: 12}}>
    //                     <Text size={12} align='left' style={{opacity: 0.6}}>
    //                         Buka Jam 09:00 - 22:00
    //                     </Text>
    //                 </View>
    //             </View>

    //             <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
    //                 <View style={{alignItems: 'center'}}>
    //                     <View style={{height: 70, width: 70, borderRadius: 35, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center'}}>
    //                         <Text size={22} type='bold'>{item.like}</Text>
    //                     </View>
    //                     <Text size={12} style={{marginTop: 16}}>Ramah Disabilitas</Text>
    //                 </View>

    //                 <View style={{alignItems: 'center'}}>
    //                     <View style={{height: 70, width: 70, borderRadius: 35, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center'}}>
    //                         <MaterialCommunityIcons name='ticket-percent' size={30} color={Color.green} />
    //                     </View>
    //                     <Text size={12} style={{marginTop: 16}}>Voucher</Text>
    //                 </View>

    //                 <View style={{alignItems: 'center'}}>
    //                     <TouchableOpacity
    //                         onPress={() => {
    //                             let daddr = `-6.311272,106.793541`;

                                  //   if (!item.latitude || !item.longitude) {
                                  //     alert('Alamat tidak valid');
                                  //     return;
                                  // }

                                  // daddr = item.latitude + ',' + item.longitude;

    //                             if (Platform.OS === 'ios') {
    //                                 Linking.openURL('http://maps.apple.com/maps?daddr=' + daddr);
    //                             } else {
    //                                 Linking.openURL('http://maps.google.com/maps?daddr=' + daddr);
    //                             }
    //                         }}
    //                         style={{height: 70, width: 70, borderRadius: 35, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center'}}
    //                     >
    //                         <Ionicons name='location' size={30} color={Color.primary} />
    //                     </TouchableOpacity>
    //                     <Text size={12} style={{marginTop: 16}}>Lihat Lokasi</Text>
    //                 </View>
    //             </View> */}
    //   </ScrollView>

    //   {/* <View style={{height: 60, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: Color.textInput, ...shadowStyle}}>
    //             <TouchableOpacity
    //                 onPress={() => {
    //                     fetchAddLike();
    //                 }}
    //                 style={{
    //                     height: 40,
    //                     width: '50%',
    //                     borderRadius: 20,
    //                     flexDirection: 'row',
    //                     backgroundColor: state.im_like ? Color.success : Color.info,
    //                     justifyContent: 'center',
    //                     alignItems: 'center',
    //                 }}
    //             >
    //                 <Ionicons
    //                     name={state.im_like ? 'checkmark' : 'bookmark-outline'}
    //                     size={20}
    //                     color={Color.textInput}
    //                 />
    //                 <Text
    //                     color={Color.textInput}
    //                     style={{marginBottom: 4, marginLeft: 4}}
    //                 >
    //                     {state.im_like ? 'Applied' : 'Apply Now'}
    //                 </Text>
    //             </TouchableOpacity>
    //         </View> */}
    // </Scaffold>

    <Scaffold
      headerTitle="Detail"
      fallback={false}
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{uri: item.image}}
          style={{width: '100%', aspectRatio: 16/9}}
        />

        <View style={{padding: 24, marginTop: -16, borderTopLeftRadius: 24, borderTopRightRadius: 24, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Color.theme}}>
            {user && user.userId === item.ownerId && <TouchableOpacity
                onPress={() => {
                    navigation.navigate('EditThreadScreen', {
                        ...item,
                        title: 'Edit',
                    });
                }}
                style={{height: 48, width: 48, borderRadius: 24, position: 'absolute', top: -24, right: 16, backgroundColor: Color.primary, justifyContent: 'center', alignItems: 'center'}}
            >
                <Ionicons
                    name='pencil'
                    size={20}
                    color={Color.textInput}
                />
            </TouchableOpacity>}
        </View>

        <View
          style={{
            backgroundColor: Color.theme,
            width: '100%',
            height: '100%',
          }}>
          <View>
            <Text
              style={{
                color: Color.info,
                fontWeight: 'bold',
                fontSize: 11,
                textAlign: 'left',
                paddingHorizontal: 20,
                marginBottom: 2,
              }}>
              OFFICIAL EVENT
            </Text>
            <Text
              style={{
                color: Color.text,
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'justify',
                paddingHorizontal: 20,
              }}>
              {item.productName}
            </Text>
          </View>
          <View style={{flexDirection: 'row', paddingVertical: 18}}>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 20,
                width: '50%',
                alignItems: 'center',
              }}>
              <Foundation
                name={'calendar'}
                size={22}
                color={Color.primary}
              />
              <Divider width={8} />
              <Text style={{fontWeight: 'bold'}}>{moment(parseInt(item.updated_date)).format('DD MMM YYYY')}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                width: '50%',
                alignItems: 'center',
              }}>
              <Ionicons
                name='person'
                size={20}
                color={Color.secondary}
              />
              <Divider width={8} />
              <Text style={{fontWeight: 'bold'}}>{item.fullname}</Text>
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
          
          {item.like > 0 &&
            <Container paddingHorizontal={16}>
                <WidgetUserLikes id={item.id} title='Akan Hadir' />
            </Container>
          }

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
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16}}>
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
            <Ionicons name='chatbubble-ellipses-outline' color={Color.text} size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (state.im_like) {
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
            backgroundColor: state.im_like ? Color.error : Color.primary,
            width: '40%',
            height: 45,
            borderRadius: 25,
            justifyContent: 'center',
          }}>
          <Text
            style={{color: Color.textInput, fontSize: 16, fontWeight: 'bold'}}
          >
            {state.im_like ? 'Batalkan' : 'Akan Datang'}
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
    </Scaffold>
  );
};
