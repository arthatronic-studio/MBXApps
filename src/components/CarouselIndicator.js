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
      toValue: currentIndex * 14,
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
              width: 6,
              height: 6,
              borderRadius: 3,
              marginRight: 8,
              backgroundColor: Color.theme,
              borderWidth: 0.5,
              borderColor: Color.primary,
            }}
          />
        )
      })}

      <Animated.View
        style={{
          width: 6,
          height: 6,
          position: 'absolute',
          left: 0,
          borderRadius: 3,
          marginRight: 8,
          backgroundColor: Color.primary,
          borderWidth: 0.5,
          borderColor: Color.primary,
          transform: [{ translateX: bgAnimatedRef }],
        }}
      />
    </View>
  );
}

export default Indicator;