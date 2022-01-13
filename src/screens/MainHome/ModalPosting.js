import React, { useRef, forwardRef, useState } from 'react';
import { Dimensions, TouchableOpacity, useWindowDimensions, Image } from 'react-native';
import { Modalize } from 'react-native-modalize';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { Newspaper, MapPinLine, Calendar, Briefcase } from 'phosphor-react-native';

import {
  Text,
  // TouchableOpacity,
  useColor
} from '@src/components';

import {
  iconArtikel,
  iconTempat,
  iconEvent,
  iconLoker
} from '@assets/images/home'

import { View, TextInput } from 'react-native';

import { shadowStyle } from '@src/styles';

import { useCombinedRefs } from '@src/hooks';
import { Divider } from 'src/styled';
import { from } from 'apollo-link';

const { width } = Dimensions.get('window');

const defaultProps = {
  onPress: () => {},
};

const data = [
  {
    id: 1,
    name: 'Artikel',
    icon: <Image source={iconArtikel} style={{width: '50%', height: '50%', marginBottom: 4}}/>,
    nav: 'CreateThreadScreen', params: {
      title: 'Posting Artikel',
      productType: "TRIBES",
      productCategory: '',
      productSubCategory: 'POSTING'
    }
  },
  {
    id: 2,
    name: 'Tempat',
    icon: <Image source={iconTempat} style={{width: '45%', height: '50%', marginBottom: 4}}/>,
    nav: 'CreateThreadScreen', params: {
      title: 'Posting Tempat Terdekat',
      productType: "TRIBES",
      productCategory: '',
      productSubCategory: 'NEARBY_PLACE',
    }
  },
  {
    id: 3,
    name: 'Event',
    icon: <Image source={iconEvent} style={{width: '50%', height: '50%', marginBottom: 4}}/>,
    nav: 'CreateThreadScreen', params: {
      title: 'Posting Event',
      productType: "TRIBES",
      productCategory: '',
      productSubCategory: 'EVENT',
    }
  },
  {
    id: 4,
    name: 'Loker',
    icon: <Image source={iconLoker} style={{width: '50%', height: '50%', marginBottom: 4}}/>,
    nav: 'CreateThreadScreen', params: {
      title: 'Posting Loker',
      productType: "TRIBES",
      productCategory: '',
      productSubCategory: 'JOBS',
    }
  },
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
          borderWidth: 1,
          borderColor: '#bcbcbc',
          borderRadius: 8,
          // width,
          paddingVertical: 8,
          height: 70,
          width: 70,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {item.icon}
        <Text size={14} align='center'>
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
      handleStyle={{width: width / 3, height: handle ? 8 : 8, backgroundColor: Color.primary+'30', marginTop: 8}}
      onPositionChange={handlePosition}
      childrenStyle={{
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 16,
        paddingBottom: 50,
        borderTopLeftRadius: 12, 
        borderTopRightRadius: 12,
      }}
      modalStyle={{
        backgroundColor: Color.theme
      }}
    >
      <View style={{ flexDirection: 'row', paddingLeft: 12, marginVertical: 14 }}>
        <Text type='bold' textAlign='left'>Buat Postingan</Text>
      </View>
      <View style={{ flexDirection: 'row', width,  justifyContent: 'space-around',  }}>
        {renderContent()}
      </View>
    </Modalize>
  );
});

ModalPosting.defaultProps = defaultProps;

export default ModalPosting;