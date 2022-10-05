import { postAPI } from '../httpService';

export const fetchFestGalleries = async(body) => {
    const endpoint = 'festival/galleries';
    const result = await postAPI(endpoint, body);
    console.log(`result ${endpoint}`, body, result);
    return result;
}