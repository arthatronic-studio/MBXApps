import { postAPI } from './httpService';

export const fetchFavoriteProduct = async(body) => {
    const endpoint = 'favorite-product/like';
    const result = await postAPI(endpoint, body);
    console.log(`result ${endpoint}`, body, result);
    return result;
}