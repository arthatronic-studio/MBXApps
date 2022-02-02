import React from 'react';
import Styled from 'styled-components';
import { View, ActivityIndicator, Platform } from 'react-native';
import PropTypes from 'prop-types';

import { useColor } from '@src/components';
import Text from '@src/components/Text';

const Wrapper = Styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 16px;
  backgroundColor: ${props => props.transparent ? 'transparent' : props.backgroundColor};
`;

const Body = Styled(View)`
  backgroundColor: ${props => (props.transparent ? 'transparent' : props.backgroundColor)};
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 5px;
  width: ${props => (props.type === 'small' ? '50%' : '100%')};
`;

const ContainerIndicator = Styled(View)`
  borderWidth: ${Platform.OS === 'android' ? '5px' : '0px'};
  borderRadius: 25px;
  height: 50px;
  width: 50px;
  justifyContent: center;
  alignItems: center;
`;

const BodyText = Styled(View)`
  width: 100%
  margin-top: 15px;
  justify-content: center;
`;

const propTypes = {
  visible: PropTypes.bool,
  message: PropTypes.string,
  type: PropTypes.string,
  transparent: PropTypes.bool,
}

const defaultProps = {
  visible: true,
  message: 'Mohon Tunggu',
  type: 'large',
  transparent: false,
};

const ScreenIndicator = (props) => {
    const { visible, message, type, transparent } = props;

    const { Color } = useColor();

    if (!visible) {
      return <View />
    }

    return (
      <Wrapper transparent={transparent} backgroundColor={Color.theme}>
        <Body type={type} transparent={transparent} backgroundColor={Color.theme}>
          <ContainerIndicator style={{borderColor: Color.theme}}>
            <ActivityIndicator size={Platform.OS === 'android' ? 60 : type} color={Color.primary} style={{position: 'absolute'}} />
          </ContainerIndicator>
          {message && <BodyText>
            <Text color={Color.primary}>{message}</Text>
          </BodyText>}
        </Body>
      </Wrapper>
    );
}

ScreenIndicator.propTypes = propTypes;
ScreenIndicator.defaultProps = defaultProps;
export default ScreenIndicator;