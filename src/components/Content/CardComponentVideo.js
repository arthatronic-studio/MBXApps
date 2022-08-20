import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { Text, useColor } from '@src/components';
import YoutubePlayer from 'react-native-youtube-iframe';
import { getSizeByRatio } from 'src/utils/get_ratio';
import { useSelector } from 'react-redux';
import { analyticMethods } from 'src/utils/analytics';

const defaultProps = {
  name: 'Live',
};

const CardComponentYoutube = ({ item, name }) => {
  const { Color } = useColor();
  const { width } = useWindowDimensions();
  const user = useSelector(state => state['user.auth'].login.user);
  const navigation = useNavigation();

  const [beforePlay, setBeforePlay] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [isError, setIsError] = useState(false);

  const youtubeRef = useRef();

  const onStateChange = useCallback(state => {
    console.log('state', state);
    if (state === 'playing') {
      setBeforePlay(false);
      setPlaying(true);
    }
    else if (state === 'ended') {
      setBeforePlay(true);
      setPlaying(false);
    }
    else if (state === 'paused') {
      setPlaying(false);
    } else {
      GALogEvent(name, {
        id: item.id,
        product_name: item.productName,
        user_id: user.userId,
        method: analyticMethods.view,
      });
    }
  }, []);

  let videoId = '';
  if (item.videoFilename) {
    const urlSplit = item.videoFilename.split('v=')[1];
    videoId = urlSplit;
  } else {
    videoId = 'Oo2zo7YWulI';
  }

  console.log('videoId', videoId);

  return (
    <View
      style={{ paddingHorizontal: 0, marginBottom: 16 }}
    >
      <View
        style={{
          backgroundColor: Color.border,
          width: width,
          aspectRatio: 16 / 9
        }}
      >
        <View style={{ width: '100%', height: '100%', position: 'absolute', justifyContent: 'center' }}>
          <Image
            source={{ uri: item.image }}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />
          {item.productName === '' && <View style={{ padding: 8, backgroundColor: Color.overflow }}>
            <Text color={Color.textInput} type='medium'>Url tidak valid</Text>
          </View>}
        </View>

        {videoId !== '' && <YoutubePlayer
          ref={youtubeRef}
          width={width}
          height={getSizeByRatio({ width: width, ratio: 9 / 16 }).height}
          play={playing}
          videoId={videoId}
          url
          onChangeState={onStateChange}
          onError={(val, v) => {
            console.log('youtube error', val, v);
          }}
        />}
      </View>

      <TouchableOpacity
        onPress={() => { }}
        style={{
          width: width,
          height:
            beforePlay ?
              getSizeByRatio({ width: width / 2.4, ratio: 9 / 16 }).height
              :
              playing ?
                getSizeByRatio({ width: width / 3, ratio: 9 / 16 }).height
                :
                getSizeByRatio({ width: width / 1.4, ratio: 9 / 16 }).height,
          position: 'absolute',
          top: 0,
          left: 6,
          backgroundColor: 'transparent'
        }}
      >

      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          // navigation.navigate('UserProfileScreen', { userId: item.ownerId })
        }}
        style={{ flexDirection: 'row', padding: 8 }}
      >
        <Image
          source={{ uri: item.avatar }}
          style={{ flex: 1, aspectRatio: 1, borderRadius: 50, backgroundColor: Color.border }}
        />

        <View style={{ flex: 9, paddingLeft: 8, justifyContent: 'space-between' }}>
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
  );
};

CardComponentYoutube.defaultProps = defaultProps;
export default CardComponentYoutube;
