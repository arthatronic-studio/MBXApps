import React, {useState, useEffect} from 'react';
import {View, Image, useWindowDimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Text, TouchableOpacity, useColor} from '@src/components';
import {shadowStyle} from '@src/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import imageAssets from 'assets/images';

import {useSelector} from 'react-redux';
import {Container, Divider} from 'src/styled';
import AccordianItem from '../AccordionItem';

const defaultProps = {
  productCategory: '',
  onPress: () => {},
  numColumns: 2,
  horizontal: true,
  style: {},
};

const CardSchedule = ({
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

  console.log(item, 'item');

  return (
    <Container
      borderWidth={1}
      padding={10}
      marginVertical={5}
      borderColor={Color.black}
      borderRadius={8}>
      <AccordianItem
        title={item.id + '. ' + item.title}
        titleStyle={{
          textAlign: 'left',
          size: 14,
          color: Color.black,
          lineHeight: 18,
          fontWeight: '500',
        }}>
        <>
          <Text size={10} lineHeight={12} color={'#3A3936'} align="left">
            {item.date}
          </Text>
          {item.desc &&
            item.desc.map((data, index) => {
              return (
                <Container
                  flex={1}
                  flexDirection="row"
                  key={index}
                  marginVertical={4}>
                  <Text align="left" size={8} color={Color.text}>
                    {'\u2B24'}
                  </Text>
                  <Divider width={8} />
                  <Container flex={1} flexDirection="column">
                    {data.title && (
                      <Text
                        align="left"
                        size={12}
                        type="medium"
                        lineHeight={16}
                        color={Color.black}>
                        {data.title}
                      </Text>
                    )}
                    {data.time && (
                      <Text
                        align="left"
                        size={10}
                        lineHeight={12}
                        color={'#ACAAA5'}>
                        {data.time}
                      </Text>
                    )}
                    {data.desc && (
                      <Text
                        align="left"
                        size={10}
                        lineHeight={12}
                        color={'#3A3936'}>
                        {data.desc}
                      </Text>
                    )}
                  </Container>
                </Container>
              );
            })}
        </>
      </AccordianItem>
    </Container>
  );
};

CardSchedule.defaultProps = defaultProps;
export default CardSchedule;
