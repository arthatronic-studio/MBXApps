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

const MusikTerbaru = ({ }) => {
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
      productCategory: "NEWEST_MUSIC",
    };

    client.query({
      query: queryContentProduct,
      variables,
    })
    .then((res) => {
      console.log('res musik terbaru', res);

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
      console.log('err musik terbaru', err);

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
        marginRight: 8,
      }}>
      <TouchableOpacity
        onPress={() => {
          trackPlayerPlay(list.data, index);
          navigation.navigate('MusicPlayerScreen');
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
            <View
              style={{
                backgroundColor: Color.error,
                width: 55,
                height: 20,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                align='left'
                style={{fontSize: 10, color: Color.theme}}
              >
                Baru
              </Text>
            </View>
            <Text
              align='left'
              style={{fontSize: 18, color: Color.textInput, fontWeight: 'bold'}}
              numberOfLines={1}
            >
              {item.productName}
            </Text>
            <Text
              align='left'
              style={{fontSize: 10, color: Color.textInput, fontWeight: 'bold'}}
              numberOfLines={1}
            >
              {item.productDescription}
            </Text>
          </View>

          <View
            style={{
              position: 'absolute',
              alignSelf: 'center',
              marginVertical: '35%',
            }}>
            <Entypo
              name={'controller-play'}
              size={70}
              style={{
                color: Color.textInput,
              }}
            />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );

  if (list.data.length === 0) return <View />;

  return (
    <Container paddingVertical={12}>
      <PostingHeader
        productCategory='NEWEST_MUSIC'
        title='Musik Terbaru'
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

MusikTerbaru.defaultProps = defaultProps;
export default MusikTerbaru;
