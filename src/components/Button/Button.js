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
  padding: 16px;
  borderRadius: 50px;
  alignItems: center;
  justifyContent: center;
  flexDirection: row;
`;

const CustomImage = Styled(Image)`
  width: 10;
  height: 10;
  marginRight: 3;
`;

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
    style
  } = props;

  const {Color} = useColor();

  return (
    <MainButton
      style={disabled && { opacity: 0.6 }}
    >
      <CustomButton
        color={color || Color.primary}
        onPress={!disabled && onPress}
        {...style}
        {...props}
      >
        {source && <CustomImage source={source} />}
        
        <Text
          size={fontSize}
          type={type || 'semibold'}
          color={
            disabled ? Color.border : props.fontColor ? props.fontColor : Color.textButtonInline
          }>
          {children}
        </Text>
      </CustomButton>
    </MainButton>
  );
};

export default Button;
