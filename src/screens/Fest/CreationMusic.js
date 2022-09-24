import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Image,
  FlatList,
  ScrollView,
  Platform,
  Linking,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Moment from 'moment';
import {useSelector} from 'react-redux';
import Header from '@src/components/Header';
import {useLoading, usePopup, useColor, Alert, Row, Col, Text} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import {TouchableOpacity, Button} from '@src/components/Button';
import HighlightContentProduct from 'src/components/Content/HighlightContentProduct';
import Client from '@src/lib/apollo';
import {queryAddLike} from '@src/lib/query';
import {Container, Divider, Padding} from 'src/styled';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import {analyticMethods, GALogEvent} from 'src/utils/analytics';
import ImagesPath from 'src/components/ImagesPath';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {FormatMoney} from 'src/utils';
import {getAPI} from 'src/api-rest/httpService';
import {initialItemState} from 'src/utils/constants';
import CardFestArts from 'src/components/Fest/CardFestArts';
import client from '@src/lib/apollo';
import {queryContentProduct} from '@src/lib/query';

const CreationMusic = ({navigation, route}) => {
  const {Color} = useColor();
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
    // const result = await getAPI(`ticket-order?isUsed=0&page=${itemData.page + 1}`);

    // console.log('result ticket-order', result);

    // let newData = [];

    // if (result.status) {
    //   newData = result.data;
    // }
    const variables = {
      page: 1,
      itemPerPage: 50,
      productType: 'TRIBESASIA',
      productCategory: 'NEWEST_MUSIC',
    };

    client
      .query({
        query: queryContentProduct,
        variables,
      })
      .then(res => {
        console.log('res musik terbaru', res);

        let newData = [];
        if (res.data.contentProduct) {
          newData = res.data.contentProduct;
        }
        console.log('hahahah');

        setItemData({
          ...itemData,
          data: newData,
          loading: false,
          loadNext: false,
          message: res.message,
          refresh: false,
        });
      })
      .catch(err => {
        console.log('err musik terbaru', err);

        setItemData({
          ...itemData,
          loading: false,
          loadNext: false,
          message: res.message,
          refresh: false,
        });
      });

    // setItemData({
    //   ...itemData,
    //   data: itemData.data.concat(newData),
    //   page: newData.length > 0 ? itemData.page + 1 : -1,
    //   loading: false,
    //   loadNext: false,
    //   refresh: false,
    // });
  };

  const cardFestMusic = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          trackPlayerPlay(itemData.data, index);
          navigation.navigate('FestMusicPlayer', {item});
        }}
        style={{
          padding: 10,
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          // source={{uri: item.image}}
          source={imageAssets.aboutFest1}
          style={{
            width: '14%',
            aspectRatio: 1,
            borderRadius: 8,
          }}
          resizeMode="cover"
        />

        <Divider width={10} />
        <Container flexDirection="column" flex={1}>
          <Text
            size={14}
            align="left"
            color={Color.text}
            type="medium"
            numberOfLines={1}>
            Aroma Roket Senja
          </Text>
          <Text size={10} align="left" numberOfLines={1}>
            Besok Ngoding Band
          </Text>
        </Container>
      </TouchableOpacity>
    );
  };

  return (
    <Scaffold
      style={{backgroundColor: '#F4F4F4'}}
      fallback={itemData.loading}
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}
      showHeader={false}>
      <Divider />

      <FlatList
        keyExtractor={(_, index) => index.toString()}
        data={itemData.data}
        // onEndReachedThreshold={0.3}
        // onEndReached={() => {
        //   if (itemData.page !== -1) setItemData({...itemData, loadNext: true});
        // }}
        ListFooterComponent={
          itemData.loadNext && (
            <Text size={12} type="medium">
              Loading...
            </Text>
          )
        }
        renderItem={({item, index}) => (
          <View style={{paddingHorizontal: 16}}>
            {/* <cardFestMusic item={item} index={index}/> */}
            {/* {cardFestMusic(item, index)} */}
          </View>
        )}
      />
    </Scaffold>
  );
};

export default CreationMusic;
