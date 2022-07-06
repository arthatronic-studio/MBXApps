import React, { useState, useEffect } from 'react';
import { View, Image, useWindowDimensions, } from 'react-native';
import Moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import ImagesPath from '../../components/ImagesPath';
import {imageContentItem} from 'assets/images/content-item';
import {
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import { shadowStyle } from '@src/styles';
import { queryAddLike } from 'src/lib/query';
import client from 'src/lib/apollo';
import { Divider, Line, Padding, Row } from 'src/styled';

const defaultProps = {
    onPress: () => {},
    numColumns: 1,
    style: {},
    showAllText: false,
};

const CardForumVertical = ({ item, numColumns, onPress, onPressDot, showAllText, style }) => {
    const [like, setLike] = useState(item.like);
    const [im_like, setImLike] = useState(item.im_like);
    const [trigger, setTrigger] = useState(false);

    const { Color } = useColor();
    const { width } = useWindowDimensions();
    const user = useSelector(state => state['user.auth'].login.user);

    useEffect(() => {
        setLike(item.like);
        setImLike(item.im_like);
    }, [item]);

    useEffect(() => {
        const timeout = trigger ? setTimeout(() => {
            fetchAddLike();
        }, 500) : null;

        return () => {
            clearTimeout(timeout);
        }
    }, [trigger]);

    const fetchAddLike = () => {
        console.log('trigger emergency');

        client.query({
            query: queryAddLike,
            variables: {
                productId: item.id
            }
        })
        .then((res) => {
          console.log(res, 'res add like');
          setTrigger(false);
        })
        .catch((err) => {
            console.log(err, 'err add like');
            setTrigger(false);
        });
    }

    const onSubmitLike = () => {
        setLike(!im_like ? like + 1 : like - 1);
        setImLike(!im_like);
        setTrigger(true);
    }

    const extraPropsText = showAllText ? {} : { numberOfLines: 3 };
    const now = Moment();
    const createdDate = parseInt(item.created_date, 10);
    const isToday = Moment(createdDate).isSame(now, 'day');
    let dateLabel = Moment(createdDate).format('DD MMM YYYY, HH:mm');
    if (isToday) {
        dateLabel = `${Moment(createdDate).fromNow()}, ${Moment(createdDate).format('HH:mm')}}`;
    }
    const iconSize = 18;

    return (
      <TouchableOpacity
        onPress={() => onPress(item)}
        style={{
          width: width - 32,
          marginTop: 16,
          borderRadius: 8,
          backgroundColor: Color.textInput,
          ...style,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
            <View style={{flex: 1, aspectRatio: 1, justifyContent: 'center'}}>
              <Image
                source={{uri: item.avatar}}
                style={{
                  width: '100%',
                  aspectRatio: 1,
                  borderRadius: 50,
                  backgroundColor: Color.primary,
                }}
              />
            </View>

            <View style={{flex: 8}}>
              <Padding horizontal={10}>
                <Row>
                  <Text type="bold" align="left" numberOfLines={2}>
                    {item.fullname}
                  </Text>
                  {/* hide admin post */}
                  {/* <Image
                                    source={ImagesPath.ranking}
                                    style={{
                                        width: 14,
                                        height: 14,
                                        marginLeft: 4,
                                    }}
                                /> */}
                </Row>

                <View style={{flexDirection: 'row', marginTop: 4}}>
                  <Text size={8} align="left">
                    {dateLabel}
                  </Text>
                </View>
              </Padding>
            </View>

            {typeof onPressDot === 'function' && (
              <TouchableOpacity
                onPress={() => onPressDot()}
                style={{
                  flex: 1,
                  aspectRatio: 1,
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  color={Color.text}
                  size={18}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{width: '100%', aspectRatio: 16 / 9, marginBottom: 8}}>
          <Image
            source={{uri: item.image}}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 8,
            }}
          />

          {/* hide overlay */}
          {/* <View style={{position: 'absolute', height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 8}} /> */}
        </View>

        <View style={{marginBottom: 4}}>
          <Text align="left" type="bold" numberOfLines={2}>
            {item.productName}
          </Text>
        </View>

        <Text align="left" size={12} type="medium" {...extraPropsText}>
          {item.productDescription}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 8,
            paddingVertical: 16,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <TouchableOpacity
              onPress={() => onSubmitLike()}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Entypo
                name={im_like ? 'arrow-bold-up' : 'arrow-bold-up'}
                size={iconSize}
                color={im_like ? Color.error : Color.gray}
              />
              {/* <Image
                            source={imageContentItem.heart_active}
                            style={{
                                width: iconSize,
                                height: iconSize,
                                resizeMode: 'contain',
                            }}
                        /> */}
              <Text
                size={14}
                align="left"
                color={Color.gray}
                style={{marginLeft: 10}}>
                {like}
              </Text>
            </TouchableOpacity>

            <Divider width={54} />
            <TouchableOpacity
              onPress={() => onSubmitLike()}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Entypo
                name={!im_like ? 'arrow-bold-down' : 'arrow-bold-down'}
                size={iconSize}
                color={!im_like ? Color.error : Color.gray}
              />
              {/* <Image
                            source={imageContentItem.heart_active}
                            style={{
                                width: iconSize,
                                height: iconSize,
                                resizeMode: 'contain',
                            }}
                        /> */}
              <Text
                size={14}
                align="left"
                color={Color.gray}
                style={{marginLeft: 10}}>
                {like}
              </Text>
            </TouchableOpacity>

            <Divider width={54} />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Image
                source={imageContentItem.comment}
                style={{
                  width: iconSize,
                  height: iconSize,
                  resizeMode: 'contain',
                }}
              />
              <Text
                size={14}
                align="left"
                color={Color.gray}
                style={{marginLeft: 10}}>
                {item.comment}
              </Text>
            </View>

            <Divider width={54} />

            <TouchableOpacity
              disabled
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Image
                source={imageContentItem.view}
                style={{
                  width: iconSize,
                  height: iconSize,
                  resizeMode: 'contain',
                }}
              />
              <Text
                size={14}
                align="left"
                color={Color.gray}
                style={{marginLeft: 10}}>
                {item.view}
              </Text>
            </TouchableOpacity>

            <Divider width={54} />

            <TouchableOpacity
              onPress={async () => {
                await Share.open({
                  url: item.share_link,
                });
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Image
                source={imageContentItem.share}
                style={{
                  width: iconSize + 2,
                  height: iconSize + 2,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Line color={Color.border} width={width} />
      </TouchableOpacity>
    );
}

CardForumVertical.defaultProps = defaultProps;
export default CardForumVertical;