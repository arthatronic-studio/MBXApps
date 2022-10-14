import { getAPI } from './httpService';

export const fetchGetArticle = async(param) => {
    const endpoint = 'articles' + param;
    const result = await getAPI(endpoint);
    console.log(`result ${endpoint}`, result);
    return result;
}