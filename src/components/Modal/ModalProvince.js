import React, { useRef, forwardRef } from 'react';
import { View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Modalize } from 'react-native-modalize';
import {
  Text,
  useColor
} from '@src/components';

import { useCombinedRefs } from '@src/hooks';
import { statusBarHeight } from 'src/utils/constants';

const defaultProps = {
    data: [],
    selected: null,
    onPress: () => {},
    onClose: () => {},
    style: {},
};

const ModalProvince = forwardRef((props, ref) => {
  const { data, selected, onPress, onClose, children, style } = props;

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);

  const { Color } = useColor();
  const { width } = useWindowDimensions();

  const renderContent = () => {
    return data.map((item, idx) => {
      if (item.show === false) return <View key={idx} />;
      
      return (
        <TouchableOpacity
            key={idx}
            onPress={() => {
              item.onPress ? item.onPress() : onPress(item);
            }}
            style={{
              width: width - 32,
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginTop: 16,
            }}
        >
            <Text size={12} align='left' color={item.color ? item.color : selected && selected.id === item.id ? Color.secondary : Color.text}>
                {item.name}
            </Text>
        </TouchableOpacity>
      )
    })
  }
  
  return (
    <Modalize
      ref={combinedRef}
      withHandle
      handlePosition="inside"
      adjustToContentHeight
      handleStyle={{
        width: width / 6,
        height: 4,
        backgroundColor: Color.primary,
        marginTop: 8
      }}
      childrenStyle={{
        backgroundColor: Color.theme,
        alignItems: 'flex-start',
        padding: 16,
        paddingBottom: statusBarHeight + 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        ...style
      }}
      modalStyle={{
        backgroundColor: Color.theme
      }}
      onClose={() => onClose()}
    >
      {data.length > 0 ? renderContent() : children}
    </Modalize>
  );
});

ModalProvince.defaultProps = defaultProps;
export default ModalProvince;