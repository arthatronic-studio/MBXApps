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
import { Container, Divider, Line, Padding } from 'src/styled';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import { accessClient } from 'src/utils/access_client';
import ImagesPath from 'src/components/ImagesPath';
import { FormatMoney, loginRequired } from 'src/utils';
import imageAssets from 'assets/images';

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
  const auth = useSelector(state => state['auth']);
  
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <Pressable style={{ width: '100%', marginBottom: 10, padding: 10, backgroundColor: Color.theme, borderWidth: 0.5, borderColor: Color.border, borderRadius: 8 }}>
        <Row>
          <Col>
            <Text size={16} align='left' type='medium'>{item.name}</Text>
          </Col>
        </Row>

        <Divider height={8} />

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
          {/* <Divider width={10} />
          <Image
            source={imageAssets.calendarRemove}
            style={{
              width: 16,
              height: 16,
            }}
          />
          <Divider width={6} />
          <Text size={11}>{item.reservation ? 'Perlu Reservasi' : 'Tidak Perlu Reservasi'}</Text> */}
        </Row>

        <Divider height={8} />

        <Line height={1} width='100%' color='#F4F4F4' />

        <View style={{ width: '100%', flexDirection: 'row', paddingTop: 8 }}>
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
              onPress={() => {
                if (auth.user.isGuest) {
                  loginRequired('EventDetail', 'PemesananTiket', { item });
                  return;
                }
                navigation.navigate('PemesananTiket', { item });
              }}
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