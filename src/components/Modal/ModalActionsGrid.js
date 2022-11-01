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
import { Line } from 'src/styled';

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

const ModalActionsGrid = ({ visible, data, selected, adjust, onPress, onClose, children, style, name }) => {
  const {Color} = useColor();
  const {width} = useWindowDimensions();

  const renderContent = () => {
    return data.map((item, idx) => {
      if (item.show === false) return <View key={idx} />;

      const isSelected = selected && selected.id === item.id;

      return (
        <View
          key={idx}
          style={{
            width: width / 4,
            paddingHorizontal: 8,
            marginTop: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              item.onPress ? item.onPress() : onPress(item, name);
            }}
            style={{
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: Color.text,
              backgroundColor: isSelected ? Color.text : Color.textInput,
            }}>
            <Text
              size={17}
              color={
                item.color
                  ? item.color
                  : isSelected
                  ? Color.textInput
                  : Color.text
              }>
              {item.name}
            </Text>
          </TouchableOpacity>
        </View>
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
          paddingBottom: statusBarHeight,
        }}
      >
        {/* handle */}
        <View>
          <Line color={Color.primary} height={4} width={width / 6} radius={2} />
        </View>

        <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap' }}>
          {data.length > 0 ? renderContent() : children}
        </View>
      </View>
    </Modal>
  );
};

ModalActionsGrid.defaultProps = defaultProps;
export default ModalActionsGrid;
