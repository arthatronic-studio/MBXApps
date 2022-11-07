import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useColor, Text, Header} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ListContentProductV2 from 'src/components/Content/ListContentProductV2';
import ListContenFest from 'src/components/Fest/ListContenFest';
import {Modalize} from 'react-native-modalize';
import {Container, Divider} from 'src/styled';
import imageAssets from 'assets/images';
import {fetchFestLocation} from 'src/api-rest/fest/fetchFestLocation';
import { useIsFocused } from '@react-navigation/native';
import CardContentFest from 'src/components/Fest/CardContentFest';

const ShowAllArea = ({navigation, route}) => {
  const {title} = route.params;
  const user = useSelector(state => state['user.auth'].login.user);
  const {Color} = useColor();
  const modalRef = useRef();
  const [selected, setSelected] = useState(false);
  const {width} = useWindowDimensions();
  const isFocused = useIsFocused();
  const [itemData, setItemData] = useState({
    data: [],
    loading: true,
    message: '',
    nextUrl: null,
    loadNext: false,
    refresh: false,
  });

  const fetchData = async first => {
    let params = itemData.nextUrl
      ? itemData.nextUrl
      : '?type=experience&perPage=10';
    const result = await fetchFestLocation(params);
    if (result.status) {
      console.log(result, 'resss');
      setItemData({
        ...itemData,
        data: first ? result.data : itemData.data.concat(result.data),
        nextUrl: result.nextUrl ? `?${result.nextUrl.split('?')[1]}` : null,
        loading: false,
        loadNext: false,
        message: result.message,
        refresh: false,
      });
    }
  };

  console.log(itemData, 'dataaa');

  useEffect(() => {
    if (isFocused) {
      fetchData(true);
    }
  }, [isFocused]);

  useEffect(() => {
    if (itemData.loadNext && itemData.nextUrl != null) {
      fetchData(false);
    }
  }, [itemData.loadNext]);

  return (
    <Scaffold
      header={
        <Header centerTitle={false} title={title} iconLeftButton="arrow-left" />
      }>
      <FlatList
        keyExtractor={(item, index) => item.toString() + index}
        data={itemData.data}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 8,
        }}
        onEndReachedThreshold={0.3}
        onEndReached={() => setItemData({...itemData, loadNext: true})}
        renderItem={({item, index}) => {
          return (
            <CardContentFest
              productCategory="AREA"
              item={item}
              horizontal={false}
              numColumns={2}
            />
          );
        }}
      />
    </Scaffold>
  );
};

export default ShowAllArea;
