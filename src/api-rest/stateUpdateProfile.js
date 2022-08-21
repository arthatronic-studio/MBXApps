import { store } from '../state/redux';
import { postAPI } from './httpService';

export const stateUpdateProfile = async(body) => {
    const endpoint = 'update-profile';
    const result = await postAPI(endpoint, body);
    console.log(`result ${endpoint} `, result);

    console.log(endpoint, body);
    
    if (result.status) {
        await store.dispatch({
            type: 'AUTH.SET_USER',
            data: result.data,
        });

        return true;
    }

    return false;
}