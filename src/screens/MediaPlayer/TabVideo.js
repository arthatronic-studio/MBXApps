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
import { queryBannerList } from 'src/lib/query/banner';
import client from 'src/lib/apollo';

const TabVideo = ({ }) => {
    const [state, setState] = useState();

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading] = useLoading();
    const navigation = useNavigation();
    const { Color } = useColor();

    const ref = useRef();

    const [loadingBanner, setLoadingBanner] = useState(true);
    const [listBanner, setListBanner] = useState([]);

    useEffect(() => {
        fetchBannerList();
    }, []);

    const fetchBannerList = () => {
        const variables = {
          categoryId: 4,
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

    return (
        <Scaffold
            showHeader={false}
            fallback={false}
            empty={false}
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
            <ScrollView>
                <Divider height={16} />

                <Banner
                    showHeader={false}
                    data={listBanner}
                    loading={loadingBanner}
                />

                <Divider />

                <VideoCardList
                    title='INUL & IPUL'
                    productCategory='NEWEST_VIDEO'
                    onPress={(item) => navigation.navigate('VideoDetail', { item })}
                />
            </ScrollView>
        </Scaffold>
    )
}

export default TabVideo;