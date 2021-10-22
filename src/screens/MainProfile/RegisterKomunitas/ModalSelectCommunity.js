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
    selected: { id: 1, value: 'Komunitas Baca' },
    onPress: () => {},
};

const data = [
    { id: 1, value: 'Komunitas Baca' },
    { id: 2, value: 'Komunitas Otomotif' },
    { id: 3, value: 'Komunitas Renang' },
];

const ModalSelectCommunity = forwardRef((props, ref) => {
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
              {item.value}
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
    >
        {renderContent()}
    </Modalize>
  );
});

ModalSelectCommunity.defaultProps = defaultProps;

export default ModalSelectCommunity;