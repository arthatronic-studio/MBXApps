import React, { useState, useEffect, useRef, createRef } from 'react';
import { View } from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {
    useLoading,
    usePopup,
    useColor,
    Header
} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { Divider } from 'src/styled';
import TabMusic from './TabMusic';
import TabVideo from './TabVideo';

const { Navigator, Screen } = createMaterialTopTabNavigator();

const MediaPlayerScreen = ({ navigation, route }) => {
    const [state, setState] = useState();

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading] = useLoading();

    const { Color } = useColor();

    const ref = useRef();

    useEffect(() => {

    }, []);

    return (
        <Scaffold
            header={
                <Header
                    title='Media Player'
                    showLeftButton={false}
                />
            }
            fallback={false}
            empty={false}
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
            {/* <Text align='left' onPress={() => navigation.navigate('UploadMusicScreen')}>
                Upload Music
            </Text>
            <Divider />
            <Text align='left' onPress={() => navigation.navigate('UploadVideoScreen')}>
                Upload Video
            </Text> */}

            <Navigator
                initialRouteName="TabMusic"
                tabBarOptions={{
                    activeTintColor: Color.text,
                    inactiveColor: Color.border,
                    labelStyle: {fontSize: 12, fontWeight: 'bold'},
                    style: {
                        backgroundColor: Color.textInput,
                    },
                    labelStyle: { textTransform: 'none' },
                    // indicatorStyle: { backgroundColor: 'red' }
                }}
            >
                <Screen
                    name="TabMusic"
                    component={TabMusic}
                    options={{tabBarLabel: 'Music'}}
                />
                <Screen
                    name="TabVideo"
                    component={TabVideo}
                    options={{tabBarLabel: 'Video'}}
                />
            </Navigator>
        </Scaffold>
    )
}

export default MediaPlayerScreen;