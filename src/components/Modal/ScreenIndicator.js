import React from 'react';
import { View, ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';

import { useColor } from '@src/components';
import Text from '@src/components/Text';
import { Divider } from 'src/styled';
import { shadowStyle } from 'src/styles';

const propTypes = {
  visible: PropTypes.bool,
  message: PropTypes.string,
  type: PropTypes.string,
}

const defaultProps = {
  visible: true,
  message: 'Mohon Tunggu',
  type: 'large',
};

const ScreenIndicator = (props) => {
    const { visible, message, type } = props;

    const { Color } = useColor();
    const {width} = useWindowDimensions();

    if (!visible) {
      return <View />
    }

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}
      >
        <View
          style={{
            width: width / 1.5,
            aspectRatio: 21 / 9,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            backgroundColor: Color.primary,
            ...shadowStyle,
          }}
        >
          <ActivityIndicator size={Platform.OS === 'android' ? 60 : type} color={Color.text}/>
          <Divider height={12} />
          <Text>{message}</Text>
        </View>
      </View>
    );
}

ScreenIndicator.propTypes = propTypes;
ScreenIndicator.defaultProps = defaultProps;
export default ScreenIndicator;