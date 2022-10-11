import React from 'react';
import {Text as ReactText} from 'react-native';
import Styled from 'styled-components';
import {useColor} from '@src/components';

export const fontFamily = {
  regular: 'NeueHaasDisplay-Light',
  medium: 'NeueHaasDisplay-Roman',
  semibold: 'NeueHaasDisplay-Mediu',
  bold: 'NeueHaasDisplay-Bold',
  light: 'NeueHaasDisplay-Thin',
  italic: 'NeueHaasDisplay-Thin',
};

const BaseText = Styled(ReactText)`
  fontSize: ${props => props.size || '14px'};
  fontFamily: ${props => fontFamily[props.type] || fontFamily.regular};
  textAlign: ${props => props.align || 'center'};
  color: ${props => props.color};
  textShadowRadius: 0;

  ${props =>
    props.lineHeight &&
    `
    lineHeight: ${props.lineHeight}
  `}
`;

const Text = props => {
  const {
    type,
    align,
    children,
    size,
    lineHeight,
    letterSpacing,
    color,
    italic,
    underline,
    ...style
  } = props;

  const {Color} = useColor();

  return (
    <BaseText
      style={[
        // letterSpacing && {letterSpacing},
        { letterSpacing: letterSpacing ? letterSpacing : 0.4 },
        italic && {fontStyle: 'italic'},
        underline && {textDecorationLine: 'underline'}
      ]}
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
