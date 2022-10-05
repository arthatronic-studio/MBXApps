import React, { useState, useEffect, useRef } from 'react';
import { View, Image, FlatList, ScrollView, Platform, Linking, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { useLoading, usePopup, useColor, Alert, Row, Col } from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { Container, Divider, Padding } from 'src/styled';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { getAPI } from 'src/api-rest/httpService';
import { initialItemState } from 'src/utils/constants';
import CardFestEvent from 'src/components/Fest/CardFestEvent';

const TabEventComming = ({ navigation, route }) => {

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
    // const result = await getAPI(`ticket-order?isUsed=0&page=${itemData.page + 1}`);

    // console.log('result ticket-order', result);

    let newData = [
      {
        id: 1,
        group: 'Musik',
        nav: 'FestMusicScreen',
        head: true,
      },
      {
        id: 2,
        group: 'Literatur',
        nav: 'FestLiteratureScreen',
        head: true,
      },
      {
        id: 3,
        group: 'Art & Design',
        nav: 'FestArtsScreen',
        head: true,
      },
      {
        id: 4,
        group: 'Art & Design',
        nav: 'FestArtsScreen',
        head: false,
      },
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
      empty={!itemData.loading && itemData.data.length === 0}
      popupProps={popupProps}
      loadingProps={loadingProps}
      showHeader={false}
    >
      <Divider />

      <FlatList
        keyExtractor={(_, index) => index.toString()}
        data={itemData.data}
        // onEndReachedThreshold={0.3}
        // onEndReached={() => {
        //   if (itemData.page !== -1) setItemData({ ...itemData, loadNext: true });
        // }}
        contentContainerStyle={{ 
          paddingHorizontal: 8
         }}
        ListFooterComponent={
          itemData.loadNext &&
          <Text size={12} type='medium'>Loading...</Text>
        }
        renderItem={({ item, index }) => {
          if(item.head){
            return (
              <>
                <Container paddingHorizontal={8}>
                  <Text size={14} lineHeight={18} type="medium" color={Color.black} align="left">
                    {item.group}
                  </Text>
                </Container>
                <CardFestEvent item={item} onPress={() => navigation.navigate(item.nav)}/>
              </>
            )
          }else{
            return(
              <CardFestEvent item={item}/>
            )
          }
         }
        }
      />
    </Scaffold>
  )
}

export default TabEventComming;