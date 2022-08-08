import Client from '@src/lib/apollo';
import { queryGroupMemberManage } from 'src/lib/query';

export const fetchGroupMemberManage = async(variables)  => {
    let response = {
        data: null,
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    try {
        const result = await Client.mutate({
            mutation: queryGroupMemberManage,
            variables,
        });
    
        if (
            result &&
            result.data &&
            result.data.groupMemberManage
        ) {
            response.data = result.data.groupMemberManage;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err groupMemberManage', result);
            response.message = 'Gagal, silakan coba kembali';
            response.error = result;
        }
    
        return response;
    } catch (error) {
        console.log('catch groupMemberManage', error);
        response.error = error;
        return response;
    }
  };