import Client from '@src/lib/apolloUpload';
import { queryProductManage } from '@src/lib/query/queryContentProductManage';
import { store } from '@src/state/redux';

export const uploadChunkProductManage = (variables, total, counter) => {
    store.dispatch({ type: 'UPLOAD_CHUNK_STATE.SET_ON_UPLOAD' });

    Client.query({
        query: queryProductManage,
        variables,
    })
    .then((res) => {
        let progress = store.getState()['uploadChunkState'].progress + 1;
        store.dispatch({ type: 'UPLOAD_CHUNK_STATE.SET_PROGRESS', data: progress });

        if ( progress >= total) {
            store.dispatch({ type: 'UPLOAD_CHUNK_STATE.SET_END_UPLOAD' });
        }
    })
    .catch((err) => {
        console.log(err, '=== err upload chunk ===');
        
        store.dispatch({ type: 'UPLOAD_CHUNK_STATE.SET_ERROR', data: [variables.products[0].part] });
        store.dispatch({ type: 'UPLOAD_CHUNK_STATE.SET_ERROR_UPLOAD', data: true });
    })
};