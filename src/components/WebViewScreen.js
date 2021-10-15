import React from 'react';
import { View, ActivityIndicator, SafeAreaView } from 'react-native';
import Styled from 'styled-components';
import { WebView } from 'react-native-webview';

import Color from '@src/components/Color';
import Header from '@src/components/Header';

const URL = require('url-parse');

const MainView = Styled(View)`
  flexDirection: column;
  width: 100%;
  backgroundColor: white;
  flex: 1
`;

const CustomHeader = Styled(Header)`
  height: 60;
`;

const CustomActivityIndicator = Styled(ActivityIndicator)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  alignItems: center;
  justifyContent: center;
`;

const baseDomain = 'vesta.id';

const defaultProps = {
  url: '',
  onClose: () => {},
};

const WebViewScreen = (props) => {
  const {
    url,
    onClose,
  } = props;

  function isPaid(url, host) {
    // const hostnamePaymentRouter = host.indexOf(`${baseDomain}/payment-router/callback`);
    const hostnamePaymentRouter = host.indexOf(`${baseDomain}/static-pages/payment-finish`);
    const paymentPaid = url.query.indexOf('status-payment=PAID');
    if (hostnamePaymentRouter >= 0 && paymentPaid >= 0) onClose('paymentPaid');
  }

  function isTourPage(url, host) {
    const hostnameTour = host.indexOf(`${baseDomain}/tour/detail`);
    if (hostnameTour >= 0) {
      const arrayOfPathname = url.pathname.split('/');
      onClose('tourPage', arrayOfPathname[3]);
    }
  }

  function checkURL(web) {
    const url = new URL(web.url);
    const host = url.hostname + url.pathname;
    isPaid(url, host);
    isTourPage(url, host);
  }

  const onNavigationStateChange = (webViewState) => {
    // ini close modal otomatis dari web view
    checkURL(webViewState);
  }

  function renderActivityIndicatorLoadingView() {
    return (
      <CustomActivityIndicator color={Color.loading} size='large' />
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: Color.theme, flex: 1 }}>
      <MainView>
        <CustomHeader title="Ashefa App Content" showLeftButton onPressLeftButton={onClose} iconLeftButton='close' />
        <WebView
          source={{ uri: url }}
          onNavigationStateChange={onNavigationStateChange}
          renderLoading={renderActivityIndicatorLoadingView}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
        />
      </MainView>
    </SafeAreaView>
  );
}

WebViewScreen.defaultProps = defaultProps;

export default WebViewScreen;