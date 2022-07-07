import Client from '@src/lib/apollo';
import { queryGroupMemberList } from 'src/lib/query';

export const fetchGroupMemberList = async(variables)  => {

    console.log('varia',variables);

    let response = {
        data: null,
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    try {
        const result = await Client.query({
            query: queryGroupMemberList,
            variables,
        });
    
        if (
            result &&
            result.data &&
            result.data.groupMemberList
        ) {
            response.data = result.data.groupMemberList;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err productTopicList', result);
            response.message = 'Gagal, silakan coba kembali';
            error = result;
        }
    
        return response;
    } catch (error) {
        console.log('catch contentChatRoomManage', error);
        response.error = error;
        return response;
    }
  };