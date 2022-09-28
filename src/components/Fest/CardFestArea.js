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

const CardFestArea = ({
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
      onPress={() => navigation.navigate('AreaDetail', {item: item})}
      style={{
        marginVertical: 10,
        marginHorizontal: 8,
        width: width / numColumns - (horizontal ? 32 : 24),
        borderWidth: 1,
        borderRadius: 8,
      }}>
      <Container
        width={width / numColumns - (horizontal ? 32 : 24)}
        height={width / numColumns - (horizontal ? 32 : 24)}>
        <Image
          source={imageAssets.mBlocMarketJambi}
          style={{
            width: '100%',
            height: '100%',
            // borderTopLeftRadius: 8,
            // borderTopRightRadius: 8,
            resizeMode: 'cover',
          }}
        />
      </Container>
      <Divider height={16} />
      <Container flex={1} flexDirection="column" paddingHorizontal={10}>
        <Text
          align="left"
          size={16}
          type="medium"
          color={Color.black}
          lineHeight={20}>
          mbloc Market
        </Text>
        <Text align="left" size={10} color={'#ACAAA5'} lineHeight={12}>
          Experience Area
        </Text>
        <Divider height={16} />
      </Container>
    </TouchableOpacity>
  );
};

CardFestArea.defaultProps = defaultProps;
export default CardFestArea;
