import {useNavigation} from '@react-navigation/native';
import Moment from 'moment';
import React, {useState, useEffect} from 'react';
import {Image, useWindowDimensions, View} from 'react-native';

import {Text, TouchableOpacity, useColor} from '@src/components';
import {shadowStyle} from '@src/styles';
import {Divider, Row, Container} from 'src/styled';

const defaultProps = {
  onPress: () => {},
  onPressBadge: () => {},
  numColumns: 1,
  horizontal: false,
  style: {},
  item: {},
};

const CardFestLiterature = ({
  item,
  numColumns,
  onPress,
  onPressBadge,
  horizontal,
  style,
}) => {
  const [trigger, setTrigger] = useState(false);

  const {Color} = useColor();
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  console.log(horizontal, 'hori');

  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 8,
        paddingVertical: 8,
        width: width / numColumns - (horizontal ? 16 : 8),
      }}
      onPress={() => onPress()}>
      <Image
        source={{uri: item.image}}
        style={{
          width: '100%',
          aspectRatio: 0.7,
          resizeMode: 'cover',
          borderRadius: 8,
        }}
      />
    </TouchableOpacity>
  );
};

CardFestLiterature.defaultProps = defaultProps;
export default CardFestLiterature;
