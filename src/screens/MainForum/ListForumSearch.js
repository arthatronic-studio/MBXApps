import React from 'react';

import {useColor} from '@src/components/Color';
import {Text, TouchableOpacity} from '@src/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FlatList} from 'react-native-gesture-handler';

const ListForumSearch = ({data}) => {
  //   console.log('data plsss', data.toString());
  const {Color} = useColor();
  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => item.toString() + index}
      renderItem={({item}) => {
        console.log('haaaaaaaaaaaa', item);
        return (
          <TouchableOpacity
            style={{
              borderWidth: 0.5,
              borderColor: Color.border,
              paddingHorizontal: 16,
              paddingVertical: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text size="11">{item.title} </Text>
            <Ionicons name="arrow-forward" size={14} color={Color.primary} />
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default ListForumSearch;
