import { postAPI } from './httpService';

export const fetchEatCartAdd = async(body) => {
    const endpoint = 'cart/add';
    const result = await postAPI(endpoint, body);
    console.log(`result ${endpoint}`, body, result);
    return result;
}