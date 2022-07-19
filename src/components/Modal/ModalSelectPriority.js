import React, { useRef, forwardRef, useState } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Text,
  // TouchableOpacity,
  useColor
} from '@src/components';

import { useCombinedRefs } from '@src/hooks';

const { width } = Dimensions.get('window');

const defaultProps = {
    selected: { id: 3, value: 'HIGH', name: 'High' },
    onPress: () => {},
};

const data = [
  { id: 1, value: 'LOW', name: 'Low (> 20 Km)' },
  { id: 2, value: 'MEDIUM', name: 'Medium (10 - 20 Km)' },
  { id: 3, value: 'HIGH', name: 'High (< 10 Km)' },
];

const ModalSelectPriority = forwardRef((props, ref) => {
  const { selected, onPress } = props;

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);
  const [handle, setHandle] = useState(false);

  const { Color } = useColor();

  const handlePosition = position => {
    setHandle(position === 'top');
  };

  const renderContent = () => {
    return data.map((item, idx) =>
        <TouchableOpacity
            key={idx}
            onPress={() => {
                onPress(item);
            }}
            style={{flexDirection: 'row', paddingVertical: 8}}
        >
            <Text size={12} color={selected.id === item.id ? Color.primary : Color.text}>
                {item.name}
            </Text>
        </TouchableOpacity>
    )
  }

  return (
    <Modalize
      ref={combinedRef}
      withHandle={handle}
      handlePosition="inside"
      adjustToContentHeight
      handleStyle={{width: width / 3, height: handle ? 4 : 4, backgroundColor: Color.primary, marginTop: 8}}
      onPositionChange={handlePosition}
      childrenStyle={{backgroundColor: Color.theme, alignItems: 'center', marginTop: 16, padding: 16, paddingBottom: 32, borderTopLeftRadius: 12, borderTopRightRadius: 12}}
      modalStyle={{
        backgroundColor: Color.theme
      }}
    >
        {renderContent()}
    </Modalize>
  );
});

ModalSelectPriority.defaultProps = defaultProps;

export default ModalSelectPriority;