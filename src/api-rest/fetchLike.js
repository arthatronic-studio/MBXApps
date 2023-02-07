import {postAPI} from './httpService';

export const fetchLike = async body => {
  const endpoint = 'blocx/like';
  const result = await postAPI(endpoint, body);
  console.log(`result`, endpoint, body, result);
  return result;
};
