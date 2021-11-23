
import React, { useState, useEffect } from 'react';
import { View, FlatList, BackHandler, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import Styled from 'styled-components';
import Moment from 'moment';
import {
  Text,
  Header,
  TouchableOpacity,
  useColor
} from '@src/components';

import Client from '@src/lib/apollo';
import { queryLike } from '@src/lib/query';

const MainView = Styled(SafeAreaView)`
  flex: 1;
`;

const ShowAllFromProfile = ({ navigation, route }) => {
    const { title } = route.params;

    const [itemData, setItemData] = useState({
      data: [],
      loading: true,
      page: 0,
      loadNext: false,
    });

    const { Color } = useColor();

    useEffect(() => {
      if (itemData.page !== -1) {
        fetchListLike();
      }
      
      if (route.params && route.params.popToTop) {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      }

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      }
    }, [itemData.loadNext])

    const handleBackPress = () => {
      navigation.popToTop();
      return true;
    }

    const onBack = () => {
      if (route.params && route.params.popToTop) {
          navigation.popToTop();
      } else {
          navigation.pop();
      }
    }

    const fetchListLike = () => {
      Client.query({
        query: queryLike,
        variables: {
          page: itemData.page + 1,
          itemPerPage: 10,
        }
      })
      .then((res) => {
        // console.log(res, 'ressss');

        setStateItemData({
          data: itemData.data.concat(res.data.contentLike),
          loading: false,
          page: res.data.contentLike.length === 10 ? itemData.page + 1 : -1,
          loadNext: false,
        });
      })
      .catch((err) => {
        console.log(err, 'errrrr');
        
        setStateItemData({
          loading: false,
          page: -1,
          loadNext: false,
        });
      })
    }

    const setStateItemData = (obj) => {
      setItemData({
        ...itemData,
        ...obj
      });
    }

    return (
        <MainView style={{backgroundColor: Color.theme}}>
            <Header
              title={title}
              onPressLeftButton={() => {
                onBack();
              }}
            />
            
            {itemData.loading ?
              <ActivityIndicator size='large' color={Color.primary} style={{marginTop: 24}} />
            :
              <FlatList
                keyExtractor={(item, index) => item.toString() + index}
                data={itemData.data}
                contentContainerStyle={{paddingHorizontal: 16, paddingTop: 8}}
                renderItem={({ item }) =>
                  <View style={{height: 70, width: '100%', marginBottom: 8, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Image
                      source={{ uri: item.image }}
                      style={{width: 70, height: 70, marginRight: 8, borderRadius: 4, backgroundColor: Color.border}}
                    />
                    <View style={{alignItems: 'flex-start'}}>
                      <Text>{item.fullname}</Text>
                      <Text size={10}>{Moment(parseInt(item.likeDate)).format('ddd, DD/MM/YYYY')}</Text>
                    </View>
                  </View>
                }
                onEndReached={() => itemData.page !== -1 && setStateItemData({ loadNext: true })}
                onEndReachedThreshold={0.3}
              />
            }
        </MainView>
    )
}

export default ShowAllFromProfile;