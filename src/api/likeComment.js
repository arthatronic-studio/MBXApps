import Client from '@src/lib/apollo';
import {queryLikeComment} from 'src/lib/query';

export const fetchLikeComment = async variables => {
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
      query: queryLikeComment,
      variables: v,
    });

    if (result && result.data && result.data.contentCommentLikeManage) {
      response.status = result.data.contentCommentLikeManage.success;
      response.message = result.data.contentCommentLikeManage.message || 'OK';
    } else {
      console.log('err like comment', result);
      response.message = 'Gagal, silakan coba kembali';
      response.error = result;
    }

    return response;
  } catch (error) {
    console.log('catch like comment', JSON.stringify(error));
    response.error = error;
    return response;
  }
};
