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

const defaultProps = {
    autoplay: true,
    item: {
        videoFilename: '',
    },
}

const VideoPlayerIos = ({ autoplay, item }) => {
    const { height, width } = useWindowDimensions();
    const { Color } = useColor();

    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(true);
    const [play, setPlay] = useState(autoplay);

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

    if (!show) {
        return <View />
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
                paused={!play}
                resizeMode='cover'
                onBuffer={onBuffer}
                onLoadStart={onLoadStart}
                onLoad={onLoad}
                onError={(err) => {
                    console.log('err', err);
                    setShow(false);
                }}
                
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

VideoPlayerIos.defaultProps = defaultProps;
export default VideoPlayerIos;