import Client from '@src/lib/apollo';
import { queryReportAbuseV2 } from 'src/lib/query';

export const fetchReportAbuse = async variables => {
  let response = {
    data: null,
    status: false,
    message: 'Terjadi kesalahan',
    error: null,
  };

  const v = {
    ...variables,
  };

  try {
    const result = await Client.query({
      query: queryReportAbuseV2,
      variables: v,
    });
    if (result && result.data && result.data.reportAbuseManageV2) {
      response.status = result.data.reportAbuseManageV2.success;
      response.message = result.data.reportAbuseManage.message || 'OK';
    } else {
      console.log('err report abuse', result);
      response.message = 'Gagal, silakan coba kembali';
      response.error = result;
    }

    return response;
  } catch (error) {
    console.log('catch report abuse', JSON.stringify(error));
    response.error = error;
    return response;
  }
};
