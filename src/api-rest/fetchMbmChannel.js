import { postAPI } from './httpService';

export const fetchMbmChannel = async(body) => {
    const endpoint = 'mbm/get-payment-channel';
    const result = await postAPI(endpoint, body);
    console.log(`result`, endpoint, body, result);
    return result;
}