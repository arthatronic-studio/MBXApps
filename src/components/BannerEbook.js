import React, { Component } from 'react'
import { AppRegistry, StyleSheet, Text, View , Image} from 'react-native'
import Swiper from 'react-native-swiper'
import ImagesPath from './ImagesPath'

const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  }
})

export default class BannerEbook extends Component {
  render() {
    return (
      <Swiper style={{height: 250}}>
        <View style={styles.slide1}>
          <Image source={ImagesPath.ebookbanner} style={{width: '99%', height: '99%', resizeMode: 'contain'}}/>
        </View>
        <View style={styles.slide2}>
        <Image source={ImagesPath.ebookbanner} style={{width: '99%', height: '99%', resizeMode: 'contain'}}/>
        </View>
        <View style={styles.slide3}>
        <Image source={ImagesPath.ebookbanner} style={{width: '99%', height: '99%', resizeMode: 'contain'}}/>
        </View>
      </Swiper>
    )
  }
}

AppRegistry.registerComponent('myproject', () => SwiperComponent)