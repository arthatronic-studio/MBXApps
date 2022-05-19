import React, { useState, useEffect, useRef } from 'react';
import { View, Image, SafeAreaView, TextInput as TextInputs, useWindowDimensions } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Text,
  // TouchableOpacity,
  useLoading,
  Scaffold,
  Row, Col,
  useColor,
  Header
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import { TextInput } from 'src/components/Form';
import TopTabShop from './TopTabShop';
import ImagesPath from 'src/components/ImagesPath';
import { queryGetMyProduct, queryGetMyShop } from 'src/lib/query/ecommerce';
import ListMyProduct from 'src/screens/Ecommerce/ListMyProduct';

const MyShop = ({ navigation, route }) => {
  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [data, setData] = useState({});

  const { Color } = useColor();
  const { width, height } = useWindowDimensions();

  useEffect(() => {
		getMyShop();
	}, []);
	
	const getMyShop = () => {
		let variables = {
		  merchantId: undefined,
		}
		Client.query({query: queryGetMyShop})
		  .then(res => {
			console.log(res, 'ress')
      if (res.data.ecommerceGetMerchant) {
				if(res.data.ecommerceGetMerchant.id){
					setData(res.data.ecommerceGetMerchant);
				}else{
					navigation.replace('SplashCreateShop')
				}
			}
	
			// hideLoading();
			// navigation.navigate('TopUpScreen');
		  })
		  .catch(reject => {
			  console.log(reject);
      });
  };

  const imageStoreSize = width / 5;

  const renderHeaderMyStore = () => {
    return (
      <View style={{width, marginLeft: -8, backgroundColor: Color.theme, marginBottom: 16}}>
        <View style={{ width: '100%', aspectRatio: 4/1, paddingHorizontal: 16 }}>
          <Image source={ImagesPath.shopbanner} style={{width: '100%', height: '100%'}}/>

          <TouchableOpacity
            onPress={() => navigation.navigate('MyShop')}
            style={{ height: imageStoreSize, aspectRatio: 1, position: 'absolute', bottom: -(imageStoreSize / 2), left: 32}}
          > 
            <Image source={{ uri: data.profileImg }} style={{width: '100%', height: '100%', borderRadius: 4}} />
          </TouchableOpacity>

          
        </View>

        <View style={{marginTop: imageStoreSize / 1.4, backgroundColor: Color.theme, paddingBottom: 32, paddingLeft: 16, height: 60 }}>
          <Text align='left' type='bold' size={18}>{data.name}</Text>
          <Row style={{marginVertical: 8}}>
              <Entypo name={'location-pin'} size={12} style={{color: Color.secondary, paddingVertical: 1, paddingHorizontal: 2}}/>
              <Text size={10} numberOfLines={1} style={{color: Color.secondary, width: '30%', marginRight: 10}}>{data.cityName? data.cityName : 'Belum Ada Lokasi yang jelas gimana'}</Text>
              <FontAwesome name={'phone'} size={12} style={{color: Color.secondary, paddingVertical: 1, marginHorizontal: 8}}/>
              <Text style={{fontSize: 10, textAlign: 'left', width: '25%'}}>{data.noTelp}</Text>
              <Entypo name={'instagram'} size={12} style={{color: Color.secondary, paddingVertical: 1, paddingHorizontal: 5}}/>
              <Text numberOfLines={1} style={{fontSize: 10, textAlign: 'left', width: '20%'}}>@{data.socialMedia ? data.socialMedia.instagram : ''}</Text>
          </Row>
        </View>
      </View>
    )
  }

  const renderFooterMyStore = () => {
    return (
      <Row style={{ backgroundColor: Color.theme, padding: 16 }}>
        {/* hide batch delete */}
        {/* <Col size={1.5}>
          <TouchableOpacity onPress={() => navigation.navigate('MyProduct')} style={{ width: 50,backgroundColor: Color.theme, borderWidth: 1, borderColor: Color.primary, borderRadius: 20, paddingVertical: 10 }}>
            <AntDesign name={'delete'} size={18} style={{textAlign: 'center', color: Color.primary}}/>
          </TouchableOpacity>
        </Col> */}
        {/* <Col size={0.5} /> */}
        <TouchableOpacity onPress={()=> navigation.navigate('AddProduct',{type: 'add', item: {}})} style={{justifyContent: 'center',flexDirection: 'row',backgroundColor: Color.primary, borderRadius: 20, paddingVertical: 10, width: '100%'}}>
          <AntDesign name={'pluscircleo'} size={18} style={{color: Color.textInput, paddingVertical: 2, marginHorizontal: 10}}/>
          <Text type='semibold' color={Color.textInput}>Tambah Produk</Text>
        </TouchableOpacity>
      </Row>
    )
  }

  if (data.length == 0) return <View />;

  return (
    <Scaffold
      header={
        <Header 
          customIcon 
          title='Toko Saya'
          type='regular'
          centerTitle={false}
        />
      }
      loadingProps={loadingProps}
      onPressLeftButton={() => navigation.pop()}
    >
      {/* hide etalase */}
      {/* <TopTabShop /> */}
      <ListMyProduct
        topComponent={renderHeaderMyStore()}
        bottomComponent={renderFooterMyStore()}
      />
    </Scaffold>
  );
}

export default MyShop;