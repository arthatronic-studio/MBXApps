import React, { useRef, forwardRef, useState, useEffect } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { queryGetChapterList }  from 'src/lib/query';
import Client from '@src/lib/apollo';
import {
  Text,
  // TouchableOpacity,
  useColor
} from '@src/components';

import { View, TextInput } from 'react-native';

import { shadowStyle } from '@src/styles';

import { useCombinedRefs } from '@src/hooks';

const { width } = Dimensions.get('window');

const defaultProps = {
    selected: { id: 1, value: 'Chapter 1' },
    onPress: () => {},
};

const data = [
    { id: 1, value: 'Chapter 1' },
    { id: 2, value: 'Chapter 2' },
    { id: 3, value: 'Chapter 3' },
];

const ModalSelectChapter = forwardRef((props, ref) => {
  const { selected, onPress } = props;
  const [data2, setData2] = useState(null)

  useEffect(() => {
    Client.query({query: queryGetChapterList})
      .then((res) => {
        setData2(res.data.getChapterList)
        console.log(data2)
      })
  }, [])

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);
  const [handle, setHandle] = useState(false);

  const { Color } = useColor();

  const handlePosition = position => {
    setHandle(position === 'top');
  };

  const renderContent = () => {
    return data2.map((item, idx) =>
        <TouchableOpacity
            key={idx}
            onPress={() => {
                onPress(item);
            }}
            style={{flexDirection: 'row', paddingVertical: 8}}
        >
            <Text size={14} color={selected.id === item.id ? Color.primary : Color.text}>
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
    >
        <View style={{width: '100%', flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 16, backgroundColor: Color.theme, borderTopWidth: 4, borderColor: Color.theme}}>
          <View style={{width: '90%', height: 46, borderRadius: 22.5, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: Color.textInput, ...shadowStyle}}>
            <Ionicons name='search' size={22} color={Color.primary} />
              <TextInput
                placeholder='Cari sesuatu..'
                autoFocus
                placeholderTextColor={Color.gray}
                style={{height: 50, color: Color.gray, fontSize: 12, fontFamily: 'Raleway-Regular', marginLeft: 8}}
              />
          </View>
        </View>
        {data2 && renderContent()}
    </Modalize>
  );
});

ModalSelectChapter.defaultProps = defaultProps;

export default ModalSelectChapter;