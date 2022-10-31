import { getAPI } from './httpService';

export const fetchGetGroups = async(param) => {
    const endpoint = 'groups' + param;
    const result = await getAPI(endpoint);
    // console.log(`result ${endpoint}`, result);
    return result;
}