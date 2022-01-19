import React from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';

import { Text, useColor } from 'src/components';

const DATA = [
  {
    id: 1,
    category: 'Hijab',
  },
  {
    id: 2,
    category: 'Fashion',
  },
  {
    id: 3,
    category: 'Instrument',
  },
  {
    id: 4,
    category: 'Kacamata',
  },
  {
    id: 4,
    category: 'Kacamata',
  },
  {
    id: 4,
    category: 'Kacamata',
  },
  {
    id: 4,
    category: 'Kacamata',
  },
];

const Category = () => {
  const { Color } = useColor();

  const renderItem = ({item}) => (
    <View>
      <TouchableOpacity style={[styles.btnCategory, { backgroundColor: Color.gray, borderColor: Color.gray }]}>
        <Text color={Color.textInput}>{item.category}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={DATA}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
  },
  btnCategory: {
    width: 110,
    height: 35,
    borderWidth: 1,
    borderRadius: 15,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
