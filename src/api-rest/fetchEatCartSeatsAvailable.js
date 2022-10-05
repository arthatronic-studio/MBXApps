import { postAPI } from './httpService';

export const fetchEatCartSeatsAvailable = async(body) => {
    const endpoint = 'eats/seats-available';
    const result = await postAPI(endpoint, body);
    console.log(`result ${endpoint}`, body, result);
    return result;
}