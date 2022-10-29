import React from 'react';
import Styled from 'styled-components';
import { View, Image, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';

import Text from '@src/components/Text';
import { useColor } from '@src/components';

import {
  imageEmpty,
  empty,
} from '@assets/images';

const Wrapper = Styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 16px;
  backgroundColor: ${props => props.transparent ? 'transparent' : props.backgroundColor};
`;

const Body = Styled(View)`
  background-color: ${props => props.transparent ? 'transparent' : props.backgroundColor};
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 5px;
  width: ${props => (props.type === 'small' ? '50%' : '100%')};
`;

const BodyText = Styled(View)`
  width: 100%
  margin-top: 15px;
  justify-content: center;
`;

const propTypes = {
  message: PropTypes.string,
  type: PropTypes.string,
  transparent: PropTypes.bool,
  style: PropTypes.object,
  imageAsset: PropTypes.any,
}

const defaultProps = {
  message: 'Data tidak tersedia',
  type: 'big',
  transparent: false,
  style: {},
  imageAsset: null,
}

const ScreenEmptyEvent = (props) => {
    const { message, type, transparent, style } = props;

    const { Color } = useColor();
    const { width } = useWindowDimensions();

    return (
      <Wrapper transparent={transparent} backgroundColor={Color.theme} {...style}>
        <Body type={type} transparent={transparent} backgroundColor={Color.theme}>
          <View
            style={{
              height: width / 5,
              aspectRatio: 1,
            }}
          >
            <Image
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode='contain'
              source={empty}
            />
          </View>

          {message && <BodyText>
            <Text type="semibold" size={17} lineHeight={20.4} color={Color.textSoft}>{message}</Text>
          </BodyText>}
        </Body>
      </Wrapper>
    );
}

ScreenEmptyEvent.propTypes = propTypes;
ScreenEmptyEvent.defaultProps = defaultProps;
export default ScreenEmptyEvent;