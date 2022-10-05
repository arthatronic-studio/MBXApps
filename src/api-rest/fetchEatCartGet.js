import { postAPI } from './httpService';

export const fetchEatCartGet = async(body) => {
    const endpoint = 'cart/get-cart';
    const result = await postAPI(endpoint, body);
    console.log(`result ${endpoint}`, body, result);
    return result;
}