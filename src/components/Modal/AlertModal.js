import React from 'react';
import { View, Modal, SafeAreaView, TouchableOpacity } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    Text,
    // TouchableOpacity,
    useColor
} from '@src/components';

const ContainerModal = Styled(TouchableOpacity)`
  width: 100%;
  height: 100%;
  alignItems: center;
  justifyContent: center;
  backgroundColor: rgba(0, 0, 0, 0.4);
`;

const ButtonSubmit = Styled(TouchableOpacity)`
  borderRadius: 8px;
  width: 100%;
  height: 45px;
  justifyContent: center;
  elevation: 2;
  marginTop: 16px;
`;

const CardModal = Styled(View)`
  width: 90%;
  alignItems: center;
  padding: 16px;
  backgroundColor: #FFFFFF;
  borderRadius: 8px;
`;

const defaultProps = {
    visible: true,
    type: 'info',
    onSubmit: () => {},
    onClose: () => {},
    title: '',
    message: '',
};

const AlertModal = (props) => {
    const {
        visible, type, onSubmit, onClose,
        title, message,
    } = props;

    const { Color } = useColor();

    const rawIcon = () => {
        const result = {
            name: 'information',
            color: Color.info,
        };

        switch (type) {
            case 'success':
                result.name = 'checkmark';
                result.color = Color.success;
                return result;
            case 'error':
                result.name = 'close';
                result.color = Color.error;
                return result;
            case 'warning':
                result.name = 'warning';
                result.color = Color.warning;
                return result;
            default: return result;
        }
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType='fade'
            onRequestClose={() => {
                onClose();
            }}
        >
            <SafeAreaView>
                <ContainerModal onPress={() => onClose()}>
                    <CardModal>
                        <View style={{width: 74, height: 74, borderRadius: 37, borderWidth: 3, borderColor: rawIcon().color, alignItems: 'center', justifyContent: 'center', marginBottom: 8}}>
                            <Ionicons name={rawIcon().name} size={42} color={rawIcon().color} />
                        </View>
                        
                        {title !== '' && <View style={{marginBottom: 4}}>
                            <Text type='semibold' size={18} color={rawIcon().color}>{title}</Text>
                        </View>}
                        <Text type='semibold' size={16}>{message}</Text>

                        <ButtonSubmit
                            style={{backgroundColor: Color.theme}}
                            onPress={() => {
                                onSubmit();
                            }}
                        >
                            <Text>Oke</Text>
                        </ButtonSubmit>
                    </CardModal>
                </ContainerModal>
            </SafeAreaView>
        </Modal>
    )
}

AlertModal.defaultProps = defaultProps;

export default AlertModal;