import Client from '@src/lib/apollo';
import { queryChekMemberJoinGroup } from 'src/lib/query';

export const checkJoinMember = async(variables)  => {
    let response = {
        data: null,
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    try {
        const result = await Client.query({
            query: queryChekMemberJoinGroup,
            variables,
        });
    
        if (
            result &&
            result.data &&
            result.data.checkMemberJoinGroup
        ) {
            response.data = result.data.checkMemberJoinGroup;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err ChekMemberJoinGroup', result);
            response.message = 'Gagal, silakan coba kembali';
            response.error = result;
        }
    
        return response;
    } catch (error) {
        console.log('catch queryChekMemberJoinGroup', error);
        response.error = error;
        return response;
    }
  };