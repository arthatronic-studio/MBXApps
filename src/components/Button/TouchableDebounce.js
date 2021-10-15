import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { PropTypes } from 'prop-types';

const debounce = function(callback, wait, context = this) {
	let timeout = null;
	let callbackArgs = null;
  
	const later = () => callback.apply(context, callbackArgs);
  
	return function() {
		callbackArgs = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

class TouchableDebounce extends Component {
	constructor(props) {
		super(props);
	};

	render() {
		return (
			<TouchableOpacity
        style={this.props.style}
        disabled={this.props.disabled}
				activeOpacity={this.props.activeOpacity}
				onPress={
          this.props.delay > 0 ?
            debounce(() => 
            {
              this.props.onPress();
            }, 300)
          : () => this.props.onPress()
        }
        onLongPress={() => this.props.onLongPress()}
			>
				{this.props.children}
			</TouchableOpacity>
		);
	};
}

TouchableDebounce.propTypes = {
  children: PropTypes.any,
  delay: PropTypes.number,
  style: PropTypes.any,
  disabled: PropTypes.bool,
	activeOpacity: PropTypes.any,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
};

TouchableDebounce.defaultProps = {
  delay: 0,
  style: {},
  disabled: false,
  activeOpacity: 1,
  onPress: () => {},
  onLongPress: () => {},
};

export default TouchableDebounce;

/**
  * Based on https://medium.com/@devmrin/debouncing-touch-events-in-react-native-prevent-navigating-twice-or-more-times-when-button-is-90687e4a8113,
  * just made it more generic https://gist.github.com/ivmos/b6546de193349fcf54ea8581ea445a8d
  */