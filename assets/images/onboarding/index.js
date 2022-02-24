import { accessClient } from 'src/utils/access_client';

const indexing = {
    'TRIBESASIA': [
        {imageAsset: require('./icon-1.png'), title: 'Smart Technology', subTitle: 'Tribesocial is an intelligent community platform that delivers personalized content recommendations to every user based on their interests.'},
        {imageAsset: require('./icon-2.png'), title: 'Diversified Community', subTitle: 'Users are actively engaged on Tribesocial, they like to express, discuss, show their attitudes and share content with others.'},
        {imageAsset: require('./icon-3.png'), title: 'High Quality Users', subTitle: 'Users are loyal to our platform, they use Tribesocial frequently.'},
    ],
    'TRIBESXSABYAN': [
        {imageAsset: require('./rrid/icon-1.png'), title: 'Selamat datang di Aplikasi Sabyan', subTitle: ''},
        {imageAsset: require('./sabyan/icon-2.png'), title: 'Dengar Lagu Sabyan Secara Eksklusif', subTitle: 'Dengarkan semua lagu sabyan favoritmu disini tanpa iklan dan tanpa ribet.'},
        {imageAsset: require('./sabyan/icon-3.png'), title: 'Temukan Kalender Event Sabyan', subTitle: 'Kamu bisa menemukan kalender event terbaru dari Sabyan supaya kamu bisa datang langsung ke konsernya.'},
        {imageAsset: require('./rrid/icon-4.png'), title: 'LOGIN SEKARANG', subTitle: ''},
    ],
    'TRIBESXRRID': [
        {imageAsset: require('./rrid/icon-1.png'), title: 'SELAMAT DATANG DI APLIKASI', subTitle: ''},
        {imageAsset: require('./rrid/icon-2.png'), title: 'SOLUSI PRAKTIS UNTUK PENUHI KEBUTUHANMU', subTitle: 'Cari apapun yang kamu butuhkan disini dengan mudah, hanya dengan sentuhan jari di satu aplikasi.'},
        {imageAsset: require('./rrid/icon-3.png'), title: 'SALING TERKONEKSI', subTitle: 'Makin mudah menjalin relasi dan berkomunikasi dengan sesama member/anggota bahkan yang jauh sekalipun.'},
        {imageAsset: require('./rrid/icon-4.png'), title: 'LOGIN SEKARANG', subTitle: ''},
    ],
}

const listBoarding = indexing[accessClient.InitialCode] ?
    indexing[accessClient.InitialCode] : indexing['TRIBESASIA'];

export {listBoarding};