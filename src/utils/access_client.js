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

export const accessClient = {
    InitialCode: Config.INITIAL_CODE,
    BottomTabsNavigator: {
        type: listKomotoFamily.includes(Config.INITIAL_CODE) ? 'komoto' : 'default',
    },
    CreatePosting: {
        showPrivacy: listKomotoFamily.includes(Config.INITIAL_CODE) ? false : true,
    },
    MainHome: {
        showWidgetBalance: listKomotoFamily.includes(Config.INITIAL_CODE) ? false : true,
        showBannerHeader: listKomotoFamily.includes(Config.INITIAL_CODE) ? false : true,
        showListJob: listKomotoFamily.includes(Config.INITIAL_CODE) ? false : true,
        showListAuction: listKomotoFamily.includes(Config.INITIAL_CODE) ? false : true,
        showListSoonAuction: listKomotoFamily.includes(Config.INITIAL_CODE) ? false : true,
        showListPromo: listKomotoFamily.includes(Config.INITIAL_CODE) ? false : true,
        showListMusicNewer: listKomotoFamily.includes(Config.INITIAL_CODE) ? false : true,
        showListYoutube: listKomotoFamily.includes(Config.INITIAL_CODE) ? false : true,
        showListEbookNewer: listKomotoFamily.includes(Config.INITIAL_CODE) ? false : true,
    },
    MenuHome: {
        showJob: listKomotoFamily.includes(Config.INITIAL_CODE) ? false : true,
    },
    MainProfile: {
        showButtonJoinCommunity: listKomotoFamily.includes(Config.INITIAL_CODE) ? false : true,
        showMenuJoinCommunity: listKomotoFamily.includes(Config.INITIAL_CODE) ? true : false,
        showMenuCommunityAdmin: listKomotoFamily.includes(Config.INITIAL_CODE) ? true : false,
    }
};