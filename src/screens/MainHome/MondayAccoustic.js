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

import YoutubePlayer from 'react-native-youtube-iframe';

const DATA = [
  {imageAsset: ImagesPath.sabyanLive},
  // {imageAsset: ImagesPath.sabyanLive},
];

const MondayAccoustic = () => {
  const {Color} = useColor();
  const {width} = useWindowDimensions();

  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  const renderItem = () => {
    return (
      <View style={{paddingHorizontal: 6}}>
        <YoutubePlayer
          height={220}
          width={365}
          play={playing}
          videoId={'xv60Mo5RsGQ'}
          onChangeState={onStateChange}
          style={{backgroundColor: 'red'}}
        />
      </View>

      //     <View style={{paddingHorizontal: 8}}>
      //       <ImageBackground
      //         source={ImagesPath.sabyanLive}
      //         imageStyle={{
      //           borderRadius: 10,
      //         }}
      //         style={{
      //           width: width - 32,
      //           aspectRatio: 16/9,
      //           justifyContent: 'space-between',
      //         }}
      //       >
      //         <View
      //           style={{
      //             flexDirection: 'row',
      //             paddingTop: 16,
      //             paddingHorizontal: 16,
      //             justifyContent: 'space-between',
      //             alignItems: 'center',
      //           }}>
      //           <Text
      //             align='left'
      //             style={{
      //               color: Color.textInput,
      //             }}>
      //             Monday Accoustic
      //           </Text>
      //           <View
      //             style={{
      //               backgroundColor: Color.red,
      //               width: 50,
      //               height: 23,
      //               borderRadius: 6,
      //               justifyContent: 'center',
      //               alignItems: 'center',
      //             }}>
      //             <Text
      //               align='left'
      //               style={{color: Color.textInput, fontSize: 10}}
      //             >
      //               LIVE
      //             </Text>
      //           </View>
      //         </View>

      //         <View
      //           style={{
      //             flexDirection: 'row',
      //             paddingBottom: 16,
      //             paddingHorizontal: 16,
      //             alignItems: 'center'
      //           }}>
      //           <Ionicons
      //             name={'eye-outline'}
      //             size={17}
      //             style={{color: Color.textInput}}
      //           />
      //           <Divider width={8} />
      //           <Text
      //             align='left'
      //             style={{
      //               color: Color.textInput,
      //               fontSize: 12,
      //             }}>
      //             10.3 k
      //           </Text>
      //         </View>

      //         <View
      //           style={{
      //             position: 'absolute',
      //             top: 0,
      //             right: 0,
      //             bottom: 0,
      //             left: 0,
      //             alignItems: 'center',
      //             justifyContent: 'center',
      //           }}>
      //           <TouchableOpacity>
      //             <Entypo
      //               name={'controller-play'}
      //               size={32}
      //               style={{color: Color.textInput}}
      //             />
      //           </TouchableOpacity>
      //         </View>
      //       </ImageBackground>
      //     </View>
    );
  };

  return (
    <View style={{backgroundColor: Color.primary, paddingVertical: 12}}>
      <Text
        align="left"
        type="bold"
        style={{
          fontSize: 18,
          paddingLeft: 16,
          marginBottom: 8,
          color: Color.textInput,
        }}>
        Sedang Berlangsung
      </Text>

      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id + index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}
      />
    </View>
  );
};

export default MondayAccoustic;
