import Client from '@src/lib/apollo';
import { queryGetArea, queryGetCity, queryGetProvince, queryGetSub } from 'src/lib/query/ecommerce';

export const fetchShipperGetProvinceList = async(variables) => {
    let response = {
        data: [],
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    try {
        const result = await Client.query({
            query: queryGetProvince,
            variables: {
                countryCode: 228,
                ...variables,
            },
        });
    
        if (
            result &&
            result.data &&
            result.data.shipperGetProvinceList
        ) {
            response.data = result.data.shipperGetProvinceList;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err shipperGetProvinceList', result);
            response.message = 'Gagal, silakan coba kembali';
            error = result;
        }
    
        return response;
    } catch (error) {
        console.log('catch shipperGetProvinceList', error);
        response.error = error;
        return response;
    }
};

export const fetchShipperGetCityList = async(variables) => {
    let response = {
        data: [],
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    try {
        const result = await Client.query({
            query: queryGetCity,
            variables,
        });
    
        if (
            result &&
            result.data &&
            result.data.shipperGetCitiesList
        ) {
            response.data = result.data.shipperGetCitiesList;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err shipperGetCitiesList', result);
            response.message = 'Gagal, silakan coba kembali';
            error = result;
        }
    
        return response;
    } catch (error) {
        console.log('catch shipperGetCitiesList', error);
        response.error = error;
        return response;
    }
};

export const fetchShipperGetSuburbList = async(variables) => {
    let response = {
        data: [],
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    try {
        const result = await Client.query({
            query: queryGetSub,
            variables,
        });
    
        if (
            result &&
            result.data &&
            result.data.shipperGetSuburbList
        ) {
            response.data = result.data.shipperGetSuburbList;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err shipperGetSuburbList', result);
            response.message = 'Gagal, silakan coba kembali';
            error = result;
        }
    
        return response;
    } catch (error) {
        console.log('catch shipperGetSuburbList', error);
        response.error = error;
        return response;
    }
};

export const fetchShipperGetAreaList = async(variables) => {
    let response = {
        data: [],
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    try {
        const result = await Client.query({
            query: queryGetArea,
            variables,
        });
    
        if (
            result &&
            result.data &&
            result.data.shipperGetAreaList
        ) {
            response.data = result.data.shipperGetAreaList;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err shipperGetAreaList', result);
            response.message = 'Gagal, silakan coba kembali';
            error = result;
        }
    
        return response;
    } catch (error) {
        console.log('catch shipperGetAreaList', error);
        response.error = error;
        return response;
    }
};