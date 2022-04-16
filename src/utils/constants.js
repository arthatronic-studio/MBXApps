import { NativeModules, Platform, Dimensions, StatusBar } from 'react-native';
const { StatusBarManager } = NativeModules;

export const statusBarHeight = isIphoneNotch() ? 44 : StatusBarManager['HEIGHT'];

export function isIphoneNotch() {
    const dimen = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        ((dimen.height === 780 || dimen.width === 780)
          || (dimen.height === 812 || dimen.width === 812)
          || (dimen.height === 844 || dimen.width === 844)
          || (dimen.height === 896 || dimen.width === 896)
          || (dimen.height === 926 || dimen.width === 926))
    );
}

export const initialItemState = {
    data: [],
    loading: true,
    message: '',
    page: 0,
    loadNext: false,
    refresh: false,
};

export const listContentCategory = [
    {
        code: 'JOBS',
        name: 'Loker',
        nav: 'JobScreen',
    },
    {
        code: 'NEARBY_PLACE',
        name: 'Tempat',
        nav: 'PlaceScreen',
    },
    {
        code: 'EVENT',
        name: 'Event',
        nav: 'EventScreen',
    },
    {
        code: 'POSTING',
        name: 'Artikel',
        nav: 'NewsScreen',
    },
    {
        code: 'FORUM',
        name: 'Forum',
        nav: 'ForumScreen',
    },
    {
        code: 'EMERGENCY',
        name: 'Help Me',
        nav: '',
    },
    {
        code: 'NEWEST_VIDEO',
        name: 'Video Terbaru',
        nav: '',
    },
    {
        code: 'NEWEST_MUSIC',
        name: 'Musik Terbaru',
        nav: '',
    },
    {
        code: 'NEWEST_EBOOK',
        name: 'Buku Terbaru',
        nav: '',
    },

    // non
    {
        code: 'SURVEY',
        name: 'Survey',
        nav: 'SurveyFirst',
    },
    {
        code: 'MEDIA_PLAYER',
        name: 'Media Player',
        nav: 'MediaPlayerScreen',
    },
    {
        code: 'E_COMMERCE',
        name: 'E-Commerce',
        nav: 'Ecommerce',
    },
    {
        code: 'AUCTION',
        name: 'Lelang',
        nav: 'Lelang',
    },
    {
        code: 'PULSA',
        name: 'Pulsa',
        nav: 'PulsaScreen',
    },
    {
        code: 'LISTRIK',
        name: 'Listrik',
        nav: 'PlnScreen',
    },
    {
        code: 'GAME',
        name: 'Game',
        nav: '',
    },
    {
        code: 'PDAM',
        name: 'PDAM',
        nav: 'PdamScreen',
    },
    {
        code: 'BPJS',
        name: 'BPJS',
        nav: '',
    },
    {
        code: 'INTERNET',
        name: 'Internet',
        nav: '',
    },
    {
        code: 'IURAN',
        name: 'Iuran',
        nav: 'OrderListPerProduct',
        params: { title: 'Iuran', type: 'ACTIVE', productType: 'ALL_SAMBATAN' },
    },
];