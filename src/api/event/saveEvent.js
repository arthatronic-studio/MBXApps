import Config from 'react-native-config';
import Client from '@src/lib/apollo';
import { mutatuinEventManage } from 'src/lib/query/event';

export const fetchSaveEvent = async(variables) => {
    let response = {
        data: [],
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    const v = {
        ...variables,
    };

    try {
        const result = await Client.query({
            query: mutatuinEventManage,
            variables: v,
        });

        if (
            result &&
            result.data &&
            result.data.eventManage &&
            result.data.eventManage.success
        ) {
            response.data = result.data.eventManage;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err save event', result);
            response.message = 'Gagal, silakan coba kembali';
            response.error = result;
        }

        return response;
    } catch (error) {
        console.log('catch save event', JSON.stringify(error));
        response.error = error;
        return response;
    }
}