import { getAPI } from './httpService';

export const fetchGetNotifCount = async(param) => {
    const endpoint = 'get-notif';
    const result = await getAPI(endpoint);
    console.log(`result ${endpoint}`, result);
    return result;
}