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
    'TRIBESXMIGARI',
    'TRIBESXINDOBARCA',
    'TRIBESXKOMISI',
    'TRIBESXTHISABLE',
    'TRIBESXSANTRIPRENEUR',
];

const useDefaultDarkThemeCode = [
    'TRIBESXMOBILITY',
    'TRIBESXRRID',
];

const isTribes = Config.INITIAL_CODE === 'TRIBESASIA';
const isKomoto = listKomotoFamily.includes(Config.INITIAL_CODE);
const isRRID = Config.INITIAL_CODE === 'TRIBESXRRID';
const isMobility = Config.INITIAL_CODE === 'TRIBESXMOBILITY';
const isSabyan = Config.INITIAL_CODE === 'TRIBESXSABYAN';
const isGofish = Config.INITIAL_CODE === 'TRIBESXGOFISH';
const isTeukuZacky = Config.INITIAL_CODE === 'TRIBESXTEUKUZACKY';
const isSurvey = Config.INITIAL_CODE === 'TRIBESXSURVEY';
const isUnitedId = Config.INITIAL_CODE === 'TRIBESXUNITEDID';
const isMigari = Config.INITIAL_CODE === 'TRIBESXMIGARI';
const isIndoBarca = Config.INITIAL_CODE === 'TRIBESXINDOBARCA';
const isKomisi = Config.INITIAL_CODE === 'TRIBESXKOMISI';
const isThisable = Config.INITIAL_CODE === 'TRIBESXTHISABLE';
const isSantriPreneur = Config.INITIAL_CODE === 'TRIBESXSANTRIPRENEUR';

export const accessClient = {
    // state
    InitialCode: Config.INITIAL_CODE,
    isTribes,
    isKomoto,
    isRRID,
    isMobility,
    isSabyan,
    isGofish,
    isTeukuZacky,
    isSurvey,
    isUnitedId,
    isIndoBarca,
    isKomisi,
    isThisable,
    IsAutoJoinMember:
        isSabyan ||
        isIndoBarca ||
        isThisable ||
        isSantriPreneur ||
        isMigari ?
        true : false,
    Theme:
        useDefaultDarkThemeCode.includes(Config.INITIAL_CODE) ? 'dark' : 'light',
    ColorBgParallax:
        useDefaultDarkThemeCode.includes(Config.INITIAL_CODE) ? 'theme' :
        isSabyan ? 'primary' :
        'theme',
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
    LoginScreen: {
        guesMode: isSantriPreneur ? false : true
    },
    BottomTabsNavigator: {
        type:
            isKomoto ? 'komoto' :
            isSabyan ? 'sabyan' : 'default',
    },
    MainHome: {
        showMenuHome: isUnitedId ? false : true,
        showMemberRank: isIndoBarca ? false : true,
        showWidgetBalance: isKomoto || isSabyan ? false : true,
        showListAuction: isKomoto || isSabyan ? false : true,
        showListSoonAuction: isKomoto || isSabyan ? false : true,
        showListPromo: isKomoto || isSabyan ? false : true,
        showListVideo:
            isKomoto ? false : true,
        showListEbookNewer: isKomoto || isSabyan ? false : true,
    },
    CreatePosting: {
        showPrivacy:
            isKomoto || isSabyan ? false : true,
    },
    MainProfile: {
        showButtonJoinCommunity:
        isTribes ? true : false,
        showMenuHistory:
        isTribes ? true : false,
        showMenuCoupon:
        isTribes ? true : false,
        showMenuMyStore:
        isTribes ? true : false,
        showMenuBidAuction:
            isTribes ? true : false,
        showMenuJoinCommunity:
            isKomoto ? true : false,
        showMenuCommunityAdmin:
            isKomoto ? true : false,
        showMenuSurvey:
        isTribes || isSurvey ? true : false,
        showStatusMember:
            isSabyan ? false : true,
    },
    ChangeProfile: {
        showIdNumber:
        isKomoto ? true : false,
    },
};