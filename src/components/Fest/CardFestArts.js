import {useNavigation} from '@react-navigation/native';
import Moment from 'moment';
import React, {useState, useEffect} from 'react';
import {Image, useWindowDimensions, View} from 'react-native';

import {Text, TouchableOpacity, useColor} from '@src/components';
import {shadowStyle} from '@src/styles';
import {Divider, Row, Container} from 'src/styled';
import {getSizeByRatio} from 'src/utils/get_ratio';
import Ionicons from 'react-native-vector-icons/Ionicons';

const defaultProps = {
  onPress: () => {},
  onPressBadge: () => {},
  numColumns: 1,
  horizontal: false,
  style: {},
  item: {},
};

const CardFestArts = ({
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
  // const [size, setSize] = useState({width: 0, height: 0});
  // console.log(widthImage, "hahaha");

  // useEffect(() => {
  //   Image.getSize(item.image, (width, height) => {
  //     return height;
  //   }).then((res) => console.log(res, "haha"));
  // }, []);

  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 8,
        paddingVertical: 8,
        width: width / numColumns - (horizontal ? 16 : 8),
      }}
      onPress={() => navigation.navigate('DetailArts', {item})}>
      <Image
        source={{uri: item.image}}
        style={{
          width: '100%',
          aspectRatio: 1.5,
          // height: size.height * ((width / numColumns - (horizontal ? 16 : 8)) / size.width),
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
        Gedung Perpus Spiral
      </Text>
      <Text align="left" numberOfLines={1} size={10} color={Color.textSoft}>
        Herman Hutabarat
      </Text>
      <Container flex={1} flexDirection="row" align="center">
        <Ionicons
          name={'heart'}
          color={"#ACAAA5"}
        />
        <Divider width={5}/>
        <Text size={10} color={"#ACAAA5"}>
          10.5rb Suka
        </Text>
      </Container>
    </TouchableOpacity>
  );
};

CardFestArts.defaultProps = defaultProps;
export default CardFestArts;
