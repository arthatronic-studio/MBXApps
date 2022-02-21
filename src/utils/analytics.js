import GA from '@react-native-firebase/analytics';

export const GALogEvent = async(name, params) => {
    const result = await GA().logEvent(name, params);
    console.log('GALogEvent', result);
    return result;
}

export const GALogSelectContent = async(item_id, content_type) => {
    const result = await GA().logSelectContent({
        item_id,
        content_type,
    });
    console.log('GALogSelectContent', result);
    return result;
}