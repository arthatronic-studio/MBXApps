import {getAPI} from './httpService';

export const fetchGetBanner = async param => {
  const endpoint = 'banner' + param;
  const result = await getAPI(endpoint);
  return result;
};
