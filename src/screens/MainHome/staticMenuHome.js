const { accessClient } = require("src/utils/access_client");
import {
    iconBPJS,
    iconGames,
    iconInternet,
    iconIuran,
    iconPDAM,
    iconPLN,
    iconPulsa,
    iconSemua,
    iconLelang,
    iconMediaPlayer,
    iconMenuArtikel,
    iconMenuEvent,
    iconMenuLoker,
    iconMenuTempat,
    iconMenuForum,
} from '@assets/images/home';

const listContentProduct = [];

export const listMenuHome = [
    {
        code: 'JOBS',
        name: 'Loker',
        images: iconMenuLoker,
        nav: 'JobScreen',
        params: { title: 'Loker' },
        badge: false,
        show: accessClient.MenuHome.showJob,
    },
    {
        code: 'NEARBY_PLACE',
        name: 'Tempat',
        images: iconMenuTempat,
        nav: 'PlaceScreen',
        params: { title: 'Tempat' },
        badge: false,
        show: accessClient.MenuHome.showPlace,
    },
    {
        code: 'EVENT',
        name: 'Event',
        images: iconMenuEvent,
        nav: 'EventScreen',
        params: { title: 'Event' },
        badge: false,
        show: true,
    },
    {
        code: 'POSTING',
        name: 'Artikel',
        images: iconMenuArtikel,
        nav: 'NewsScreen',
        params: { title: 'Artikel' },
        badge: false,
        show: true,
    },
    {
        code: 'FORUM',
        name: 'Forum',
        images: iconMenuForum,
        nav: 'ForumScreen',
        params: {},
        badge: true,
        show: true,
    },
    {
        code: 'EMERGENCY',
        name: 'Emergency',
        images: null,
        nav: '',
        params: { title: '' },
        badge: false,
        show: false,
    },
    {
        code: 'NEWEST_VIDEO',
        name: 'Video Terbaru',
        images: null,
        nav: '',
        params: { title: '' },
        badge: false,
        show: false,
    },
    {
        code: 'NEWEST_MUSIC',
        name: 'Musik Terbaru',
        images: null,
        nav: '',
        params: { title: '' },
        badge: false,
        show: false,
    },
    {
        code: 'NEWEST_EBOOK',
        name: 'Buku Terbaru',
        images: null,
        nav: '',
        params: { title: '' },
        badge: false,
        show: false,
    },

    // menu tribes
    // {
    //     code: '',
    //     name: 'Media Player',
    //     images: iconMediaPlayer,
    //     nav: '',
    //     params: {},
    //     badge: true,
    //     show: true,
    // },
    // {
    //     code: '',
    //     name: 'Lelang',
    //     images: iconLelang,
    //     nav: 'Lelang',
    //     params: {},
    //     badge: true,
    //     show: true,
    // },
    // {
    //     code: '',
    //     name: 'Pulsa',
    //     images: iconPulsa,
    //     nav: 'PulsaScreen',
    //     params: {}
    // },
    // {
    //     code: '',
    //     name: 'Listrik',
    //     images: iconPLN,
    //     nav: 'PlnScreen',
    //     params: {}
    // },
    // {
    //     code: '',
    //     name: 'Game',
    //     images: iconGames,
    //     nav: '',
    //     params: {}
    // },
    // {
    //     code: '',
    //     name: 'PDAM',
    //     images: iconPDAM,
    //     nav: 'PdamScreen',
    //     params: {}
    // },
    // {
    //     code: '',
    //     name: 'BPJS',
    //     images: iconBPJS,
    //     nav: '',
    //     params: {}
    // },
    // {
    //     code: '',
    //     name: 'Internet',
    //     images: iconInternet,
    //     nav: '',
    //     params: { title: 'Iuran Non-wajib', type: 'ACTIVE', productType: 'SAMBATAN_O', }
    // },
    // {
    //     id: 6,
    //     code: '',
    //     name: 'Iuran',
    //     images: iconIuran,
    //     nav: 'OrderListPerProduct',
    //     params: { title: 'Iuran', type: 'ACTIVE', productType: 'ALL_SAMBATAN' },
    // },
    // {
    //     code: '',
    //     name: 'Semua',
    //     images: iconSemua,
    //     nav: '',
    //     params: { title: 'Iuran Non-wajib', type: 'ACTIVE', productType: 'SAMBATAN_O', }
    // },
    // {
    //     code: '',
    //     name: 'Lainnya', // 'Tagihan &\n Isi Ulang',
    //     images: iconIuran,
    //     nav: '',
    //     params: {},
    // },
];