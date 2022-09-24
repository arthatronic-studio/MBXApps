import { postAPI } from './httpService';

export const fetchEatCartRemove = async(body) => {
    const endpoint = 'cart/remove';
    const result = await postAPI(endpoint, body);
    console.log(`result ${endpoint}`, body, result);
    return result;
}