import { Platform } from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
import { uploadChunkProductManage } from './uploadChunkProductManage';

export const uploadChunkActions = (videoPath, variables) => {
  return (dispatch, getState) => {
    dispatch({ type: 'UPLOAD_CHUNK_STATE.RESET' });
    // dispatch({ type: 'UPLOAD_CHUNK_STATE.SET_ON_UPLOAD' });

    let path = videoPath;
    if (Platform.OS === 'ios') {
        path = videoPath.replace('file:', '');
    };

    return (
        RNFetchBlob.fs.stat(path)
        .then((stats) => {
            const fileSize = stats.size;
            // const partSize = fileSize / 10;
            const initPart = 4095 * 25;
            const partSize = fileSize > initPart ? initPart : fileSize;

            const total = Math.ceil(fileSize / partSize);

            dispatch({ type: 'UPLOAD_CHUNK_STATE.SET_TOTAL', data: total });
            dispatch({ type: 'UPLOAD_CHUNK_STATE.SET_PROGRESS', data: 0 });

            dispatch({ type: 'UPLOAD_CHUNK_STATE.UPDATE_IS_PORSES', data: { isProses: true, totalProses: total } });

            RNFetchBlob.fs.readStream(path, 'base64', partSize, -1)
            .then((stream) => {
                let index = 0;

                stream.open();

                stream.onData((chunk) => {
                    index += 1;

                    dispatch({ type: 'UPLOAD_CHUNK_STATE.UPDATE_IS_PORSES', data: { countProses: index } });
                    
                    console.log(index, 'index');
                    uploadChunkProductManage({
                        products: [{
                            name: variables.products[0].name,
                            method: 'UPLOAD_FILES',
                            stream: chunk,
                            type: variables.products[0].type,
                            part: index,
                        }]
                    }, total, 1);
                });

                stream.onEnd(() => {
                    dispatch({ type: 'UPLOAD_CHUNK_STATE.UPDATE_IS_PORSES', data: { isProses: false } });
                    // dispatch({ type: 'UPLOAD_CHUNK_STATE.SET_END_UPLOAD'});
                });
            })
            .catch(err => {
                console.log(err, 'err');
            })
        })
    )
  }
}