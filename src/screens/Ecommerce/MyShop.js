import React, { useState, useEffect, useRef } from 'react';
import { View, Image ,ScrollView, Platform, SafeAreaView, TextInput as TextInputs } from 'react-native';
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
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import { TextInput } from 'src/components/Form';
import CardListProduk from 'src/components/Card/CardListProduct';
import TopTabShop from './TopTabShop';
import ImagesPath from 'src/components/ImagesPath';
import { queryGetMyProduct, queryGetMyShop } from 'src/lib/query/ecommerce';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;

const MyShop = ({ navigation, route }) => {
  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [data, setData] = useState({});
  const { Color } = useColor();

  useEffect(() => {
		getMyShop();
	// });
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

  if(data.length == 0) return <View />
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
          onPressLeftButton={() => navigation.pop()}
        >

        <View showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: Color.semiwhite }}>
          <View style={{backgroundColor: Color.theme, height: 190, marginBottom: 10}}>
            <View style={{ height: 68,}}>
              <Image source={ImagesPath.shopbanner} style={{width: '98%'}}/>
            </View>
            <View style={{ flexDirection: 'row', height: 72, backgroundColor: Color.textInput, position: 'absolute', elevation: 1, top: 36, zIndex: 1, left: 16, width: 72, borderRadius: 8 }}> 
              <Image source={ImagesPath.shopprofile} style={{width: '100%', height: '100%'}}/>
            </View>
            <View style={{alignItems: 'flex-end', marginHorizontal: 20, marginVertical: 8}}>
              <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center',borderWidth: 1, borderColor: Color.primary, height: 28, width: '24%', borderRadius: 8}}>
                <Text style={{fontSize: 9, color: Color.primary}}>Edit Toko</Text>
              </TouchableOpacity>
            </View>
                <View style={{marginVertical: 12, backgroundColor: Color.theme, paddingBottom: 32, paddingLeft: 16, height: 60 }}>
                    <Text align='left' type='bold' size={18}>{data.name}</Text>
                    <Row style={{marginVertical: 5}}>
                        <Col style={{flexDirection: 'row'}}>
                            <Entypo name={'location-pin'} size={12} style={{color: Color.secondary, paddingVertical: 1, paddingHorizontal: 2}}/>
                            <Text size={10}>{data.alamat}</Text>
                        </Col>
                        <Col style={{flexDirection: 'row'}}>
                            <FontAwesome name={'phone'} size={12} style={{color: Color.secondary, paddingVertical: 2, paddingHorizontal: 5}}/>
                            <Text size={10}>{data.noTelp}</Text>
                        </Col>
                        <Col style={{flexDirection: 'row'}}>
                            <Entypo name={'instagram'} size={12} style={{color: Color.secondary, paddingVertical: 1, paddingHorizontal: 5}}/>
                            <Text size={10}>@{data.socialMedia ? data.socialMedia.instagram : ''}</Text>
                        </Col>
                        
                    </Row>
                </View>
            </View>
            <TopTabShop />
        </View>
        <Row style={{ backgroundColor: Color.theme, padding: 16 }}>
            <Col size={1.5}>
                <TouchableOpacity onPress={() => navigation.navigate('CheckoutScreen')} style={{ width: 50,backgroundColor: Color.theme, borderWidth: 1, borderColor: Color.primary, borderRadius: 20, paddingVertical: 10 }}>
                    <AntDesign name={'delete'} size={18} style={{textAlign: 'center', color: Color.primary}}/>
                </TouchableOpacity>
            </Col>
            <Col size={0.5} />
           
                <TouchableOpacity onPress={()=> navigation.navigate('AddProduct')} style={{justifyContent: 'center',flexDirection: 'row',backgroundColor: Color.primary, borderRadius: 20, paddingVertical: 10, width: '83%'}}>
                    <AntDesign name={'pluscircleo'} size={18} style={{color: Color.textInput, paddingVertical: 2, marginHorizontal: 10}}/>
                    <Text type='semibold' color={Color.textInput} style={{selfAlign: 'center'}}>Tambah Produk</Text>
                </TouchableOpacity>
            
        </Row>
      {/* <Loading {...loadingProps} /> */}
    </Scaffold>
  );
}

export default MyShop;