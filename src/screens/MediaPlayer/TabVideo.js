import React, { useState, useEffect, useRef, createRef } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
    useLoading,
    usePopup,
    useColor,
    Header
} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { Divider } from 'src/styled';
import Banner from 'src/components/Banner';
import ImagesPath from 'src/components/ImagesPath';
import VideoCardList from 'src/components/VideoCardList';

const TabVideo = ({ }) => {
    const [state, setState] = useState();

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading] = useLoading();
    const navigation = useNavigation();
    const { Color } = useColor();

    const ref = useRef();

    useEffect(() => {

    }, []);

    return (
        <Scaffold
            showHeader={false}
            fallback={false}
            empty={false}
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
            <ScrollView>
                <Banner
                    showHeader={false}
                    data={[{imageAsset: ImagesPath.sabyanBannerVideo}]}
                    loading={false}
                />

                <Divider />

                <VideoCardList
                onPress={() => navigation.navigate('VideoDetail')}
                />
            </ScrollView>
        </Scaffold>
    )
}

export default TabVideo;