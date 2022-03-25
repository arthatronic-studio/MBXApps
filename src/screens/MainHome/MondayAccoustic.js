import React, { useEffect, useCallback, useState} from 'react';
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
import Client from '@src/lib/apollo';
import {queryContentProduct} from '@src/lib/query';
import Config from 'react-native-config';
import { getSizeByRatio } from 'src/utils/get_ratio';

const MondayAccoustic = ({  }) => {
  const {Color} = useColor();
  const {width} = useWindowDimensions();

  const [itemData, setItemData] = useState([]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetchContentProduct();
  }, []);

  const fetchContentProduct = () => {
    const variables = {
      page: 0,
      itemPerPage: 6,
      productType: Config.PRODUCT_TYPE,
      productCategory: 'YOUTUBE_VIDEO'
    };

    Client.query({
      query: queryContentProduct,
      variables,
    })
    .then((res) => {
      console.log('res YOUTUBE_VIDEO', res);

      const data = res.data.contentProduct;

      if (data) {
        setItemData(data);
      }
    })
    .catch((err) => {
      console.log('err YOUTUBE_VIDEO', err);
    });
  }

  const onStateChange = useCallback(state => {
    console.log('state', state);
    if (state === 'ended' || state === 'paused') {
      setPlaying(false);
    }
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={{paddingHorizontal: 6}}>
        <YoutubePlayer
          width={width - 32}
          height={getSizeByRatio({ width: width - 32, ratio: 9/16 }).height}
          play={playing}
          videoId={item.productName}
          onChangeState={onStateChange}
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
        data={itemData}
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
