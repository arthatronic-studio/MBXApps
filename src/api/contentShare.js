import Client from '@src/lib/apollo';
import { queryContentShare } from 'src/lib/query';

export const fetchContentShare = async variables => {
  let response = {
    status: false,
    message: 'Terjadi kesalahan',
    error: null,
  };

  const v = {
    ...variables,
  };

  try {
    const result = await Client.query({
      query: queryContentShare,
      variables: v,
    });
    if (result && result.data && result.data.productShareCount) {
      console.log(result);
      response.status = result.data.productShareCount.success;
      response.message = result.data.productShareCount.message || 'OK';
    } else {
      response.message = 'Gagal, silakan coba kembali';
      response.error = result;
    }

    return response;
  } catch (error) {
    console.log('catch share', error);
    response.error = error;
    return response;
  }
};
