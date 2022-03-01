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
    selected: { label: 'Privasi', value: 'PRIVATE', iconName: 'lock-closed' },
    onPress: () => {},
};

const data = [
    { label: 'Publik', value: 'PUBLISH', iconName: 'globe' },
    { label: 'Teman Komunitas', value: 'PRIVATE_IN_THIS_APP', iconName: 'people' },
    { label: 'Privasi', value: 'PRIVATE', iconName: 'lock-closed' },
];

const ModalSelectStatus = forwardRef((props, ref) => {
  const { selected, onPress } = props;

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);
  const [handle, setHandle] = useState(false);

  const { Color } = useColor();

  const handlePosition = position => {
    setHandle(position === 'top');
  };

  const renderContent = () => {
    return data.map((item, idx) => {
      const isSelected = selected && selected.value === item.value;

      return (
        <TouchableOpacity
          key={idx}
          onPress={() => {
            onPress(item);
          }}
          style={{
            flexDirection: 'row',
            paddingVertical: 8,
            justifyContent: 'center',
          }}
        >
          <Text size={12} color={isSelected ? Color.primary : Color.text}>
            <Ionicons name={item.iconName} size={12} />
            &nbsp;&nbsp;{item.label}
          </Text>
        </TouchableOpacity>
      )
    });
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

ModalSelectStatus.defaultProps = defaultProps;
export default ModalSelectStatus;