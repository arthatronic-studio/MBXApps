import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';

import imagesPath from '../components/ImagesPath';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Text, useColor} from 'src/components';

const Filter = ({data = [], value = {}, onSelect = () => {}}) => {
  const { Color } = useColor();

  const [showOption, setShowOption] = useState(false);

  const onSelectedItem = val => {
    setShowOption(false);
    onSelect(val);
  };

  return (
    <View>
      <TouchableOpacity
        style={{
          width: 110,
          height: 35,
          borderWidth: 1,
          borderColor: Color.info,
          borderRadius: 50,
          justifyContent: 'space-around',
          alignItems: 'center',
          flexDirection: 'row',
          marginHorizontal: 10,
        }}
        activeOpacity={0.8}
        onPress={() => setShowOption(!showOption)}>
        <Text
          style={{
            color: Color.info,
          }}>
          {!!value ? value?.name : ' Filter'}
        </Text>
        <MaterialIcons
          name={'keyboard-arrow-down'}
          size={15}
          style={{color: Color.info}}
        />
        {/* <Image
          style={{transform: [{rotate: showOption ? '180deg' : '0deg'}]}}
          source={imagesPath.icDropDown}
        /> */}
      </TouchableOpacity>
      {/* {showOption && (
        <View>
          {data.map((val, i) => {
            return (
              <TouchableOpacity
                key={String(i)}
                onPress={() => onSelectedItem(val)}
                style={{
                  paddingVertical: 8,
                  width: 120,
                  borderRadius: 4,
                }}>
                <Text>{val.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )} */}
    </View>
  );
};

export default Filter;
