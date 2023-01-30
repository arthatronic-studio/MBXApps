import { postAPI } from './httpService';

export const fetchMbmOrder = async(body) => {
    const endpoint = 'mbm/order';
    const result = await postAPI(endpoint, body);
    console.log(`result`, endpoint, body, result);
    return result;
}