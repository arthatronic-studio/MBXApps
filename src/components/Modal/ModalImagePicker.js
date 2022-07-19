import React, { useState } from 'react';
import { View, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Modal from 'react-native-modal';

import {
    Text,
    useColor,
} from '@src/components';
import Button from '@src/components/Button/Button';
import { statusBarHeight } from 'src/utils/constants';
import { Line } from 'src/styled';

const options = {
    mediaType: 'photo',
    maxWidth: 640,
    maxHeight: 640,
    quality: 1,
    includeBase64: true,
};

const defaultProps = {
    visible: false,
    onSelected: () => { },
    onClose: () => { },
    withPreview: false,
};

const ModalImagePicker = ({ visible, onSelected, onClose, withPreview }) => {
    const { height, width } = useWindowDimensions();
    const { Color } = useColor();

    const [tempSelected, setTempSelected] = useState();

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

                    if (!withPreview) onClose();
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

                    if (!withPreview) onClose();
                });
            },
        }
    ];

    const handleSelectImage = (callback) => {
        if (withPreview) {
            setTempSelected(callback);
        } else {
            onSelected(callback);
        }
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
                            backgroundColor: 'red'
                        }}
                    />
                </View>

                <Button
                    onPress={() => {
                        onSelected(tempSelected);
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
            onBackdropPress={() => { onClose(); setTempSelected(); }}
            onSwipeComplete={() => { onClose(); setTempSelected(); }}
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
                    tempSelected ? renderPreview() :
                    data.length > 0 ? renderContent() : children
                }
            </View>
        </Modal>
    );
}

ModalImagePicker.defaultProps = defaultProps;
export default ModalImagePicker;