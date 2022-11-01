import React, { useState, useEffect, useRef } from 'react';
import { View, Image, FlatList, ScrollView, Platform, Linking, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Fontisto from 'react-native-vector-icons/Fontisto';
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
import { FormatMoney } from 'src/utils';
import { getAPI } from 'src/api-rest/httpService';
import { initialItemState } from 'src/utils/constants';

const HistoryTiketku = ({ navigation, route }) => {

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
    const result = await getAPI(`ticket-order?isUsed=0&page=${itemData.page + 1}`);

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
      empty={!itemData.loading && itemData.data.length === 0}
      popupProps={popupProps}
      loadingProps={loadingProps}
      showHeader={false}
    >
      <Divider />

      <FlatList
        keyExtractor={(_, index) => index.toString()}
        data={itemData.data}
        onEndReachedThreshold={0.3}
        onEndReached={() => {
          if (itemData.page !== -1) setItemData({ ...itemData, loadNext: true });
        }}
        ListFooterComponent={
          itemData.loadNext &&
          <Text size={12} type='medium'>Loading...</Text>
        }
        renderItem={({ item }) => {
          // 0 waiting
          // 1 success
          // 2 canceled
          // 3 expired
          // 4 finish

          let textColorStatus = Color.textInput;
          let bgColorStatus = Color.text;
          let borderColorStatus = Color.text;
          if (item.status === 0) {
            textColorStatus = Color.text;
            bgColorStatus = '#CCCCCC';
            borderColorStatus = '#CCCCCC';
          }

          return (
            <View style={{ paddingHorizontal: 16 }}>
              <Pressable
                onPress={() => navigation.navigate('OrderEventDetail', { item })}
                style={{ borderWidth: 1, borderColor: Color.text, marginBottom: 10, backgroundColor: Color.theme, width: '100%' }}
              >
                <View style={{ borderBottomWidth: 1, borderColor: Color.text, paddingHorizontal: 8, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text numberOfLines={2} align={'left'} type='medium' size={11} letterSpacing={0.5} color={Color.secondary}>No. Receipt</Text>
                    <Divider height={2} />
                    <Text numberOfLines={2} align={'left'} type='bold' size={12} letterSpacing={0.4}>{item.invoice_id || '-'}</Text>
                  </View>

                  <View style={{ borderWidth: 1, borderColor: borderColorStatus, backgroundColor: bgColorStatus, paddingHorizontal: 10, paddingVertical: 6, justifyContent: 'center', alignItems: 'center' }}>
                    <Text size={10} color={textColorStatus} type='medium'>{item.status_name}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 12 }}>
                  <View style={{ width: '14%', aspectRatio: 1, backgroundColor: Color.secondary, borderRadius: 4 }}>
                    <Image
                      source={{ uri: item.ticket && item.ticket.event ? item.ticket.event.image : '' }}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 4
                      }}
                    />
                  </View>
                  <View style={{ paddingHorizontal: 10, width: '76%' }}>
                    <Text numberOfLines={2} align={'left'} style={{ fontWeight: 'bold' }}>{item.ticket ? item.ticket.name : ''}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 4, alignItems: 'center' }}>
                      <Text style={{ fontSize: 10, color: Color.secondary }}>{item.amount} Tiket</Text>
                      <View style={{ width: 3, height: 3, backgroundColor: Color.secondary, borderRadius: 20, marginHorizontal: 5 }} />
                      <Text style={{ fontSize: 10, color: Color.secondary }}>1 Pax</Text>
                    </View>
                  </View>
                </View>

                <View style={{ borderTopWidth: 1, borderColor: Color.text, paddingVertical: 12, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View>
                    <Text>{item.total_price > 0 ? FormatMoney.getFormattedMoney(item.total_price) : 'Free'}</Text>
                  </View>

                  <Pressable
                    onPress={() => navigation.navigate('OrderEventDetail', { item })}
                    style={{ flexDirection: 'row', backgroundColor: Color.text, alignItems: 'center', justifyContent: 'center', padding: 8 }}
                  >
                    <Text size={12} type='bold' color={Color.textInput}>Check Ticket</Text>
                  </Pressable>
                </View>
              </Pressable>
            </View>
          )
        }}
      />
    </Scaffold>
  )
}

export default HistoryTiketku