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