import RNFetchBlob from 'react-native-blob-util';

export const removeFilePath = (path) => {
  return (dispatch, getState) => {
    return (
      RNFetchBlob.fs.unlink(path)
        .then((res) => {
            console.log(res, 'res delete');
        })
        .catch(err => {
            console.log(err, 'err delete');
        })
    )
  }
}