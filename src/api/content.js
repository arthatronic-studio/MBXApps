import Config from 'react-native-config';
import Client from '@src/lib/apollo';
import { queryContentProduct } from 'src/lib/query';

export const fetchContentProduct = async (variables) => {
    let response = {
        data: [],
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    try {
        const result = await Client.query({
            query: queryContentProduct,
            variables: {
                page: 1,
                itemPerPage: 6,
                productType: Config.PRODUCT_TYPE,
                ...variables,
            },
        });

        if (
            result &&
            result.data &&
            result.data.contentProduct &&
            Array.isArray(result.data.contentProduct)
        ) {
            response.data = result.data.contentProduct;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err content product', result);
            response.message = 'Gagal, silakan coba kembali';
            response.error = result;
        }

        return response;
    } catch (error) {
        console.log('catch content product', error);
        response.error = error;
        return response;
    }
}