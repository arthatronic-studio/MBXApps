import { postAPI } from './httpService';

export const fetchEatCartDetail = async(body) => {
    const endpoint = 'cart/detail';
    const result = await postAPI(endpoint, body);
    console.log(`result ${endpoint}`, body, result);
    return result;
}