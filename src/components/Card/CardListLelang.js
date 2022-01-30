import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import ImagesPath from '../ImagesPath';
import {
  Text,
  useColor,
} from '@src/components';
import { statusBarHeight } from 'src/utils/constants';
import { Divider } from 'src/styled';
import { useNavigation } from '@react-navigation/native';

const propTypes = {
  ListHeaderComponent: PropTypes.func,
}

const defaultProps = {
  ListHeaderComponent: () => <View />,
}

const DATA = [
  {
    id: 1,
    image: ImagesPath.produklelang,
    title: 'Pashmina Pink Nissa Sabyan',
    firstPrice: '50.000',
    time: '02:25',
  },
  {
    id: 2,
    image: ImagesPath.produklelang2,
    title: 'Gazelle Hi Vintage - Green',
    firstPrice: '20.000',
    time: '02:25',
  },
  {
    id: 3,
    image: ImagesPath.produklelang3,
    title: 'ZIPPO Pemantik Armor 5 Sisi ...',
    firstPrice: '20.000',
    time: '02:25',
  },
  {
    id: 4,
    image: ImagesPath.produklelang2,
    title: 'Gazelle Hi Vintage - Green',
    firstPrice: '20.000',
    time: '02:25',
  },
  {
    id: 4,
    image: ImagesPath.produklelang5,
    title: 'Limited Edition Figure - Monkey ...',
    firstPrice: '60.000',
    time: '02:25',
  },
  {
    id: 4,
    image: ImagesPath.produklelang6,
    title: 'PlayStation 4 Pro 500 Million ...',
    firstPrice: '50.000',
    time: '02:25',
  },
];

const CardListLelang = (props) => {
  const { ListHeaderComponent } = props;

  const {Color} = useColor();
  const navigation = useNavigation();

  const renderItem = ({item}) => (
    <View
      style={{
        width: '46%',
        height: 260,
        marginHorizontal: 5,
        marginVertical: 5,
      }}
    >
      <TouchableOpacity
        style={[styles.btnCategory, {backgroundColor: Color.textInput}]}
        onPress={() => {
          navigation.navigate('DetailLelang');
        }}
      >
        <Image
          source={item.image}
          style={{
            width: 160,
            height: 150,
            borderRadius: 10,
            alignSelf: 'center',
          }}
        />

        <View
          style={{
            width: '100%',
            height: '45%',
          }}>
          <View style={{paddingVertical: 8}}>
            <Text align='left' type='bold'>{item.title}</Text>
          </View>
          <View style={{marginVertical: 5}}>
            <Text align='left' size={12} color={Color.disabled}>Harga Awal</Text>
            <Divider height={4} />
            <Text align='left' type='bold'>Rp {item.firstPrice}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          width: '17%',
          position: 'absolute',
          marginVertical: 14,
          marginHorizontal: 20,
        }}>
        <TouchableOpacity
          style={{
            width: 53,
            height: 23,
          }}>
          <View>
            <View
              style={{
                backgroundColor: Color.error,
                width: 53,
                height: 23,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text color={Color.textInput} size={10}>{item.time}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => {
    if (typeof ListHeaderComponent !== 'undefined') {
      return <ListHeaderComponent />;
    }

    return <View />;
  }

  return (
    <View style={{alignItems: 'center'}}>
      <FlatList
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        data={DATA}
        ListHeaderComponent={() => renderHeader()}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: statusBarHeight
        }}
      />
    </View>
  );
};

CardListLelang.propTypes = propTypes;
CardListLelang.defaultProps = defaultProps;
export default CardListLelang;

const styles = StyleSheet.create({
  btnCategory: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
    paddingHorizontal: 10,
  },
});
