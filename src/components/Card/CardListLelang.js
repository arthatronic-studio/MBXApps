import React,{useState, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import {useIsFocused} from '@react-navigation/native';
import ImagesPath from '../ImagesPath';
import {
  Text,
  useColor,
} from '@src/components';
import { statusBarHeight } from 'src/utils/constants';
import { Divider } from 'src/styled';
import { useNavigation, useRoute } from '@react-navigation/native';
import { queryGetAuction } from 'src/lib/query/auction';
import client from 'src/lib/apollo';
import { FormatMoney } from 'src/utils';
import Client from '@src/lib/apollo';

const propTypes = {
  ListHeaderComponent: PropTypes.func,
}

const defaultProps = {
  ListHeaderComponent: () => <View />
}

const CardListLelang = (props) => {
  const { ListHeaderComponent } = props;
  const navigation = useNavigation();
  const {Color} = useColor();
  const isFocused = useIsFocused();

  const [list, setList] = useState({
    data: [],
    loading: false,
    message: 'error',
  });

  useEffect(() => {
    fetchListProduct();
  }, []);

  const fetchListProduct = () => {
    const variables = {
      type: "HOMEPAGE"
    };

    Client.query({
      query: queryGetAuction,
      variables: {
        type: "HOMEPAGE"
      },
    }).then(res => {
      console.log('aku adalah', res.data.auctionProduct);

      let newData = [];
      if (res.data.auctionProduct) {
        newData = res.data.auctionProduct;
      }

      setList({
        ...list,
        data: newData,
        loading: false,
        message: ''
      });
    })
    .catch((err) => {
      console.log('err', err);

      setList({
        ...list,
        loading: false,
        message: ''
      });
    })
  }

  const renderItem = ({item}) => (
    <View
      style={{
        width: '46%',
        height: 260,
        marginHorizontal: 5,
        marginVertical: 5,
        borderRadius: 5,
      }}
    >
      <TouchableOpacity
        style={[styles.btnCategory, {backgroundColor: Color.textInput, elevation: 5}]}
        onPress={() => {
          navigation.navigate('DetailLelang', {iniId: item.id})
        }}
      >
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
                width: 60,
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
        <Image
          source={{ uri: item.product.imageUrl }}
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
            <Text align='left' type='bold'>{item.product.name}</Text>
          </View>
          <View style={{marginVertical: 5}}>
            <Text align='left' size={8} color={Color.disabled}>Harga Awal</Text>
            <Divider height={4} />
            <Text align='left' type='bold'>{FormatMoney.getFormattedMoney(item.startPrice)} <Text size={8}>Poin</Text></Text>
          </View>
        </View>
      </TouchableOpacity>
      
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
        data={list.data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id + index.toString()}
        ListHeaderComponent={() => renderHeader()}
        contentContainerStyle={{
          paddingBottom: statusBarHeight + 60
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

