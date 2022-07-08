import Client from '@src/lib/apollo';
import { queryCarTypeListing, queryCommunityMemberCheck, queryJoinCommunityUpdate } from "src/lib/query/community";
import { joinCommunityMember } from 'src/lib/query/joinCommunityMember';
import { accessClient } from 'src/utils/access_client';

export const fetchJoinCommunityMember = async({ status, userId, name }) => {
    let response = {
        data: [],
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    let variables = { initialCode: accessClient.InitialCode }
    if (status) variables.status = status;
    if (userId) variables.userId = userId
    if (name) variables.name = name;

    try {
        const result = await Client.query({
            query: joinCommunityMember,
            variables,
        });
    
        if (
            result &&
            result.data &&
            Array.isArray(result.data.joinCommunityMember)
        ) {
            response.data = result.data.joinCommunityMember;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err joinCommunityMember', result);
            response.message = 'Gagal, silakan coba kembali';
            error = result;
        }
    
        return response;
    } catch (error) {
        console.log('catch joinCommunityMember', error);
        response.error = error;
        return response;
    }
};

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
            variables: {
                initialCode: accessClient.InitialCode
            },
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
            variables: {
                initialCode: accessClient.InitialCode,
            }
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


export const fetchJoinCommunityUpdate = async(variables) => {
    let response = {
        data: null,
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    try {
        const result = await Client.query({
            query: queryJoinCommunityUpdate,
            variables,
        });
    
        if (
            result &&
            result.data
        ) {
            response.data = result.data.joinCommunityUpdate;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err joinCommunityUpdate', result);
            response.message = 'Gagal, silakan coba kembali';
            error = result;
        }
    
        return response;
    } catch (error) {
        console.log('catch joinCommunityUpdate', error);
        response.error = error;
        return response;
    }
};