import React, { useCallback, useState, useRef} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Text, useColor} from '@src/components';
import YoutubePlayer from 'react-native-youtube-iframe';
import { getSizeByRatio } from 'src/utils/get_ratio';
import { useSelector } from 'react-redux';
import { analyticMethods } from 'src/utils/analytics';

const defaultProps = {
  name: 'Live',
};

const CardComponentYoutube = ({ item, name }) => {
  const {Color} = useColor();
  const {width} = useWindowDimensions();
  const user = useSelector(state => state['user.auth'].login.user);
  const [beforePlay, setBeforePlay] = useState(true);
  const [playing, setPlaying] = useState(false);

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

  return (
    <View
      style={{paddingHorizontal: 6, marginBottom: 16}}
    >
      <View
        style={{
          backgroundColor: Color.border,
          width: width - 32,
          aspectRatio: 16/9
        }}
      >
        <YoutubePlayer
          ref={youtubeRef}
          width={width - 32}
          height={getSizeByRatio({ width: width - 32, ratio: 9/16 }).height}
          play={playing}
          videoId={item.productName}
          onChangeState={onStateChange}
        />
      </View>

      <TouchableOpacity
        onPress={() => {}}
        style={{
          width: width - 32,
          height:
            beforePlay ?
              getSizeByRatio({ width: (width - 32) / 2.4, ratio: 9/16 }).height
            :
            playing ?
              getSizeByRatio({ width: (width - 32) / 3, ratio: 9/16 }).height
            :
              getSizeByRatio({ width: (width - 32) / 1.4, ratio: 9/16 }).height,
          position: 'absolute',
          top: 0,
          left: 6,
          backgroundColor: 'transparent'
        }}
      >

      </TouchableOpacity>
    </View>
  );
};

CardComponentYoutube.defaultProps = defaultProps;
export default CardComponentYoutube;
