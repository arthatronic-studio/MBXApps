import Client from '@src/lib/apollo';
import { queryCarTypeListing, queryCommunityMemberCheck } from "src/lib/query/community";

export const fetchCarTypeListing = async() => {
    let response = {
        data: [],
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    try {
        const result = await Client.query({
            query: queryCarTypeListing,
        });
    
        if (
            result &&
            result.data &&
            Array.isArray(result.data.carTypeListing)
        ) {
            const data = new Promise.all(
                result.data.carTypeListing.map((item) => {
                    return {
                        id: item.id,
                        name: item.car_type_name,
                    };
                })
            )
            response.data = await data;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err carTypeListing', result);
            response.message = 'Gagal, silakan coba kembali';
            error = result;
        }
    
        return response;
    } catch (error) {
        console.log('catch carTypeListing', error);
        response.error = error;
        return response;
    }
};

export const fetchCommunityMemberCheck = async() => {
    let response = {
        data: null,
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    try {
        const result = await Client.query({
            query: queryCommunityMemberCheck,
        });
    
        if (
            result &&
            result.data
        ) {
            response.data = result.data.joinCommunityMemberCheck;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err joinCommunityMemberCheck', result);
            response.message = 'Gagal, silakan coba kembali';
            error = result;
        }
    
        return response;
    } catch (error) {
        console.log('catch joinCommunityMemberCheck', error);
        response.error = error;
        return response;
    }
};