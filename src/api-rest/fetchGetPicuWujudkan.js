import {getAPI} from './httpService';

export const fetchGetPicuWujudkan = async param => {
  const endpoint = 'articles' + param;
  const result = await getAPI(endpoint);
  return result;
};
