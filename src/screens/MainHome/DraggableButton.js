import React, { Component } from 'react';
import {
  Dimensions,
  View,
  PanResponder,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default class DraggableButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1)
    };
  }

  componentWillMount() {
    this.state.pan.setValue({ x: (width / 2) - (20 + 16), y: (height / 3) });

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (e, gestureState) => {
        // Set the initial value to the current state
        this.state.pan.setOffset({ x: this.state.pan.x._value, y: this.state.pan.y._value });
        // this.state.pan.setValue({x: 0, y: 0});
        Animated.spring(
          this.state.scale,
          { toValue: 1.1, friction: 3 }
        ).start();
      },

      // When we drag/pan the object, set the delate to the states pan position
      onPanResponderMove: Animated.event([
        null, { dx: this.state.pan.x, dy: this.state.pan.y },
      ]),

      onPanResponderRelease: (e, { vx, vy }) => {
        // Flatten the offset to avoid erratic behavior
        this.state.pan.flattenOffset();
        Animated.spring(
          this.state.scale,
          { toValue: 1, friction: 3 }
        ).start();

        if (this.state.pan.x._value < 0) {
          if (this.state.pan.y._value > height / 3) {
            // this.state.pan.setValue({x: -((width / 2) - (20 + 16)), y: height / 2.5});
            Animated.timing(
              this.state.pan.x,
              { toValue: -((width / 2) - (20 + 16)), duration: 500 }
            ).start();
            Animated.timing(
              this.state.pan.y,
              { toValue: height / 3, duration: 500 }
            ).start();
          }
          else if (this.state.pan.y._value < -(height / 3)) {
            // this.state.pan.setValue({x: -((width / 2) - (20 + 16)), y: -(height / 3)});
            Animated.timing(
              this.state.pan.x,
              { toValue: -((width / 2) - (20 + 16)), duration: 500 }
            ).start();
            Animated.timing(
              this.state.pan.y,
              { toValue: -(height / 3), duration: 500 }
            ).start();
          }
          else {
            // this.state.pan.setValue({x: -((width / 2) - (20 + 16)), y: this.state.pan.y._value});
            Animated.timing(
              this.state.pan.x,
              { toValue: -((width / 2) - (20 + 16)), duration: 500 }
            ).start();
            Animated.timing(
              this.state.pan.y,
              { toValue: this.state.pan.y._value, duration: 500 }
            ).start();
          }
        }
        else {
          if (this.state.pan.y._value > height / 3) {
            // this.state.pan.setValue({x: (width / 2) - (20 + 16), y: height / 2.5});
            Animated.timing(
              this.state.pan.x,
              { toValue: (width / 2) - (20 + 16), duration: 500 }
            ).start();
            Animated.timing(
              this.state.pan.y,
              { toValue: height / 3, duration: 500 }
            ).start();
          }
          else if (this.state.pan.y._value < -(height / 3)) {
            // this.state.pan.setValue({x: (width / 2) - (20 + 16), y: -(height / 3)});
            Animated.timing(
              this.state.pan.x,
              { toValue: (width / 2) - (20 + 16), duration: 500 }
            ).start();
            Animated.timing(
              this.state.pan.y,
              { toValue: -(height / 3), duration: 500 }
            ).start();
          }
          else {
            // this.state.pan.setValue({x: (width / 2) - (20 + 16), y: this.state.pan.y._value});
            Animated.timing(
              this.state.pan.x,
              { toValue: (width / 2) - (20 + 16), duration: 500 }
            ).start();
            Animated.timing(
              this.state.pan.y,
              { toValue: this.state.pan.y._value, duration: 500 }
            ).start();
          }
        }
      }
    });
  }

  render() {
    // Destructure the value of pan from the state
    let { pan, scale } = this.state;

    // Calculate the x and y transform from the pan value
    let [translateX, translateY] = [pan.x, pan.y];

    let rotate = '0deg';

    // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
    let imageStyle = { transform: [{ translateX }, { translateY }, { rotate }, { scale }] };

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {this.props.children}

        <Animated.View style={[imageStyle, { position: 'absolute', }]} {...this._panResponder.panHandlers}>
          <View style={{ height: 40, width: 40, backgroundColor: 'red' }} />
        </Animated.View>
      </View>
    );
  }
};