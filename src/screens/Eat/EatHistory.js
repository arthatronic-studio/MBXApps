import React, { useState, useEffect, useRef } from 'react';
import { View, Image, FlatList, ScrollView, Platform, Linking, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import Header from '@src/components/Header';
import { useLoading, usePopup, useColor, Alert, Row, Col } from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { TouchableOpacity, Button } from '@src/components/Button';
import HighlightContentProduct from 'src/components/Content/HighlightContentProduct';
import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
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
import { useIsFocused, useRoute } from '@react-navigation/native';
import { getHistory } from 'src/lib/query/event';
import { FormatMoney } from 'src/utils';

const EatHistory = ({ navigation, route }) => {

  const { Color } = useColor();
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    console.log(route, 'props');
    // showLoading();
    let variables = {
      page: 0,
      itemPerPage: 20,
    };
    console.log(variables);
    Client.query({ query: getHistory, variables })
      .then(res => {
        // hideLoading()
        if (res.data.eventTicketOrderList) {
          setData(res.data.eventTicketOrderList)
        }
        console.log(res);

        setLoading(false);
      })
      .catch(reject => {
        // hideLoading()
        console.log(reject, 'reject');
        setLoading(false);
      });
  };

  return (
    <Scaffold
      style={{ backgroundColor: '#F4F4F4' }}
      fallback={false}
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}
      header={
        <Header
          type="bold"
          centerTitle={false}
          title="Riwayat Pesanan"
        />
      }
    >
      <Divider />
      <FlatList
        data={data}
        renderItem={({ item }) =>
          <Pressable
            onPress={() => {
              
            }}
            style={{ borderRadius: 5, marginBottom: 10, backgroundColor: Color.theme, width: '95%', alignSelf: 'center' }}
          >
            <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10, }}>
              <Col style={{ width: '60%' }}>
                <Text align={'left'} style={{ fontSize: 9 }} type='medium' color={Color.textSoft}>No. Receipt</Text>
                <Divider height={2} />
                <Text align={'left'} style={{ fontSize: 11 }} type='medium'>{item.orderNumber}</Text>
              </Col>
              {item.status == "Lunas" ?
                <View style={{ backgroundColor: '#E7F5D0', borderRadius: 8, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                  <Text size={10} type='medium' color={'#558617'}>{item.status}</Text>
                </View> :
                <View style={{ backgroundColor: '#FDD6DA', borderRadius: 8, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                  <Text size={10} type='medium' color={'#F73347'}>{item.status}</Text>
                </View>
              }
            </View>
            <View style={{ borderWidth: 0.6, borderColor: Color.border, width: '95%', alignSelf: 'center' }} />
            <View style={{ paddingVertical: 10, flexDirection: 'row', paddingHorizontal: 10 }}>
              <View style={{ width: 50, height: 50, backgroundColor: Color.secondary, borderRadius: 5 }}>
                <Image source={{ uri: item.event.images[0] }} style={{ width: '100%', height: '100%' }} />
              </View>
              <View style={{ paddingHorizontal: 10, width: '70%' }}>
                <Text numberOfLines={2} align={'left'} style={{ fontWeight: 'bold' }}>{item.event.name}</Text>
                <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                  <Text style={{ fontSize: 10, color: Color.secondary }}>Cafe</Text>
                </View>
              </View>
            </View>
            <Container paddingVertical={11} paddingHorizontal={10} align='flex-start'>
              <Text sizd={12} color={Color.textSoft}>Pesanan : 2 Hot cofee</Text>
            </Container>
            <View style={{ borderWidth: 0.6, borderColor: Color.border, width: '95%', alignSelf: 'center' }} />
            <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
              <View style={{ width: '70%', paddingHorizontal: 10 }}>
                <Text align={'left'} style={{ fontSize: 8, color: Color.secondary }}>Harga Total</Text>
                <Divider height={2} />
                <Text align={'left'} style={{ fontWeight: 'bold' }}>{FormatMoney.getFormattedMoney(item.price)}</Text>
              </View>
            </View>
          </Pressable>}
      />
    </Scaffold>
  )
}

export default EatHistory;