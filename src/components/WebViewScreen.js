import React, { useRef } from 'react';
import { View, ActivityIndicator, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { WebView } from 'react-native-webview';
import Config from 'react-native-config';

import Color from '@src/components/Color';
import Header from '@src/components/Header';

const URL = require('url-parse');

const MainView = Styled(View)`
  flexDirection: column;
  width: 100%;
  backgroundColor: ${Color.textInput};
  flex: 1
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

const propTypes = {
  url: PropTypes.string,
  onClose: PropTypes.func,
}

const defaultProps = {
  url: '',
  onClose: () => {},
};

const WebViewScreen = (props) => {
  const {
    url,
    onClose,
  } = props;

  const webviewRef = useRef();

  function isPaid(url, host) {
    console.log('url: ', url, ' |  host: ', host);
    // const hostnamePaymentRouter = host.indexOf(`${Config.BASE_DOMAIN}/payment-router/callback`);
    const hostnamePaymentRouter = host.indexOf(`${Config.BASE_DOMAIN}/static-pages/payment-finish`);
    const paymentPaid = url.query.indexOf('status-payment=PAID');
    if (hostnamePaymentRouter >= 0 && paymentPaid >= 0) onClose('paymentPaid');
  }

  // function isTourPage(url, host) {
  //   const hostnameTour = host.indexOf(`${Config.BASE_DOMAIN}/tour/detail`);
  //   if (hostnameTour >= 0) {
  //     const arrayOfPathname = url.pathname.split('/');
  //     onClose('tourPage', arrayOfPathname[3]);
  //   }
  // }

  function checkURL(web) {
    const url = new URL(web.url);
    const host = url.hostname + url.pathname;
    isPaid(url, host);
    // isTourPage(url, host);
  }

  function renderActivityIndicatorLoadingView() {
    return (
      <CustomActivityIndicator color={Color.loading} size='large' />
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: Color.theme, flex: 1 }}>
      <MainView>
        <Header
          title=""
          showLeftButton
          onPressLeftButton={onClose}
          iconLeftButton='close-a'
        />
        <Header
          title="Payment Method"
          showLeftButton
          onPressLeftButton={() => {
            if (webviewRef.current) {
              webviewRef.current.goBack();
            }
          }}
        />
        <WebView
          ref={webviewRef}
          source={{ uri: url }}
          onNavigationStateChange={checkURL}
          renderLoading={renderActivityIndicatorLoadingView}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
        />
      </MainView>
    </SafeAreaView>
  );
}

WebViewScreen.propTypes = propTypes;
WebViewScreen.defaultProps = defaultProps;
export default WebViewScreen;