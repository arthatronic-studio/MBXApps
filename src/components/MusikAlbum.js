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
      productType: accessClient.InitialCode,
      productCategory: "ALBUM_MUSIC",
      // productSubCategory: "NEW"
    };

    client.query({
      query: queryContentProduct,
      variables,
    })
    .then((res) => {
      console.log('res', res);

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
      console.log('err', err);

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
            width: width / 1.7,
            height: width / 1.7,
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
    <View>
      <View>
        <Text
          align='left'
          type='bold'
          style={{
            paddingHorizontal: 16,
            marginTop: 8,
            marginBottom: 4,
          }}
        >
          Album
        </Text>
      </View>
      <FlatList
        data={list.data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id + index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}
      />
    </View>
  );
};

MusikAlbum.defaultProps = defaultProps;
export default MusikAlbum;