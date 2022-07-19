import Client from '@src/lib/apollo';
import { queryContentChatRoomManage } from 'src/lib/query';

export const fetchContentChatRoomManage = async(variables) => {
    let response = {
        data: null,
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    try {
        const result = await Client.query({
            query: queryContentChatRoomManage,
            variables,
        });
    
        if (
            result &&
            result.data &&
            result.data.contentChatRoomManage
        ) {
            response.data = result.data.contentChatRoomManage;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err contentChatRoomManage', result);
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