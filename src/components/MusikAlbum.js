import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

import {Text, useColor} from '@src/components';
import client from 'src/lib/apollo';
import { queryContentProduct } from 'src/lib/query';
import { accessClient } from 'src/utils/access_client';
import { trackPlayerPlay } from 'src/utils/track-player-play';
import Config from 'react-native-config';
import PostingHeader from './Posting/PostingHeader';
import { Container } from 'src/styled';

const defaultProps = {
  
}

const MusikAlbum = ({ }) => {
  const {Color} = useColor();
  const {width} = useWindowDimensions();
  const navigation = useNavigation();

  const [list, setList] = useState({
    data: [],
    loading: false,
    message: 'error',
  });

  useEffect(() => {
    fetchContentProduct();
  }, []);

  const fetchContentProduct = () => {
    const variables = {
      page: 1,
      itemPerPage: 50,
      productType: Config.PRODUCT_TYPE,
      productCategory: "ALBUM_MUSIC",
    };

    client.query({
      query: queryContentProduct,
      variables,
    })
    .then((res) => {
      console.log('res musik album', res);

      let newData = [];
      if (res.data.contentProduct) {
        newData = res.data.contentProduct;
      }

      setList({
        ...list,
        data: newData,
        loading: false,
        message: ''
      });
    })
    .catch((err) => {
      console.log('err musik album', err);

      setList({
        ...list,
        loading: false,
        message: ''
      });
    })
  }

  const renderItem = ({ item, index }) => (
    <View
      style={{
        paddingLeft: 8,
        marginRight: 16,
      }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('AlbumMusicDetail', { item });
        }}
      >
        <ImageBackground
          source={{ uri: item.image }}
          style={{
            width: width / 2,
            height: width / 2,
          }}
          imageStyle={{
            borderRadius: 16,
          }}
        >
          <View
            style={{
              flex: 1,
              padding: 16,
              justifyContent: 'flex-end',
            }}>
            <Text
              align='left'
              style={{fontSize: 18, color: Color.textInput, fontWeight: 'bold'}}
              numberOfLines={1}
            >
              {item.productName}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );

  if (list.data.length === 0) return <View />;

  return (
    <Container paddingVertical={12}>
      <PostingHeader
        productCategory='ALBUM_MUSIC'
        title='Album Populer'
        showSeeAllText={false}
      />

      <FlatList
        data={list.data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id + index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          marginTop: 8
        }}
        contentContainerStyle={{
          paddingHorizontal: 8,
        }}
      />
    </Container>
  );
};

MusikAlbum.defaultProps = defaultProps;
export default MusikAlbum;
