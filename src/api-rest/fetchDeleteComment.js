import {postAPI} from './httpService';

export const fetchDeleteComment = async body => {
  const endpoint = 'delete-comment';
  const result = await postAPI(endpoint, body);
  console.log(`result ${endpoint} ${body}`, result);
  return result;
};
