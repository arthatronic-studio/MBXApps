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
import CardFestArts from 'src/components/Fest/CardFestArts';
import imageAssets from 'assets/images';
import MasonryList from '@react-native-seoul/masonry-list';

const CreationArts = ({ navigation, route }) => {

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

    let newData = [
      {
          id: 1,
          image: imageAssets.arts1,
          width: 716,
          height: 960,
      },
      {
          id: 2,
          image: imageAssets.arts3,
          width: 1024,
          height: 1536,
      },
      {
          id: 3,
          image: imageAssets.arts2,
          width: 600,
          height: 450,
      },
      {
        id: 4,
        image: imageAssets.arsitektur1,
        width: 600,
        height: 364,
      },
      {
        id: 5,
        image: imageAssets.arsitektur2,
        width: 564,
        height: 399,
      },
      {
        id: 6,
        image: imageAssets.arsitektur3,
        width: 800,
        height: 418,
      }
    ];

    // if (result.status) {
    //   newData = result.data;
    // }

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
      showHeader={false}
    >
      <Divider />

      <MasonryList
        keyExtractor={(_, index) => index.toString()}
        data={itemData.data}
        numColumns={2}
        // onEndReachedThreshold={0.3}
        // onEndReached={() => {
        //   if (itemData.page !== -1) setItemData({ ...itemData, loadNext: true });
        // }}
        contentContainerStyle={{
          paddingHorizontal: 8,
        }}
        ListFooterComponent={
          itemData.loadNext &&
          <Text size={12} type='medium'>Loading...</Text>
        }
        renderItem={({ item }) =>
          // <View style={{ paddingHorizontal: 16 }}>
            <CardFestArts item={item} numColumns={2}/>
          // </View>
        }
      />
    </Scaffold>
  )
}

export default CreationArts