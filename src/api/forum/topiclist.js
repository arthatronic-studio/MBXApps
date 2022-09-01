import Client from '@src/lib/apollo';
import { queryproductTopicList } from 'src/lib/query';

export const fetchTopicList = async(variables)  => {

    let response = {
        data: null,
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    try {
        const result = await Client.query({
            query: queryproductTopicList,
            variables,
        });
    
        if (
            result &&
            result.data &&
            result.data.productTopicList
        ) {
            response.data = result.data.productTopicList;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err productTopicList', result);
            response.message = 'Gagal, silakan coba kembali';
            error = result;
        }
    
        return response;
    } catch (error) {
        console.log('catch queryproductTopicList', error);
        response.error = error;
        return response;
    }
  };