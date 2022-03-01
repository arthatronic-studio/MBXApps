import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';

import ImagesPath from 'src/components/ImagesPath';
import {
  Text,
  TouchableOpacity,
  useColor,
  Scaffold,
  Button,
} from '@src/components';
import { Container } from 'src/styled';
import FormInput from './FormInput';

const defaultProps = {
    visible: false,
    onSubmit: () => {},
    onClose: () => {},
    style: {},
    errorMessage: '',
};

const ModalInputCode = ({ visible, onSubmit, onClose, style, errorMessage }) => {
    const {Color} = useColor();

    const [text, setText] = useState('');
    const [errorText, setErrorText] = useState('');

    useEffect(() => {
        setErrorText(errorMessage);
    }, [errorMessage]);

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={() => {
                onClose();
            }}
            animationIn="slideInDown"
            animationOut="slideOutDown"
        >
            <Scaffold
                showHeader={false}
                style={{flex: 0, backgroundColor: 'transparent'}}
            >
            <View
                style={{
                    width: '100%',
                    padding: 16,
                    backgroundColor: Color.theme,
                    borderRadius: 8,
                    ...style,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        onClose();
                    }}
                    style={{
                        alignSelf: 'flex-end',
                        backgroundColor: Color.error,
                        borderRadius: 12,
                        padding: 2,
                    }}
                >
                    <Image
                        source={ImagesPath.icClose}
                        style={{width: 20, height: 20}}
                    />
                </TouchableOpacity>

                <Container marginVertical={16}>
                    <Text size={16} type='medium'>Masukan Kode Komunitas</Text>
                </Container>

                <FormInput
                    placeholder='Masukan kode'
                    value={text}
                    onChangeText={(val) => {
                        setText(val)
                    }}
                    error={errorText}
                    style={{
                        textAlign: 'center',
                    }}
                />

                <Button
                    onPress={() => {
                        if (text === '') {
                            setErrorText('Kode tidak boleh kosong');
                            return;
                        }

                        setErrorText('');

                        onSubmit(text);
                    }}
                >
                    Lanjut
                </Button>
            </View>
            </Scaffold>
        </Modal>
    )
}

ModalInputCode.defaultProps = defaultProps;
export default ModalInputCode;