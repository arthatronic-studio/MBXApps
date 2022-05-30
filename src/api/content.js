import Config from 'react-native-config';
import Client from '@src/lib/apollo';
import { queryContentProduct, queryContentUserProduct } from 'src/lib/query';

export const fetchContentProduct = async(variables) => {
    let response = {
        data: [],
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    const v = {
        page: 1,
        itemPerPage: 6,
        productType: Config.PRODUCT_TYPE,
        ...variables,
    };

    try {
        const result = await Client.query({
            query: queryContentProduct,
            variables: v,
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
        console.log('catch content product', JSON.stringify(error));
        response.error = error;
        return response;
    }
}

export const fetchContentUserProduct = async(variables) => {
    let response = {
        data: [],
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    const v = {
        page: 1,
        itemPerPage: 6,
        productType: Config.PRODUCT_TYPE,
        ...variables,
    };

    try {
        const result = await Client.query({
            query: queryContentUserProduct,
            variables: v,
        });

        if (
            result &&
            result.data &&
            result.data.contentUserProduct &&
            Array.isArray(result.data.contentUserProduct)
        ) {
            response.data = result.data.contentUserProduct;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err content user product', result);
            response.message = 'Gagal, silakan coba kembali';
            response.error = result;
        }

        return response;
    } catch (error) {
        console.log('catch content user product', JSON.stringify(error));
        response.error = error;
        return response;
    }
}