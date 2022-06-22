import React, {useState, useEffect, useRef} from 'react';
import {View, Image, FlatList,ScrollView, Platform, Linking, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Header from '@src/components/Header';
import {useLoading, usePopup, useColor, Alert, Row, Col} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import {TouchableOpacity, Button} from '@src/components/Button';
import Client from '@src/lib/apollo';
import {queryAddLike} from '@src/lib/query';
import { Container, Divider, Padding } from 'src/styled';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import ImagesPath from 'src/components/ImagesPath';
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';




const DATA = [
  {
    id: 1,
    title: 'PRESALE - Reguler (A)',
    date: '08 Feb 2022',
    refund: 'Bisa Refund',
    reservasi: "Tidak Perlu Reservasi",
    harga: 'Rp 100.000'
  },
  {
    id: 2,
    title: 'PRESALE - Reguler (B)',
    date: '08 Feb 2022',
    refund: 'Bisa Refund',
    reservasi: "Tidak Perlu Reservasi",
    harga: 'Rp 100.000'
  },
  {
    id: 3,
    title: 'PRESALE - VIP (A)',
    date: '08 Feb 2022',
    refund: 'Bisa Refund',
    reservasi: "Tidak Perlu Reservasi",
    harga: 'Rp 100.000'
  },
  {
    id: 4,
    title: 'PRESALE - VIP (A)',
    date: '08 Feb 2022',
    refund: 'Bisa Refund',
    reservasi: "Tidak Perlu Reservasi",
    harga: 'Rp 100.000'
  },
];


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
  const renderItem = ({ item }) => (
   <Pressable style={{width: '100%', height: 165, marginBottom: 10,paddingHorizontal: 15, backgroundColor: Color.theme, borderWidth: 1, borderColor: Color.border, borderRadius: 8}}>
      <Divider height={10}/>
      <Row>
        <Col>
          <Text style={{fontSize: 11, textAlign: 'left',fontWeight: 'bold'}}>{item.title}</Text>
          <Text style={{fontSize: 8, textAlign: 'left', marginVertical: 3}}>{item.date}</Text>
        </Col>
        <View style={{flexDirection:'row', justifyContent: 'center'}}>
            <Text style={{fontSize: 10, color: '#3C58C1', marginHorizontal: 5}}>Lihat Detail</Text>
            <MaterialIcons name={'arrow-forward'} size={12} color={'#3C58C1'}/>
        </View>
      </Row>
      <Divider height={25}/>
      <Row style={{alignItems: 'center', }}>
        <MaterialCommunityIcons name={'cash-refund'} color={Color.secondary} size={22}/>
        <Text style={{fontSize: 10, color: Color.secondary, marginHorizontal: 5}}>Bisa Refund</Text>
        <Divider width={8}/>
        <AntDesign name='calendar' size={18} color={Color.secondary}/>
        <Text style={{fontSize: 10, color: Color.secondary, marginHorizontal: 5}}>Tidak Perlu Reservasi</Text>
      </Row>
      <Divider height={25}/>
      <Row>
        <Col>
            <Text style={{textAlign: 'left', fontSize: 8}}>Harga</Text>
            <Text style={{textAlign: 'left', fontWeight: 'bold'}}>{item.harga}<Text style={{fontSize: 8}}>/Pax</Text></Text>
        </Col>
        <TouchableOpacity style={{justifyContent: 'center',backgroundColor: Color.primary, width: '35%', borderRadius: 30}}>
          <Text style={{fontSize: 10, color: Color.textInput}}>Pesan Sekarang</Text>
        </TouchableOpacity>
      </Row>
   </Pressable>
  );


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
          title="Detail"
          actions={
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity>
                <Feather name='bookmark' size={22} color={Color.text} style={{marginHorizontal: 15}} />
              </TouchableOpacity>
              <MaterialIcons onPress={() => {modalOptionsRef.current.open();}} 
              name='more-vert' size={22} color={Color.text} />
            </View>
          }
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
            <Divider height={10}/>
            <FlatList
              data={DATA}
              renderItem={renderItem}
              keyExtractor={item => item.id}
             />
          </View>

          <Divider/>
          <View>
            <Text style={{fontSize: 11, textAlign: 'left', fontWeight: 'bold', paddingHorizontal: 20}}>Detail Lokasi</Text>
            <Divider height={8}/>
            <View style={{flexDirection: 'row',alignItems: 'center', paddingHorizontal: 10 ,backgroundColor: '#F0F0F0', width: '90%', alignSelf: 'center', height: 70}}>
              <Image source={ImagesPath.LocationEvent} style={{borderRadius: 5}}/>
              <Text style={{fontSize: 8, lineHeight: 12,textAlign: 'left', width: '65%', paddingHorizontal: 10}}>Jl. Tebet Barat I No.2, RT.1/RW.2, Tebet Bar., Kec. Tebet, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12810</Text>
              <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center',backgroundColor: Color.primary, width: 35, height: 35, borderRadius: 20, marginLeft: 35}}>
                <Ionicons name='navigate' size={17} style={{color: Color.theme}}/>
              </TouchableOpacity>
            </View>
          <Divider/>
          <View>
            <Text style={{fontSize: 11, textAlign: 'left', fontWeight: 'bold', paddingHorizontal: 20}}>Informasi Lainnya</Text>
            <Divider height={8}/>
            <View style={{width: '90%', alignSelf: 'center', paddingHorizontal: 15, backgroundColor: Color.border, height: 1}}/>
            <Pressable style={{flexDirection:'row', alignItems: 'center', height: 40, width: '90%', borderBottomColor: Color.border, borderBottomWidth: 1, alignSelf: 'center'}}>
              <FontAwesome5Icon name={"ticket-alt"} style={{width: '8%'}}/>
              <Text style={{fontSize: 10, fontWeight: 'bold', width: '85%', textAlign: 'left'}}>Pengembalian Tiket</Text>
              <MaterialIcons name={'keyboard-arrow-down'} size={18}/>
            </Pressable>
            <Pressable style={{flexDirection:'row', alignItems: 'center', height: 40, width: '90%', borderBottomColor: Color.border, borderBottomWidth: 1, alignSelf: 'center'}}>
              <MaterialCommunityIcons size={15} name={"equal-box"} style={{width: '8%'}}/>
              <Text style={{fontSize: 10, fontWeight: 'bold', width: '85%', textAlign: 'left'}}>Syarat & Ketentuan</Text>
              <MaterialIcons name={'keyboard-arrow-down'} size={18}/>
            </Pressable>
          </View>

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
        <Divider height={25}/>
      </ScrollView>
      <Row style={{height: 60, paddingHorizontal: 20,paddingVertical: 15}}>
        <Col style={{justifyContent: 'center'}}>
            <Text style={{textAlign: 'left', fontSize: 8}}>Mulai dari</Text>
            <Text style={{textAlign: 'left', fontWeight: 'bold'}}>Rp. 100.000</Text>
        </Col>
        <TouchableOpacity style={{justifyContent: 'center',backgroundColor: Color.primary, width: '30%', borderRadius: 30, height: 35}}>
          <Text style={{fontSize: 10, color: Color.textInput}}>Ikut Event</Text>
        </TouchableOpacity>
      </Row>
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