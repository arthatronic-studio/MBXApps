import React from 'react';
import {Text as ReactText} from 'react-native';
import Styled from 'styled-components';
import {useColor} from '@src/components';

const fontFamily = {
  regular: 'Raleway-Regular',
  medium: 'Raleway-Medium',
  semibold: 'Raleway-SemiBold',
  bold: 'Raleway-Bold',
  light: 'Raleway-Light',
  italic: 'Raleway-Italic',
};

const BaseText = Styled(ReactText)`
  fontSize: ${(props) => props.size || '14px'};
  fontFamily: ${(props) => fontFamily[props.type] || fontFamily.regular};
  textAlign: ${(props) => props.align || 'center'};
  color: ${(props) => props.color};
  textShadowRadius: 0;

  ${(props) =>
    props.lineHeight &&
    `
    lineHeight: ${props.lineHeight}
  `}
`;

const Text = (props) => {
  const {
    type,
    align,
    children,
    size,
    lineHeight,
    letterSpacing,
    color,
    ...style
  } = props;

  const {Color} = useColor();

  return (
    <BaseText
      style={[letterSpacing && {letterSpacing}]}
      {...style}
      align={align}
      type={type}
      size={size}
      lineHeight={lineHeight}
      allowFontScaling={false}
      color={color || Color.text}>
      {children}
    </BaseText>
  );
};

export default Text;
