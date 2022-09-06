import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { WebView } from 'react-native-webview';

import Color from '@src/components/Color';
import Header from '@src/components/Header';
import { Scaffold } from 'src/components';

const URL = require('url-parse');

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
};

const defaultProps = {
  url: '',
};

const WebviewGeneralScreen = ({ navigation, route }) => {
  const { params } = route;

  function checkURL(web) {
    const url = new URL(web.url);
    const host = url.hostname + url.pathname;
  }

  function renderActivityIndicatorLoadingView() {
    return (
      <CustomActivityIndicator color={Color.loading} size='large' />
    );
  }

  return (
    <Scaffold
      useSafeArea={false}
      translucent
    >
      <WebView
        source={{ uri: params.url }}
        onNavigationStateChange={checkURL}
        renderLoading={renderActivityIndicatorLoadingView}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
      />
    </Scaffold>
  );
}

WebviewGeneralScreen.propTypes = propTypes;
WebviewGeneralScreen.defaultProps = defaultProps;
export default WebviewGeneralScreen;