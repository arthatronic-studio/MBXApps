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
import { bgLogin, iconApp } from '@assets/images';
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
                    aspectRatio: 2/1,
                }}
            >
                <Image
                    source={bgLogin}
                    style={{
                        height: '100%',
                        width: '100%',
                    }}
                />
            </View>
        </>
    )
}

export default WidgetBgFixIcon;