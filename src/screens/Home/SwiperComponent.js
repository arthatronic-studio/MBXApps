import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, Image} from 'react-native';

import Swiper from 'react-native-swiper';
import ImagesPath from 'src/components/ImagesPath';

const styles = StyleSheet.create({
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default class SwiperComponent extends Component {
  render() {
    return (
      <View
        style={{
          width: '100%',
          height: '30%',
        }}>
        <Swiper
          style={{width: '100%', height: 300}}
          showsPagination={false}
          showsButtons={false}>
          <View>
            <Image
              source={ImagesPath.imageBanner2}
              style={{
                width: '70%',
                height: 300,
                resizeMode: 'contain',
              }}
            />
          </View>
          <View>
            <Image
              source={ImagesPath.imageBanner1}
              style={{width: '100%', height: 300, resizeMode: 'contain'}}
            />
          </View>
          <View>
            <Image
              source={ImagesPath.imageBanner2}
              style={{width: '100%', height: 300, resizeMode: 'contain'}}
            />
          </View>
        </Swiper>
      </View>
    );
  }
}

AppRegistry.registerComponent('myproject', () => SwiperComponent);
