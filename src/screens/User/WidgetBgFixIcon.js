import React from 'react';
import {
    View,
    useWindowDimensions,
    Image,
    Platform,
} from 'react-native';

import {
    useColor,
} from '@src/components';
import { iconApp } from '@assets/images';
import { statusBarHeight } from 'src/utils/constants';
import { accessClient } from 'src/utils/access_client';

const WidgetBgFixIcon = () => {
    const { height } = useWindowDimensions();
    const { Color } = useColor();

    return (
        <>
            <View
                style={{
                    width: '100%',
                    height: height / 3,
                    top: (Platform.OS === 'ios' ? statusBarHeight : 0) + height / 3,
                    position: 'absolute',
                    backgroundColor: Color[accessClient.ColorBgParallax],
                }}
            />

            <View
                style={{
                    width: '100%',
                    height: height / 3,
                    top: Platform.OS === 'ios' ? statusBarHeight : 0,
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Color[accessClient.ColorBgParallax],
                }}
            >
                <Image
                    source={iconApp}
                    style={{
                        resizeMode: 'contain',
                        height: '40%',
                        width: '70%',
                        marginTop: '10%',
                        alignSelf: 'center',
                    }}
                />
            </View>
        </>
    )
}

export default WidgetBgFixIcon;