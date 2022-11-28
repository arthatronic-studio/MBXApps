import React from 'react';
import { View, Image, TouchableOpacity, Animated } from 'react-native';
import Styled from 'styled-components';
import PropTypes from 'prop-types';

import {
  Row, Col,
  Text,
  useColor
} from '@src/components';
import imageAssets, {
  iconSplash,
  iconApp
} from '@assets/images';
import { Container, Divider } from 'src/styled';
import { useSelector } from 'react-redux';

const SideButton = Styled(TouchableOpacity)`
    height: 100%;
    alignItems: flex-end;
    justifyContent: center;
`;

const propTypes = {
  title: PropTypes.string,
  titleRight: PropTypes.string,
  actions: PropTypes.node,
  style: PropTypes.object,
  useAnimated: PropTypes.bool,
};

const defaultProps = {
    type: '',
    title: '',
    titleRight: '',
    actions: null,
    style: {},
    useAnimated: false,
};

const HeaderBig = ({
  type,
  title,
  titleRight,
  titleRightColor,
  actions,
  style,
  useAnimated,
  iconRightButton,
  onPressRightButton,
}) => {

  const { Color } = useColor();
  const auth = useSelector(state => state['auth']);

  const MainContainer = useAnimated ? Animated.View : View;

  return (
    <MainContainer
      style={{
        width: '100%',
        padding: 20,
        backgroundColor: Color.theme,
        ...style,
      }}
    >
      <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <View style={{flex: 1}}>
          {title === '' ?
            <View style={{flexDirection: 'row'}}>
              <Image source={iconApp} style={{width: 40, height: 40}} resizeMode='contain' />
            </View>
          :
            <Text size={28} type='bold'>{title}</Text>
          }
        </View>

        <View style={{}}>
          {iconRightButton && <SideButton
            onPress={() => onPressRightButton && onPressRightButton()}
          >
            {iconRightButton}
          </SideButton>}

          {titleRight !== '' && (
            <View style={{ alignSelf: 'flex-end', borderBottomWidth: 1, borderColor: Color.text }}>
              <Text
                size={17}
                type='medium'
                align='right'
                color={titleRightColor || Color.primary}
                onPress={() => onPressRightButton &&  onPressRightButton()}
              >
                  {titleRight}
              </Text>
            </View>
          )}

          {actions && actions}
        </View>
      </View>
    </MainContainer>
  );
}

HeaderBig.propTypes = propTypes;
HeaderBig.defaultProps = defaultProps;
export default HeaderBig;
