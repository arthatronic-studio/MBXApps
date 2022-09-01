import React, {Component} from 'react';
import {View, Image} from 'react-native';

export default class ImageSlider extends Component {
  render() {
    const {data} = this.props;
    return (
      <View>
        {data.map((val, idx) => (
          <Image
            key={idx}
            source={{ uri: val }}
            style={{width: '100%', height: '100%', borderRadius: 5}}
          />
        ))}
      </View>
    );
  }
}