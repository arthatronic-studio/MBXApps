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
import CardListMusic from '@src/screens/MediaPlayer/CardListMusic';

const dataDummyMusic = [
    {
      id: 'd',
      productName: 'Deen Assalam',
      productDescription: 'Bismillah',
      image: 'https://firebasestorage.googleapis.com/v0/b/tribes-social.appspot.com/o/nissa.png?alt=media&token=664063c5-fc42-458c-b02e-596cca8b18dc',
      videoFilename: 'https://firebasestorage.googleapis.com/v0/b/tribes-social.appspot.com/o/Sabyan%20Gambus%20-%20Deen%20Assalam.mp3?alt=media&token=ba7e5d58-4d81-4639-9758-cc7bf67aa43a'
    },
    {
      id: 'y',
      productName: 'Ya Habibal Qolbi',
      productDescription: 'Bismillah',
      image: 'https://firebasestorage.googleapis.com/v0/b/tribes-social.appspot.com/o/nissa.png?alt=media&token=664063c5-fc42-458c-b02e-596cca8b18dc',
      videoFilename: 'https://firebasestorage.googleapis.com/v0/b/tribes-social.appspot.com/o/Sabyan%20Gambus%20-%20Ya%20Habibal%20Qolbi.mp3?alt=media&token=5d3154b8-9f01-4eee-8ebb-76d83ae31bf2'
    },
];

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
                    // data={dataDummyMusic}
                    // onPress={() => {
                    //     trackPlayerPlay();
                    //     navigation.navigate('MusicPlayerScreen');
                    // }}
                />

                <CardListMusic
                    componentType='POPULAR'
                    data={dataDummyMusic}
                    title='Lagu Populer'
                    decimalWidth={0.17}
                    decimalHeight={0.17}
                    showAll={false}
                    onPressShowAll={() => {
                        // navigation.navigate('ShowAllScreen', {
                        //     title: '',
                        //     subTitle: 'Semua Musik',
                        //     componentType: 'SHOW_ALL_MUSIC',
                        //     productType: 'MUSIC',
                        //     productCategory: 'POPULAR'
                        // });
                    }}
                />
            </ScrollView>
        </Scaffold>
    )
}

export default TabMusic;