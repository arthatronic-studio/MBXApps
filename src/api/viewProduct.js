import Client from '@src/lib/apollo';
import {queryViewProduct} from 'src/lib/query';

export const fetchViewProduct = async variables => {
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
      query: queryViewProduct,
      variables: v,
    });

    if (result && result.data && result.data.contentProductViewManage) {
      response.status = result.data.contentProductViewManage.success;
      response.message = result.data.contentProductViewManage.message || 'OK';
    } else {
      console.log('err view product', result);
      response.message = 'Gagal, silakan coba kembali';
      response.error = result;
    }

    return response;
  } catch (error) {
    console.log('catch view product', JSON.stringify(error));
    response.error = error;
    return response;
  }
};
