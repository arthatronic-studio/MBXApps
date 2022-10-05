import { postAPI } from '../httpService';

export const fetchFestLineup = async(body) => {
    const endpoint = 'festival/todays-line-up';
    const result = await postAPI(endpoint, body);
    console.log(`result ${endpoint}`, body, result);
    return result;
}