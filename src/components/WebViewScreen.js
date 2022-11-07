import React, { useRef } from 'react';
import { View, ActivityIndicator, SafeAreaView, Linking } from 'react-native';
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
          originWhitelist={["https://*", "http://*", "gojek://*", "shopeeid://*"]}
          onShouldStartLoadWithRequest={function (req) {
            console.log('openExternalLink() run: ' + req.url);
            if (
              // Gopay app link prefixes
              req.url.startsWith('https://gojek.link') ||
              req.url.startsWith('gojek://') ||
              // ShopeePay app link prefixes
              req.url.startsWith('https://wsa.wallet.airpay.co.id') ||
              req.url.startsWith('shopee://') ||
              // UOB EzPay app link prefixes
              req.url.startsWith('https://tmrwbyuobid.page.link') ||
              // other app link prefixes, if needed
              req.url.startsWith('intent://')
            ) {
              // URL meets the conditions to be handled specifically
              if (Linking.canOpenURL(req.url)) {
                console.log('opening non HTTP url: ' + req.url);
                Linking.openURL(req.url); // URL will be opened on OS level, not by WebView
                return false; // prevent WebView from loading the URL
              } else {
                // handle URL not able to be opened,
                console.log('not able to open non HTTP url: ' + req.url);
                return false; // try loading the URL via WebView anyway
              }
            }
            console.log('opening url via webview normally: ' + req.url);
            // URL doesn't meet the conditions to be handled specifically
            return true; // URL will be loaded via WebView normally
          }}
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