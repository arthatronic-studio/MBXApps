import React from 'react';
import { Platform,  } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const geoLocationPermission = async() => {
    let result = false;
    if (Platform.OS === 'ios') {
        result = await Geolocation.requestAuthorization('always') === 'granted';
    } else {

    }
    return result;
}

export const geoCurrentPosition = (success, error) => Geolocation.getCurrentPosition(
    (res) => success(res),
    (err) => error(err),
    {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
    },
);