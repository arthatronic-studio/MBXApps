import React, { useRef, forwardRef, useState } from 'react';
import { Dimensions, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Modalize } from 'react-native-modalize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { Newspaper, MapPinLine, Calendar, Briefcase } from 'phosphor-react-native';
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
  {
    id: 1,
    name: 'Artikel',
    // icon: <Newspaper color='#B0DE59' size={20} />,
    icon: null,
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
    // icon: <MapPinLine color='#ED5596' size={20} />,
    icon: null,
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
    // icon: <Calendar color='#6246C7' size={20} />,
    icon: null,
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
    // icon: <Briefcase color='#1E89FC' size={20} />,
    icon: null,
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
          {/* <MaterialCommunityIcons
            name='post-outline'
            size={20}
            color={Color.text}
          /> */}
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