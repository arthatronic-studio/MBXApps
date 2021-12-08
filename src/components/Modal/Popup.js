import React, { useState, useEffect } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Portal } from 'react-native-portalize';

import TouchableOpacity from 'src/components/Button/TouchableDebounce';
import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import { isIphoneNotch, statusBarHeight } from 'src/utils/constants';

const { height, width } = Dimensions.get('window');

const MainView = Styled(Animated.View)`
    width: ${width}px;
    position: absolute;
    top: ${props => props.top}px;
    ${props => !props.fitHeight && `height: ${height}px`}
`;

const TouchablePopup = Styled(TouchableOpacity)`
    minHeight: 60px;
    width: 100%;
    flexDirection: row;
    backgroundColor: ${props => props.backgroundColor};
    alignItems: center;
    justifyContent: flex-start;
    padding: 0px 16px;
`;

const IconView = Styled(View)`
    marginRight: 8px;
`;

const CloseView = Styled(TouchableOpacity)`
`;

const DescriptionView = Styled(View)`
    flex: 1;
    alignItems: flex-start;
`;

export const usePopup = () => {
    const [popupProps, setPopupProps] = useState({
        visible: false,
        popupLabel: '',
        onClose: () => setPopupProps({
          ...popupProps, visible: false
        }),
    });

    const showPopup = (popupLabel, popupType) => {
        setPopupProps({
            ...popupProps,
            visible: true,
            popupLabel,
            popupType
        })
    }

    return [popupProps, showPopup];
}

const defaultProps = {
    visible: false,
    onClose: () => {},
    timeout: true,
    timeoutDelay: 3000,
    fitHeight: true,
    popupType: '',
    popupLabel: '',
    isTranslucent: false,
}

const Popup = ({
    visible,
    onClose,
    timeout,
    timeoutDelay,
    fitHeight,
    popupType,
    popupLabel,
    isTranslucent,
}) => {
    const [showPopup] = useState(new Animated.Value(-height));

    const { Color } = useColor();

    useEffect(() => {
        if (visible) {
            openModalPopup();
        } else {
            closeModalPopup();
        }
    }, [visible])

    const openModalPopup = () => {
        Animated.timing(showPopup, {
            duration: 300,
            toValue: 0,
            useNativeDriver: true
        }).start();
    
        if (timeout) {
            setTimeout(() => {
                closeModalPopup();
                onClose();
            }, timeoutDelay);
        }
    }
    
    const closeModalPopup = () => {
        Animated.timing(showPopup, {
            duration: 300,
            toValue: -height,
            useNativeDriver: true
        }).start();
    }

    const getLabelType = (type) => {
        switch(type) {
            case 'info': return 'Info!';
            case 'warning': return 'Peringatan!';
            case 'error': return 'Ups!';
            default: return 'Berhasil!';
        }
    }

    const renderPopup = () => {
        let icon = <Ionicons name='information-circle' color={Color.theme} size={32} />;
        if (popupType === 'success') icon = <Ionicons name='checkmark-circle' color={Color.theme} size={32} />;
        else if (popupType === 'error') icon = <Ionicons name='close-circle' color={Color.theme} size={32} />;

        return (
            <MainView
                style={{ transform: [{translateY: showPopup}] }}
                fitHeight={fitHeight}
                top={isTranslucent ? statusBarHeight : isIphoneNotch() ? statusBarHeight : 0}
            >
                <TouchablePopup
                    onPress={() => closeModalPopup()}
                    backgroundColor={popupType && popupType !== '' ? Color[popupType] : 'transparent'}
                >
                    <IconView>
                        {icon}
                    </IconView>
                    <DescriptionView>
                        <Text size={12} type='bold' align='left' color={Color.theme}>{getLabelType(popupType)}</Text>
                        <Text size={14} align='left' color={Color.theme}>{popupLabel}</Text>
                    </DescriptionView>
                    <CloseView onPress={() => onClose()}>
                        <Ionicons name='close-outline' color={Color.theme} size={20} />
                    </CloseView>
                </TouchablePopup>
            </MainView>
        )
    }

    return <Portal>{renderPopup()}</Portal>;
}

Popup.defaultProps = defaultProps;

export default Popup;