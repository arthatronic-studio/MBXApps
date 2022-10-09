import React from 'react';
import { View, Modal, SafeAreaView, TouchableOpacity } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    Text,
    // TouchableOpacity,
    useColor
} from '@src/components';
import { Divider } from 'src/styled';

const ContainerModal = Styled(TouchableOpacity)`
  width: 100%;
  height: 100%;
  alignItems: center;
  justifyContent: center;
  backgroundColor: rgba(0, 0, 0, 0.4);
`;

const CardModal = Styled(TouchableOpacity)`
  width: 90%;
  alignItems: center;
  padding: 24px 16px;
`;

const defaultProps = {
    visible: true,
    type: 'info',
    onSubmit: () => {},
    onDiscard: () => {},
    onClose: () => {},
    title: '',
    message: '',
    showDiscardButton: false,
    AccepetText: 'Ya',
};

const AlertModal = ({
    visible, type, onSubmit, onDiscard, onClose, title, message, showDiscardButton, AccepetText,
}) => {
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
            <ContainerModal onPress={() => onClose()}>
                <CardModal activeOpacity={1} style={{backgroundColor: Color.theme}}>
                    {/* <View style={{width: 40, height: 40, borderRadius: 20, borderWidth: 3, borderColor: rawIcon().color, alignItems: 'center', justifyContent: 'center', marginBottom: 8}}>
                        <Ionicons name={rawIcon().name} size={30} color={rawIcon().color} />
                    </View> */}
                    
                    {title !== '' && <View style={{marginBottom: 16}}>
                        <Text type='bold' size={20} color={'#242424'}>{title}</Text>
                    </View>}
                    <Text size={12} type="medium" color="#3D3D3D">{message}</Text>

                    <View style={{width: '100%', flexDirection: 'row', marginTop: 16, alignItems: 'center'}}>
                        {showDiscardButton && <TouchableOpacity
                            style={{
                                flex: 1,
                            }}
                            onPress={() => {
                                onDiscard();
                            }}
                        >
                            <Text color={Color.primaryDark} underline>Cancel</Text>
                        </TouchableOpacity>}

                        {showDiscardButton && <Divider />}

                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                borderColor: '#E50000',
                                paddingVertical: 12,
                                borderWidth: 1,
                            }}
                            onPress={() => {
                                onSubmit();
                            }}
                        >
                            <Text color={'#E50000'} size={14} type="medium">{AccepetText}</Text>
                        </TouchableOpacity>
                    </View>
                </CardModal>
            </ContainerModal>
        </Modal>
    )
}

AlertModal.defaultProps = defaultProps;
export default AlertModal;