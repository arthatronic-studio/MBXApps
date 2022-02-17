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
  {imageAsset: ImagesPath.bananaisart},
];

const VideoCardList = () => {
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
      <View style={{paddingHorizontal: 1}}>
        <Image source={ImagesPath.bananaart} style={{ width: 380, height: 220 }} />
        <Text style={{ backgroundColor:'#00000099',height: 25, width: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 4, position: 'absolute', right: 5, bottom: 5,color: Color.textInput, }} >
        15:35
      </Text>
      </View>
       );
       
  }
  return (
    <View style={{ backgroundColor:Color.disabled, paddingVertical: 12,}}>
      <Text
        align="left"
        type="bold"
        style={{
          fontSize: 18,
          paddingLeft: 16,
          marginBottom: 8,
          color: Color.textInput,
        }}>
        VIdeo Card
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
      
      <View style={{flexDirection:'row' }}>
      <Image source={ImagesPath.bananaauthor} style={{borderRadius: 500, width:40,height:40,marginLeft:10,flexDirection:'row'}}/>
        
        <View>
        <Text align="left"
          type="bold"
          numberOfLines={4}
          style={{
            fontSize: 14,
            marginBottom: 4,
            color: Color.textInput,
           
            paddingLeft:5
            
          }}>KENAPA PISANG DILAKBAN KETEMBOK
        </Text>
        <Text align="left"
          style={{
            fontSize: 12,
           
            color: Color.gray,
            
            paddingLeft:5
            
          }}>Tangan belang 21 rb x ditonton 1 hari yang lalu
          </Text>
          
        </View>
        <Entypo
            name={'dots-three-vertical'}
            color={Color.text}
            size={12}
            style={{paddingLeft: 40}}
          />
     </View>
    </View>
   
  );
};

export default VideoCardList;
