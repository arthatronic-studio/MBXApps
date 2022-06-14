import Client from '@src/lib/apollo';
import { queryUserAddressList } from "src/lib/query/user-address";

export const fetchUserAddressList = async({ userId, page, itemPerPage }) => {
    let response = {
        data: [],
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    const variables = {
        userId,
        page,
        itemPerPage: itemPerPage || 10,
    };

    try {
        const result = await Client.query({
            query: queryUserAddressList,
            variables,
        });
    
        if (
            result &&
            result.data &&
            Array.isArray(result.data.userAddressList)
        ) {
            const data = new Promise.all(
                result.data.userAddressList.map((item) => {
                    return {
                        ...item,
                        name: item.labelAddress,
                        caption: item.province.name,
                    };
                })
            )
            response.data = await data;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err userAddressList', result);
            response.message = 'Gagal, silakan coba kembali';
            error = result;
        }
    
        return response;
    } catch (error) {
        console.log('catch userAddressList', error);
        response.error = error;
        return response;
    }
};