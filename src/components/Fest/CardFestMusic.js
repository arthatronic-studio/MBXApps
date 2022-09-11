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

const CardFestMusic = ({
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

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('FestMusicPlayer')}
      style={{
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Image
        source={{uri: item.image}}
        style={{
          width: '14%',
          aspectRatio: 1,
          borderRadius: 8,
        }}
        resizeMode="cover"
      />

      <Divider width={10}/>
      <Container flexDirection="column" flex={1}>
        <Text size={14} align='left' color={Color.text} type="medium" numberOfLines={1}>
          Aroma Roket Senja
        </Text>
        <Text size={10} align="left" numberOfLines={1}>
          Besok Ngoding Band
        </Text>
        
      </Container>

    </TouchableOpacity>
  );
};

CardFestMusic.defaultProps = defaultProps;
export default CardFestMusic;
