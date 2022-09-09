import React, { useState, useEffect } from 'react';
import { View, Modal, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { WebView } from 'react-native-webview';

import Color from '@src/components/Color';
import Header from '@src/components/Header';
import { Scaffold } from 'src/components';
import WebViewScreen from 'src/components/WebViewScreen';

const WebviewPaymentScreen = ({ navigation, route }) => {
  const { params } = route;

  const [sourceURL, setSourceURL] = useState(params.sourceURL);

  useEffect(() => {
    setSourceURL(params.sourceURL);
  }, [params.sourceURL]);

  const onCloseWebview = (status) => {
    setSourceURL('');
    if (status === 'paymentPaid') navigation.navigate('PaymentSucceed');
    else navigation.pop();
  }

  return (
    <Scaffold
      useSafeArea={false}
      translucent
      showHeader={false}
    >
      <Modal
        transparent
        animationType="fade"
        onRequestClose={onCloseWebview}
        visible={sourceURL !== ''}
      >
        <WebViewScreen
          url={sourceURL}
          onClose={onCloseWebview}
        />
      </Modal>
    </Scaffold>
  );
}

export default WebviewPaymentScreen;