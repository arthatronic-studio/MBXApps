import React, {useRef, forwardRef} from 'react';
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Text, useColor} from '@src/components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {useCombinedRefs} from '@src/hooks';
import {statusBarHeight} from 'src/utils/constants';

const defaultProps = {
  data: [
    {
      name: '10 Menit',
      value: 10,
    },
    {
      name: '15 Menit',
      value: 15,
    },
    {
      name: '30 Menit',
      value: 30,
    },
    {
      name: '60 Menit',
      value: 60,
    },
    {
      name: '90 Menit',
      value: 90,
    },
    {
      name: '120 Menit',
      value: 120,
    },
  ],
  selectedValue: null,
  onPress: () => {},
  onClose: () => {},
  style: {},
};

const ModalDropDown = forwardRef((props, ref) => {
  const {data, selectedValue, onPress, onClose, children, style} = props;

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);

  const {Color} = useColor();
  const {width} = useWindowDimensions();

  const renderContent = () => {
    return data.map((item, idx) => {
      const _isActive = item.value === selectedValue;

      return (
        <TouchableOpacity
          style={{
            backgroundColor: _isActive ? '#FDE4D2' : 'transparent',
            paddingVertical: 16,
            paddingHorizontal: 16,
            width: width,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}
          key={idx}
          onPress={() => onPress(item.value)}>
          <Text align="left">{item.name}</Text>
          {_isActive && (
            <MaterialIcons
              name="check"
              color={Color.primary}
              size={22}
            />
          )}
        </TouchableOpacity>
      );
    });
  };

  return (
    <Modalize
      ref={combinedRef}
      withHandle={false}
      adjustToContentHeight
      childrenStyle={{
        backgroundColor: Color.theme,
        alignItems: 'flex-start',
        paddingBottom: 32,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingTop: 24,
        ...style,
      }}
      modalStyle={{
        backgroundColor: Color.theme,
      }}
      onClose={() => onClose()}>
      <View style={{flex: 1}}>
        <View style={{marginBottom: 8, paddingHorizontal: 16}}>
          <Text size={10} color={Color.text} type="bold" align="left">
            Durasi
          </Text>
        </View>
        <ScrollView>{data.length > 0 ? renderContent() : children}</ScrollView>
      </View>
    </Modalize>
  );
});

ModalDropDown.defaultProps = defaultProps;
export default ModalDropDown;
