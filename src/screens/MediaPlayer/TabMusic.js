import React, { useState, useEffect, useRef, createRef } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
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
import MusikTerbaru from 'src/components/MusikTerbaru';
import { trackPlayerPlay } from 'src/utils/track-player-play';

const TabMusic = ({ }) => {
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
                    isDummy={true}
                    showHeader={false}
                    data={[{imageAsset: ImagesPath.sabyanBannerMusic}]}
                    loading={false}
                />

                <Divider />

                <MusikTerbaru
                    onPress={() => {
                        trackPlayerPlay();
                        navigation.navigate('MusicPlayerScreen');
                    }}
                />
            </ScrollView>
        </Scaffold>
    )
}

export default TabMusic;