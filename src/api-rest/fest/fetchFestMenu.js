import { postAPI } from '../httpService';

export const fetchFestMenu = async() => {
    const endpoint = 'festival/home-v2';
    const result = await postAPI(endpoint);
    console.log(`result ${endpoint}`, result);
    return result;
}