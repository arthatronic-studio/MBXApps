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
    // legacy
    InitialCode: Config.INITIAL_CODE,
    IsAutoJoinMember:
        isKomoto ? false :
        isSabyan ? true :
        false,
    Theme:
        isKomoto ? "dark" :
        isSabyan ? 'light' :
        'light',
    ColorBgParallax:
        isKomoto ? 'theme' :
        isSabyan ? 'primary' :
        'primarySoft',
    UserGeneratedContent:
        isKomoto ? true :
        isSabyan ? false :
        true,
    // screen
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
        showWidgetBalance: isKomoto || isSabyan ? false : true,
        showBannerHeader: isKomoto || isSabyan ? false : true,
        showListEmergency: isKomoto,
        showListJob: isKomoto || isSabyan ? false : true,
        showListPlace:
            isKomoto ? true :
            isSabyan ? false :
            true,
        showListAuction: isKomoto || isSabyan ? false : true,
        showListSoonAuction: isKomoto || isSabyan ? false : true,
        showListPromo: isKomoto || isSabyan ? false : true,
        showListMusicNewer: isKomoto ? false : true,
        showListYoutube:
            isKomoto ? false :
            isSabyan ? true : true,
        showListVideo:
            isKomoto ? false:
            isSabyan ? false : true,
        showListEbookNewer: isKomoto || isSabyan ? false : true,
    },
    MenuHome: {
        showJob:
            isKomoto ? false :
            isSabyan ? false :
            true,
        showPlace:
            isKomoto ? true :
            isSabyan ? false :
            true,
        showSurvey:
            isKomoto ? false :
            isSabyan ? false :
            true,
        showEcommerce:
            isKomoto ? false :
            isSabyan ? false :
            true,
        showAlbum:
            isKomoto ? false :
            isSabyan ? true :
            true,
    },
    CreatePosting: {
        showPrivacy:
            isKomoto ||
            isSabyan ? false : true,
    },
    MainProfile: {
        showButtonJoinCommunity:
            isKomoto ? false :
            isSabyan ? false : true,
        showMenuHistory:
            isKomoto ? false :
            isSabyan ? false : true,
        showMenuCoupon:
            isKomoto ? false :
            isSabyan ? false : true,
        showMenuMyStore:
            isKomoto ? false :
            isSabyan ? false : true,
        showMenuBidAuction:
            isKomoto ? false :
            isSabyan ? false : true,
        showMenuJoinCommunity:
            isKomoto ? true :
            isSabyan ? false : false,
        showMenuCommunityAdmin:
            isKomoto ? true :
            isSabyan ? false : false,
        showMenuSurvey:
            isKomoto ? false :
            isSabyan ? false : true,
        showStatusMember:
            isKomoto ? true :
            isSabyan ? false : true,
    },
    ChangeProfile: {
        showIdNumber:
            isKomoto ? true :
            isSabyan ? false : false,
    },
};