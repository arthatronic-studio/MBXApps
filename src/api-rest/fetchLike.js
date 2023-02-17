import {postAPI} from './httpService';

export const fetchLike = async body => {
  const endpoint = '/blocx/like';
  const result = await postAPI(endpoint, body);
  console.log(`result like`, endpoint, body, result);
  return result;
};
