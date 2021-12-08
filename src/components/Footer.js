import React from 'react';
import {View} from 'react-native';
import Styled from 'styled-components';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Text from '@src/components/Text';
import {useColor} from '@src/components/Color';
import {TouchableOpacity} from '@src/components/Button';

const ButtonView = Styled(View)`
    width: 100%;
    padding: 16px;
    borderColor: #00000029;
    borderTopWidth: ${(props) => props.borderTopWidth};
    flexDirection: ${(props) => (props.row ? 'row' : 'column')};
    alignItems: center;
    justifyContent: space-between;
    backgroundColor: ${(props) => props.color};
`;

const InfoButton = Styled(View)`
    width: 50%;
    height: 40px;
    justifyContent: space-between;
    alignItems: flex-start;
`;

const OutlineButton = Styled(TouchableOpacity)`
    width: ${(props) => props.width || '100%'};
    height: 40px;
    borderColor: ${(props) => props.twinButtonBorderColor};
    borderWidth: 1px;
    borderRadius: 4px;
    justifyContent: center;
    alignItems: center;
    marginBottom: ${(props) => props.marginBottom};
`;

const PayButton = Styled(TouchableOpacity)`
    width: ${(props) => props.width || '100%'};
    height: 40px;
    backgroundColor: ${(props) => props.backgroundColor};
    borderRadius: 4px;
    justifyContent: center;
    alignItems: center;

    ${(props) =>
      props.buttonBorderColor &&
      `
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
};

const Footer = (props) => {
  const {
    footerType,
    title,
    detail,
    withLeftToogle,
    onPressToggle,
    onPress,
    buttonLabel,
    buttonColor,
    buttonWidth,
    buttonTextColor,
    buttonBorderColor,
    buttonBorderTopWidth,
    onPressTwinButton,
    twinButtonLabel,
    twinButtonColor,
    twinButtonBorderColor,
  } = props;

  const {Color} = useColor();

  if (
    footerType === 'button' ||
    footerType === 'twinButton' ||
    footerType === 'twinRowButton'
  ) {
    return (
      <ButtonView
        row={footerType === 'twinRowButton'}
        borderTopWidth={buttonBorderTopWidth}
        color={Color.theme}>
        {withLeftToogle && (
          <OutlineButton
            marginBottom={footerType === 'twinRowButton' ? 0 : 8}
            twinButtonBorderColor={Color.secondary}
            width="10%"
            onPress={() => onPressToggle()}>
            <AntDesign name="wechat" size={16} color={Color.secondary} />
          </OutlineButton>
        )}

        {(footerType === 'twinButton' || footerType === 'twinRowButton') && (
          <OutlineButton
            marginBottom={footerType === 'twinRowButton' ? 0 : 8}
            twinButtonBorderColor={twinButtonBorderColor}
            width={buttonWidth}
            onPress={() => onPressTwinButton()}>
            <Text
              size={16}
              letterSpacing={0.02}
              color={twinButtonColor || Color.primary}>
              {twinButtonLabel}
            </Text>
          </OutlineButton>
        )}
        <PayButton
          backgroundColor={buttonColor || Color.border}
          width={buttonWidth}
          buttonBorderColor={buttonBorderColor}
          onPress={() => onPress()}>
          <Text
            size={16}
            letterSpacing={0.02}
            color={buttonTextColor || Color.textInput}>
            {buttonLabel}
          </Text>
        </PayButton>
      </ButtonView>
    );
  }

  return (
    <ButtonView
      row={true}
      borderTopWidth={buttonBorderTopWidth}
      color={Color.theme}>
      <InfoButton>
        <Text size={13} letterSpacing={0.02} color={Color.gray}>
          {title}
        </Text>
        <Text size={16} type="semibold" letterSpacing={0.02} color="#232323">
          {detail}
        </Text>
      </InfoButton>
      <PayButton
        backgroundColor={buttonColor || Color.border}
        width="50%"
        buttonBorderColor={buttonBorderColor}
        onPress={() => onPress()}>
        <Text
          size={16}
          letterSpacing={0.02}
          color={buttonTextColor || Color.textInput}>
          {buttonLabel}
        </Text>
      </PayButton>
    </ButtonView>
  );
};

Footer.defaultProps = defaultProps;

export default Footer;
