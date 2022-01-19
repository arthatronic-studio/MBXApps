import React, {Component} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import Swiper from 'react-native-swiper';

import ImagesPath from './ImagesPath';

const styles = StyleSheet.create({
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class Banner extends Component {
  render() {
    return (
      <View
        style={{
          width: '100%',
          aspectRatio: 16/9,
        }}
      >
        <Swiper
          showsButtons={false}
          autoplay
        >
          <View style={styles.slide1}>
            <Image
              source={ImagesPath.bannerlelang}
              style={{width: '100%', height: '100%', borderRadius: 16}}
            />
          </View>
          <View style={styles.slide1}>
            <Image
              source={ImagesPath.bannerlelang}
              style={{width: '100%', height: '100%', borderRadius: 16}}
            />
          </View>
          <View style={styles.slide1}>
            <Image
              source={ImagesPath.bannerlelang}
              style={{width: '100%', height: '100%', borderRadius: 16}}
            />
          </View>
          <View style={styles.slide1}>
            <Image
              source={ImagesPath.bannerlelang}
              style={{width: '100%', height: '100%', borderRadius: 16}}
            />
          </View>
        </Swiper>
      </View>
    );
  }
}