import React, { useState, useEffect, useRef, createRef } from 'react';
import { ScrollView, View } from 'react-native';

import {
    useLoading,
    usePopup,
    useColor,
} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { Divider } from 'src/styled';
import Banner from 'src/components/Banner';
import { queryBannerList } from 'src/lib/query/banner';
import client from 'src/lib/apollo';
import HighlightContentProduct from 'src/components/Content/HighlightContentProduct';

const TabVideo = ({ }) => {
    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading] = useLoading();
    const { Color } = useColor();

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

                <HighlightContentProduct
                    productCategory='NEWEST_VIDEO'
                    name='Video'
                    title='Video Terbaru'
                    // nav=''
                    refresh={false}
                />
            </ScrollView>
        </Scaffold>
    )
}

export default TabVideo;