import Config from 'react-native-config';

const tribesBanner = require('./tribes-banner.png');

const RRIDBanner1 = require('./rrid/banner-home.png');
const RRIDBanner2 = require('./rrid/banner-bantuan.png');
const RRIDBanner3 = require('./rrid/banner-jobs.png');
const RRIDBanner4 = require('./rrid/banner-jualbeli.png');
const RRIDBanner5 = require('./rrid/banner-lelang.png');
const RRIDBanner6 = require('./rrid/banner-lokasi.png');
const RRIDBanner7 = require('./rrid/banner-shop.png');

const listTribesBanner = [
    {imageAsset: tribesBanner}
];

const listTribesSabyan = [];

const listRRIDBanner = [
    {imageAsset: RRIDBanner1},
    {imageAsset: RRIDBanner2},
    {imageAsset: RRIDBanner3},
    {imageAsset: RRIDBanner4},
    {imageAsset: RRIDBanner5},
    {imageAsset: RRIDBanner6},
    {imageAsset: RRIDBanner7},
];

const listDummyBanner =
    Config.INITIAL_CODE === 'TRIBESASIA' || Config.INITIAL_CODE === 'TRIBESXRRID' ?
        listRRIDBanner :
    Config.INITIAL_CODE === 'TRIBESXSABYAN' ?
        listTribesSabyan :
        listTribesBanner;

export {
    listDummyBanner,
    tribesBanner,
};