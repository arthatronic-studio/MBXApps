import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import {Text, useColor} from '@src/components';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';

const defaultProps = {
  name: 'Video',
  horizontal: false,
};

const CardComponentVideo = ({ item, name, horizontal }) => {
  const {Color} = useColor();
  const {width} = useWindowDimensions();
  const navigation = useNavigation();
  const user = useSelector(state => state['user.auth'].login.user);

  return (
    <View style={{width: width - (horizontal ? 16 : 0), paddingHorizontal: 0, marginBottom: 16}}>
      <TouchableOpacity
        style={{ width: '100%' }}
        onPress={() => {
          navigation.navigate('VideoDetail', { item });

          GALogEvent(name, {
            id: item.id,
            product_name: item.productName,
            user_id: user.userId,
            method: analyticMethods.view,
          });
        }}
      >
        <ImageBackground
          source={{ uri: item.image }}
          style={{ width: '100%', aspectRatio: 16 / 9 }}
          imageStyle={{borderRadius: 0}}
        >
          {/* <View style={{position: 'absolute', bottom: 8, right: 8, paddingVertical: 4, paddingHorizontal: 16, borderRadius: 4, backgroundColor: Color.text}}>
            <Text color={Color.textInput}>
              15:35
            </Text>
          </View> */}
        </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('UserProfileScreen', { userId: item.ownerId })
        }}
        style={{flexDirection:'row', padding: 8}}
      >
        <Image
          source={{ uri: item.avatar }}
          style={{flex: 1, aspectRatio: 1, borderRadius: 50, backgroundColor: Color.border}}
        />

        <View style={{flex: 9, paddingLeft: 8, justifyContent: 'space-between'}}>
          <Text
            align="left"
            type="bold"
            numberOfLines={1}
            style={{
              marginBottom: 4
            }}
          >
            {item.productName}
          </Text>
          <Text
            align="left"
            size={12}
            color={Color.gray}
            numberOfLines={2}
          >
            {item.fullname}
          </Text>
        </View>
        {/* <Entypo
            name={'dots-three-vertical'}
            color={Color.text}
            size={12}
            style={{paddingLeft: 40}}
          /> */}
      </TouchableOpacity>
    </View>
  )
};

CardComponentVideo.defaultProps = defaultProps;
export default CardComponentVideo;
