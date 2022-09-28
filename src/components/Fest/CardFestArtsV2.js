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

const CardFestArtsV2 = ({
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
      onPress={() => navigation.navigate('FestArtsDetail', {item: item})}
      style={{
        marginHorizontal: 8,
        marginVertical: 10,
        width: width - 32,
        borderWidth: 1,
      }}>
      <Image
        source={item.imageBanner}
        style={{
          width: width - 32,
          height: (width - 32) * 0.7,
          resizeMode: 'cover',
        }}
      />
      <Container padding={16}>
        <Text
          numberOfLines={3}
          align="left"
          size={14}
          lineHeight={22}
          color={Color.black}>
          {item.desc}
        </Text>
        <Divider height={10}/>
        <TouchableOpacity
          onPress={() => navigation.navigate('FestArtsDetail', {item: item})}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            size={12}
            lineHeight={16}
            type="medium"
            color={Color.primaryDark}>
            Selengkapnya
          </Text>
          <Divider width={10} />
          <Ionicons name="arrow-forward" size={16} color={Color.primaryDark} />
        </TouchableOpacity>
      </Container>
    </TouchableOpacity>
  );
};

CardFestArtsV2.defaultProps = defaultProps;
export default CardFestArtsV2;
