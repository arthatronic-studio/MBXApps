import { accessClient } from 'src/utils/access_client';

const tribesBanner = require('./tribes-banner.png');

const bannerType = {
    'TRIBESASIA': [
        {imageAsset: tribesBanner}
    ],
    'TRIBESXSABYAN': [
        {imageAsset: require('./sabyan/banner-1.png')},
        {imageAsset: require('./sabyan/banner-2.png')},
        {imageAsset: require('./sabyan/banner-3.png')},
    ],
    'TRIBESXRRID': [
        {imageAsset: require('./rrid/banner-home.png')},
        {imageAsset: require('./rrid/banner-bantuan.png')},
        {imageAsset: require('./rrid/banner-jobs.png')},
        {imageAsset: require('./rrid/banner-jualbeli.png')},
        {imageAsset: require('./rrid/banner-lelang.png')},
        {imageAsset: require('./rrid/banner-lokasi.png')},
        {imageAsset: require('./rrid/banner-shop.png')},
    ],
}

const listDummyBanner = bannerType[accessClient.InitialCode] ?
    bannerType[accessClient.InitialCode] : [];

export {
    listDummyBanner,
    tribesBanner,
};