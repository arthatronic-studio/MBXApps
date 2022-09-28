import React, {useState, useRef} from 'react';
import {View, TouchableOpacity, Animated, LayoutAnimation} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Text, useColor} from 'src/components';

const defaultProps = {
  title: "",
  children: null,
  titleStyle: {},
  icon: null,
  showContentInitial: false
};

const AccordianItem = ({title, children, titleStyle, icon, showContentInitial}) => {
  const [showContent, setShowContent] = useState(showContentInitial);
  const animationController = useRef(new Animated.Value(showContentInitial ? 1 : 0)).current;
  const {Color} = useColor();

  const toggleListItem = () => {
    const config = {
      duration: 300,
      toValue: showContent ? 0 : 1,
      useNativeDriver: true,
    };
    Animated.timing(animationController, config).start();
    LayoutAnimation.configureNext({
      duration: 300,
      update: {
        duration: 300,
        property: LayoutAnimation.Properties.opacity,
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete: {
        duration: 200,
        property: LayoutAnimation.Properties.opacity,
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    setShowContent(!showContent);
  };
  const arrowTransform = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });
  return (
    <View
      style={{
        width: '100%',
        overflow: 'hidden',
      }}>
      <TouchableOpacity onPress={() => toggleListItem()}>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 4,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 1}}>
            <Text style={{...titleStyle}}>{title}</Text>
          </View>
          <View flexDirection="row" style={{alignItems: 'center'}}>
            {icon}
            <Animated.View style={{transform: [{rotateZ: arrowTransform}]}}>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color={Color.disabled}
              />
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>
      {showContent && children}
    </View>
  );
};

export default AccordianItem;
