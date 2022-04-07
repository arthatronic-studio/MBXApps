import React, { useState, useEffect, useRef, createRef } from 'react';
import { FlatList, ScrollView, View, Image, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
    useLoading,
    usePopup,
    useColor,
    Header
} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { Container, Divider } from 'src/styled';
import Banner from 'src/components/Banner';
import ImagesPath from 'src/components/ImagesPath';
import MusikTerbaru from 'src/components/MusikTerbaru';
import { trackPlayerPlay } from 'src/utils/track-player-play';
import CardListMusic from '@src/screens/MediaPlayer/CardListMusic';
import TrackPlayer, { Event, useTrackPlayerEvents } from 'react-native-track-player';
import { queryBannerList } from 'src/lib/query/banner';
import client from 'src/lib/apollo';
import MusikAlbum from 'src/components/MusikAlbum';

const events = [
    Event.PlaybackTrackChanged,
];

const AlbumMusicDetail = ({ navigation, route }) => {
    const { item } = route.params;

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading] = useLoading();
    const { Color } = useColor();
    const {height, width} = useWindowDimensions();

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
            fallback={false}
            empty={false}
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
            <CardListMusic
                parentProductId={item.id}
                useCover={false}
                topComponent={
                    <Container paddingTop={8} paddingHorizontal={16} paddingBottom={32} width={width} style={{flexDirection: 'row'}}>
                        <View
                            style={{
                                flex: 1,
                                aspectRatio: 1,
                            }}
                        >
                            <Image
                                source={{ uri: item.image }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 8,
                                }}
                            />
                        </View>

                        <View
                            style={{
                                flex: 2,
                                alignItems: 'flex-start',
                                padding: 16,
                            }}
                        >
                            <Text type='bold' size={18}>{item.productName}</Text>
                            <Text>{item.productDescription}</Text>
                        </View>
                    </Container>
                }
                activePlayingTrack={thisTrack}
                componentType='POPULAR'
                title='Lagu Populer'
                decimalWidth={0.17}
                decimalHeight={0.17}
                showAll={false}
                showHeader={false}
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
        </Scaffold>
    )
}

export default AlbumMusicDetail;