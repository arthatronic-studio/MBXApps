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
import CardProduct from './CardProduct';
import ImagesPath from 'src/components/ImagesPath';
import Client from '@src/lib/apollo';


import {MainView} from 'src/styled';
import { shadowStyle } from '@src/styles';

import { mutationMerchant, queryGetCart, queryGetMyProduct } from 'src/lib/query/ecommerce';

let filter = [
  {id: 1, name: 'Category'},
  {id: 2, name: 'Rating'},
];




const MyProduct = ({navigation, route}) => {
  // selector
  const {Color} = useColor();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [data, setData] = useState({
    "id": 1,
    "userId": 1,
    "name": "Preach",
    "noTelp": "082213231071",
    "alamat": "bakti murni",
    "profileImg": ImagesPath.productImage,
    "isVeriffied": true,
    "isOfficial": true,
    "productList": [{
      "id": 1,
      "name": "Preach",
      "catgoryID": 1,
      "description": "Preach",
      "price": 10000,
      "initialPrice": 1000000.0,
      "imageUrl": ImagesPath.productImage,
      "stock": 10,
      "height": 1.5,
      "width": 1.5,
      "length": 1.5,
      "weight": 1.5,
      "merchantId": 1,
      "productUnit": "res productUnit",
      "minimumBuy": 1,
      "productMassa": "100",
      "status": "statusss",
      "Category": "Pakaian",
    },
    {
      "id": 2,
      "name": "bro",
      "catgoryID": 2,
      "description": "bro",
      "price": 10000,
      "initialPrice": 1000000.0,
      "imageUrl": ImagesPath.productImage,
      "stock": 10,
      "height": 1.5,
      "width": 1.5,
      "length": 1.5,
      "weight": 1.5,
      "merchantId": 1,
      "productUnit": "res productUnit",
      "minimumBuy": 1,
      "productMassa": "100",
      "status": "statusss",
      "Category": "Pakaian",
    }],
  });

  const onSelect = item => {
    setSelectedItem(item);
  };
  const getProductList = (id) => {
    showLoading();
    let variables = {
      merchantId: id,
    }
    console.log(variables)
    Client.query({query: queryGetMyProduct, variables})
      .then(res => {
        // hideLoading()
        console.log(res)
        if (res.data.ecommerceGetMerchant) {
          setData(res.data.ecommerceGetMerchant);
          console.log(res.data.ecommerceGetMerchant.productList);
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
    console.log(variables)
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
  }, []);

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
      <MainView style={{backgroundColor: Color.semiwhite}}>
        <View style={{marginTop: 12, marginBottom: 10}}>
          <Filter
            title={'semua'}
            value={selectedItem}
            data={filter}
            onSelect={onSelect}
          />
        </View>
        
        <View style={{flex: 1}}>
          <FlatList
            data={data.productList}
            keyExtractor={(item, index) => item.toString() + index}
            renderItem={({item}) => {
              return <CardProduct data={item} />;
            }}
          />
        </View>

        {/* <Loading {...loadingProps} /> */}
      </MainView>
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
          <TouchableOpacity
            style={{
              borderWidth: 1.5,
              borderColor: Color.danger,
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 120,
            }}
            onPress={() => deleteProduct()}
          >
            
            <Image source={ImagesPath.trash} />
          </TouchableOpacity>
          <TouchableOpacity
          onPress={() => navigation.navigate('AddProduct')}
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
