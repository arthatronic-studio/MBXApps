import React, {useState, useEffect, useRef} from 'react';
import {View, Image, useWindowDimensions, TextInput} from 'react-native';
import {Divider, Line} from 'src/styled';
import {connect, useDispatch, useStore} from 'react-redux';
import {TouchableOpacity} from '@src/components/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  ModalListAction,
} from '@src/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import ImagesPath from 'src/components/ImagesPath';
import { FormatMoney } from 'src/utils';
import { queryDetailProduct } from 'src/lib/query/ecommerce';
import client from 'src/lib/apollo';

const EditProduct = ({navigation,route}) => {
  const [data,setData] = useState([]);
  useEffect(()=>{
   
    getDetail()
   
  },[data])

  const getDetail = () => {
    let variables = {
      id: route.params.item.id,
    };
    client.query({query: queryDetailProduct, variables})
      .then(res => {
        console.log(res);
          setData(res.data.ecommerceProductDetail[0]);
          console.log("data detailllll")
          console.log(res.data.ecommerceProductDetail[0]);
         
      })
      .catch(reject => {
        console.log(reject);
      });
  }

  console.log(data,"dataaa")
  const {Color} = useColor();
  return (
    <Scaffold
      style
      header={
        <Header
          customIcon
          title="Edit Produk"
          type="regular"
          centerTitle={false}
        />
      }
      onPressLeftButton={() => navigation.pop()}>
      <View style={{paddingHorizontal: 14, paddingVertical: 16}}>
        <View
          style={{
            padding: 16,
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: Color.border,
            borderRadius: 8,
          }}>
          <Image
          source={{uri:data.imageUrl}}
            style={{
              borderRadius: 4,
              backgroundColor: Color.secondary,
              width: 48,
              height: 48,
            }}
          />
          <View style={{marginLeft: 8, alignItems: 'flex-start'}}>
            <Text type="bold">{data.name}</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: 120,
                marginVertical: 4,
              }}>
              <Text style={{color: Color.secondary}} size="10">
                Hijab
              </Text>
              <Text style={{color: Color.secondary}} size="10">
                •
              </Text>
              
              <Text style={{color: Color.secondary}} size="10">
                {data.weight}gr
              </Text>
              <Text style={{color: Color.secondary}} size="10">
                •
              </Text>
              <Text style={{color: Color.secondary}} size="10">
                {data.stock} Stok
              </Text>
            </View>
            <Text type="bold">{FormatMoney.getFormattedMoney(data.price)}</Text>
          </View>
        </View>
        <View style={{marginTop: 24, alignItems: 'flex-start'}}>
          <Text size="11" type="semibold">
            Detail
          </Text>

          <TouchableOpacity
          onPress={()=>{navigation.navigate('AddProduct',{item:data,type:"edit"})}}
            style={{
              paddingVertical: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
            <Text>Informasi Produk</Text>
            <Image source={ImagesPath.arrowRight} />
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=>{
            navigation.navigate("StepTwo",{item:data,type:"edit"})
          }}
            style={{
              paddingVertical: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
            <Text>Detail Produk</Text>
            <Image source={ImagesPath.arrowRight} />
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=>{
            navigation.navigate("StepThree",{item:data,type:"edit"})
          }}
            style={{
              paddingVertical: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
            <Text>Harga Produk</Text>
            <Image source={ImagesPath.arrowRight} />
          </TouchableOpacity>
        </View>
      </View>
    </Scaffold>
  );
};

export default EditProduct;
