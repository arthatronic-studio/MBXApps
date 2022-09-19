import axios from 'axios';
import { CommonActions } from '@react-navigation/native';
import qs from 'qs';
import Config from 'react-native-config';

import { navigationRef } from 'App';
import { store } from '../state/redux';

const statusCodeDanger = [401];
const statusCodeReject = [500];

export const requestHttp = axios.create({
    baseURL: Config.REST_API_URL,
});

const redirect = async() => {
    // clear session token
    await store.dispatch({ type: 'AUTH.CLEAR' });
    await store.dispatch({type: 'USER.LOGOUT'});

    // handle multiple redirect
    const safeNavigation = navigationRef.current && typeof navigationRef.current.getRootState === 'function';
    if (safeNavigation) {
        const navRoutes = await navigationRef.current.getRootState();
        if (Array.isArray(navRoutes.routes) && typeof navRoutes.index === 'number' && typeof navRoutes.routes[navRoutes.index] !== 'undefined' && navRoutes.routes[navRoutes.index].name === 'LoginScreen') {
            return;
        }
    }

    // redirect
    await navigationRef.current.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'LoginScreen', params: { logout: true } },
          ],
        })
    );
}

export const successResponse = (data) => {
    return {
        ...data,
        status: data.success,
        message: data.message || 'OK',
    };
}

export const errorResponse = (data) => {
    return {
        status: false,
        message: data && data.message ? data.message : 'Tidak terhubung ke server',
        data: data,
    };
}

export const postAPI = async(endtpoint, body, headers) => {
    const auth = await store.getState()['auth'];
    
    if (auth.token === null) {
        redirect();
        return;
    }

    const config = {
        headers: {
            'Authorization': 'Bearer ' + auth.token,
            'Content-Type': 'application/json',
            ...headers,
        }
    }

    const data = headers && headers['Content-Type'] === 'application/x-www-form-urlencoded' ? qs.stringify(body) : body;

    try {
        const result = await requestHttp.post(
            endtpoint,
            data,
            config
        );

        // console.log('result result result', result);

        if (result.status === 200) {
            if (result.data.message === 'Unauthenticated.') {
                redirect();
                return;
            }

            return successResponse(result.data);
        }

        throw {
            status: result.status,
            message: 'Terjadi kesalahan',
            data: result,
        };
    } catch (error) {
        if (error) {
            if (error.response && error.response.status && statusCodeDanger.includes(error.response.status)) {
                redirect();
                return;
            }

            return errorResponse({ status: statusCodeReject[0] });
        }

        throw errorResponse(error.response.data);
    }
}

export const getAPI = async(endtpoint, body, headers) => {
    const auth = await store.getState()['auth'];
    
    if (auth.token === null) {
        redirect();
        return;
    }

    const config = {
        data: body,
        headers: {
            'Authorization': 'Bearer ' + auth.token,
            ...headers,
        }
    }

    try {
        const result = await requestHttp.get(endtpoint, config);

        // console.log('result result result', result);

        if (result.status === 200) {
            if (result.data.message === 'Unauthenticated.') {
                redirect();
                return;
            }

            return successResponse(result.data);
        }

        throw {
            status: result.status,
            message: 'Terjadi kesalahan',
            data: result,
        };
    } catch (error) {
        if (error) {
            if (error.response && error.response.status && statusCodeDanger.includes(error.response.status)) {
                redirect();
                return;
            }

            return errorResponse({ status: statusCodeReject[0] });
        }
        
        throw errorResponse(error.response.data);
    }
}

export const postNonAuth = async(endtpoint, body) => {
    try {
        const result = await requestHttp.post(
            endtpoint,
            qs.stringify(body),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        if (result.status === 200) {
            return successResponse(result.data);
        }

        throw errorResponse(result.data);
    } catch (error) {
        throw errorResponse(error.response.data);
    }
}