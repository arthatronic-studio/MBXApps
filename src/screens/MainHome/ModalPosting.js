import React, { useRef, forwardRef, useState } from 'react';
import { Dimensions, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Modalize } from 'react-native-modalize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Text,
  // TouchableOpacity,
  useColor
} from '@src/components';

import { View, TextInput } from 'react-native';

import { shadowStyle } from '@src/styles';

import { useCombinedRefs } from '@src/hooks';
import { Divider } from 'src/styled';

const { width } = Dimensions.get('window');

const defaultProps = {
  onPress: () => {},
};

const data = [
  { id: 1, name: 'Posting Artikel', nav: 'CreateThreadScreen', params: {
    title: 'Posting Artikel',
    productType: "TRIBES",
    productCategory: '',
    productSubCategory: 'POSTING'
  } },
  { id: 2, name: 'Posting Tempat Terdekat', nav: 'CreateThreadScreen', params: {
    title: 'Posting Tempat Terdekat',
    productType: "TRIBES",
    productCategory: '',
    productSubCategory: 'NEARBY_PLACE',
  } },
  { id: 3, name: 'Posting Event', nav: 'CreateThreadScreen', params: {
    title: 'Posting Event',
    productType: "TRIBES",
    productCategory: '',
    productSubCategory: 'EVENT',
  } },
  { id: 4, name: 'Posting Loker', nav: 'CreateThreadScreen', params: {
    title: 'Posting Loker',
    productType: "TRIBES",
    productCategory: '',
    productSubCategory: 'JOBS',
  } },
];

const ModalPosting = forwardRef((props, ref) => {
  const { onPress } = props;

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);
  const [handle, setHandle] = useState(false);

  const { Color } = useColor();
  const { width } = useWindowDimensions();

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
        style={{
          width,
          paddingVertical: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <MaterialCommunityIcons
          name='post-outline'
          size={20}
          color={Color.text}
        />
        <Divider width={8} />
        <Text size={14} align='left'>
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
      childrenStyle={{
        alignItems: 'center',
        marginTop: 16,
        padding: 16,
        paddingBottom: 32,
        borderTopLeftRadius: 12, 
        borderTopRightRadius: 12,
      }}
      modalStyle={{
        backgroundColor: Color.theme
      }}
    >
      {renderContent()}
    </Modalize>
  );
});

ModalPosting.defaultProps = defaultProps;

export default ModalPosting;