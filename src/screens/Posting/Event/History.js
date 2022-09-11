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
import { getAPI } from 'src/api-rest/httpService';
import { initialItemState } from 'src/utils/constants';

const History = ({ navigation, route }) => {

  const { Color } = useColor();
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();

  const [itemData, setItemData] = useState(initialItemState);
  const isFocused = useIsFocused();

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    if (itemData.loadNext) {
      getList();
    }
  }, [itemData.loadNext]);

  const getList = async () => {
    const result = await getAPI(`ticket-order?page=${itemData.page + 1}`);

    console.log('result ticket-order', result);

    let newData = [];

    if (result.status) {
      newData = result.data;
    }

    setItemData({
      ...itemData,
      data: itemData.data.concat(newData),
      page: newData.length > 0 ? itemData.page + 1 : -1,
      loading: false,
      loadNext: false,
      refresh: false,
    });
  };

  return (
    <Scaffold
      style={{ backgroundColor: '#F4F4F4' }}
      fallback={itemData.loading}
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
        data={itemData.data}
        onEndReachedThreshold={0.3}
        onEndReached={() => {
          if (itemData.page !== -1) setItemData({ ...itemData, loadNext: true });
        }}
        ListFooterComponent={
          itemData.loadNext &&
          <Text size={12} type='medium'>Loading...</Text>
        }
        renderItem={({ item }) =>
          <View style={{ paddingHorizontal: 16 }}>
            <Pressable
              style={{ borderRadius: 8, marginBottom: 10, backgroundColor: Color.theme, width: '100%' }}
            >
              <View style={{ paddingVertical: 10, flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center' }}>
                <View style={{ width: '12%', aspectRatio: 1, backgroundColor: Color.secondary, borderRadius: 4 }}>
                  <Image
                    source={{ uri: item.ticket.event.image }}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 4
                    }}
                  />
                </View>
                <View style={{ paddingHorizontal: 10, width: '60%' }}>
                  <Text numberOfLines={2} align={'left'} style={{ fontWeight: 'bold' }}>{item.ticket.name}</Text>
                  <View style={{ flexDirection: 'row', marginTop: 4, alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: Color.secondary }}>{item.amount} Tiket</Text>
                    <View style={{ width: 3, height: 3, backgroundColor: Color.secondary, borderRadius: 20, marginHorizontal: 5 }} />
                    <Text style={{ fontSize: 10, color: Color.secondary }}>1 Pax</Text>
                  </View>
                </View>
                <View style={{width: '28%'}}>
                  {item.status === 0 ?
                    <View style={{ backgroundColor: Color.info, borderRadius: 120, paddingHorizontal: 12, paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }}>
                      <Text size={10} color={Color.textInput} type='medium'>{item.status_name}</Text>
                    </View>
                    :
                    item.status === 1 ?
                      <View style={{ backgroundColor: '#E7F5D0', borderRadius: 120, paddingHorizontal: 12, paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }}>
                        <Text size={10} color={'#558617'} type='medium'>{item.status_name}</Text>
                      </View>
                      :
                      <View style={{ backgroundColor: '#FDD6DA', borderRadius: 120, paddingHorizontal: 12, paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }}>
                        <Text size={10} color={'#F73347'} type='medium'>{item.status_name}</Text>
                      </View>
                  }
                </View>
              </View>

              <View style={{ borderWidth: 0.5, borderColor: Color.border, width: '95%', alignSelf: 'center' }} />

              <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text align={'left'} style={{ fontSize: 8, color: Color.secondary }}>Total</Text>
                  <Text align={'left'} style={{ fontWeight: 'bold' }}>{FormatMoney.getFormattedMoney(item.total_price)}</Text>
                </View>
                <Pressable onPress={() => navigation.navigate('OrderEventDetail', { item })}
                  style={{ backgroundColor: Color.theme, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, paddingVertical: 10, borderWidth: 0.5 }}
                >
                  <Text style={{ fontSize: 12 }} type='medium'>Lihat Detail</Text>
                </Pressable>
              </View>
            </Pressable>
          </View>
        }
      />
    </Scaffold>
  )
}

export default History