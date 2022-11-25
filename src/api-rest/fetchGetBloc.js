import { getAPI } from './httpService';

export const fetchGetBloc = async(params) => {
    let endpoint = 'bloc';
    if(params && params != ''){
        endpoint = endpoint + params;
    }
    console.log(endpoint, "endpoint");
    const result = await getAPI(endpoint);
    console.log(`result ${endpoint} ${params}`, result);
    return result;
}