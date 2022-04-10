import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  Row,
  Col,
  // TouchableOpacity,
  useColor,
} from '@src/components';
import { useNavigation } from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';
import { shadowStyle } from 'src/styles';
import { queryGetMyProduct, queryGetProduct } from 'src/lib/query/ecommerce';
import Client from 'src/lib/apollo';
import { FormatMoney } from 'src/utils';
import { statusBarHeight } from 'src/utils/constants';
import CardEcomerceProduct from 'src/screens/Ecommerce/CardEcomerceProduct';

const ListMyProduct = ({ topComponent, bottomComponent }) => {
  const [listProduct, setListProduct] = useState([]);
  const {Color} = useColor();
  const navigation = useNavigation();
  const { height, width } = useWindowDimensions();
  const isFocused = useIsFocused();

  useEffect(() => {
    getProduct();
  }, [isFocused]);

  const getProduct = () => {
    let variables = {
        merchantId: undefined,
    };

    Client.query({query: queryGetMyProduct, variables})
      .then(res => {
        console.log(res);

        if (res.data.ecommerceGetMerchant.productList) {
          let newData = res.data.ecommerceGetMerchant.productList;
          setListProduct(newData);
        }

        // hideLoading();
        // navigation.navigate('TopUpScreen');
      })
      .catch(reject => {
        console.log(reject);

        let newData = [];
        setListProduct(newData);
      });
  };

  return (
    <>
      {/* hide category */}
      {/* <FlatList
        showsHorizontalScrollIndicator={false}
        style={{height: 35, marginHorizontal: 20}}
        data={[
          {kategori: 'Semua Produk'},
          {kategori: 'Fashion'},
          {kategori: 'Gadget'},
          {kategori: 'Semua Produk'},
          {kategori: 'Frozen Food'},
          {kategori: 'Electronics'},
        ]}
        horizontal
        renderItem={({item}) => 
          <TouchableOpacity style={{borderRadius: 20,justifyContent: 'center', alignItems: 'center',width: 90, height: 30, borderWidth: 1, borderColor: Color.secondary, marginHorizontal: 5}}>
            <Text style={{fontSize: 10}}>{item.kategori}</Text>
          </TouchableOpacity>  
        }
      /> */}

      <FlatList
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        data={listProduct}
        ListHeaderComponent={topComponent}
        renderItem={({ item, index }) => <CardEcomerceProduct isMyProduct item={item} index={index} />}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingBottom: statusBarHeight,
        }}
        style={{backgroundColor: Color.semiwhite}}
      />

      {bottomComponent}
    </>
  );
};

export default ListMyProduct;