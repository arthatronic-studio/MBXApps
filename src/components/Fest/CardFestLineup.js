import React, {useState, useEffect} from 'react';
import {View, Image, useWindowDimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Text, TouchableOpacity, useColor} from '@src/components';
import {shadowStyle} from '@src/styles';
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

const CardFestLineup = ({
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
  const variable = {image: imageAssets.lineupContent}

  return (
    <TouchableOpacity
      onPress={() => onPress(variable)}
      style={{
        marginVertical: 10,
        marginHorizontal: 8,
        width: width / numColumns - (horizontal ? 32 : 24),
        borderWidth: 1,
        borderRadius: 8,
      }}>
      <Image
        source={imageAssets.lineupContent}
        style={{
          width: '100%',
          // borderTopLeftRadius: 8,
          // borderTopRightRadius: 8,
          resizeMode: 'cover',
        }}
      />
      <Divider height={16} />
      <Container 
        flex={1}
        flexDirection="column"
        paddingHorizontal={10}
        >
          <Text align="left" size={14} type="medium" color={Color.black} lineHeight={18}>
            DJ Raggil Suliza
          </Text>
          <Text align="left" size={10} color={"#3A3936"} lineHeight={12}>
            Sun, 25 Sep 2022
          </Text>
          <Text align="left" size={10} color={"#3A3936"} lineHeight={12}>
            14:00 - 14:45
          </Text>
          <Text align="left" size={10} color={"#3A3936"} lineHeight={12}>
            Live House
          </Text>
          <Divider height={16}/>
      </Container>
    </TouchableOpacity>
  );
};

CardFestLineup.defaultProps = defaultProps;
export default CardFestLineup;
