import React from 'react';
import {Image, View} from 'react-native';
import Styled from 'styled-components';
import {
  Text,
  useColor,
} from '@src/components';

import TouchableOpacity from 'src/components/Button/TouchableDebounce';

const MainButton = Styled(View)`
  width: 100%;
`;

const CustomButton = Styled(TouchableOpacity)`
  backgroundColor: ${(props) => (props.color)};
  width: 100%;
  padding: 16px 8px;
  borderRadius: 0px;
  alignItems: center;
  justifyContent: center;
  flexDirection: row;
  borderWidth: 1px;
  borderColor: ${(props) => (props.borderColor)};
`;

const CustomImage = Styled(Image)`
  width: 10;
  height: 10;
  marginRight: 3;
`;

const defaultProps = {
  outline: false,
};

const Button = (props) => {
  const {
    fontColor,
    fontSize,
    color,
    onPress,
    children,
    disabled,
    type,
    source,
    style,
    outline,
  } = props;

  const {Color} = useColor();

  let buttonColor = color || Color.primary;
  let textColor = disabled ? Color.border : fontColor || Color.textInput;
  let borderColor = buttonColor;

  if (outline) {
    buttonColor = disabled ? Color.border : fontColor || Color.textInput;
    textColor = color || Color.primary;
    borderColor = textColor;
  }

  return (
    <MainButton
      style={disabled && { opacity: 0.6 }}
    >
      <CustomButton
        color={buttonColor}
        borderColor={borderColor}
        activeOpacity={disabled ? 1 : 0.65}
        onPress={() => {
          if (!disabled) {
            onPress();
          }
        }}
        {...style}
      >
        {source && <CustomImage source={source} />}
        
        <Text
          size={fontSize}
          type={type || 'semibold'}
          color={textColor}
        >
          {children}
        </Text>
      </CustomButton>
    </MainButton>
  );
};

Button.defaultProps = defaultProps;
export default Button;
