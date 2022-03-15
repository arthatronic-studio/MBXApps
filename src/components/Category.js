import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import ImagesPath from './ImagesPath';
import {Text, useColor} from 'src/components';

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

const DATA_REVIEW = [
  {
    id: 1,
    rate: 5,
  },
  {
    id: 2,
    rate: 4,
  },
  {
    id: 3,
    rate: 3,
  },
  {
    id: 4,
    rate: 2,
  },
  {
    id: 5,
    rate: 1,
  },
 
];

const Category = ({type}) => {
  const {Color} = useColor();

  const renderItem = ({item}) => (
    <View>
      <TouchableOpacity
        style={[
          styles.btnCategory,
          {backgroundColor: Color.gray, borderColor: Color.gray},
        ]}>
        <Text color={Color.textInput}>{item.category}</Text>
      </TouchableOpacity>
    </View>
  );
  const renderItemReview = ({item}) => (
    <View>
      <TouchableOpacity
        style={{
          backgroundColor: Color.textInput,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 5,
          borderRadius:20,
          borderWidth:1,
          borderColor:Color.border,
          marginRight:10
        }}>
        <Image source={ImagesPath.starRate} style={{marginRight:5}}/>
        <Text color={Color.text}>{item.rate}</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={type === 'review' ? DATA_REVIEW : DATA}
        renderItem={type === 'review' ? renderItemReview : renderItem}
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
