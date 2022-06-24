import React, { useCallback, useState, useRef} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import {Text, useColor} from '@src/components';
import YoutubePlayer from 'react-native-youtube-iframe';
import { getSizeByRatio } from 'src/utils/get_ratio';
import { useSelector } from 'react-redux';
import { analyticMethods } from 'src/utils/analytics';
import { Divider } from 'src/styled';

const defaultProps = {
  name: 'Live',
};

const CardComponentYoutube = ({ item, name }) => {
  const {Color} = useColor();
  const {width} = useWindowDimensions();
  const user = useSelector(state => state['user.auth'].login.user);
  const navigation = useNavigation();

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
      style={{marginHorizontal: 16, marginBottom: 16}}
    >
      <View
        style={{
          backgroundColor: Color.border,
          width: '100%',
          aspectRatio: 16/9,
          borderRadius: 8,
          overflow: 'hidden'
        }}
      >
        <YoutubePlayer
          ref={youtubeRef}
          width={'100%'}
          height={getSizeByRatio({ width: width-32, ratio: 9/16 }).height}
          play={playing}
          videoId={item.productName}
          onChangeState={onStateChange}
          borderRadius={true}
          webViewStyle={ {opacity:0.99} }
        />

      </View>

      <TouchableOpacity
        onPress={() => {}}
        style={{
          width: width,
          height:
            beforePlay ?
              getSizeByRatio({ width: width / 2.4, ratio: 9/16 }).height
            :
            playing ?
              getSizeByRatio({ width: width / 3, ratio: 9/16 }).height
            :
              getSizeByRatio({ width: width / 1.4, ratio: 9/16 }).height,
          position: 'absolute',
          top: 0,
          left: 6,
          backgroundColor: 'transparent'
        }}
      >

      </TouchableOpacity>

      <Divider height={8}/>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('UserProfileScreen', { userId: item.ownerId })
        }}
        style={{flexDirection:'row'}}
      >
        <View style={{flex: 9, justifyContent: 'space-between'}}>
          <Text
            align="left"
            type="bold"
            numberOfLines={1}
            size={14}
          >
            {item.productDescription}
          </Text>
          <Divider height={4}/>
          <Text
            align="left"
            size={10}
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
