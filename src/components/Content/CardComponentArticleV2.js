import React, {useState, useEffect} from 'react';
import {View, Image, useWindowDimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import {useNavigation} from '@react-navigation/native';

import {Text, TouchableOpacity, useColor} from '@src/components';
import {shadowStyle} from '@src/styles';

import Client from '@src/lib/apollo';
import {queryAddLike} from '@src/lib/query';

import {
  iconLocation,
  iconCategory,
  iconComment,
  iconLiked,
  iconLike,
} from '@assets/images/home';
import {Container, Divider, Row} from 'src/styled';
import {analyticMethods, GALogEvent} from 'src/utils/analytics';
import {useSelector} from 'react-redux';
import CardComponentYoutube from './CardComponentYoutube';
import CardComponentVideo from './CardComponentVideo';

const defaultProps = {
  productCategory: '',
  onPress: () => {},
  numColumns: 1,
  horizontal: false,
  style: {},
};

const CardComponentArticleV2 = ({
  productCategory,
  item,
  numColumns,
  onPress,
  horizontal,
  style,
}) => {
  const [like, setLike] = useState(item.like);
  const [im_like, setImLike] = useState(item.im_like);
  const [trigger, setTrigger] = useState(false);

  const {Color} = useColor();
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const user = useSelector(state => state['user.auth'].login.user);

  useEffect(() => {
    setLike(item.like);
    setImLike(item.im_like);
  }, [item]);

  useEffect(() => {
    const timeout = trigger
      ? setTimeout(() => {
          fetchAddLike();
        }, 500)
      : null;

    return () => {
      clearTimeout(timeout);
    };
  }, [trigger]);

  const fetchAddLike = () => {
    console.log('trigger emergency');

    Client.query({
      query: queryAddLike,
      variables: {
        productId: item.id,
      },
    })
      .then(res => {
        console.log(res, 'res add like');
        setTrigger(false);
      })
      .catch(err => {
        console.log(err, 'err add like');
        setTrigger(false);
      });
  };

  const onSubmitLike = () => {
    setLike(!im_like ? like + 1 : like - 1);
    setImLike(!im_like);
    setTrigger(true);
  };

  return (
    <TouchableOpacity
      onPress={async () => {
        await fetchViewProduct({productId: item.id});
        console.log('sini');
        navigation.navigate('NewsDetailV2', {code: item.code});

        GALogEvent('Artikel', {
          id: item.id,
          product_name: item.productName,
          user_id: user.userId,
          method: analyticMethods.view,
        });
      }}
      style={[
        {
          width: width / numColumns - 16,
          paddingHorizontal: 8,
          marginBottom: 16,
          flexDirection: 'row',
        },
        style,
      ]}>
      <View
        style={{
          width: '100%',
          flexDirection: 'column',
          padding: 16,
          borderRadius: 4,
          backgroundColor: Color.textInput,
          ...shadowStyle,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: '25%'}}>
            <Image
              source={{uri: item.image}}
              style={{
                width: '100%',
                aspectRatio: 1,
                borderRadius: 8,
              }}
              resizeMode="cover"
            />
          </View>
          <View style={{width: '75%', paddingLeft: 16}}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text type="bold" align="left" numberOfLines={2}>
                {item.productName}
              </Text>
            </View>
            <View style={{paddingTop: 4}}>
              <Text
                size={10}
                align="left"
                numberOfLines={3}
                style={{width: '90%', lineHeight: 15}}>
                {item.productDescription}
              </Text>
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <View style={{width: '70%'}}>
            <Text color={Color.secondary} size={10} align="left">
              {item.fullname} |{' '}
              {Moment(parseInt(item.created_date)).format('DD MMMM YYYY')}
            </Text>
          </View>
          <View style={{width: '30%'}}>
            <Text color={Color.primary} size={10} align="left">
              Baca Selengkapnya
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

CardComponentArticleV2.defaultProps = defaultProps;
export default CardComponentArticleV2;
