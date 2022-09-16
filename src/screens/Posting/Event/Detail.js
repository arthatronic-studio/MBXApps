import React, { useState, useEffect, useRef } from 'react';
import { View, Image, FlatList, ScrollView, Platform, Linking, Pressable, Touchable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Accordion from 'react-native-collapsible/Accordion';

import Header from '@src/components/Header';
import { useLoading, usePopup, useColor, Alert, Row, Col } from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { TouchableOpacity, Button } from '@src/components/Button';
import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import { Container, Divider, Padding } from 'src/styled';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import { accessClient } from 'src/utils/access_client';
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
import imageAssets from 'assets/images';
import CardEventTicket from './CardEventTicket';
import { useCurrentUser } from 'src/hooks/useCanGenerateContent';
import { postAPI } from 'src/api-rest/httpService';
import HtmlView from 'src/components/HtmlView';

const EventDetail = ({ navigation, route }) => {
  const { Color } = useColor();
  const items = route.params.item;
  const modalOptionsRef = useRef();
  const flatlistRef = useRef();
  const user = useSelector(state => state['user.auth'].login.user);
  const {canGeneratedContent} = useCurrentUser();

  const [im_like, set_im_like] = useState(items.im_like);
  const [heightHeader, setHeightHeader] = useState(0);

  const [loading, setLoading] = useState(true);
  const [bookmark, setBookmark] = useState(false);
  const [desc, setDesc] = useState(false);
  const [data, setData] = useState(null);
  const [activeSections, setActiveSections] = useState([]);

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const isFocused = useIsFocused();

  useEffect(() => {
    getDetail();
  }, [isFocused]);

  const getDetail = () => {
    // showLoading();
    let variables = {
      id: items.id,
    };
    console.log(variables);
    Client.query({ query: getDetailEvent, variables })
      .then(res => {
        // hideLoading()
        if (res.data.eventDetail) {
          console.log(res.data)
          setData(res.data.eventDetail)
          setBookmark(res.data.eventDetail.bookmarked);
        }
        setLoading(false);
      })
      .catch(reject => {
        // hideLoading()
        // alert(reject.message)
        console.log(reject.message, 'reject');
        setLoading(false);
      });
  };

  const renderItem = ({ item }) => {
    return (
      <CardEventTicket item={item} />
    )
  }

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

  const openGps = (lat, lng) => {
    // var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    // var url = scheme + `${lat},${lng}`;
    const latLng = `${lat},${lng}`;
    // return `google.navigation:q=${latLng}`;
    Linking.openURL(`google.navigation:q=${latLng}`);
  }

  console.log('items', items);

  let descriptionProps = { numberOfLines: 12 };
  if (desc) descriptionProps = {};
  const labelDesctiption = items.description;

  const renderHeader = () => {
    return (
      <View
        onLayout={(e) => {
          setHeightHeader(e.nativeEvent.layout.height);
        }}
        style={{
          paddingBottom: 24,
        }}
      >
        <Container paddingHorizontal={16} marginTop={8} marginBottom={16}>
          <View>
            <Text
              size={22}
              align='left'
            >
              {items.title}
            </Text>
          </View>

          <View style={{ flex: 1, flexDirection: 'row', marginTop: 8 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={imageAssets.calendar}
                style={{
                  width: 16,
                  height: 16,
                }}
                resizeMode='contain'
              />
              <View style={{flex: 1, paddingLeft: 4, alignItems: 'flex-start'}}>
                <Text size={10} type='medium' numberOfLines={1}>{items.formatted_date}</Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={imageAssets.clock}
                style={{
                  width: 16,
                  height: 16,
                }}
                resizeMode='contain'
              />
              <View style={{flex: 1, paddingLeft: 4, alignItems: 'flex-start'}}>
                <Text size={10} type='medium' numberOfLines={1}>{items.time}</Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={imageAssets.location}
                style={{
                  width: 16,
                  height: 16,
                }}
                resizeMode='contain'
              />
              <View style={{flex: 1, paddingLeft: 4, alignItems: 'flex-start'}}>
                <Text size={10} type='medium' numberOfLines={1}>{items.location}</Text>
              </View>
            </View>
          </View>
        </Container>

        <TouchableOpacity
          onPress={() => {
            data ? data.images.length == 0 ? console.log() :
              navigation.navigate('GalleryDetailScreen', {
                id: data.id,
                image: data.images[0],
              })
              : console.log()
          }}
          style={{
            width: '100%',
            aspectRatio: 16 / 9,
          }}
        >
          <Image
            source={{ uri: items.image }}
            style={{ width: '100%', height: '100%', backgroundColor: Color.border }}
          />
        </TouchableOpacity>

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

        {/* {data && data.ordered && <Row style={{ backgroundColor: '#FAF3ED', marginHorizontal: 10, padding: 13, borderRadius: 8 }}>
          <Col>
            <Text size={11} type='bold' align='left'>Kamu telah memiliki tiket untuk event ini</Text>
          </Col>
          <Col style={{ alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={() => navigation.navigate('MyTicket', { item: data })} style={{ backgroundColor: '#F3771D', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 20 }}>
              <Row style={{ alignItems: 'center' }}>
                <Text size={10} color='#fff' style={{ marginRight: 8 }}>Lihat Tiket</Text>
                <AntDesign name='arrowright' color='#fff' />
              </Row>
            </TouchableOpacity>
          </Col>
        </Row>} */}

        <Container paddingHorizontal={16} marginTop={16}>
          <Text
            align='left'
            type='medium'
            letterSpacing={0.1}
          >
            Deskripsi
          </Text>
          <Divider height={8} />
          <Text
            align='left'
            {...descriptionProps}
          >
            {labelDesctiption}
          </Text>

          <Pressable
            onPress={() => setDesc(!desc)}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}
          >
            <Text color={Color.primaryDark}>{desc ? 'Lebih sedikit' : 'Selengkapnya'}</Text>
            <MaterialIcons name={'keyboard-arrow-down'} size={22} color={Color.primaryDark} />
          </Pressable>
        </Container>
      </View>
    )
  }

  const renderFooter = () => {
    return (
      <Container paddingHorizontal={16} marginTop={8}>
        <Text align='left'>Detail Lokasi</Text>
        <Divider height={8} />
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderRadius: 8, backgroundColor: Color.theme }}>
          <Image
            source={ImagesPath.LocationEvent}
            style={{
              width: 48,
              height: 48,
              borderRadius: 4,
            }}
          />
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <Text size={12} align='left' lineHeight={16} letterSpacing={0.4}>{items.location_detail}</Text>
          </View>
          <TouchableOpacity
            onPress={() => false && openGps(data.lat, data.lng)}
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <Image
              source={imageAssets.direction}
              style={{
                width: 40,
                height: 40,
              }}
            />
          </TouchableOpacity>
        </View>
        <Divider />
        <View>
          <Text size={12} style={{ textAlign: 'left', fontWeight: 'bold' }}>Informasi Lainnya</Text>
          <Divider height={8} />

          <Accordion
            sections={[
              {
                title: 'Pengembalian Tiket',
                content: items.return_terms,
                imageAsset: imageAssets.ticketRefund,
              },
              {
                title: 'Syarat & Ketentuan',
                content: items.term_and_condition,
                imageAsset: imageAssets.terms,
              },
            ]}
            activeSections={activeSections}
            renderHeader={(section) => (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', height: 40, width: '100%', borderColor: Color.border, backgroundColor: Color.theme, borderTopWidth: 0.5, alignSelf: 'center' }}
              >
                <Image
                  source={section.imageAsset}
                  style={{
                    width: 14,
                    height: 10,
                    marginRight: 12,
                    tintColor: Color.textSoft,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text size={12} style={{ fontWeight: '500', textAlign: 'left' }}>{section.title}</Text>
                </View>
                <MaterialIcons name={'keyboard-arrow-down'} size={18} color={Color.text} />
              </View>
            )}
            renderContent={(section) => (
              <Container paddingVertical={8}>
                {/* <Text align='left' size={12}>{section.content}</Text> */}
                <HtmlView
                  html={section.content}
                />
              </Container>
            )}
            onChange={(val) => {
              setActiveSections(val);
            }}
          />
          <View style={{ width: '100%', paddingHorizontal: 16, backgroundColor: Color.border, height: 0.5 }} />
        </View>
      </Container>
    )
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
          // actions={
          //   <View style={{ flexDirection: 'row' }}>
          //     <TouchableOpacity
          //       style={{ marginRight: 15 }}
          //       onPress={async () => {
          //         showLoading();

          //         const body = {
          //           event_id: items.id,
          //         }
          //         const res = await postAPI('wishlist', body);
          //         console.log(body, res);

          //         if (res.status) {
          //           setBookmark(!bookmark);
          //           showLoading('success', res.message);
          //           return;
          //         }
                  
          //         showLoading('error', res.message);
          //       }}>
          //       {bookmark == true ? (
          //         <FontAwesome name={'bookmark'} size={24} color={Color.text} />
          //       ) : (
          //         <FontAwesome name={'bookmark-o'} size={24} color={Color.text} />
          //       )}
          //     </TouchableOpacity>

          //     <Pressable
          //       onPress={() => {
          //         modalOptionsRef.current.open();
          //       }}
          //     >
          //       <Image
          //         source={imageAssets.moreOutline}
          //         style={{
          //           height: 24,
          //           width: 24,
          //         }}
          //         resizeMode='contain'
          //       />
          //     </Pressable>
          //   </View>
          // }
        />
      }
    >
      <FlatList
        ref={flatlistRef}
        data={
          Array.isArray(items.tickets) && items.tickets.length > 0 ?
          items.tickets
          :
          []
        }
        keyExtractor={(item, index) => item.id + index.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
      />

      <Row style={{ padding: 16, backgroundColor: Color.theme }}>
        <Col style={{ justifyContent: 'center' }}>
          <Text type='medium' style={{ textAlign: 'left', fontSize: 8 }}>Mulai dari</Text>
          <Divider height={4} />
          <Text size={18} type='semibold' style={{ textAlign: 'left' }}>{FormatMoney.getFormattedMoney(items.lowest_price ? items.lowest_price.price : 0)}</Text>
        </Col>
        <TouchableOpacity
          onPress={() => {
            flatlistRef.current.scrollToOffset({
              offset: heightHeader,
              animated: true
            })
          }}
          style={{ justifyContent: 'center', backgroundColor: Color.primary, borderRadius: 8, height: 45, paddingHorizontal: 24 }}
        >
          <Text type='medium' color={Color.textButtonInline}>Cari Tiket</Text>
        </TouchableOpacity>
      </Row>

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