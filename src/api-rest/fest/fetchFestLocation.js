import { postAPI } from '../httpService';

export const fetchFestLocation = async(body) => {
    const endpoint = 'festival/location';
    const result = await postAPI(endpoint, body);
    console.log(`result ${endpoint}`, body, result);
    return result;
}