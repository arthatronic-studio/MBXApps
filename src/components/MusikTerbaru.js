import React from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import ImagesPath from './ImagesPath';
import {Text, useColor} from '@src/components';

const DATA = [
  {
    id: 1,
    music: ImagesPath.sabyanMusic,
  },
  {
    id: 2,
    music: ImagesPath.sabyanMusic,
  },
  {
    id: 3,
    music: ImagesPath.sabyanMusic,
  },
];

const MusikTerbaru = () => {
  const {Color} = useColor();
  const {width} = useWindowDimensions();

  const renderItem = ({item}) => (
    <View
      style={{
        paddingLeft: 8,
        paddingRight: 8,
      }}>
      <TouchableOpacity>
        <ImageBackground
          source={item.music}
          style={{
            width: width / 1.7,
            height: width / 1.7,
          }}
        >
          <View
            style={{
              flex: 1,
              padding: 16,
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                backgroundColor: Color.oldGreen,
                width: 55,
                height: 25,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                align='left'
                style={{fontSize: 10, color: Color.theme}}
              >
                Baru
              </Text>
            </View>
            <Text
              align='left'
              style={{fontSize: 18, color: Color.textInput, fontWeight: 'bold'}}
            >
              Deen Assalam
            </Text>
            <Text
              align='left'
              style={{fontSize: 10, color: Color.textInput, fontWeight: 'bold'}}
            >
              Ya Maulana
            </Text>
          </View>

          <View
            style={{
              position: 'absolute',
              alignSelf: 'center',
              marginVertical: '35%',
            }}>
            <Entypo
              name={'controller-play'}
              size={70}
              style={{
                color: Color.textInput,
              }}
            />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <View>
        <Text
          align='left'
          type='bold'
          style={{
            fontSize: 18,
            color: Color.text,
            paddingHorizontal: 16,
            marginBottom: 8
          }}
        >
          Musik Terbaru
        </Text>
      </View>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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

export default MusikTerbaru;
