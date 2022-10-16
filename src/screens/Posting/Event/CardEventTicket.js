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
  isPassedEventDate: false,
};

const CardEventTicket = ({ item, isPassedEventDate, onSelect }) => {
  const { Color } = useColor();
  const navigation = useNavigation();
  const auth = useSelector(state => state['auth']);
  
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={{ width: '100%', marginBottom: 10, paddingVertical: 10, backgroundColor: Color.theme, borderWidth: 1, borderColor: Color.primary }}>
        <Container paddingHorizontal={10}>
          <Row>
            <Col>
              <Text size={16} align='left' type='medium'>{item.name}</Text>
            </Col>
          </Row>

          <Divider height={8} />

          <Row style={{ alignItems: 'center' }}>
            <Text size={11}>{item.isRefundable ? 'Refundable' : 'Non-Refundable'}</Text>
          </Row>
        </Container>

        <Divider height={8} />

        <Line height={1} width='100%' color={Color.primary} />

        <Container paddingHorizontal={10}>
          <View style={{ width: '100%', flexDirection: 'row', paddingTop: 10 }}>
            <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text type='medium'>{FormatMoney.getFormattedMoney(item.price)}<Text size={11}>/Pax</Text></Text>
            </View>
            <View style={{ flex: 0.4 }}>
              {typeof onSelect === 'function' ?
              <TouchableOpacity
                onPress={() => onSelect()}
                disabled={isPassedEventDate}
                style={{ justifyContent: 'center', borderWidth: 1, borderColor: Color.primary, paddingVertical: 8 }}
              >
                <Text type='medium'>Pilih Tiket</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity
                onPress={() => {
                  if (auth.user.isGuest) {
                    loginRequired('EventDetail', 'PemesananTiket', { item });
                    return;
                  }
                  navigation.navigate('PemesananTiket', { item });
                }}
                disabled={isPassedEventDate}
                style={{ justifyContent: 'center', borderWidth: 1, borderColor: Color.primary, paddingVertical: 8 }}
              >
                <Text type='medium'>{isPassedEventDate ? 'Unavailable' : 'Get Ticket'}</Text>
              </TouchableOpacity>
              }
            </View>
          </View>
        </Container>
      </View>
    </View>
  );
};

CardEventTicket.defaultProps = defaultProps;
export default CardEventTicket;