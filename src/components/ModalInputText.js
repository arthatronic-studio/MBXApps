import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  useWindowDimensions,
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
    successMessage: '',
    errorMessage: '',
    headerLabel: 'Masukan Teks',
    placeholder: 'Masukan teks',
    isTextArea: false,
};

const ModalInputText = ({ visible, onSubmit, onClose, style, successMessage, errorMessage, headerLabel, placeholder, isTextArea }) => {
    const {Color} = useColor();
    const {height} = useWindowDimensions();

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
                        <Text size={16} type='medium'>{headerLabel}</Text>
                    </Container>
                    
                    <FormInput
                        placeholder={placeholder}
                        value={text}
                        onChangeText={(val) => {
                            setText(val)
                        }}
                        error={errorText}
                        style={{
                            textAlign: 'center',
                            maxHeight: height / 2,
                        }}
                        multiline={isTextArea}
                    />

                    {successMessage !== '' ?
                        <Container paddingVertical={8}>
                            <Text color={Color.success}>{successMessage}</Text>
                        </Container>
                    :
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
                            Laporkan
                        </Button>
                    }
                </View>
            </Scaffold>
        </Modal>
    )
}

ModalInputText.defaultProps = defaultProps;
export default ModalInputText;