import { postAPI } from './httpService';

export const fetchEatDetail = async(body) => {
    const endpoint = 'eats/detail';
    const result = await postAPI(endpoint, body);
    console.log(`result ${endpoint}`, body, result);
    return result;
}