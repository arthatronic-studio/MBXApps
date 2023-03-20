import React from 'react';
import {Text as ReactText} from 'react-native';
import Styled from 'styled-components';
import {useColor} from '@src/components';

// export const fontFamily = {
//   regular: 'NeueHaasDisplay-Light',
//   medium: 'NeueHaasDisplay-Roman',
//   semibold: 'NeueHaasDisplay-Mediu',
//   bold: 'NeueHaasDisplay-Bold',
//   light: 'NeueHaasDisplay-Thin',
//   italic: 'NeueHaasDisplay-Thin',
// };

export const fontFamily = {
  regular: 'Inter-Light',
  medium: 'Inter-Regular',
  semibold: 'Inter-Medium',
  bold: 'Inter-Bold',
  light: 'Inter-Thin',
  italic: 'Inter-Thin',
};

const BaseText = Styled(ReactText)`
  fontSize: ${props => typeof props.size === 'number' ? `${props.size}px` : '14px'};
  fontFamily: ${props => fontFamily[props.type] || fontFamily.regular};
  textAlign: ${props => props.align || 'center'};
  color: ${props => props.color};
  textShadowRadius: 0;
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
        underline && {textDecorationLine: 'underline'},
        lineHeight && { lineHeight },
      ]}
      {...style}
      align={align}
      type={type}
      size={size}
      allowFontScaling={false}
      color={color || Color.text}>
      {children}
    </BaseText>
  );
};

export default Text;
