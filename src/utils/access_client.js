import Config from 'react-native-config';

const listKomotoFamily = [
    'TRIBESXKOMOTO',
    'TRIBESXRRID',
];

const listInitialCode = [
    ...listKomotoFamily,
    'TRIBESASIA',
    'TRIBESXSABYAN',
    'TRIBESXGOFISH',
];

const isKomoto = listKomotoFamily.includes(Config.INITIAL_CODE);
const isSabyan = Config.INITIAL_CODE === 'TRIBESXSABYAN';

export const accessClient = {
    InitialCode: Config.INITIAL_CODE,
    IsAutoJoinMember:
        isSabyan ? true : false,
    Theme:
        isKomoto ? "dark" :
        isSabyan ? 'light' : 'light',
    SplashScreen: {
        backgroundColor:
            isKomoto ? 'theme' :
            isSabyan ? 'primary' : 'theme',
    },
    BottomTabsNavigator: {
        type:
            isKomoto ? 'komoto' :
            isSabyan ? 'sabyan' : 'default',
    },
    MainHome: {
        backgroundParallaxColor:
            isKomoto ? 'theme' :
            isSabyan ? 'primary' : 'primarySoft',
        dummyBanner:
            isKomoto ? true :
            isSabyan ? true : true,
        showWidgetBalance: isKomoto || isSabyan ? false : true,
        showBannerHeader: isKomoto || isSabyan ? false : true,
        showListEmergency: isKomoto,
        showListJob: isKomoto || isSabyan ? false : true,
        showListAuction: isKomoto || isSabyan ? false : true,
        showListSoonAuction: isKomoto || isSabyan ? false : true,
        showListPromo: isKomoto || isSabyan ? false : true,
        showListMusicNewer: isKomoto ? false : true,
        showListYoutube: isKomoto || isSabyan ? false : true,
        showListEbookNewer: isKomoto || isSabyan ? false : true,
    },
    MenuHome: {
        showJob: isKomoto || isSabyan ? false : true,
    },
    CreatePosting: {
        showPrivacy:
            isKomoto ||
            isSabyan ? false : true,
    },
    MainProfile: {
        showButtonJoinCommunity: isKomoto ? false : true,
        showMenuJoinCommunity: isKomoto ? true : false,
        showMenuCommunityAdmin: isKomoto ? true : false,
        showStatusMember: isSabyan ? false : true,
    },
    ChangeProfile: {
        showIdNumber: isKomoto ? true : false,
    },
};