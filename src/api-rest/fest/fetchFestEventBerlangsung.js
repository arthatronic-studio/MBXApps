import { postAPI } from '../httpService';

export const fetchFestEventBerlangsung = async(body) => {
    const endpoint = 'festival/event-berlangsung';
    const result = await postAPI(endpoint, body);
    console.log(`result ${endpoint}`, body, result);
    return result;
}