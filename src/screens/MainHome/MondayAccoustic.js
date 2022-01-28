import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useColor} from '@src/components';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MondayAccoustic = () => {
  const {Color} = useColor();
  return (
    <View
      style={{
        paddingHorizontal: 10,
      }}>
      <Text
        style={{
          fontSize: 18,
          color: Color.text,
          fontWeight: 'bold',
        }}>
        Monday Accoustic With Sabyan
      </Text>
      <View>
        <Image source={ImagesPath.sabyanLive} style={{borderRadius: 10}} />
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            paddingVertical: 10,
          }}>
          <Text
            style={{
              color: Color.textInput,
              fontSize: 14,
              fontWeight: 'normal',
              width: '78%',
              paddingHorizontal: 10,
            }}>
            Monday Accoustic
          </Text>
          <View
            style={{
              backgroundColor: Color.red,
              width: 50,
              height: 23,
              borderRadius: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: Color.textInput, fontSize: 10}}>LIVE</Text>
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            paddingHorizontal: '40%',
            paddingVertical: '22%',
          }}>
          <TouchableOpacity style={{paddingHorizontal: 10}}>
            <Entypo
              name={'controller-play'}
              size={32}
              style={{color: 'white'}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            marginVertical: '40%',
            paddingHorizontal: 10,
          }}>
          <Ionicons
            name={'eye-outline'}
            size={17}
            style={{color: Color.textInput}}
          />
          <Text
            style={{
              color: Color.textInput,
              paddingHorizontal: 10,
              fontSize: 12,
            }}>
            10.3 k
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MondayAccoustic;
