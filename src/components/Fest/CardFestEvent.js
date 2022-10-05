import React, {useState, useEffect} from 'react';
import {View, Image, useWindowDimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Text, TouchableOpacity, useColor} from '@src/components';
import {shadowStyle} from '@src/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import imageAssets from 'assets/images';

import {useSelector} from 'react-redux';
import {Container, Divider} from 'src/styled';

const defaultProps = {
  productCategory: '',
  onPress: () => {},
  numColumns: 2,
  horizontal: true,
  style: {},
};

const CardFestEvent = ({
  productCategory,
  item,
  numColumns,
  onPress,
  horizontal,
  style,
}) => {
  const {Color} = useColor();
  const navigation = useNavigation();
  const {width} = useWindowDimensions();

  console.log(item, "item");

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(item.nav, {item: item})
      }}
      style={{
        borderWidth: 1,
        marginVertical: 8,
        borderRadius: 8,
        marginHorizontal: 8,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
      }}>
        <Image
          style={{
            width: '22%',
            resizeMode: 'cover',
            aspectRatio: 1,
          }}
          source={{ uri: item.file }}
        />
        <Divider width={10}/>
        <Container flex={1}>
          <Text align="left" size={16} lineHeight={20} color={Color.black} type="medium">
            {item.name}
          </Text>
          <Divider height={8}/>
          <Text align="left" color="#3A3936" size={10} lineHeight={12}>
            {item.date}
          </Text>
          <Text align="left" color="#3A3936" size={10} lineHeight={12}>
            {item.time}
          </Text>
        </Container>
    </TouchableOpacity>
  );
};

CardFestEvent.defaultProps = defaultProps;
export default CardFestEvent;
