import Config from 'react-native-config';
import Client from '@src/lib/apollo';
import { getEventList } from 'src/lib/query/event';

export const fetchEventList = async(variables) => {
    let response = {
        data: [],
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    const v = {
        page: 1,
        itemPerPage: 6,
        ...variables,
    };

    try {
        const result = await Client.query({
            query: getEventList,
            variables: v,
        });

        if (
            result &&
            result.data &&
            result.data.eventList &&
            Array.isArray(result.data.eventList)
        ) {
            response.data = result.data.eventList;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err event list', result);
            response.message = 'Gagal, silakan coba kembali';
            response.error = result;
        }

        return response;
    } catch (error) {
        console.log('catch event list', JSON.stringify(error));
        response.error = error;
        return response;
    }
}