import React, {useCallback, useState, useRef} from 'react';
import {View, Image, TouchableOpacity, useWindowDimensions} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import {useNavigation} from '@react-navigation/native';
import { FormatMoney } from 'src/utils';

import {Text, useColor} from '@src/components';
import {useSelector} from 'react-redux';
import { Divider, Row } from 'src/styled';
import Moment from 'moment';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';


const defaultProps = {
  item: {},
  numColumns: 1,
  horizontal: false,
  style: {},
  category: ''
};

const CardComponentEventV2 = ({item, numColumns, horizontal, style, category}) => {
  const {Color} = useColor();
  const {width} = useWindowDimensions();
  const user = useSelector(state => state['user.auth'].login.user);
  const navigation = useNavigation();

  // let eventDate = !isNaN(parseInt(item.date))
  //   ? parseInt(item.date)
  //   : null;
  // if (!eventDate)
  //   eventDate = !isNaN(parseInt(item.updated_date))
  //     ? parseInt(item.updated_date)
  //     : null;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('EventDetail', {item});

        GALogEvent('Event', {
          id: item.id,
          product_name: item.name,
          user_id: user.userId,
          method: analyticMethods.view,
        });
      }}
      style={[
        {
          width: width / numColumns - (horizontal ? 32 : 32),
          marginBottom: 16,
          borderRadius: 8,
          elevation: 2,
          backgroundColor: Color.theme,
          alignSelf: 'center',
        },
        style,
      ]}>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={{uri: item.images ? item.images[0] : ''}}
          style={{
            width: '35%',
            aspectRatio: 10 / 16,
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
            backgroundColor: Color.border,
          }}
        />
        <View
          style={{
            width: '65%',
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
            backgroundColor: Color.textInput,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 70,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 16,
                borderWidth: 1,
                borderRadius: 20,
                borderColor: '#2C70F7',
                backgroundColor: '#2C70F766',
              }}>
              <Text size={8} color={'#2C70F7'}>
                {item.category}
              </Text>
            </View>

            {/* <Ionicons name='bookmark-outline' size={20} color={Color.primary} /> */}
          </View>

          <View style={{paddingTop: 8}}>
            <Text
              type="bold"
              align="left"
              numberOfLines={3}
              style={{lineHeight: 20}}>
              {item.name}
            </Text>
            <Divider height={12} />
            <Row>
              <AntDesign
                name={'clockcircleo'}
                color={Color.secondary}
                size={9}
                style={{marginRight: 8}}
              />
                <Text
                  size={10}
                  color={Color.secondary}
                  align="left"
                  numberOfLines={2}>
                  {Moment(item.date).format('DD MMM YYYY')}
                </Text>
            </Row>
            <Divider height={3} />
            <Row>
              <AntDesign
                name={'user'}
                size={10}
                color={Color.secondary}
                style={{marginRight: 7}}
              />
              <Text
                size={10}
                color={Color.secondary}
                align="left"
                numberOfLines={2}>
                {item.author}
              </Text>
            </Row>
            <Divider height={12} />
            {/* Difference */}
            {category == 'MyEvent' ? (
              <>
                <Row>
                  <View style={{width: '50%'}}>
                    <Text
                      size={8}
                      color={Color.secondary}
                      align="left"
                      numberOfLines={2}
                      style={{marginBottom: 2}}>
                      Tiket Dimiliki
                    </Text>
                    <Text type="bold" align="left" numberOfLines={3}>
                      {item.tickets ? item.tickets.quota : ''} Tiket
                    </Text>
                  </View>
                  <Pressable
                    style={{
                      backgroundColor: Color.primary,
                      width: 110,
                      borderRadius: 25,
                      height: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 11,
                        color: Color.textInput,
                        fontWeight: 'bold',
                      }}>
                      Lihat Detail
                    </Text>
                  </Pressable>
                </Row>
              </>
            ) : (
              <>
                <Text
                  size={8}
                  color={Color.secondary}
                  align="left"
                  numberOfLines={2}
                  style={{marginBottom: 2}}>
                  Mulai dari
                </Text>
                <Row>
                  <Text type="bold" align="left" numberOfLines={3}>
                    {item.discountPrice ? FormatMoney.getFormattedMoney(item.discountPrice) : FormatMoney.getFormattedMoney(item.startPrice)}
                  </Text>
                  {item.discountPrice !== null &&
                    <Text
                      style={{
                        fontSize: 8,
                        color: Color.secondary,
                        marginLeft: 5,
                        textDecorationLine: 'line-through',
                      }}>
                      {FormatMoney.getFormattedMoney(item.startPrice)}
                    </Text>
                  }
                </Row>
              </>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

CardComponentEventV2.defaultProps = defaultProps;
export default CardComponentEventV2;
