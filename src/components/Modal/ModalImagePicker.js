import React from 'react';
import { useWindowDimensions } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

import {
    useColor,
} from '@src/components';
import ModalActions from 'src/components/Modal/ModalActions';

const options = {
    mediaType: 'photo',
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

const ModalImagePicker = ({ visible, onSelected, onClose }) => {
    const { height } = useWindowDimensions();
    const { Color } = useColor();
    
    return (
        <ModalActions
            visible={visible}
            onClose={() => {
                onClose();
            }}
            data={[
                {
                    id: 1,
                    name: 'Buka Kamera',
                    onPress: () => {
                        launchCamera(options, (callback) => {
                            if (callback.didCancel) {}
                            else if (callback.errorCode) {}
                            else {
                                onSelected(callback);
                            }

                            onClose();
                        });
                    },
                },
                {
                    id: 2,
                    name: 'Buka Galeri',
                    onPress: () => {
                        launchImageLibrary(options, (callback) => {
                            if (callback.didCancel) {}
                            else if (callback.errorCode) {}
                            else {
                                onSelected(callback);
                            }

                            onClose();
                        });
                    },
                }
            ]}
        />
    )
}

ModalImagePicker.defaultProps = defaultProps;
export default ModalImagePicker;