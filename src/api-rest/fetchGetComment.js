import {getAPI} from './httpService';

export const fetchGetComment = async params => {
  let endpoint = 'comment';
  if (params && params != '') {
    endpoint = endpoint + params;
  }
  console.log(endpoint, 'endpoint');
  const result = await getAPI(endpoint);
  console.log(`result`,params ,result);
  return result;
};
