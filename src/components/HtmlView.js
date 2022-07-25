import React, { memo } from 'react';
import { useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';
import RenderHtml from 'react-native-render-html';

const propTypes = {
  html: PropTypes.string,
  style: PropTypes.object,
};

const defaultProps = {
  html: '<p></p>',
  style: {},
};

const HtmlView = memo(function HtmlView({ html, style, fontSize }) {
    const { width } = useWindowDimensions();
    const tagsStyles = {
      a: {
        fontFamily: 'Inter-Regular',
        margin: 0,
        fontSize: fontSize || 14,
      },
      p: {
        fontFamily: 'Inter-Regular',
        margin: 0,
        fontSize: fontSize || 14,
      },
      body: {
        fontFamily: 'Inter-Regular',
        fontSize: fontSize || 14,
      }
    };

    return (
      <RenderHtml
        contentWidth={width}
        source={{html}}
        tagsStyles={tagsStyles}
        systemFonts={['Inter-Regular']}
        baseStyle={{...style}}
      />
    );
});

HtmlView.propTypes = propTypes;
HtmlView.defaultProps = defaultProps;
export default HtmlView;