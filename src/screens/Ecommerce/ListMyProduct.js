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
import ImagesPath from 'src/components/ImagesPath';
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
        console.log(res, 'product seller');

        if (res.data.ecommerceGetMerchant.productList) {
          let newData = res.data.ecommerceGetMerchant.productList;
          setListProduct(newData);
        }else{
          setListProduct([]);
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


      {topComponent}
      
      {listProduct.length === 0 ?
      <View style={{justifyContent: 'center', alignItems: 'center', height: '55%', backgroundColor: Color.semiwhite}}>
        <Image source={ImagesPath.productempty}/>
        <Text style={{marginVertical: 15, lineHeight: 20,fontSize: 14, color: Color.secondary, width: '60%', textAlign: 'center' }}>Kamu belum memasukkan barang apapun ke Toko</Text>
      </View>
      :
      <FlatList
      numColumns={2}
      keyExtractor={(item, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      data={listProduct}
      renderItem={({ item, index }) => <CardEcomerceProduct isMyProduct item={item} onRefresh={() => getProduct()} index={index} />}
      contentContainerStyle={{
        paddingHorizontal: 8,
        paddingTop: 8,
        paddingBottom: statusBarHeight,
      }}
      style={{backgroundColor: Color.semiwhite}}
    />
      }

      {bottomComponent}
    </>
  );
};

export default ListMyProduct;