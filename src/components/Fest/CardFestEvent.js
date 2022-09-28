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
  const user = useSelector(state => state['user.auth'].login.user);
  const variable = {image: imageAssets.lineupContent};

  return (
    <TouchableOpacity
      onPress={() => onPress()}
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
          source={imageAssets.bookFestival1}
        />
        <Divider width={10}/>
        <Container flex={1}>
          <Text align="left" size={16} lineHeight={20} color={Color.black} type="medium">
            Mbloc Music Week Festival
          </Text>
          <Divider height={8}/>
          <Text align="left" color="#3A3936" size={10} lineHeight={12}>
            25 Sep - 02 Okt 2022
          </Text>
          <Text align="left" color="#3A3936" size={10} lineHeight={12}>
            10:00 - 22:10
          </Text>
        </Container>
    </TouchableOpacity>
  );
};

CardFestEvent.defaultProps = defaultProps;
export default CardFestEvent;
