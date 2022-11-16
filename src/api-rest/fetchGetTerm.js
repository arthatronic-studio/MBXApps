import { getAPI } from './httpService';

export const fetchGetTerm = async(param) => {
    const endpoint = 'syarat-ketentuan';
    const result = await getAPI(endpoint);
    console.log(`result ${endpoint}`, result);
    return result;
}