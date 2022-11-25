import { store } from '../state/redux';
import { postAPI } from './httpService';

export const stateUpdateProfile = async(body) => {
    const auth = await store.getState()['auth'];
    const endpoint = 'update-profile';
    const NewBody = body ? body : {};
    if(auth.guest_id){
        NewBody.gues_id = auth.guest_id;
    }else{
        NewBody.gues_id = 0;
    }
    const result = await postAPI(endpoint, NewBody);    
    if (result.status) {
        await store.dispatch({
            type: 'AUTH.SET_USER',
            data: result.data,
        });
    }

    return result;
}