import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  ImageBackground,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Text, useColor} from '@src/components';
import ImagesPath from 'src/components/ImagesPath';
import {Divider} from 'src/styled';
import { initialItemState } from 'src/utils/constants';
import client from 'src/lib/apollo';
import { queryContentProduct } from 'src/lib/query';
import Config from 'react-native-config';

const defaultProps = {
  title: '',
  onPress: () => {},
}

const VideoCardList = ({ title, onPress, productCategory, productSubCategory }) => {
  const {Color} = useColor();
  const {width} = useWindowDimensions();

  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(true);
  const [itemData, setItemData] = useState(initialItemState);

  useEffect(() => {
    const variables = {
      productType: Config.PRODUCT_TYPE,
    };

    if (productCategory) {
      variables['productCategory'] = productCategory;
    }

    if (productSubCategory) {
      variables['productSubCategory'] = productSubCategory;
    }

    console.log('variables', variables);

    client.query({
      query: queryContentProduct,
      variables,
    })
    .then((res) => {
      console.log('res video', res);

      const data = res.data.contentProduct;
      let newData = [];

      if (data) {
        newData = data;
      }

      setItemData({
        ...itemData,
        data: newData,
        loading: false,
      });
    })
    .catch((err) => {
      console.log('err video', err);

      setItemData({
        ...itemData,
        loading: false,
      });
    });
  }, []);

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <View style={{width: width - 32, paddingHorizontal: 8}}>
        <TouchableOpacity
          style={{ width: '100%' }}
          onPress={() => onPress(item)}
        >
          <ImageBackground
            source={{ uri: item.image }}
            style={{ width: '100%', aspectRatio: 16 / 9 }}
            imageStyle={{borderRadius: 8}}
          >
            {/* <View style={{position: 'absolute', bottom: 8, right: 8, paddingVertical: 4, paddingHorizontal: 16, borderRadius: 4, backgroundColor: Color.text}}>
              <Text color={Color.textInput}>
                15:35
              </Text>
            </View> */}
          </ImageBackground>
        </TouchableOpacity>

        <View style={{flexDirection:'row', paddingTop: 8}}>
          <Image
            source={{ uri: item.avatar }}
            style={{flex: 1, aspectRatio: 1, borderRadius: 50}}
          />

          <View style={{flex: 9, paddingLeft: 8, justifyContent: 'space-between'}}>
            <Text
              align="left"
              type="bold"
              numberOfLines={1}
              style={{
                marginBottom: 4
              }}
            >
              {item.productName}
            </Text>
            <Text
              align="left"
              size={12}
              color={Color.gray}
              numberOfLines={2}
            >
              {item.productDescription}
            </Text>
          </View>
          {/* <Entypo
              name={'dots-three-vertical'}
              color={Color.text}
              size={12}
              style={{paddingLeft: 40}}
            /> */}
        </View>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: Color.primary, paddingVertical: 16 }}>
      <Text
        align="left"
        type="bold"
        size={18}
        style={{
          paddingLeft: 16,
        }}>
        {title}
      </Text>

      <FlatList
        keyExtractor={(item, index) => item.id + index.toString()}
        data={itemData.data}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 16,
          paddingHorizontal: 8,
        }}
        renderItem={renderItem}
      />
    </View>
  );
};

VideoCardList.defaultProps = defaultProps;
export default VideoCardList;
