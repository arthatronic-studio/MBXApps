import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Styled from 'styled-components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
    Text,
    // TouchableOpacity,
    useColor
} from '@src/components';

const ButtonView = Styled(View)`
    width: 100%;
    padding: 16px;
    borderColor: #00000029;
    borderTopWidth: ${props => props.borderTopWidth};
    flexDirection: ${props => props.row ? 'row' : 'column'};
    alignItems: center;
    justifyContent: space-between;
`;

const InfoButton = Styled(View)`
    width: 50%;
    height: 40px;
    justifyContent: space-between;
    alignItems: flex-start;
`;

const OutlineButton = Styled(TouchableOpacity)`
    width: ${props => props.width || '100%'};
    height: 40px;
    borderColor: ${props => props.twinButtonBorderColor};
    borderWidth: 1px;
    borderRadius: 45px;
    justifyContent: center;
    alignItems: center;
    marginBottom: ${props => props.marginBottom};
`;

const PayButton = Styled(TouchableOpacity)`
    width: ${props => props.width || '100%'};
    height: 45px;
    backgroundColor: ${props => props.backgroundColor};
    borderRadius: 45px;
    justifyContent: center;
    alignItems: center;

    ${props => props.buttonBorderColor && `
        borderColor: ${props.buttonBorderColor};
        borderWidth: 1px;
    `}
`;

const defaultProps = {
    title: 'Total',
    detail: 'Rp. 0',
    buttonLabel: 'Bayar',
    buttonWidth: '100%',
    buttonBorderTopWidth: 0.5,
    onPress: () => {},
    twinButtonLabel: 'Cek',
    onPressTwinButton: () => {},
    onPressToggle: () => {},
}

const Submit = (props) => {
    const {
        type, title, detail, withLeftToogle, onPressToggle,
        onPress, buttonLabel, buttonColor, buttonWidth, buttonTextColor, buttonBorderColor, buttonBorderTopWidth,
        onPressTwinButton, twinButtonLabel, twinButtonColor, twinButtonBorderColor, style,
    } = props;

    const { Color } = useColor();

    // if (type === 'button' || type === 'twinButton' || type === 'twinRowButton') {
    //     return (
    //         <ButtonView
    //             row={type === 'twinRowButton'}
    //             borderTopWidth={buttonBorderTopWidth}
    //             style={{backgroundColor: Color.theme}}
    //         >
    //             {withLeftToogle &&
    //             <OutlineButton marginBottom={type === 'twinRowButton' ? 0 : 8} twinButtonBorderColor={Color.secondary} width='10%' onPress={() => onPressToggle()}>
    //                 <AntDesign name='wechat' size={16} color={Color.secondary} />
    //             </OutlineButton>
    //             }
    //             {(type === 'twinButton' || type === 'twinRowButton') &&
    //             <OutlineButton marginBottom={type === 'twinRowButton' ? 0 : 8} twinButtonBorderColor={twinButtonBorderColor} width={buttonWidth} onPress={() => onPressTwinButton()}>
    //                 <Text size={16} letterSpacing={0.02} color={twinButtonColor || Color.disabled}>{twinButtonLabel}</Text>
    //             </OutlineButton>
    //             }
    //             <PayButton backgroundColor={buttonColor || Color.disabled} width={buttonWidth} buttonBorderColor={buttonBorderColor} onPress={() => onPress()}>
    //                 <Text size={16} letterSpacing={0.02} color={buttonTextColor || Color.theme}>{buttonLabel}</Text>
    //             </PayButton>
    //         </ButtonView>
    //     )
    // }
    
    // return (
    //     <ButtonView
    //         row={true}
    //         borderTopWidth={buttonBorderTopWidth}
    //         style={{backgroundColor: Color.theme}}
    //     >
    //         <InfoButton>
    //             <Text size={13} letterSpacing={0.02} color={Color.gray}>{title}</Text>
    //             <Text size={16} type='semibold' letterSpacing={0.02} color='#232323'>{detail}</Text>
    //         </InfoButton>
    //         <PayButton backgroundColor={buttonColor || Color.disabled} width='50%' buttonBorderColor={buttonBorderColor} onPress={() => onPress()}>
    //             <Text size={16} letterSpacing={0.02} color={buttonTextColor || Color.theme}>{buttonLabel}</Text>
    //         </PayButton>
    //     </ButtonView>
    // )

    // return (
    //     <PayButton backgroundColor={buttonColor || Color.disabled} width='50%' buttonBorderColor={buttonBorderColor} onPress={() => onPress()}>
    //         <Text size={16} letterSpacing={0.02} color={buttonTextColor || Color.theme}>{buttonLabel}</Text>
    //     </PayButton>
    // )

    if (type === 'bottomSingleButton') {
        return (
            <ButtonView
                row={true}
                borderTopWidth={buttonBorderTopWidth}
                style={{backgroundColor: Color.theme, ...style}}
            >
                <PayButton backgroundColor={buttonColor || Color.disabled} width='100%' buttonBorderColor={buttonBorderColor} onPress={() => onPress()}>
                    <Text size={16} letterSpacing={0.02} color={buttonTextColor || Color.theme}>{buttonLabel}</Text>
                </PayButton>
            </ButtonView>
        )
    }
}

Submit.defaultProps = defaultProps;

export default Submit;