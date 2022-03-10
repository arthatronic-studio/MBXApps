import React from 'react';
import {View} from 'react-native';
import {useColor} from '@src/components/Color';
import {Text} from '@src/components';

import {FlatList} from 'react-native-gesture-handler';

import CardForumPopular from './CardForumPopular';

const ListForumPopular = ({data}) => {
  return (
    <View style={{marginTop: 16}}>
      <Text style={{marginBottom: 24}} align="left" size="11" type="bold">
        Topik Terpopuler
      </Text>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.toString() + index}
        renderItem={({item}) => {
          return <CardForumPopular item={item} />;
        }}
      />
    </View>
  );
};

export default ListForumPopular;
