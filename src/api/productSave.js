import Client from '@src/lib/apollo';
import { queryProductSave } from 'src/lib/query/queryProductSave';

export const fetchProductSave = async variables => {
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
      query: queryProductSave,
      variables: v,
    });

    console.log(result, "res save");

    if (result && result.data && result.data.productSave && result.data.productSave.success) {
      response.status = result.data.productSave.success;
      response.message = result.data.productSave.message || 'OK';
    } else {
      console.log('err save product', result);
      response.message = 'Gagal, silakan coba kembali';
      response.error = result;
    }

    return response;
  } catch (error) {
    console.log('catch save product', JSON.stringify(error));
    response.error = error;
    return response;
  }
};
