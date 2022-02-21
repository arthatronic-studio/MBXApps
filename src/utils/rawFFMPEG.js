import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { RNFFprobe } from 'react-native-ffmpeg';

const outputVideoCache = `file://${RNFS.CachesDirectoryPath}/video.mp4`;
const outputImageCache = `file://${RNFS.CachesDirectoryPath}/image.png`;

const getRawCodec = async(param, totalDuration) => {
    let _response = {
        uri: '',
        videoCodec: [],
        imageCodec: [],
        messageText: '',
    };

    const idxSelected = param.selected[0];
    let uri = param.photos[idxSelected].node.image.uri;

    if (Platform.OS === 'ios') {
        const ext = param.photos[idxSelected].node.image.filename.split('.')[1];
        const dest = `${RNFS.TemporaryDirectoryPath}input.${ext}`;

        const copy = await RNFS.copyAssetsVideoIOS(uri, dest);

        const stat = await RNFS.stat(copy);
        uri = 'file://' + stat.path;
    }

    const input = uri;
    let videoCodec = ['-i', input, '-c:v', 'libx264', '-crf', '23', '-preset', 'medium', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', '-vf', 'scale=-2:720,format=yuv420p', '-y', outputVideoCache];
    let imageCodec = ['-i', input, '-ss', '00:00:01.000', '-vframes', '1', '-y', outputImageCache];

    if (Platform.OS === 'ios') {
        videoCodec = ['-i', input, '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', '-vf', 'scale=-2:720,format=yuv420p', '-y', outputVideoCache];
        imageCodec = ['-i', input, '-ss', '00:00:01.000', '-frames', '1', '-y', outputImageCache];
    }

    const info = await RNFFprobe.getMediaInformation(input);
    const information = info.getMediaProperties();

    if (information) {
        totalDuration.current = Math.abs(information.duration);
        const fileSize = parseInt(information.size);
        const minVideoSize = 5000000;
        const maxVideoSize = 400000000;

        if (fileSize > maxVideoSize) {
            _response.messageText = 'Maksimal video yang dipilih 400mb';
            return _response;
        }

        if (fileSize < minVideoSize) {
            _response.uri = input;
            _response.imageCodec = imageCodec;
            return _response;
        }
    }

    _response.videoCodec = videoCodec;
    _response.imageCodec = imageCodec;

    return _response;
}

export {
    outputVideoCache,
    outputImageCache,
    getRawCodec,
};