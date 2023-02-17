import {postAPI} from './httpService';

export const fetchComment = async body => {
  const endpoint = '/blocx/comment';
  const result = await postAPI(endpoint, body);
  console.log(`result post comment ${endpoint} ${body}`, result);
  return result;
};
