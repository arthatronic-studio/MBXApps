import { Animated } from 'react-native';

export const startAnimation = (ref, value, duration, nativeDriver) => {
    Animated.timing(ref, {
        toValue: value || 0,
        duration: duration || 300,
        useNativeDriver: nativeDriver || false,
    }).start();
};

export const startAnimationWithDelay = (ref, value, delay, duration, nativeDriver) => {
    Animated.sequence([
        Animated.delay(delay || 300),
        Animated.timing(ref, {
            toValue: value || 0,
            duration: duration || 300,
            useNativeDriver: nativeDriver || false,
        })
    ]).start();
};