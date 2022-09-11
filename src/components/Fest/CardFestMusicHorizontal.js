import {useNavigation} from '@react-navigation/native';
import Moment from 'moment';
import React, {useState, useEffect} from 'react';
import {Image, useWindowDimensions, View} from 'react-native';

import {Text, TouchableOpacity, useColor} from '@src/components';
import {shadowStyle} from '@src/styles';
import {Divider, Row, Container} from 'src/styled';
import {getSizeByRatio} from 'src/utils/get_ratio';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {trackPlayerPlay} from 'src/utils/track-player-play';

const defaultProps = {
  onPress: () => {},
  onPressBadge: () => {},
  numColumns: 1,
  horizontal: false,
  style: {},
  item: {},
};

const CardFestMusicHorizontal = ({
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
      style={{
        paddingHorizontal: 8,
        paddingVertical: 8,
        width: width / numColumns - (horizontal ? 16 : 8),
      }}
      onPress={() => {
        trackPlayerPlay(
          [
            {
              id: 'haha1',
              url: 'http://panel.dev.tribesocial.id/storage/1650210335.mp3',
              // type: 'default',
              title: 'test lagu1',
              // album: play.productDescription,
              artist: 'haha1',
              artwork: item.image,
            },
            {
              id: 'haha2',
              url: 'http://panel.dev.tribesocial.id/storage/1650210335.mp3',
              // type: 'default',
              title: 'test lagu2',
              // album: play.productDescription,
              artist: 'haha2',
              artwork: item.image,
            },
          ],
          1,
        );
        navigation.navigate('FestMusicPlayer', {item});
      }}>
      <Image
        source={{uri: item.image}}
        style={{
          width: '100%',
          aspectRatio: 1,
          resizeMode: 'cover',
          borderRadius: 8,
        }}
        resizeMethod={'auto'}
      />
      <Divider height={8} />
      <Text
        align="left"
        numberOfLines={1}
        size={14}
        type="medium"
        color={Color.black}>
        Aroma Roket Senja
      </Text>
      <Text align="left" numberOfLines={1} size={10} color={Color.textSoft}>
        Besok Ngoding Band
      </Text>
      <Container flex={1} flexDirection="row" align="center">
        <Ionicons name={'heart'} color={'#ACAAA5'} />
        <Divider width={5} />
        <Text size={10} color={'#ACAAA5'}>
          10.5rb Suka
        </Text>
      </Container>
    </TouchableOpacity>
  );
};

CardFestMusicHorizontal.defaultProps = defaultProps;
export default CardFestMusicHorizontal;
