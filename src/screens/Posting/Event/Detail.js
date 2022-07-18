import React, {useState, useEffect, useRef} from 'react';
import {View, Image, FlatList,ScrollView, Platform, Linking, Pressable, Touchable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Header from '@src/components/Header';
import {useLoading, usePopup, useColor, Alert, Row, Col} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import {useIsFocused, useRoute} from '@react-navigation/native';
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
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { getDetailEvent } from 'src/lib/query/event';
import { fetchSaveEvent } from 'src/api/event/saveEvent';
import { FormatMoney } from 'src/utils';




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
  const items = route.params.item;
  const modalOptionsRef = useRef();
  const user = useSelector(state => state['user.auth'].login.user);

  const [im_like, set_im_like] = useState(items.im_like);

  const [loading, setLoading] = useState(true);
  const [bookmark, setBookmark] = useState(false);
  const [desc, setDesc] = useState(false);
  const [data, setData] = useState(null);
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const isFocused = useIsFocused();

  useEffect(() => {
    getDetail();
  }, [isFocused]);

    const getDetail = () => {
      // showLoading();
      console.log(items)
      let variables = {
        id: items.id,
      };
      console.log(variables);
      Client.query({query: getDetailEvent, variables})
        .then(res => {
          // hideLoading()
          if(res.data.eventDetail){
            setData(res.data.eventDetail)
            setBookmark(res.data.eventDetail.bookmarked);
          }
          setLoading(false);
        })
        .catch(reject => {
          // hideLoading()
          alert(reject.message)
          console.log(reject.message, 'reject');
          setLoading(false);
        });
    };

  console.log(data, "data");


  const renderItem = ({ item }) => (
   <Pressable style={{width: '100%', height: 165, marginBottom: 10,paddingHorizontal: 15, backgroundColor: Color.theme, borderWidth: 1, borderColor: Color.border, borderRadius: 8}}>
      <Divider height={10}/>
      <Row>
        <Col>
          <Text style={{fontSize: 11, textAlign: 'left',fontWeight: 'bold'}}>{item.name}</Text>
          <Text style={{fontSize: 8, textAlign: 'left', marginVertical: 3}}>{items.date}</Text>
        </Col>
        {/* <View style={{flexDirection:'row', justifyContent: 'center'}}>
            <Text style={{fontSize: 10, color: '#3C58C1', marginHorizontal: 5}}>Lihat Detail</Text>
            <MaterialIcons name={'arrow-forward'} size={12} color={'#3C58C1'}/>
        </View> */}
      </Row>
      <Divider height={25}/>
      <Row style={{alignItems: 'center', }}>
        <MaterialCommunityIcons name={'cash-refund'} color={Color.secondary} size={22}/>
        <Text style={{fontSize: 10, color: Color.secondary, marginHorizontal: 5}}>{item.refund ? 'Bisa Refund' : 'Tidak Bisa Refund'}</Text>
        <Divider width={8}/>
        {/* <AntDesign name='calendar' size={18} color={Color.secondary}/>
        <Text style={{fontSize: 10, color: Color.secondary, marginHorizontal: 5}}>{item.reservation ? 'Perlu Reservasi' : 'Tidak Perlu Reservasi'}</Text> */}
      </Row>
      <Divider height={25}/>
      <Row>
        <Col>
            <Text style={{textAlign: 'left', fontSize: 8}}>Harga</Text>
            <Text style={{textAlign: 'left', fontWeight: 'bold'}}>{items.type === 'FREE' ? 'GRATIS' : FormatMoney.getFormattedMoney(item.price)}<Text style={{fontSize: 8}}>/Pax</Text></Text>
        </Col>
        <TouchableOpacity onPress={() => navigation.navigate('PemesananTiket', {item, dataEvent: data, itemRoute: items})} style={{justifyContent: 'center',backgroundColor: Color.primary, width: '35%', borderRadius: 30}}>
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
        productId: items.id,
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

  let eventDate = !isNaN(parseInt(items.eventDate)) ? parseInt(items.eventDate) : null;
  if (!eventDate) eventDate = !isNaN(parseInt(items.updated_date)) ? parseInt(items.updated_date) : null;

  let isPassedEventDate = true;
  if (moment(eventDate).isValid() && moment(eventDate).isAfter(moment())) {
    isPassedEventDate = false;
  }

  if(!data) return <View />

  const closest = data ? data.tickets ? data.tickets.reduce(
    (acc, loc) =>
      acc.price < loc.price
        ? acc
        : loc
  ) : 0 : 0

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
              <TouchableOpacity
                style={{marginRight: 15}}
                onPress={async() => {
                  const res = await fetchSaveEvent({eventId: data.id, type: bookmark ? 'UNBOOKMARK' : 'BOOKMARK'});
                  if(res.status == true){
                    setBookmark(!bookmark);
                  }
                }}>
                {bookmark == true ? (
                  <FontAwesome name={'bookmark'} size={24} />
                ) : (
                  <FontAwesome name={'bookmark-o'} size={24} />
                )}
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
          onPress={() => { data ? data.images.length == 0 ? console.log()  :
            navigation.navigate('GalleryDetailScreen', {
              id: data.id,
              image: data.images[0],
            })
            : console.log()
          }}
        >
          <Image
            source={{uri: data ? data.images.length == 0 ? '' : data.images[0] : ""}}
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
              {data.category} EVENT
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
              {data.name}
            </Text>
          </View>
          <View style={{flexDirection: 'row', paddingVertical: 18}}>
            <View
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
              <Text style={{fontSize: 10, color: Color.secondary, fontWeight: 'bold'}}>{moment(data.date).format('DD MMM YYYY')}</Text>
            </View>
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
              <Text style={{fontSize: 10, color: Color.secondary, fontWeight: 'bold'}}>{data.startTime} - {data.endTime}</Text>
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
              <Text style={{fontSize: 10, color: Color.secondary, fontWeight: 'bold'}}>{data.kota}</Text>
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
                navigation.navigate('GalleryScreen', {  });
              }}
            >
              Lihat Event Galeri
            </Button>
          </Container> */}
          
          {/* {items.like > 0 &&
            <Container paddingHorizontal={16}>
                <WidgetUserLikes id={items.id} title='Akan Hadir' />
            </Container>
          } */}
          {data.ordered && <Row style={{ backgroundColor: '#FAF3ED', marginHorizontal: 10, padding: 13, borderRadius: 8 }}>
            <Col>
              <Text size={11} type='bold' align='left'>Kamu telah memiliki tiket untuk event ini</Text>
            </Col>
            <Col style={{ alignItems: 'flex-end' }}>
              <TouchableOpacity onPress={()=> navigation.navigate('MyTicket', {item: data})} style={{ backgroundColor: '#F3771D', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 20 }}>
                <Row style={{ alignItems: 'center' }}>
                  <Text size={10} color='#fff' style={{ marginRight: 8 }}>Lihat Tiket</Text>
                  <AntDesign name='arrowright' color='#fff' />
                </Row>
              </TouchableOpacity>
            </Col>
          </Row>}

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
            {data.description && <Text
              numberOfLines={12}
              style={{
                textAlign: 'justify',
                paddingHorizontal: 20,
                color: Color.secondary,
                marginBottom: 16,
              }}>
              {data.description.length > 40 && !desc ? data.description.substring(0, 40) : data.description}
            </Text>}
            {data.description && data.description.length > 40 && <Pressable onPress={() => setDesc(!desc)} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center',width: '100%', paddingHorizontal: 15}}>
              <Text style={{color: Color.primary}}>{desc ? 'Lebih sedikit' : 'Selengkapnya'}</Text>
              <MaterialIcons name={'keyboard-arrow-down'} size={20} color={Color.primary} style={{marginHorizontal: 5}}/>
            </Pressable>}
          </View>
          <Divider/>

          <View style={{paddingHorizontal: 20}}>
            <Text style={{fontWeight:'bold', fontSize: 11, textAlign: 'left'}}>Jenis Tiket</Text>
            <Divider height={10}/>
            <FlatList
              data={data.tickets}
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
              {/* <Text style={{fontSize: 8, lineHeight: 12,textAlign: 'left', width: '65%', paddingHorizontal: 10}}>Jl. Tebet Barat I No.2, RT.1/RW.2, Tebet Bar., Kec. Tebet, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12810</Text> */}
              <Text style={{fontSize: 8, lineHeight: 12,textAlign: 'left', width: '65%', paddingHorizontal: 10}}>{data?.location}, {data?.kelurahan}, Kec. {data?.kecamatan}, Kota {data?.kota}, {data?.provinsi}</Text>
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
            {console.log(closest, 'cneasas')}
            <Text style={{textAlign: 'left', fontWeight: 'bold'}}>{FormatMoney.getFormattedMoney(closest ? closest.price  : 0)}</Text>
        </Col>
        <TouchableOpacity onPress={() => console.log()} style={{justifyContent: 'center',backgroundColor: Color.primary, width: '30%', borderRadius: 30, height: 35}}>
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
              id: items.id,
              product_name: items.productName,
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

            if (!items.latitude || !items.longitude) {
                alert('Alamat tidak valid');
                return;
            }

            daddr = items.latitude + ',' + items.longitude;
            
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
          event={true}
          isOwner={user && user.userId === items.ownerId}
          item={data}
      /> 
    </Scaffold>
  );
};

export default EventDetail;