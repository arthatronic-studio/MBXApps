import React, { useRef } from 'react';
import {
  View,
  useWindowDimensions,
} from 'react-native';
import Modal from 'react-native-modal';

import { Text, useColor } from '@src/components';
import { useCombinedRefs } from '@src/hooks';
import WidgetHomeMenuStatic from 'src/screens/MainHome/WidgetHomeMenuStatic';

const defaultProps = {
  visible: false,
  onClose: () => {},
  style: {},
};

const ModalMenuHome = ({ visible, onClose, style }) => {
  const { Color } = useColor();
  const { width } = useWindowDimensions();

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
        ...style,
      }}
    >
      <View style={{ backgroundColor: Color.theme, paddingTop: 24, paddingBottom: 24, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
        <View style={{ alignItems: 'flex-start', paddingLeft: 16 }}>
          <Text type='bold'>Semua Fitur</Text>
        </View>

        <WidgetHomeMenuStatic
          showMore={false}
          onPress={() => {
            
          }}
        />
      </View>
    </Modal>
  );
};

ModalMenuHome.defaultProps = defaultProps;
export default ModalMenuHome;
