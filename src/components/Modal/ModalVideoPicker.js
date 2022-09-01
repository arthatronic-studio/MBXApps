import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Modal from 'react-native-modal';

import {
    Text,
    useColor,
} from '@src/components';
import Button from '@src/components/Button/Button';
import { statusBarHeight } from 'src/utils/constants';
import { Divider, Line } from 'src/styled';
import { FFmpegKit, FFmpegKitConfig, FFprobeKit } from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';
import RNFetchBlobDf from 'react-native-blob-util';
import { useNavigation } from '@react-navigation/native';
import { ProgressView } from '@react-native-community/progress-view';

const outputVideoCache = `file://${RNFS.CachesDirectoryPath}/video.mp4`;
const outputImageCache = `file://${RNFS.CachesDirectoryPath}/image.png`;

const minVideoSize = 5000000;
const maxVideoSize = 400000000;

const options = {
    mediaType: 'video',
    maxWidth: 640,
    maxHeight: 640,
    quality: 1,
    includeBase64: true,
};

const defaultProps = {
    visible: false,
    onSelected: () => {},
    onClose: () => {},
};

const ModalVideoPicker = ({ visible, onSelected, onClose }) => {
    const { height, width } = useWindowDimensions();
    const { Color } = useColor();
    const navigation = useNavigation();

    const totalDuration = useRef(0);

    const [tempSelected, setTempSelected] = useState();
    const [processingVideo, setProcessingVideo] = useState(false);
    const [compressPercentage, setCompressPercentage] = useState(0);

    const data = [
        {
            id: 1,
            name: 'Buka Kamera',
            onPress: () => {
                launchCamera(options, (callback) => {
                    if (callback.didCancel) { }
                    else if (callback.errorCode) { }
                    else {
                        handleSelectImage(callback);
                    }
                });
            },
        },
        {
            id: 2,
            name: 'Buka Galeri',
            onPress: () => {
                launchImageLibrary(options, (callback) => {
                    if (callback.didCancel) { }
                    else if (callback.errorCode) { }
                    else {
                        handleSelectImage(callback);
                    }
                });
            },
        }
    ];

    useEffect(() => {
        const unsubListener = navigation.addListener('focus', (_) => {
            FFmpegKitConfig.enableLogCallback((log) => {});
            FFmpegKitConfig.enableStatisticsCallback(statisticsCallback);
        });

        return () => {
            unsubListener;
        }
    }, []);
    
    const statisticsCallback = (statistics) => {
        if (!statistics) {
            return;
        }

        let timeInMilliseconds = statistics.time / 1000;
        if (timeInMilliseconds > 0) {
            let totalVideoDuration = totalDuration.current;
            let completePercentage = Math.round((timeInMilliseconds * 100) / totalVideoDuration);
            setCompressPercentage(completePercentage);
        }
    }

    const handleSelectImage = (callback) => {
        setTempSelected(callback);
        validateSelected(callback);
    }

    const validateSelected = async(callback) => {
        // if (callback.duration > 15) {
        //     alert('Maksimal batas video 15 detik');
        //     return;
        // }
        
        setProcessingVideo(true);
        setCompressPercentage(0);
        // FFmpegKitConfig.resetStatistics(); gak ada di yg baru

        console.log('outputVideoCache', outputVideoCache);

        // const removeFilePath = await RNFetchBlobDf.fs.unlink(outputVideoCache);
        // console.log(removeFilePath, 'res removeFilePath');

        const result = await getRaw(callback);
        console.log('result get Raw', result);
        if (result) {
            if (result.messageText !== '') {
                onEndCompress();
                // showLoading('warning', result.messageText);
            } else if (result.uri !== '') {
                onEndCompress();
                onSelected(result);
                // getThumbnailFromVideo(result.imageCodec);
            } else {
                onCompressVideo(result);
                // getThumbnailFromVideo(result.imageCodec);
            }
        }

        // onSelected(callback);
    }

    const getRaw = async(callback) => {
        let _response = {
            uri: '',
            fileSize: 0,
            duration: callback.duration,
            videoCodec: [],
            imageCodec: [],
            messageText: '',
        };

        let uri = callback.uri;

        // tidak support content:// harus file://
        if (Platform.OS === 'android') {
            const getPath = await RNFetchBlobDf.fs.stat(callback.uri);
            uri = `file://${getPath.path}`;
        }

        // if (Platform.OS === 'ios') {
            // const ext = uri.split('.')[1];
            // const dest = `${RNFS.TemporaryDirectoryPath}input.${ext}`;
    
            // const copy = await RNFS.copyAssetsVideoIOS(uri, dest);
    
            // const stat = await RNFS.stat(copy);
            // uri = 'file://' + stat.path;
        // }

        const input = uri;
        let videoCodec = ['-i', input, '-c:v', 'libx264', '-crf', '23', '-preset', 'medium', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', '-vf', 'scale=-2:720,format=yuv420p', '-y', outputVideoCache];
        let imageCodec = ['-i', input, '-ss', '00:00:01.000', '-vframes', '1', '-y', outputImageCache];

        if (Platform.OS === 'ios') {
            // videoCodec = ['-i', input, '-s', `${480}x${320}`, '-r', '5', '-c:v', 'libx264', '-b:v', '600k', '-b:a', '44100', '-ac', '2', '-ar', '22050', '-tune', 'fastdecode', '-preset', 'ultrafast', '-y', outputVideoCache];
            videoCodec = ['-i', input, '-s', `${480}x${320}`, '-r', '5', '-c:v', 'libx264', '-b:v', '600k', '-b:a', '128k', '-ac', '2', '-ar', '22050', '-tune', 'fastdecode', '-preset', 'ultrafast', '-y', outputVideoCache];
            imageCodec = ['-i', input, '-ss', '00:00:01.000', '-frames', '1', '-y', outputImageCache];
        }

        const info = await FFprobeKit.getMediaInformation(input);
        const information = info.getMediaProperties();

        if (information) {
            totalDuration.current = Math.abs(information.duration);
            const fileSize = parseInt(information.size);

            _response.fileSize = fileSize;

            if (fileSize > maxVideoSize) {
                _response.messageText = 'Maksimal video yang dipilih 400mb';
                alert(_response.messageText);
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

    const onEndCompress = () => {
        onClose();
        setTempSelected();
        setProcessingVideo(false);
        setCompressPercentage(0);
        totalDuration.current = 0;
    }

    const onCompressVideo = (result) => {
        const videoCodec = result.videoCodec;
        console.log('videoCodec', videoCodec);
        FFmpegKit.executeWithArgumentsAsync(videoCodec, callback => {
            if (callback.returnCode === 0) {
                onEndCompress();

                FFprobeKit.getMediaInformation(outputVideoCache).then((info) => {
                    const information = info.getMediaProperties();
                    onSelected({ ...result, uri: outputVideoCache, fileSize: parseInt(information.size) });
                })
                .catch(() => {
                    onSelected({ ...result, uri: outputVideoCache, fileSize: 0 });
                });        
            } else {
                // showLoading('error', 'Gagal mengkompres file, Harap ulangi kembali');
                alert('Gagal memproses video, Harap ulangi kembali')
                onEndCompress();
            }
        });
    }

    const renderProcessing = () => {
        return (
            <View>
                <Divider height={32} />
                <Text>Memuat {compressPercentage}%</Text>
                <Divider height={8} />
                <ProgressView
                    progressTintColor={Color.primary}
                    trackTintColor={Color.border}
                    progress={compressPercentage / 100}
                />
            </View>
        )
    }

    const renderPreview = () => {
        return (
            <View>
                <View
                    style={{
                        width: '100%',
                        aspectRatio: 1,
                        paddingVertical: 16,
                    }}
                >
                    <Image
                        source={{ uri: tempSelected.uri }}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    />
                </View>

                <Button
                    onPress={() => {
                        validateSelected(tempSelected);
                        setTempSelected();
                    }}
                >
                    Selesai
                </Button>
            </View>
        )
    }

    const renderContent = () => {
        return data.map((item, idx) => {
            if (item.show === false) return <View key={idx} />;

            return (
                <TouchableOpacity
                    key={idx}
                    onPress={() => {
                        item.onPress ? item.onPress() : onPress(item, name);
                    }}
                    style={{
                        width: width - 32,
                        paddingVertical: 8,
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        marginTop: 16,
                    }}>
                    <Text
                        size={12}
                        align="left"
                        color={
                            item.color || Color.text
                        }>
                        {item.name}
                    </Text>
                </TouchableOpacity>
            );
        });
    };

    return (
        <Modal
            testID={'modal'}
            isVisible={visible}
            swipeDirection={['down']}
            // onBackdropPress={() => { !processingVideo && onEndCompress(); }}
            // onSwipeComplete={() => { !processingVideo && onEndCompress(); }}
            onBackdropPress={() => { onEndCompress(); }}
            onSwipeComplete={() => { onEndCompress(); }}
            style={{
                justifyContent: 'flex-end', // the keys of bottom half
                margin: 0,
            }}
        >
            <View
                style={{
                    backgroundColor: Color.theme,
                    paddingTop: 16,
                    paddingHorizontal: 16,
                    paddingBottom: statusBarHeight,
                }}
            >
                {/* handle */}
                <View>
                    <Line color={Color.primary} height={4} width={width / 6} radius={2} />
                </View>

                {
                    processingVideo ? renderProcessing() :
                    // tempSelected ? renderPreview() :
                    data.length > 0 ? renderContent() : children
                }
            </View>
        </Modal>
    );
}

ModalVideoPicker.defaultProps = defaultProps;
export default ModalVideoPicker;