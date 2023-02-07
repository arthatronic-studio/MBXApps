import React, {useState, useEffect} from 'react';
import {View, Image, useWindowDimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Text, TouchableOpacity, useColor, Button} from '@src/components';

import {FormatMoney} from 'src/utils';
import imageAssets from 'assets/images';
import {Divider} from 'src/styled';

const defaultProps = {
  productCategory: '',
  onPress: () => {},
  numColumns: 1,
  horizontal: false,
  style: {},
};

const CardPicuWujudkan = ({item, onPress, numColumns, horizontal, category}) => {
  const {Color} = useColor();
  const navigation = useNavigation();
  const {width} = useWindowDimensions();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('DetailPicuWujudkanScreen', {item: item, category:category});
      }}
      style={{
        // width: width * 0.65,
        width: width / numColumns - (horizontal ? width * 0.35 : 24),
        marginHorizontal: 8,
        marginTop: 12,
      }}>
      <View
        style={{
          width: '100%',
          backgroundColor: Color.theme,
        }}>
        <View
          style={{
            width: '100%',
            height: width * 0.65,
          }}>
          <Image
            source={
              item.images[0] ? {uri: item.images[0]} : imageAssets.imageBlank
            }
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
            }}
          />
        </View>
        <Divider height={8} />
        <Text align="left" size={18} type="medium" lineHeight={20.4}>
          {item.title}
        </Text>
        <Divider height={8} />
        {/* <Text align="left" size={10} lineHeight={12} type="semibold">
          Artikel
        </Text>
        <Text align="left" size={10} lineHeight={12} type="medium">
          {item.created_at}
        </Text>
        <Text align="left" size={10} lineHeight={12} type="medium">
          by {item.publisher}
        </Text> */}
      </View>
    </TouchableOpacity>
  );
};

CardPicuWujudkan.defaultProps = defaultProps;
export default CardPicuWujudkan;
