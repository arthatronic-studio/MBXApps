import { postAPI } from '../httpService';

export const fetchFestEventSchedule = async(body) => {
    const endpoint = 'festival/event-schedule';
    const result = await postAPI(endpoint, body);
    console.log(`result ${endpoint}`, body, result);
    return result;
}