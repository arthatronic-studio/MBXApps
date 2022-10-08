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

const RowView = Styled(Row)`
    height: 100%;
    alignItems: center;
    justifyContent: center;
`;

const SideButton = Styled(TouchableOpacity)`
    height: 100%;
    width: 100%;
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
        height: 60,
        elevation: 0,
        borderBottomWidth: 0,
        paddingHorizontal: 16,
        backgroundColor: Color.theme,
        borderColor: Color.border,
        ...style,
      }}
    >
      <RowView>
        <Col size={6} justify='center' align='flex-start' style={{height: '100%'}}>
          {title === '' ?
            <View style={{flexDirection: 'row'}}>
              <Image source={iconApp} style={{width: 40, height: 40}} resizeMode='contain' />
            </View>
          :
            <Text size={28} type='bold'>{title}</Text>
          }
        </Col>

        <Col size={6} justify='center' align='flex-end' style={{height: '100%'}}>
          {iconRightButton && <SideButton
            onPress={() => onPressRightButton && onPressRightButton()}
          >
            {iconRightButton}
          </SideButton>}

          {titleRight !== '' && <Text
            size={17}
            type='medium'
            align='left'
            color={titleRightColor || Color.primary}
            onPress={() => onPressRightButton &&  onPressRightButton()}
            underline
          >
              {titleRight}
          </Text>}

          {actions && actions}
        </Col>
      </RowView>
    </MainContainer>
  );
}

HeaderBig.propTypes = propTypes;
HeaderBig.defaultProps = defaultProps;
export default HeaderBig;
