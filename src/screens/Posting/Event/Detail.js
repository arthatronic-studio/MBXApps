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

  const isPassedEventDate = items.is_past_event === 1 ? true : false;

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
    if (isPassedEventDate) {
      showLoading('error', 'Event telah berakhir');
    }
  }, []);

  const renderItem = ({ item }) => {
    return (
      <CardEventTicket item={item} isPassedEventDate={isPassedEventDate} />
    )
  }

  const openGps = (lat, lng) => {
    // // var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    // // var url = scheme + `${lat},${lng}`;
    // const latLng = `${lat},${lng}`;
    // // return `google.navigation:q=${latLng}`;
    // Linking.openURL(`google.navigation:q=${latLng}`);
    Linking.openURL(items.coordinate);
  }

  console.log('items', items);

  let descriptionProps = { numberOfLines: 3 };
  if (desc) descriptionProps = {};
  const labelDesctiption = items.description;

  const renderHeader = (
    <>
      <View
        onLayout={(e) => {
          setHeightHeader(e.nativeEvent.layout.height);
        }}
        style={{
          paddingBottom: 24,
        }}
      >
        <Container paddingHorizontal={16} marginTop={8}>
          <View style={{ borderWidth: 1, borderColor: Color.primary }}>
            <View style={{ padding: 10, borderBottomWidth: 1, borderColor: Color.primary }}>
              <Text
                size={27}
                type='medium'
                align='left'
              >
                {items.title}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={1}
              style={{
                width: '100%',
                aspectRatio: 1,
              }}
            >
              <Image
                source={{ uri: items.image }}
                style={{ width: '100%', height: '100%', backgroundColor: Color.border }}
              />
            </TouchableOpacity>
          
            <View style={{ flexDirection: 'row', minHeight: (12 * 3) + 20, borderTopWidth: 1, borderColor: Color.primary }}>
              <View style={{ flex: 1, padding: 10, justifyContent: 'center', backgroundColor: Color.primary }}>
                <Text size={12} type='medium' numberOfLines={3} color={Color.textInput}>{items.formatted_date}</Text>
              </View>
              <View style={{ flex: 1, padding: 10, justifyContent: 'center', }}>
                <Text size={12} type='medium' numberOfLines={3}>{items.location}</Text>
              </View>
            </View>
          </View>

          {/* <View style={{ flex: 1, flexDirection: 'row', marginTop: 8 }}>
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
              <View style={{ flex: 1, paddingLeft: 4, alignItems: 'flex-start' }}>
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
              <View style={{ flex: 1, paddingLeft: 4, alignItems: 'flex-start' }}>
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
              <View style={{ flex: 1, paddingLeft: 4, alignItems: 'flex-start' }}>
                <Text size={10} type='medium' numberOfLines={1}>{items.location}</Text>
              </View>
            </View>
          </View> */}
        </Container>

        <Container paddingHorizontal={16} marginTop={24}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text align='left' size={10} type='semibold'>● ABOUT</Text>
            </View>

            <View style={{ flex: 3 }}>
              <Text
                align='left'
                lineHeight={18}
                size={12}
                type='medium'
                {...descriptionProps}
              >
                {labelDesctiption}
              </Text>

              <Pressable
                onPress={() => setDesc(!desc)}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}
              >
                <Text color={Color.primaryDark} size={12}>{desc ? 'View Less' : 'Read More'}</Text>
                <MaterialIcons name={'keyboard-arrow-down'} size={18} color={Color.primaryDark} />
              </Pressable>
            </View>
          </View>
        </Container>
      </View>

      <Container paddingBottom={12} paddingHorizontal={16}>
        <Text align='left' size={10} type='semibold'>● TICKET</Text>
      </Container>
    </>
  )

  const renderFooter = (
    <Container paddingHorizontal={16} marginTop={8}>
      <Text align='left' size={10} type='semibold'>● LOCATION</Text>

      <Divider height={12} />

      <Text size={12} align='left' lineHeight={16} letterSpacing={0.4}>{items.location_detail}</Text>

      <Divider height={12} />

      <Button
        outline
        onPress={() => openGps()}
      >
        Get Directions
      </Button>

      <Divider />

      <View>
        <Text align='left' size={10} type='semibold'>● ADDITIONAL INFORMATION</Text>

        <Divider height={8} />

        <Accordion
          sections={[
            {
              number: '01',
              title: 'Refund Ticket',
              content: items.return_terms,
              imageAsset: imageAssets.ticketRefund,
            },
            {
              number: '02',
              title: 'Term & Conditions',
              content: items.term_and_condition,
              imageAsset: imageAssets.terms,
            },
          ]}
          activeSections={activeSections}
          renderHeader={(section) => (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', height: 40, width: '100%', borderColor: Color.border, backgroundColor: Color.theme, alignSelf: 'center', borderBottomWidth: 1, borderColor: Color.primary }}
            >
              <View style={{ flex: 1, alignItems: 'flex-start' }}>
                <Text size={11} type='medium'>{section.number}</Text>
              </View>
              <View style={{ flex: 8 }}>
                <Text size={14} style={{ fontWeight: '500', textAlign: 'left' }}>{section.title}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ borderBottomWidth: 1, borderColor: Color.primary }}>
                  <Text size={11} type='medium'>Read More</Text>
                </View>
                <MaterialIcons name={'keyboard-arrow-down'} size={18} color={Color.text} />
              </View>
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
            
            if (flatlistRef.current) {
              setTimeout(() => {
                flatlistRef.current.scrollToEnd({
                  animated: true
                });
              }, 500);
            }
          }}
        />
        <View style={{ width: '100%', paddingHorizontal: 16, backgroundColor: Color.border, height: 0.5 }} />
      </View>

      <Divider />

    </Container>
  )

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

      {!isPassedEventDate && <Row style={{ padding: 16, backgroundColor: Color.theme }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text type='medium' style={{ textAlign: 'left', fontSize: 11 }}>Start from</Text>
          <Divider height={4} />
          <Text size={18} type='semibold' style={{ textAlign: 'left' }}>{FormatMoney.getFormattedMoney(items.lowest_price ? items.lowest_price.price : 0)}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (flatlistRef.current) {
              flatlistRef.current.scrollToOffset({
                offset: heightHeader,
                animated: true
              });
            }
          }}
          style={{ justifyContent: 'center', backgroundColor: Color.primary, flex: 0.42, paddingVertical: 8 }}
        >
          <Text type='medium' color={Color.textButtonInline}>Get Ticket</Text>
        </TouchableOpacity>
      </Row>}

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