import { postAPI } from '../httpService';

export const fetchFestDetail = async(body) => {
    const endpoint = 'festival/detail-v2';
    const result = await postAPI(endpoint, body);
    console.log(`result ${endpoint}`, body, result);
    return result;
}