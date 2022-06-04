import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { Line } from 'src/styled';
import { statusBarHeight } from 'src/utils/constants';
import Color from 'src/components/Color';
import { TouchableOpacity } from '../Button';

const { height, width } = Dimensions.get('window');

class ModalActionScroll extends Component {
    static scrollViewRef;
    constructor(props) {
        super(props);
        this.state = {
            scrollOffset: null,
        };

        this.scrollViewRef = React.createRef();
    }

    handleOnScroll = event => {
        this.setState({
            scrollOffset: event.nativeEvent.contentOffset.y,
        });
    };

    handleScrollTo = p => {
        if (this.scrollViewRef.current) {
            this.scrollViewRef.current.scrollTo(p);
        }
    };

    renderContent() {
        return this.props.data.map((item, idx) => {
            if (item.show === false) return <View key={idx} />;
      
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  item.onPress ? item.onPress() : this.props.onPress(item, this.props.name);
                }}
                style={{
                  width: width - 32,
                  paddingVertical: 8,
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginTop: 16,
                }}>
                <Text
                  size={12}
                  align="left"
                  color={
                    item.color
                      ? item.color
                      : this.props.selected && this.props.selected.id === item.id
                      ? Color.secondary
                      : Color.text
                  }
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          });
    }

    render() {
        return (
            <Modal
                testID={'modal'}
                isVisible={this.props.visible}
                onSwipeComplete={this.props.onClose}
                swipeDirection={['down']}
                scrollTo={this.handleScrollTo}
                scrollOffset={this.state.scrollOffset}
                scrollOffsetMax={height * 0.8} // content height - ScrollView height
                propagateSwipe={true}
                style={{
                    justifyContent: 'flex-end',
                    margin: 0,
                }}
            >
                <View
                    style={{
                        height: height * 0.8,
                        backgroundColor: Color.textInput,
                    }}
                >
                    <View style={{paddingVertical: 16}}>
                        <Line color={Color.primary} height={4} width={width / 6} radius={2} />
                    </View>

                    <ScrollView
                        ref={this.scrollViewRef}
                        onScroll={this.handleOnScroll}
                        scrollEventThrottle={16}
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                            paddingBottom: statusBarHeight,
                        }}
                    >
                        {Array.isArray(this.props.data) && this.props.data.length > 0 ? this.renderContent() : this.props.children}
                    </ScrollView>
                </View>
            </Modal>
        );
    }
}

export default ModalActionScroll;