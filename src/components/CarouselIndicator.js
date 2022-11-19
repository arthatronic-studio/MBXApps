import React, { useState, useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

import { useColor } from '@src/components/Color';

const Indicator = ({ currentIndex, containerStyle, count }) => {
  const { Color } = useColor();
  const bgAnimatedRef = useRef(new Animated.Value(0)).current;

  const [arrCount, setCount] = useState([]);

  useEffect(() => {
    setCount(new Array(count).fill(0))
  }, [count]);

  useEffect(() => {
    Animated.spring(bgAnimatedRef, {
      toValue: currentIndex * 16,
      velocity: 10,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        ...containerStyle,
      }}
    >
      {arrCount.map((_, idx) => {
        return (
          <View
            key={idx}
            style={{
              width: currentIndex === idx ? 16 : 8,
              height: 8,
              borderRadius: 3,
              marginRight: 8,
              backgroundColor: Color.textInput,
              borderWidth: 0.5,
              borderColor: Color.textInput,
              opacity: 0.4,
            }}
          />
        )
      })}

      <Animated.View
        style={{
          width: 16,
          height: 8,
          position: 'absolute',
          left: 0,
          borderRadius: 3,
          marginRight: 8,
          backgroundColor: '#E7FF00',
          borderWidth: 0.5,
          borderColor: '#E7FF00',
          transform: [{ translateX: bgAnimatedRef }],
        }}
      />
    </View>
  );
}

export default Indicator;