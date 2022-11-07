import { getAPI } from '../httpService';

export const fetchFestLocation = async(params) => {
    let endpoint = 'festival/location';
    if(params && params != ''){
        endpoint = endpoint + params;
    }
    const result = await getAPI(endpoint);
    console.log(`result ${endpoint}`, result);
    return result;
}