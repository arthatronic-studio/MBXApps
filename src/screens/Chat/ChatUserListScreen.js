
import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, BackHandler, Image, ActivityIndicator, ImageBackground } from 'react-native';
import Styled from 'styled-components';
import Moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import Text from '@src/components/Text';
import Color from '@src/components/Color';
import Header from '@src/components/Header';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';

import Client from '@src/lib/apollo';
import { queryLike } from '@src/lib/query';

const MainView = Styled(View)`
    width: 100%;
    height: 100%;
`;

const ChatUserListScreen = ({ navigation, route }) => {

    const [itemData, setItemData] = useState({
      data: [],
      loading: true,
      page: 0,
      loadNext: false,
    });
    const [selected, setSelected] = useState([]);

    useEffect(() => {
      if (itemData.page !== -1) {
        fetchContentLike();
      }
    }, [itemData.loadNext])

    const compareData = (arr) => {
        let obj = {};
        let newData = [];

        for ( let i=0; i < arr.length; i++ ) {
            obj[arr[i]['userId']] = arr[i];
        }
        
        for ( let key in obj ) {
            newData.push(obj[key]);
        }

        return newData;
    }

    const fetchContentLike = () => {
      Client.query({
        query: queryLike,
        variables: {
          page: itemData.page + 1,
          itemPerPage: 10,
        }
      })
      .then((res) => {
        // console.log(res, 'ressss');

        const data = res.data.contentLike;
        const newData = compareData(itemData.data.concat(data));

        setStateItemData({
          data: newData,
          loading: false,
          page: data.length === 10 ? itemData.page + 1 : -1,
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

    const onSelected = (item) => {
        setItemData({ ...itemData, loading: true });

        const idxOf = selected.length > 0 ? selected.indexOf(item) : -1;

        const newSelected = selected;
        if (idxOf === -1) {
            newSelected.push(item);
        } else {
            newSelected.splice(idxOf, 1);
        }

        setSelected(newSelected);
        setItemData({ ...itemData, loading: false });
    }
    
    const onPress = (item) => {
      if (selected.length > 0) {
        onSelected(item);
      } else {
        navigation.navigate('ChatDetailScreen', {
          roomId: null,
          selected: [item],
        });
      }
    }
    
    return (
        <MainView>
            <Header
              title='Buat Room Chat'
              actions={selected.length > 0 ? 
                <TouchableOpacity
                  style={{flex: 1, justifyContent: 'center', paddingHorizontal: 16}}
                  onPress={() => {
                    navigation.navigate('ChatDetailScreen', {
                      roomId: null,
                      selected,
                    });
                  }}
                >
                  <MaterialIcons name='send' color={Color.secondary} size={22} />
                </TouchableOpacity> : null
              }
            />
            
            {itemData.loading ?
                <ActivityIndicator size='large' color={Color.primary} style={{marginTop: 24}} />
              :
                <FlatList
                  keyExtractor={(item, index) => item.toString() + index}
                  data={itemData.data}
                  contentContainerStyle={{paddingHorizontal: 16, paddingTop: 8}}
                  renderItem={({ item }) => {
                      const isSelected = selected.filter((e) => e.userId === item.userId)[0];

                      if (isSelected) {
                          return (
                            <TouchableOpacity onPress={() => onPress(item)} onLongPress={() => onSelected(item)} style={{height: 70, width: '100%', borderRadius: 4, backgroundColor: Color.theme, marginBottom: 8, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                                <ImageBackground
                                    source={{ uri: item.image }}
                                    style={{width: 50, height: 50, borderRadius: 25, marginRight: 8, backgroundColor: Color.border}}
                                    imageStyle={{ borderRadius: 30}}
                                >
                                  <MaterialIcons name='check-circle' color={Color.success} size={22} />
                                </ImageBackground>
                                <View style={{height: 60, alignItems: 'flex-start', justifyContent: 'space-around'}}>
                                    <Text size={12} type='semibold' numberOfLines={1}>{item.fullname}</Text>
                                    {/* <Text size={10}>Available</Text> */}
                                </View>
                            </TouchableOpacity>
                          )
                      }

                      return (
                        <TouchableOpacity onPress={() => onPress(item)} onLongPress={() => onSelected(item)} style={{height: 70, width: '100%', marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image
                                source={{ uri: item.image }}
                                style={{width: 50, height: 50, borderRadius: 25, marginRight: 8, backgroundColor: Color.border}}
                            />
                            <View style={{height: 60, alignItems: 'flex-start', justifyContent: 'space-around'}}>
                                <Text size={12} type='semibold' numberOfLines={1}>{item.fullname}</Text>
                                {/* <Text size={10}>Available</Text> */}
                            </View>
                          </View>
                        </TouchableOpacity>
                      )
                  }}
                  onEndReached={() => itemData.page !== -1 && setStateItemData({ loadNext: true })}
                  onEndReachedThreshold={0.3}
                />
            }
        </MainView>
    )
}

export default ChatUserListScreen;