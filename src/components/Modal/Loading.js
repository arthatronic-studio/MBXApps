import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Image, Platform, useWindowDimensions } from 'react-native';
import Styled from 'styled-components';
import { Portal } from 'react-native-portalize';
import Entypo from 'react-native-vector-icons/Entypo';
import { ProgressView } from '@react-native-community/progress-view';
import {
  iconwait,
} from '@assets/images/home';
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
  border-radius: 16px;
  ${props => props.type === 'large' && `
    width: 100%;
  `}
`;

const ContainerIndicator = Styled(View)`
  backgroundColor: ${props => props.backgroundColor};
  borderRadius: 16px;
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
  const { width } = useWindowDimensions();

  if (!visible) return null;

  const sizeIcon = 36;
  const sizePerIcon = width / 7;

  return (
    <Portal>
      <Wrapper {...props}>
        { loadingType === 'success' ?
          <Body type={type} transparent={transparent} backgroundColor={Color.theme}>
            <Entypo name='cross' size={24} color={Color.border} onClose={() => onClose()} style={{position: 'absolute', top: 8, right: 8}} />
            <ContainerIndicator
              backgroundColor={Color.success}
              style={{
                width: sizePerIcon,
                height: sizePerIcon,
              }}
            >
              <Entypo name={'check'} size={sizeIcon} color={Color.textInput} />
            </ContainerIndicator>
            {message !== '' && <BodyText>
              <Text type='medium' size={16}>{message}</Text>
            </BodyText>}
          </Body>
        : loadingType === 'error' ?
          <Body type={type} transparent={transparent} backgroundColor={Color.theme}>
            <Entypo name='cross' size={24} color={Color.border} onClose={() => onClose()} style={{position: 'absolute', top: 8, right: 8}} />
            <ContainerIndicator
              backgroundColor={Color.error}
              style={{
                width: sizePerIcon,
                height: sizePerIcon,
              }}
            >
              <Entypo name={'cross'} size={sizeIcon} color={Color.textInput} />
            </ContainerIndicator>
            {message !== '' && <BodyText>
              <Text type='medium' size={16}>{message}</Text>
            </BodyText>}
          </Body>
        : loadingType === 'info' ?
          <Body type={type} transparent={transparent} backgroundColor={Color.theme}>
            <Entypo name='cross' size={24} color={Color.border} onClose={() => onClose()} style={{position: 'absolute', top: 8, right: 8}} />
            <ContainerIndicator
              backgroundColor={Color.info}
              style={{
                width: sizePerIcon,
                height: sizePerIcon,
              }}
            >
              <Entypo name={'info'} size={sizeIcon} color={Color.textInput} />
            </ContainerIndicator>
            {message !== '' && <BodyText>
              <Text type='medium' size={16}>{message}</Text>
            </BodyText>}
          </Body>
        : loadingType === 'wait' ?
        <Body type={type} transparent={transparent} backgroundColor={Color.theme}>
          <Entypo name='cross' size={24} color={Color.border} onClose={() => onClose()} style={{position: 'absolute', top: 8, right: 8}} />          
          <Image
            style={{ height: 50, width: 30, tintColor: Color.primary }}
            source={iconwait}
          />
          {message !== '' && <BodyText>
            <Text color={Color.info}>{message}</Text>
          </BodyText>}
        </Body>
        :
          <Body type={type} transparent={transparent} backgroundColor={Color.theme}>
            <ContainerIndicator
              backgroundColor={Color.theme}
              style={{
                width: sizePerIcon,
                height: sizePerIcon,
              }}
            >
              <ActivityIndicator
                size={Platform.OS === 'android' ? 60 : type}
                color={Color.primary}
                style={{position: 'absolute'}}
              />
            </ContainerIndicator>
            {message !== '' && <BodyText>
              <Text type='medium' size={16}>{message}</Text>
            </BodyText>}
            {usingPercentage &&
              <ProgressView
                progressTintColor={Color.theme}
                trackTintColor={Color.border}
                progress={percentage / 100}
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