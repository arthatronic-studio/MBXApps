import GA from '@react-native-firebase/analytics';

export const GALogEvent = async(name, params) => {
    const result = await GA().logEvent(name, params);
    console.log('GALog Event', result);
    return result;
}

export const GALogSelectContent = async(item_id, content_type) => {
    const result = await GA().logSelectContent({
        item_id,
        content_type,
    });
    console.log('GALog SelectContent', result);
    return result;
}

export const GALogShare = async(item_id, content_type, shareTo) => {
    const result = await GA().logShare({
        item_id,
        content_type,
        method: shareTo,
    });
    console.log('GALog Share', result);
    return result;
}

export const GALogSignUp = async(signUpBy = 'phone_number') => {
    const result = await GA().logSignUp({
        method: signUpBy,
    });
    console.log('GALog SignUp', result);
    return result;
}

export const GALogLogin = async(loginBy = 'phone_number') => {
    const result = await GA().logLogin({
        method: loginBy,
    });
    console.log('GALog Login', result);
    return result;
}