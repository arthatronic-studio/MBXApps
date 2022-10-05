import { postAPI } from '../httpService';

export const fetchFestFind = async(body) => {
    const endpoint = 'festival/find-v2';
    const result = await postAPI(endpoint, body);
    console.log(`result ${endpoint}`, body, result);
    return result;
}