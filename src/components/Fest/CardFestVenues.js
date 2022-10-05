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
        borderWidth: 1,
        marginVertical: 8,
        borderRadius: 8,
        marginHorizontal: 8,
      }}>
      <Container
        width={'100%'}
        height={(width - 32) * 0.55}
      >
        <Image
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
          source={{uri: item.venues_image[0]}}
        />
      </Container>
      <Container
        flex={1}
        flexDirection="row"
        paddingHorizontal={10}
        paddingVertical={16}
        align="center">
        <Container flex={1} flexDirection="column">
          <Text align="left" size={16} type="medium" lineHeight={20} color={Color.black}>
            {item.name}
          </Text>
          <Text align="left" size={10} color={"#ACAAA5"} lineHeight={12}>
            Venues
          </Text>
        </Container>
        <Container
          backgroundColor={item.entrance == 2 ? "#E6CFA3" : '#FCD100'}
          borderWidth={1}
          borderColor={item.entrance == 2 ? "#644B1B" : '#1D1D1B'}
          padding={9}
          borderRadius={8}
        >
          <Text color={item.entrance == 2 ? "#644B1B" : '#1D1D1B'} size={11} lineHeight={14} type="medium">
            {item.entrance === 1 ? 'Gratis' : 'Tiket'}
          </Text>
        </Container>
      </Container>
    </TouchableOpacity>
  );
};

CardFestVenues.defaultProps = defaultProps;
export default CardFestVenues;
