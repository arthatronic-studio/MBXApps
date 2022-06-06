import React,{useState, useEffect} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import {useIsFocused} from '@react-navigation/native';

import {
  Text,
  useColor,
} from '@src/components';
import { Divider } from 'src/styled';
import { useNavigation } from '@react-navigation/native';
import { queryGetAuction } from 'src/lib/query/auction';
import { FormatMoney } from 'src/utils';
import Client from '@src/lib/apollo';
import { shadowStyle } from 'src/styles';
import ScreenEmptyData from '../Modal/ScreenEmptyData';
import { initialItemState } from 'src/utils/constants';
import CardHighlightLelang from './CardHighlightLelang';

const propTypes = {
  ListHeaderComponent: PropTypes.func,
};

const defaultProps = {
  ListHeaderComponent: () => <View />
};

const CardListLelang = ({ ListHeaderComponent, prodStatus }) => {
  const navigation = useNavigation();
  const {Color} = useColor();
  const isFocused = useIsFocused();

  const [list, setList] = useState(initialItemState);

  useEffect(() => {
    fetchListProduct();
  }, []);

  useEffect(() => {
    if (list.loadNext && list.page !== -1) {
      fetchListProduct();
    }
  }, [list.loadNext]);

  const fetchListProduct = () => {
    const variables = {
      type: "HOMEPAGE",
      status: prodStatus,
      page: list.page + 1,
      limit: 10,
    };

    Client.query({
      query: queryGetAuction,
      variables,
    }).then(res => {
      console.log('res get auction ', res);
      let data = list.data;
      let page = list.page;
      let message = '';
      if (Array.isArray(res.data.auctionProduct) && res.data.auctionProduct.length > 0) {
        data = data.concat(res.data.auctionProduct);
        page++;
      } else {
        message = 'Not ok, silakan coba kembali';
      }

      setList({
        ...list,
        data,
        page,
        loading: false,
        loadNext: false,
        message,
        refresh: false,
      });
    })
    .catch((err) => {
      console.log('err', err);

      setList({
        ...list,
        loading: false,
        loadNext: false,
        message: 'Terjadi kesalahan',
        refresh: false,
      });
    })
  }

  // const renderItem = ({item}) => (
  //   <View
  //     style={{
  //       width: '45%',
  //       height: 260,
  //       marginHorizontal: 5,
  //       marginVertical: 5,
  //       borderRadius: 5,
  //     }}
  //   >
  //     <TouchableOpacity
  //       style={{
  //         width: '100%',
  //         height: '100%',
  //         backgroundColor: Color.textInput,
  //         borderRadius: 10,
  //         paddingVertical: 10,
  //         marginHorizontal: 5,
  //         paddingHorizontal: 10,
  //         ...shadowStyle,
  //       }}
  //       onPress={() => {
  //         navigation.navigate('DetailLelang', { item })
  //       }}
  //     >
  //       <View
  //       style={{
  //         width: '17%',
  //         position: 'absolute',
  //         marginVertical: 14,
  //         marginHorizontal: 20,
  //       }}>
  //       <TouchableOpacity
  //         style={{
  //           width: 53,
  //           height: 23,
  //         }}>
  //         <View>
  //           <View
  //             style={{
  //               backgroundColor: Color.error,
  //               width: 60,
  //               height: 23,
  //               borderRadius: 50,
  //               justifyContent: 'center',
  //               alignItems: 'center',
  //             }}
  //           >
  //             <Text color={Color.textInput} size={10}>{item.time}</Text>
  //           </View>
  //         </View>
  //       </TouchableOpacity>
  //     </View>
  //       <Image
  //         source={{ uri: item.product.imageUrl }}
  //         style={{
  //           width: 160,
  //           height: 150,
  //           borderRadius: 10,
  //           alignSelf: 'center',
  //         }}
  //       />

  //       <View
  //         style={{
  //           width: '100%',
  //           height: '45%',
  //         }}>
  //         <View style={{paddingVertical: 8}}>
  //           <Text numberOfLines={1}  align='left' type='bold'>{item.product.name}</Text>
  //         </View>
  //         <View style={{marginVertical: 5}}>
  //           <Text align='left' size={8} color={Color.disabled}>Harga Awal</Text>
  //           <Divider height={4} />
  //           <Text align='left' type='bold'>{FormatMoney.getFormattedMoney(item.startPrice)} <Text size={8}>Poin</Text></Text>
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   </View>
  // );

  const renderItem = ({item}) => {
    return <CardHighlightLelang item={item} color={prodStatus === 'WILLCOME' ? '#3C58C1' : Color.danger} type={prodStatus}/>
  }

  const renderHeader = () => {
    if (typeof ListHeaderComponent !== 'undefined') {
      return <ListHeaderComponent />;
    }

    return <View />;
  }

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      numColumns={2}
      data={list.data}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id + index.toString()}
      ListHeaderComponent={() => renderHeader()}
      contentContainerStyle={{
        paddingBottom: 16
      }}
      ListEmptyComponent={
        !list.loading && list.data.length === 0 &&
          <ScreenEmptyData message='Lelang belum tersedia' />
      }
      onEndReachedThreshold={0.3}
      onEndReached={() => setList({ ...list, loadNext: true })}
    />
  );
};

CardListLelang.propTypes = propTypes;
CardListLelang.defaultProps = defaultProps;
export default CardListLelang;