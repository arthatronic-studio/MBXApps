import Config from 'react-native-config';

const listKomotoFamily = [
    'TRIBESXKOMOTO',
    'TRIBESXRRID',
    'TRIBESXTRCI',
    'TRIBESXMOBILITY',
    'TRIBESXTIOCI',
    'TRIBESXSIRIONITY',
    'TRIBESXAFI',
    'TRIBESXKTCI',
    'TRIBESXDAI',
    'TRIBESXHBC',
    'TRIBESXXMAN',
    'TRIBESXBRIONESIA',
];

const listInitialCode = [
    ...listKomotoFamily,
    'TRIBESASIA',
    'TRIBESXSURVEY',
    'TRIBESXSABYAN',
    'TRIBESXGOFISH',
    'TRIBESXTEUKUZACKY',
    'TRIBESXUNITEDID',
];

const useDefaultDarkThemeCode = [
    'TRIBESXMOBILITY',
    'TRIBESXRRID',
    
];

const isTribes = Config.INITIAL_CODE === 'TRIBESASIA';
const isKomoto = listKomotoFamily.includes(Config.INITIAL_CODE);
const isRRID = Config.INITIAL_CODE === 'TRIBESXRRID';
const isSabyan = Config.INITIAL_CODE === 'TRIBESXSABYAN';
const isGofish = Config.INITIAL_CODE === 'TRIBESXGOFISH';
const isTeukuZacky = Config.INITIAL_CODE === 'TRIBESXTEUKUZACKY';
const isSurvey = Config.INITIAL_CODE === 'TRIBESXSURVEY';
const isUnitedId = Config.INITIAL_CODE === 'TRIBESXUNITEDID';

export const accessClient = {
    // state
    InitialCode: Config.INITIAL_CODE,
    isTribes,
    isKomoto,
    isRRID,
    isSabyan,
    isGofish,
    isTeukuZacky,
    isSurvey,
    isUnitedId,
    IsAutoJoinMember:
        isKomoto ? false :
        isSabyan ? true :
        false,
    Theme:
        useDefaultDarkThemeCode.includes(Config.INITIAL_CODE) ? 'dark' : 'light',
    ColorBgParallax:
        useDefaultDarkThemeCode.includes(Config.INITIAL_CODE) ? 'theme' :
        isSabyan ? 'primary' :
        'primarySoft',
    UserGeneratedContent:
        isKomoto ? 'ONLY_MEMBER' :
        isSabyan ? 'ONLY_ADMIN' :
        'ALL_USER',
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
        showMenuHome: isKomoto || isUnitedId ? false : true,
        showWidgetBalance: isKomoto || isSabyan ? false : true,
        showListAuction: isKomoto || isSabyan ? false : true,
        showListSoonAuction: isKomoto || isSabyan ? false : true,
        showListPromo: isKomoto || isSabyan ? false : true,
        showListVideo:
            isKomoto ? false:
            isSabyan ? true : true,
        showListEbookNewer: isKomoto || isSabyan ? false : true,
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
            isSabyan ? false :
            isSurvey ? true :
            true,
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