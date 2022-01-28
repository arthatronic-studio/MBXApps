import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import ImagesPath from './ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo';
import {useColor} from '@src/components';

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
  const renderItem = ({item}) => (
    <View
      style={{
        flex: 1,
      }}>
      <TouchableOpacity>
        <Image
          source={item.music}
          style={{
            width: 250,
            height: 250,
            marginHorizontal: 5,
            position: 'relative',
          }}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            alignSelf: 'center',
            marginVertical: '35%',
          }}>
          <Entypo
            name={'controller-play'}
            size={70}
            style={{
              color: 'white',
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            position: 'absolute',
            flexDirection: 'column',
            paddingHorizontal: 20,
            paddingVertical: 170,
          }}>
          <View
            style={{
              backgroundColor: Color.oldGreen,
              width: 55,
              height: 25,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 10, color: Color.theme}}>Baru</Text>
          </View>
          <Text
            style={{fontSize: 18, color: Color.textInput, fontWeight: 'bold'}}>
            Deen Assalam
          </Text>
          <Text
            style={{fontSize: 10, color: Color.textInput, fontWeight: 'bold'}}>
            Ya Maulana
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView>
      <View>
        <Text
          style={{
            fontSize: 18,
            color: Color.text,
            fontWeight: 'bold',
            paddingHorizontal: 10,
          }}>
          Musik Terbaru
        </Text>
      </View>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        style={{
          paddingHorizontal: 5,
          paddingVertical: 5,
        }}
      />
    </SafeAreaView>
  );
};

export default MusikTerbaru;
