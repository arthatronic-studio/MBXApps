// VideoPlayerIos

import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, useWindowDimensions, Platform, ActivityIndicator } from 'react-native';
import {
    Scaffold,
    Text,
    usePopup,
    useLoading,
    useColor,
} from '@src/components';
import Client from '@src/lib/apollo';
import Video from 'react-native-video';

import ImagesPath from 'src/components/ImagesPath';
import { VideoPlayerAndroid } from 'src/components/VideoPlayerAndroid';
import WebView from 'react-native-webview';
import FormInput from 'src/components/FormInput';
import { Divider } from 'src/styled';

const VideoPlayerIos = ({ item }) => {
    const { height, width } = useWindowDimensions();
    const { Color } = useColor();

    const [loading, setLoading] = useState(false);

    const onLoadStart = (e) => {
        console.log('onLoadStart', e);
        setLoading(true);
    }
    
    const onLoad = (e) => {
        console.log('onLoad', e);
        setLoading(false);
    }
    
    const onBuffer = (e) => {
        console.log('onBuffer', e);
    }

    return (
        <View
            style={{
                width: '100%',
                aspectRatio: 16 / 9,
            }}
        >
            <Video
                source={{ uri: item.videoFilename }}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                controls
                fullscreen={false}
                paused={false}
                resizeMode='cover'
                onBuffer={onBuffer}
                onLoadStart={onLoadStart}
                onLoad={onLoad}
            />

            {loading && <View
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    backgroundColor: Color.overflow,
                    justifyContent: 'center',
                }}
            >
                <ActivityIndicator color={Color.primary} size='large' />
            </View>}
        </View>
    )
}

export default VideoPlayerIos;