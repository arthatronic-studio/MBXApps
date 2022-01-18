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
      <View style={{width: '100%', height: '100%'}}>
        <Swiper style={styles.wrapper} showsButtons={false}>
          <Image
            source={ImagesPath.productImage}
            style={{width: '100%', height: '80%'}}
          />
          <Image
            source={ImagesPath.productImage}
            style={{width: '100%', height: '80%'}}
          />
          <Image
            source={ImagesPath.productImage}
            style={{width: '100%', height: '80%'}}
          />
        </Swiper>
      </View>
    );
  }
}

AppRegistry.registerComponent('myproject', () => SwiperComponent);
