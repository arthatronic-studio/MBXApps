import RNFetchBlob from 'react-native-blob-util';
import { uploadChunkProductManage } from './uploadChunkProductManage';

export const uploadChunkActions = (path, variables) => {
  return (dispatch, getState) => {
    dispatch({ type: 'UPLOAD_CHUNK_STATE.RESET' });

    return (
        RNFetchBlob.fs.stat(path)
        .then((stats) => {
            const fileSize = stats.size;
            // 4095 * 3
            const partSize = fileSize < 600000 ? 4095 * 3 : 600000;

            RNFetchBlob.fs.readStream(path, 'base64', partSize, -1)
            .then((stream) => {
                let index = 0;
                let progress = 0;

                let chunkData = [];

                stream.open();

                stream.onData((chunk) => {
                    index += 1;
                    progress += partSize;

                    // console.log(progress, 'progress', index);

                    chunkData.push({
                        products: [{
                            ...variables.products[0],
                            stream: chunk,
                            part: index,
                            method: 'UPLOAD_FILES',
                        }]
                    });
                });

                stream.onEnd(() => {
                    dispatch({ type: 'UPLOAD_CHUNK_STATE.SET_DATA', data: chunkData });
                    
                    let counter = 0;
                    chunkData.map((itemChunk) => {
                        counter += 1;
                        console.log(counter, 'counter');
                        
                        // uploadChunkProductManage(itemChunk, chunkData.length, counter);
                    });
                });
            })
            .catch(err => {
                console.log(err, 'err');
            })
        })
    )
  }
}