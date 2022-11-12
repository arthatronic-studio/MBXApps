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

const CardFestVenues = ({
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

  console.log(item, "iteeem");

  return (
    <TouchableOpacity
      onPress={() => {navigation.navigate('VenuesDetail', {item: item})}}
      style={{
        backgroundColor: Color.white,
        marginVertical: 8,
        marginHorizontal: 8,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
      }}>
      <Container
        width={width * 0.32}
        height={width * 0.32}
      >
        <Image
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
          }}
          source={{uri: item.venues_image[0]}}
        />
      </Container>
      <Divider height={12}/>
      <Container flex={1} flexDirection="column">
        <Text align="left" size={11} color={Color.black} type="medium" lineHeight={15}>
          Venue
        </Text>
        <Text align="left" size={18} type="medium" lineHeight={21.6} color={Color.primary}>
          {item.name}
        </Text>
        <Text align="left" size={11} color={"#797979"} type="medium" lineHeight={15}>
          Max {item.max_people} People
        </Text>
        <Text align="left" size={11} color={"#797979"} type="medium" lineHeight={15}>
          {item.time_from} - {item.time_to}
        </Text>

      </Container>
    </TouchableOpacity>
  );
};

CardFestVenues.defaultProps = defaultProps;
export default CardFestVenues;
