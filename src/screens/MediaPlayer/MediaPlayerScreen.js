import React, { useState, useEffect, useRef, createRef } from 'react';
import { View } from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {
    useLoading,
    usePopup,
    useColor,
    Header,
} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { Divider, Row } from 'src/styled';
import TabMusic from './TabMusic';
import TabVideo from './TabVideo';
import { useSelector } from 'react-redux';
import FloatingMusicPlayer from 'src/components/FloatingMusicPlayer';

const { Navigator, Screen } = createMaterialTopTabNavigator();

const MediaPlayerScreen = ({ navigation, route }) => {
    const user = useSelector(state => state['user.auth'].login.user);

    const [state, setState] = useState();

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading] = useLoading();

    const { Color } = useColor();

    const floatingMusicPlayerRef = useRef();

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
            {/* {user && user.isDirector === 1 && <Row justify='space-around' style={{marginBottom: 16}}>
                <Text onPress={() => navigation.navigate('UploadMusicScreen')}>
                    Upload Music
                </Text>
                <Text onPress={() => navigation.navigate('UploadVideoScreen')}>
                    Upload Video
                </Text>
            </Row>} */}

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

            <FloatingMusicPlayer
                ref={floatingMusicPlayerRef}
            />
        </Scaffold>
    )
}

export default MediaPlayerScreen;