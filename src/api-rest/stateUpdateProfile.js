import { store } from '../state/redux';
import { postAPI } from './httpService';

export const stateUpdateProfile = async(body) => {
    const endpoint = 'update-profile';
    const result = await postAPI(endpoint, body);
    
    console.log(`result ${endpoint} ${body}`, result);
    
    if (result.status) {
        await store.dispatch({
            type: 'AUTH.SET_USER',
            data: result.data,
        });
    }

    return result;
}