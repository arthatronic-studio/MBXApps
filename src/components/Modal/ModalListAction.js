import React, { useRef, forwardRef } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import {
  Text,
  // TouchableOpacity,
  useColor
} from '@src/components';

import { useCombinedRefs } from '@src/hooks';

const { width } = Dimensions.get('window');

const defaultProps = {
    data: [],
    selected: null,
    onPress: () => {},
    style: {},
};

const ModalListAction = forwardRef((props, ref) => {
  const { data, selected, onPress, children, style } = props;

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);

  const { Color } = useColor();

  const renderContent = () => {
    
    return data.map((item, idx) => {
      console.log(item);
      return (
        <TouchableOpacity
            key={idx}
            onPress={() => {
              item.onPress ? item.onPress() : onPress(item);
            }}
            style={{flexDirection: 'row', alignItems: 'flex-start', marginTop: 24}}
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
      handleStyle={{width: width / 6, height: 4, backgroundColor: Color.primary, marginTop: 8}}
      childrenStyle={{backgroundColor: Color.theme, alignItems: 'flex-start', padding: 16, paddingBottom: 32, borderTopLeftRadius: 12, borderTopRightRadius: 12, ...style}}
      modalStyle={{
        backgroundColor: Color.theme
      }}
    >
        {data.length > 0 ? renderContent() : children}
    </Modalize>
  );
});

ModalListAction.defaultProps = defaultProps;

export default ModalListAction;