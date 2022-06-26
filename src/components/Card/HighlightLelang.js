import React,{useState, useEffect} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';

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
import PostingHeader from '../Posting/PostingHeader';
import { initialItemState } from 'src/utils/constants';
import ScreenIndicator from '../Modal/ScreenIndicator';
import Moment from 'moment';
import CardHighlightLelang from './CardHighlightLelang';

const propTypes = {
  title: PropTypes.string,
  nav: PropTypes.string,
  prodStatus: PropTypes.string,
};

const defaultProps = {
  title: '',
  nav: '',
  prodStatus: 'ONGOING',
};

const HighlightLelang = ({ title, nav, prodStatus }) => {
  const navigation = useNavigation();
  const {Color} = useColor();

  const [list, setList] = useState(initialItemState);

  useEffect(() => {
    fetchListProduct();
  }, []);

  const fetchListProduct = () => {
    let variables = {};
    if(prodStatus === 'WILLCOME'){
      variables = {
        type: "HOMEPAGE",
        status: prodStatus,
        page: 1,
        limit: 4,
      };
    }else{
      variables = {
        type: "HOMEPAGE",
        page: 1,
        limit: 4,
      };
    }

    // console.log('variables', variables);

    Client.query({
      query: queryGetAuction,
      variables,
    }).then(res => {
      // console.log('aku adalah', res.data.auctionProduct);

      let newData = [];
      if (Array.isArray(res.data.auctionProduct) && res.data.auctionProduct.length > 0) {
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

  const renderItem = (item, index) => (
    <View
      key={index}
      style={{
        width: '45%',
        height: 260,
        marginHorizontal: 5,
        marginVertical: 5,
        borderRadius: 5,
      }}
    >
      <TouchableOpacity
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: Color.textInput,
          borderRadius: 10,
          paddingVertical: 10,
          marginHorizontal: 5,
          paddingHorizontal: 10,
          ...shadowStyle,
        }}
        onPress={() => {
          navigation.navigate('DetailLelang', { item })
        }}
      > 
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
            width: '17%',
            position: 'absolute',
            marginVertical: 14,
            marginHorizontal: 14,
          }}>
            {/* <TouchableOpacity
              style={{
                width: 53,
                height: 23,
              }}> */}
              <View>
                <View
                  style={{
                    backgroundColor: prodStatus === 'WILLCOME' ? '#3C58C1' : Color.danger,
                    width: 60,
                    height: 23,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text color={Color.textInput} size={10}>{Moment(item.dateStart).format('DD MMM')}</Text>
                </View>
              </View>
            {/* </TouchableOpacity> */}
        </View>

        <View
          style={{
            width: '100%',
            height: '45%',
          }}>
          <View style={{paddingVertical: 8}}>
            <Text numberOfLines={1}  align='left' type='bold'>{item.product.name}</Text>
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

  return (
    <View style={{ }}>
      <PostingHeader
        title={title}
        onSeeAllPress={() => navigation.navigate(nav, { title, prodStatus })}
      />

      {list.loading ?
        <View style={{ width: '100%', aspectRatio: 16/9 }}>
          <ScreenIndicator />
        </View> :
      !list.loading && list.data.length > 0 ?
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {list.data.map((item, index) => {
            return <CardHighlightLelang item={item} index={index} color={prodStatus === 'WILLCOME' ? '#3C58C1' : Color.danger} type={prodStatus}/>
          })}
        </View> :
        <View style={{ width: '100%', aspectRatio: 16/9 }}>
          <ScreenEmptyData message='Lelang belum tersedia' />
        </View>
      }
    </View>
  )
};

HighlightLelang.propTypes = propTypes;
HighlightLelang.defaultProps = defaultProps;
export default HighlightLelang;