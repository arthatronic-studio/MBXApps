import React, {Component} from 'react';
import {Image} from 'react-native';
import Swiper from 'react-native-swiper';

export default class ImageSlider extends Component {
  render() {
    const {data} = this.props;
    return (
      <Swiper showsButtons={false}>
        {data.map((val, idx) => (
          <Image
            key={idx}
            source={{ uri: val }}
            style={{width: '100%', height: '100%'}}
          />
        ))}
      </Swiper>
    );
  }
}