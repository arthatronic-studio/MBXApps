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
import TrackPlayer, { Event, useTrackPlayerEvents } from 'react-native-track-player';
import { queryBannerList } from 'src/lib/query/banner';
import client from 'src/lib/apollo';

const events = [
    Event.PlaybackTrackChanged,
];

const TabMusic = ({ }) => {
    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading] = useLoading();
    const navigation = useNavigation();
    const { Color } = useColor();

    const [thisTrack, setThisTrack] = useState();
    const [loadingBanner, setLoadingBanner] = useState(true);
    const [listBanner, setListBanner] = useState([]);

    useEffect(() => {
        fetchBannerList();
    }, []);

    const fetchBannerList = () => {
        const variables = {
          categoryId: 3,
        };
    
        client.query({
          query: queryBannerList,
          variables,
        })
          .then(res => {
            console.log('res banner list', res);
            setListBanner(res.data.bannerList);
            setLoadingBanner(false);
          })
          .catch(err => {
            console.log(err, 'err banner list');
            setLoadingBanner(false);
          });
    };

    // 
    useTrackPlayerEvents(events, (event) => {
        if (event.type === Event.PlaybackTrackChanged) {
            // console.log('home track changed', event);
            getCurrentPlaying();
        }
    });

    const getCurrentPlaying = async () => {
        const newCurrent = await TrackPlayer.getCurrentTrack();
        if (newCurrent != null) {
            setThisTrack(await TrackPlayer.getTrack(newCurrent));
        } else {
            setThisTrack();
        }
    }

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
                    data={listBanner}
                    loading={loadingBanner}
                />

                <Divider />

                <MusikTerbaru />

                <CardListMusic
                    activePlayingTrack={thisTrack}
                    componentType='POPULAR'
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