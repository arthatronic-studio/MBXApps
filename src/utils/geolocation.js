import React from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const geoLocationPermission = async() => {
    let result = false;
    
    if (Platform.OS === 'ios') {
        result = await Geolocation.requestAuthorization('always') === 'granted';
    } else {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                'android.permission.ACCESS_COARSE_LOCATION',
                'android.permission.ACCESS_FINE_LOCATION',
            ]);
            
            if (
                granted['android.permission.ACCESS_COARSE_LOCATION'] === 'granted' &&
                granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted'
            ) {
                result = true;
            }
        } catch (err) {
            console.warn(err);
        }
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