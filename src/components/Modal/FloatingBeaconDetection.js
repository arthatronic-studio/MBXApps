import React, {useRef, forwardRef} from 'react';
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import {Text, useColor} from '@src/components';
import {statusBarHeight} from 'src/utils/constants';
import { Container, Line } from 'src/styled';

const defaultProps = {
  visible: false,
  data: [],
  adjust: true,
  selected: null,
  name: '',
  onPress: () => {},
  onClose: () => {},
  style: {},
};

const FloatingBeaconDetection = ({ visible, data, selected, adjust, onPress, onClose, children, style, name }) => {
  const {Color} = useColor();
  const {width} = useWindowDimensions();

  const renderContent = () => {
    return data.map((item, idx) => {
      if (item.show === false) return <View key={idx} />;

      return (
        <TouchableOpacity
          key={idx}
          onPress={() => {
            item.onPress ? item.onPress() : onPress(item, name);
          }}
          style={{
            width: width - 32,
            paddingVertical: 8,
            alignItems: 'flex-start',
            marginTop: 8,
          }}>
          <Text
            size={12}
            align="left"
            color={
              item.color
                ? item.color
                : selected && selected.id === item.id
                ? Color.secondary
                : Color.text
            }>
            {item.productName || 'No Name'}
          </Text>
          <Text
            size={12}
            align="left"
            color={
              item.color
                ? item.color
                : selected && selected.id === item.id
                ? Color.secondary
                : Color.text
            }>
            {item.productAddress}
          </Text>
          <Text
            size={12}
            align="left"
            color={
              item.color
                ? item.color
                : selected && selected.id === item.id
                ? Color.secondary
                : Color.text
            }>
            {item.productUUID}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <Modal
      testID={'modal'}
      isVisible={visible}
      swipeDirection={['down']}
      onBackdropPress={() => { onClose(); }}
      onSwipeComplete={() => { onClose(); }}
      style={{
        justifyContent: 'flex-end', // the keys of bottom half
        margin: 0,
      }}
    >
      <View
        style={{
          backgroundColor: Color.theme,
          paddingTop: 16,
          paddingHorizontal: 16,
          paddingBottom: statusBarHeight,
        }}
      >
        {/* handle */}
        <View>
          <Line color={Color.primary} height={4} width={width / 6} radius={2} />
        </View>

        <Container paddingTop={16}>
          <Text>{`Hai, ada ${data.length} event di dekatmu saat ini`}</Text>
        </Container>

        {data.length > 0 ? renderContent() : children}
      </View>
    </Modal>
  );
};

FloatingBeaconDetection.defaultProps = defaultProps;
export default FloatingBeaconDetection;
