import { postNonAuth } from './httpService';

export const fetchFcm = async(body) => {
    const endpoint = '/gues-fcm';
    const result = await postNonAuth(endpoint, body);
    console.log(`result ${endpoint}`, body, result);
    return result;
}