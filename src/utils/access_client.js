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
    BottomTabsNavigator: {
        type:
            isKomoto ? 'komoto' :
            isSabyan ? 'sabyan' :
            'default',
    },
    CreatePosting: {
        showPrivacy: isKomoto ? false : true,
    },
    MainHome: {
        type:
            isKomoto ? 'komoto' :
            isSabyan ? 'sabyan' :
            'default',
        showWidgetBalance: isKomoto || isSabyan ? false : true,
        showBannerHeader: isKomoto || isSabyan ? false : true,
        showListEmergency: isKomoto,
        showListJob: isKomoto || isSabyan ? false : true,
        showListAuction: isKomoto || isSabyan ? false : true,
        showListSoonAuction: isKomoto || isSabyan ? false : true,
        showListPromo: isKomoto || isSabyan ? false : true,
        showListMusicNewer: isKomoto ? false : true,
        showListYoutube: isKomoto ? false : true,
        showListEbookNewer: isKomoto || isSabyan ? false : true,
    },
    MenuHome: {
        showJob: isKomoto || isSabyan ? false : true,
    },
    MainProfile: {
        showButtonJoinCommunity: isKomoto ? false : true,
        showMenuJoinCommunity: isKomoto ? true : false,
        showMenuCommunityAdmin: isKomoto ? true : false,
        showStatusMember: isSabyan ? false : true,
    }
};