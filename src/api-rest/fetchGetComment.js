import {getAPI} from './httpService';

export const fetchGetComment = async params => {
  let endpoint = '/blocx/all-comment';
  if (params && params != '') {
    endpoint = endpoint + params;
  }
  console.log(endpoint, 'endpoint');
  const result = await getAPI(endpoint);
  console.log(`result all comment`,params ,result);
  return result;
};
