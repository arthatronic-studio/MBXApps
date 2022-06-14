import Client from '@src/lib/apollo';
import { queryLocationCityListing, queryLocationProvinceListing } from 'src/lib/query/location';

export const fetchLocationProvince = async() => {
    let response = {
        data: [],
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    try {
        const result = await Client.query({
            query: queryLocationProvinceListing,
        });
    
        if (
            result &&
            result.data &&
            Array.isArray(result.data.locationProvinceListing)
        ) {
            const data = new Promise.all(
                result.data.locationProvinceListing.map((item) => {
                    return {
                        id: item.location_province_id,
                        name: item.location_province_name,
                        latitude: item.location_province_latitude,
                        longitude: item.location_province_longitude,
                    };
                })
            )
            response.data = await data;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err locationProvinceListing', result);
            response.message = 'Gagal, silakan coba kembali';
            error = result;
        }
    
        return response;
    } catch (error) {
        console.log('catch locationProvinceListing', error);
        response.error = error;
        return response;
    }
};

export const fetchLocationCity = async(provinceId) => {
    let response = {
        data: [],
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    const variables = {
        location_province_id: provinceId,
    };

    try {
        const result = await Client.query({
            query: queryLocationCityListing,
            variables,
        });
    
        if (
            result &&
            result.data &&
            Array.isArray(result.data.locationCityListing)
        ) {
            const data = new Promise.all(
                result.data.locationCityListing.map((item) => {
                    return {
                        id: item.location_city_id,
                        name: item.location_city_name,
                        latitude: item.location_city_latitude,
                        longitude: item.location_city_longitude,
                    };
                })
            )
            response.data = await data;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err locationCityListing', result);
            response.message = 'Gagal, silakan coba kembali';
            error = result;
        }
    
        return response;
    } catch (error) {
        console.log('catch locationCityListing', error);
        response.error = error;
        return response;
    }
};