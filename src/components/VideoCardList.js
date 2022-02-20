import React, {useCallback, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  ImageBackground,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Text, useColor} from '@src/components';
import ImagesPath from 'src/components/ImagesPath';
import {Divider} from 'src/styled';

const DATA = [
  {imageAsset: ImagesPath.bananaisart},
  {imageAsset: ImagesPath.bananaisart},
];

const defaultProps = {
  onPress: () => {},
}

const VideoCardList = ({ onPress }) => {
  const {Color} = useColor();
  const {width} = useWindowDimensions();

  const [playing, setPlaying] = useState(false);

  const [paused, setPaused] = useState(true);

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <View style={{width: width - 16, paddingHorizontal: 8, marginRight: 16}}>
        <TouchableOpacity onPress={() => onPress()}>
          <ImageBackground
            source={ImagesPath.sabyanLive}
            style={{ width: '100%', aspectRatio: 3/2 }}
            imageStyle={{borderRadius: 8}}
          >
            <View style={{position: 'absolute', bottom: 8, right: 8, paddingVertical: 4, paddingHorizontal: 16, borderRadius: 4, backgroundColor: Color.text}}>
              <Text color={Color.textInput}>
                15:35
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        <View style={{flexDirection:'row', paddingTop: 8}}>
          <Image
            source={ImagesPath.sabyanLive}
            style={{flex: 1, aspectRatio: 1, borderRadius: 50}}
          />

          <View style={{flex: 9, paddingLeft: 8, justifyContent: 'space-between'}}>
            <Text
              align="left"
              type="bold"
              numberOfLines={4}
              style={{
                color: Color.textInput,
              }}
            >
                Sabyan New Album
            </Text>
            <Text align="left"
              style={{
                fontSize: 12,
                color: Color.gray,
                
              }}>Sabyan Official
            </Text>
          </View>
          {/* <Entypo
              name={'dots-three-vertical'}
              color={Color.text}
              size={12}
              style={{paddingLeft: 40}}
            /> */}
        </View>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor:Color.disabled, paddingVertical: 16,}}>
      <Text
        align="left"
        type="bold"
        style={{
          fontSize: 18,
          paddingLeft: 16,
          color: Color.textInput,
        }}>
        Video Terbaru
      </Text>

      <FlatList
        keyExtractor={(item, index) => item.id + index.toString()}
        data={DATA}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          paddingHorizontal: 8,
          paddingTop: 16,
        }}
        renderItem={renderItem}
      />
    </View>
  );
};

VideoCardList.defaultProps = defaultProps;
export default VideoCardList;
