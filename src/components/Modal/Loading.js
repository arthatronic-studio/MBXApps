import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Image, Platform } from 'react-native';
import Styled from 'styled-components';
import { Portal } from 'react-native-portalize';
import Entypo from 'react-native-vector-icons/Entypo';
import { ProgressBar } from '@react-native-community/progress-bar-android';

import Text from '@src/components/Text';
import { useColor } from '@src/components';

const Wrapper = Styled(View)`
  background-color: rgba(0, 0, 0, 0.4);
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 15px;
`;

const Body = Styled(View)`
  background-color: ${props => (props.transparent ? 'transparent' : props.backgroundColor)};
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 5px;
  ${props => props.type === 'large' && `
    width: 100%;
  `}
`;

const ContainerIndicator = Styled(View)`
  borderWidth: ${Platform.OS === 'android' ? '5px' : '0px'};
  borderColor: ${props => props.borderColor};
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

const defaultProps = {
  visible: false,
  message: 'Mohon Tunggu',
  type: 'large',
  transparent: false,
  onClose: () => {},
  usingPercentage: false,
  percentage: 0,
};

export const useLoading = () => {
  const [loadingProps, setLoadingProps] = useState({
    visible: false,
    onClose: () => setLoadingProps({ ...loadingProps, visible: false }),
  });

  const showLoading = (loadingType, message, redirect) => {
    setLoadingProps({
      ...loadingProps,
      visible: true,
      loadingType,
      message,
    });

    if (loadingType) {
      setTimeout(() => {
        setLoadingProps({
          ...loadingProps,
          visible: false,
          loadingType,
          message,
        });

        if (typeof redirect === 'function') redirect();
      }, 1500);
    }
  }

  const hideLoading = () => {
    setLoadingProps({
      ...loadingProps,
      visible: false,
    });
  }

  return [loadingProps, showLoading, hideLoading];
}

const Loading = (props) => {
  const {
    visible, message, type, transparent, onClose, loadingType,
    usingPercentage, percentage,
  } = props;

  const { Color } = useColor();

  if (!visible) return null;

  return (
    <Portal>
      <Wrapper {...props}>
        { loadingType === 'success' ?
          <Body type={type} transparent={transparent} backgroundColor={Color.theme}>
            <Entypo name='cross' size={24} color={Color.border} onClose={() => onClose()} style={{position: 'absolute', top: 8, right: 8}} />
            <ContainerIndicator borderColor={Color.success}>
              <Entypo name={'check'} size={30} color={Color.success} />
            </ContainerIndicator>
            {message !== '' && <BodyText>
              <Text color={Color.success}>{message}</Text>
            </BodyText>}
          </Body>
        : loadingType === 'error' ?
          <Body type={type} transparent={transparent} backgroundColor={Color.theme}>
            <Entypo name='cross' size={24} color={Color.border} onClose={() => onClose()} style={{position: 'absolute', top: 8, right: 8}} />
            <ContainerIndicator borderColor={Color.error}>
              <Entypo name={'cross'} size={30} color={Color.error} />
            </ContainerIndicator>
            {message !== '' && <BodyText>
              <Text color={Color.error}>{message}</Text>
            </BodyText>}
          </Body>
        : loadingType === 'info' ?
          <Body type={type} transparent={transparent} backgroundColor={Color.theme}>
            <Entypo name='cross' size={24} color={Color.border} onClose={() => onClose()} style={{position: 'absolute', top: 8, right: 8}} />
            <ContainerIndicator borderColor={Color.info}>
              <Entypo name={'info'} size={30} color={Color.info} />
            </ContainerIndicator>
            {message !== '' && <BodyText>
              <Text color={Color.info}>{message}</Text>
            </BodyText>}
          </Body>
        :
          <Body type={type} transparent={transparent} backgroundColor={Color.theme}>
            <ContainerIndicator borderColor={Color.primary}>
              <ActivityIndicator
                size={Platform.OS === 'android' ? 60 : type}
                color={Platform.OS === 'android' ? Color.theme : Color.primary}
                style={{position: 'absolute'}}
              />
            </ContainerIndicator>
            {message !== '' && <BodyText>
              <Text color={Color.primary}>{message}</Text>
            </BodyText>}
            {usingPercentage &&
              <ProgressBar
                animating
                styleAttr="Horizontal"
                indeterminate={false}
                progress={percentage / 100}
                color={Color.theme}
                style={{width: '90%', marginTop: 4}}
              />
            }
          </Body>
        }
      </Wrapper>
    </Portal>
  );
}

Loading.defaultProps = defaultProps;

export default Loading;