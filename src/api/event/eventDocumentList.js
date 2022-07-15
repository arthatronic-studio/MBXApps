import Config from 'react-native-config';
import Client from '@src/lib/apollo';

import { queryContentProduct,queyGetDokumentasiEnventList } from '@src/lib/query';
export const fetchEventDocumentList = async(variables) => {
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

    console.log('ini variabels dua', v)

    try {
        const result = await Client.query({
            query: queyGetDokumentasiEnventList,
            variables: v,
        });

        if (
            result &&
            result.data &&
            result.data.eventDocumentationList &&
            Array.isArray(result.data.eventDocumentationList)
        ) {
            response.data = result.data.eventDocumentationList;
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