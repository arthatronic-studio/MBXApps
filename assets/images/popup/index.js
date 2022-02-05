import Config from 'react-native-config';

const TribesAdsPopup = require('./tribes-ads-popup.png');
const SabyanAdsPopup = require('./sabyan-ads-popup.png');
const RRIDAdsPopup = require('./rrid-ads-popup.png');


const adsPopup =
    Config.INITIAL_CODE === 'TRIBESASIA' || Config.INITIAL_CODE === 'TRIBESXRRID' ?
        RRIDAdsPopup :
    Config.INITIAL_CODE === 'TRIBESXSABYAN' ?
        SabyanAdsPopup :
        TribesAdsPopup;

export {adsPopup};