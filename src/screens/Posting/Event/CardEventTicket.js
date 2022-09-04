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
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
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
import { shadowStyle } from 'src/styles';

const defaultProps = {
  item: {
    name: '',
    isRefundable: false,
    reservation: false,
  },
};

const CardEventTicket = ({ item, onSelect }) => {
  const { Color } = useColor();
  const navigation = useNavigation();

  // let eventDate = !isNaN(parseInt(items.eventDate)) ? parseInt(items.eventDate) : null;
  // if (!eventDate) eventDate = !isNaN(parseInt(items.updated_date)) ? parseInt(items.updated_date) : null;

  // let isPassedEventDate = true;
  // if (moment(eventDate).isValid() && moment(eventDate).isAfter(moment())) {
  //   isPassedEventDate = false;
  // }

  const labelDesctiption = `Nothing about event planning is simple, but advertising and promoting can sometimes be the most daunting parts of the job. If you can’t find an effective way to get people excited when they click on your email invite or see the event promotion on social media, you might experience low turnout for the event.
  
  An event description is a text or copy that tells audiences all the essential details about your event. These details should come together so that it compels potential attendees to register. But more than driving up attendance, a good event description can pique the interest of non-members and even the press. In a nutshell, an event description should cover the who, what, why, where, when and how of your event to give potential attendees reasons to show up.`;

  return (
    <View style={{ paddingHorizontal: 16, ...shadowStyle, backgroundColor: Color.theme }}>
      <Pressable style={{ width: '100%', marginBottom: 10, padding: 10, backgroundColor: Color.theme, borderRadius: 8 }}>
        <Row>
          <Col>
            <Text style={{ fontSize: 11, textAlign: 'left', fontWeight: 'bold' }}>{item.name}</Text>
          </Col>
        </Row>

        <Divider />

        <Row style={{ alignItems: 'center' }}>
          <Image
            source={ImagesPath.refund}
            style={{
              width: 16,
              height: 16,
              tintColor: Color.text,
            }}
          />
          <Divider width={6} />
          <Text size={11}>{item.isRefundable ? 'Bisa Refund' : 'Tidak Bisa Refund'}</Text>
          <Divider width={10} />
          <Image
            source={imageAssets.calendarRemove}
            style={{
              width: 16,
              height: 16,
            }}
          />
          <Divider width={6} />
          <Text size={11}>{item.reservation ? 'Perlu Reservasi' : 'Tidak Perlu Reservasi'}</Text>
        </Row>

        <View style={{ width: '100%', flexDirection: 'row', paddingTop: 16 }}>
          <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
            <Text size={11}>Harga</Text>
            <Text type='medium'>{FormatMoney.getFormattedMoney(item.price)}<Text size={11}>/Pax</Text></Text>
          </View>
          <View style={{ flex: 0.8 }}>
            {typeof onSelect === 'function' ?
            <Button
              onPress={() => onSelect()}
              fontSize={12}
            >
              Pilih Tiket
            </Button>
            :
            <Button
              onPress={() => navigation.navigate('PemesananTiket', { item })}
              fontSize={12}
            >
              Pesan Sekarang
            </Button>
            }
          </View>
        </View>
      </Pressable>
    </View>
  );
};

CardEventTicket.defaultProps = defaultProps;
export default CardEventTicket;