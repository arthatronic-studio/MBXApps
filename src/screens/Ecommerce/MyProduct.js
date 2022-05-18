import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  TextInput as TextInputs,
  Image,
  FlatList,
} from 'react-native';
import Styled from 'styled-components';

import {
  Text,
  // TouchableOpacity,
  Loading,
  useLoading,
  Scaffold,
  Row,
  Col,
  HeaderBig,
  useColor,
  Header,
} from '@src/components';
import {TouchableOpacity} from '@src/components/Button';

import Filter from 'src/components/Filter';
import ImagesPath from 'src/components/ImagesPath';
import Client from '@src/lib/apollo';


import {MainView} from 'src/styled';
import { shadowStyle } from '@src/styles';
import { useIsFocused } from '@react-navigation/native';

import { mutationMerchant, queryGetCart, queryGetMyProduct } from 'src/lib/query/ecommerce';
import CardEcomerceProduct from './CardEcomerceProduct';

let filter = [
  {id: 1, name: 'Category'},
  {id: 2, name: 'Rating'},
];

const MyProduct = ({navigation, route}) => {
  // selector
  const {Color} = useColor();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const isFocused = useIsFocused();

  const onSelect = item => {
    setSelectedItem(item);
  };

  const getProductList = (id) => {
    showLoading();
    let variables = {
      merchantId: id,
    }

    console.log(variables);

    Client.query({query: queryGetMyProduct, variables})
      .then(res => {
        // hideLoading()
        console.log(res)
        if (res.data.ecommerceGetMerchant) {
          let temp = []
          // if(res.data.ecommerceGetMerchant.productList.length > 0){
          //   res.data.ecommerceGetMerchant.productList.forEach(element => {
          //     if(element.status ==)
          //   });
          // }
          setData1(res.data.ecommerceGetMerchant.productList.filter((v, i) => !(i % 2)));
          setData2(res.data.ecommerceGetMerchant.productList.filter((v, i) => (i % 2)));
        }
      })
      .catch(reject => {
        hideLoading()
        console.log(reject.message, 'error');
      });
  }


  const deleteProduct = (id, index) => {
    console.log(route, 'props')
    // showLoading();
    let variables = {
      body: {
         userId:id
      },
      merchantId:id,
      type: 'DELETED',
    }
    
    console.log(variables);

    Client.mutate({mutation: mutationMerchant, variables})
      .then(res => {
       
        console.log(res)
        if (res.data.ecommerceGetMerchant) {
          alert('Success delete')
        }
      })
      .catch(reject => {
        // hideLoading()
        alert(reject.message)
        console.log(reject.message, 'reject');
      });
  };

  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    getProductList();
  }, [isFocused]);

  return (
    <Scaffold
      header={
        <Header
          customIcon
          title="Produk Saya"
          type="regular"
          centerTitle={false}
        />
      }
      onPressLeftButton={() => navigation.pop()}>
      <ScrollView style={{backgroundColor: Color.semiwhite}}>
        {/* hide filter */}
        {/* <View style={{marginTop: 12, marginBottom: 10}}>
          <Filter
            title={'semua'}
            value={selectedItem}
            data={filter}
            onSelect={onSelect}
          />
        </View> */}
        <View style={{flex: 1, flexDirection: 'row'}}>
          <FlatList
            data={data1}
            keyExtractor={(item, index) => item.toString() + index}
            contentContainerStyle={{
              marginTop: 16,
              paddingHorizontal: 8,
            }}
            renderItem={({item, index}) => {
              return <CardEcomerceProduct item={item} index={index} isMyProduct onRefresh={() => getProductList()} type={"not-simetris"}/>;
            }}
          />
          <FlatList
            data={data2}
            keyExtractor={(item, index) => item.toString() + index}
            contentContainerStyle={{
              marginTop: 16,
              paddingHorizontal: 8,
            }}
            renderItem={({item, index}) => {
              return <CardEcomerceProduct item={item} index={index} isMyProduct onRefresh={() => getProductList()} type={"not-simetris"}/>;
            }}
          />
        </View>

        {/* <Loading {...loadingProps} /> */}
      </ScrollView>
      <View
        style={{
          ...shadowStyle,
          height: 77,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Color.textInput,
        }}>
        <View
          style={{
            width: '92%',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          {/* hide batch delete */}
          {/* <TouchableOpacity
            style={{
              borderWidth: 1.5,
              borderColor: Color.danger,
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 120,
            }}
          >
            
            <Image source={ImagesPath.trash} />
          </TouchableOpacity> */}
          <TouchableOpacity
          onPress={() => navigation.navigate('AddProduct', {type: 'add', item: {}})}
            style={{
              flexDirection: 'row',
              backgroundColor: Color.primary,
              paddingVertical: 10,
              flex: 2,
              marginLeft: 10,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image source={ImagesPath.plusCircle} />
            <Text style={{ color: Color.textInput, marginLeft: 11 }}
            
            >
              Tambah Produk
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Scaffold>
  );
};

export default MyProduct;
