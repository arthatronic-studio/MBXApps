import Client from '@src/lib/apollo';
import { queryContentInvite } from 'src/lib/query';

export const fetchContentInvite = async(variables)  => {
    let response = {
        data: null,
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    try {
        const result = await Client.query({
            query: queryContentInvite,
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
            console.log('err queryContentInvite', result);
            response.message = 'Gagal, silakan coba kembali';
            response.error = result;
        }
    
        return response;
    } catch (error) {
        console.log('catch queryContentInvite', error);
        response.error = error;
        return response;
    }
  };