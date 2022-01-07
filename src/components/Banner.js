import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, Image} from 'react-native';
import Swiper from 'react-native-swiper';
import ImagesPath from './ImagesPath';

const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
    borderRadius: 10,
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',

    borderRadius: 10,
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
    borderRadius: 10,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    borderRadius: 10,
  },
});

export default class Banner extends Component {
  render() {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          marginVertical: 10,
        }}>
        <Swiper style={styles.wrapper} showsButtons={false}>
          <View style={styles.slide1}>
            <Image
              source={ImagesPath.bannerlelang}
              style={{width: '100%', height: '100%'}}
            />
          </View>
          <View style={styles.slide1}>
            <Image
              source={ImagesPath.bannerlelang}
              style={{width: '100%', height: '100%'}}
            />
          </View>
          <View style={styles.slide1}>
            <Image
              source={ImagesPath.bannerlelang}
              style={{width: '100%', height: '100%'}}
            />
          </View>
          <View style={styles.slide1}>
            <Image
              source={ImagesPath.bannerlelang}
              style={{width: '100%', height: '100%'}}
            />
          </View>
        </Swiper>
      </View>
    );
  }
}

AppRegistry.registerComponent('myproject', () => SwiperComponent);
