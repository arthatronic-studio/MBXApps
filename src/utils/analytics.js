import {Platform} from 'react-native';
import GA from '@react-native-firebase/analytics';
import { getTrackingStatus } from 'react-native-tracking-transparency';

export const analyticMethods = {
    view: 'view',
    viewAll: 'view-all',
    comment: 'comment',
    like: 'like',
};

const handleTrackingStatus = async() => {
    if (Platform.OS) {
        const trackingStatus = await getTrackingStatus();
        if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
            return true;
        }
        return false;
    }
    return true;
}

export const GALogEvent = async(param_name, params) => {
    if (await handleTrackingStatus() === false) return false;

    const name = param_name.replace(/\s/g, ''); //remove spaces
    
    const result = await GA().logEvent(name, params);
    console.log('GALog Event ' + name, result);
    return result;
}

export const GALogSelectContent = async(item_id, content_type) => {
    if (await handleTrackingStatus() === false) return false;

    const result = await GA().logSelectContent({
        item_id,
        content_type,
    });
    console.log('GALog SelectContent', result);
    return result;
}

export const GALogShare = async(item_id, content_type, shareTo) => {
    if (await handleTrackingStatus() === false) return false;

    const result = await GA().logShare({
        item_id,
        content_type,
        method: shareTo,
    });
    console.log('GALog Share', result);
    return result;
}

export const GALogSignUp = async(signUpBy = 'phone_number') => {
    if (await handleTrackingStatus() === false) return false;

    const result = await GA().logSignUp({
        method: signUpBy,
    });
    console.log('GALog SignUp', result);
    return result;
}

export const GALogLogin = async(loginBy = 'phone_number') => {
    if (await handleTrackingStatus() === false) return false;
    
    const result = await GA().logLogin({
        method: loginBy,
    });
    console.log('GALog Login', result);
    return result;
}