import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, PermissionsAndroid, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import Popup, { usePopup } from 'src/components/Modal/Popup';
import { shadowStyle } from '@src/styles';
import { useTimeout } from 'src/hooks';
import { Divider } from 'src/styled';
import { googleApiKey, initialLatitude, initialLongitude } from 'src/utils/constants';

const initialLocationName = 'Unknown Location';

const propTypes = {
    name: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    initLocation: PropTypes.bool, // if true get current location will trigger
    onCallback: PropTypes.func.isRequired,
};

const defaultProps = {
    name: initialLocationName,
    latitude: initialLatitude,
    longitude: initialLongitude,
    initLocation: true,
    onCallback: () => {},
};

const Maps = ({ onCallback, name, latitude, longitude, initLocation }) => {
    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    const [currentLocation, setCurrentLocation] = useState({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    const [marker, setMarker] = useState();
    const [locationName, setLocationName] = useState(initialLocationName);
    const [textAddress, setTextAddress] = useState('');
    const [selectedProvince, setSelectedProvince] = useState();
    const [modalSelectProvince, setModalSelectProvince] = useState(false);
    const [selectedCity, setSelectedCity] = useState();
    const [modalSelectCity, setModalSelectCity] = useState(false);
    const [loading, setLoading] = useState(false);

    const [popupProps, showPopup] = usePopup();
    const { Color } = useColor();

    const mapMarkerRef = useRef();

    useEffect(() => {
        requestLocationPermission();
    }, []);

    useEffect(() => {
        if (name !== initialLocationName) {
            setLocationName(name);
        }
                    
        setCurrentLocation({
            ...currentLocation,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
        });

        setMarker({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
        });
    }, [name, latitude, longitude]);

    useEffect(() => {
        if (initLocation) getCurrentPosition();
    }, [hasLocationPermission, initLocation]);

    useTimeout(() => {
        if (marker) {
            getGeocoding();
        }
    }, 500, marker);

    const getGeocoding = () => {
        console.log('marker', marker);

        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${marker.latitude},${marker.longitude}&result_type=street_address&key=${googleApiKey}`)
        // fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${-6.225588},${106.798553}&result_type=street_address&key=${googleApiKey}`)
            .then((result) => result.json())
            .then((res) => {
                console.log('res geocoding', res);

                setLoading(false);

                if (res.status === 'OK' && Array.isArray(res.results)) {
                    if (res.results[0]) {
                        if (locationName === initialLocationName) {
                            setLocationName(res.results[0]['formatted_address']);
                        }
                        setTextAddress(res.results[0]['formatted_address']);

                        const param = {
                            ...marker,
                            formatted_address: res.results[0]['formatted_address'],
                            address_components: res.results[0]['address_components'],
                        };

                        onCallback(param);
                    } else {
                        alert('Lokasi tidak ditemukan');
                        onErrorFindLocation();
                    }
                } else {
                    alert('Tidak ditemukan hasil');
                    onErrorFindLocation();
                }
            })
            .catch((err) => {
                console.log('error geocoding', err);
                alert('Terjadi kesalahan, silakan coba kembali');
                setLoading(false);
                onErrorFindLocation();
            });
    }

    const onErrorFindLocation = () => {
        setTimeout(() => {
            setMarker({
                ...marker,
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
            setCurrentLocation({
                ...currentLocation,
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }, 1000);
    }

    const requestLocationPermission = async() => {
        if (Platform.OS === 'ios') {
            const result = await Geolocation.requestAuthorization('whenInUse');
            setHasLocationPermission(result === 'granted');
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
                    setHasLocationPermission(true);
                }
            } catch (err) {
                console.warn(err);
            }
        }
    }

    const getCurrentPosition = () => {
        if (hasLocationPermission) {
            setLoading(true);

            Geolocation.getCurrentPosition(
                (success) => {
                    // console.log('success geo', success);

                    setLocationName(initialLocationName);
                    
                    setCurrentLocation({
                        ...currentLocation,
                        latitude: parseFloat(success.coords.latitude),
                        longitude: parseFloat(success.coords.longitude),
                    });

                    setMarker({
                        latitude: parseFloat(success.coords.latitude),
                        longitude: parseFloat(success.coords.longitude),
                    });
                },
                (error) => {
                    console.log('error geo', error);
                    setLoading(false);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        } else {
            requestLocationPermission();
        }
    }

    const onRegionChange = (e, isGestures) => {
        // console.log(e);
        if (mapMarkerRef.current && typeof mapMarkerRef.current.showCallout === 'function') {
            mapMarkerRef.current.hideCallout();
        }
    }

    const onRegionChangeComplete = (e, isGestures) => {
        // console.log(e);
        if (mapMarkerRef.current && typeof mapMarkerRef.current.showCallout === 'function') {
            mapMarkerRef.current.showCallout();
        }
    }

    return (
        <>
            {loading ?
            <View style={{width: '100%', aspectRatio: 1, backgroundColor: Color.blueStroke, borderRadius: 8, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator color={Color.primaryDark} size='large' />
                <Divider height={4} />
                <Text size={12} color={Color.primaryDark}>Memuat Peta</Text>
            </View>
            :    
            <View style={{width: '100%', aspectRatio: 1, backgroundColor: Color.border, borderRadius: 8}}>
                <MapView
                    showsUserLocation
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={{height: '100%', width: '100%', borderRadius: 8}}
                    region={currentLocation}
                    onRegionChange={onRegionChange}
                    onRegionChangeComplete={onRegionChangeComplete}
                    onPoiClick={(e) => {
                        setLocationName(e.nativeEvent.name);

                        setMarker({
                            longitude: parseFloat(e.nativeEvent.coordinate.longitude),
                            latitude: parseFloat(e.nativeEvent.coordinate.latitude),
                        });

                        setCurrentLocation({
                            ...currentLocation,
                            longitude: parseFloat(e.nativeEvent.coordinate.longitude),
                            latitude: parseFloat(e.nativeEvent.coordinate.latitude),
                        });
                    }}
                    onPress={(e) => {
                        setLocationName(initialLocationName);

                        setMarker({
                            longitude: parseFloat(e.nativeEvent.coordinate.longitude),
                            latitude: parseFloat(e.nativeEvent.coordinate.latitude),
                        });

                        setCurrentLocation({
                            ...currentLocation,
                            longitude: parseFloat(e.nativeEvent.coordinate.longitude),
                            latitude: parseFloat(e.nativeEvent.coordinate.latitude),
                        });
                    }}
                >
                    {marker && <Marker
                        ref={mapMarkerRef}
                        coordinate={marker}
                    >
                        <Callout>
                            <View>
                                <Text>{locationName}</Text>
                            </View>
                        </Callout>
                    </Marker>}
                </MapView>

                <TouchableOpacity
                    style={{position: 'absolute', bottom: 8, right: 8, padding: 8, borderRadius: 8, backgroundColor: Color.theme, ...shadowStyle}}
                    onPress={() => {
                        getCurrentPosition()
                    }}
                >
                    <MaterialIcons
                        name='my-location'
                        size={32}
                        color={Color.primary}
                    />
                </TouchableOpacity>
            </View>}

            <Popup { ...popupProps } />
        </>
    );
}

Maps.propTypes = propTypes;
Maps.defaultProps = defaultProps;
export default Maps;