import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, SafeAreaView, TextInput as TextInputs } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Text,
  // TouchableOpacity,
  Loading, useLoading,
  Scaffold,
  Row, Col,
  HeaderBig,
  useColor,
  Header
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import { TextInput } from 'src/components/Form';
import client from '@src/lib/apollo';
import { queryGetShipper } from 'src/lib/query/ecommerce';
import { FormatMoney } from 'src/utils';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;

const ListShipping = ({ route, navigation  }) => {
  console.log(route)
  const [list, setList] = useState([]);
  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const { Color } = useColor();

  
  useEffect(() => {
    getShipping()
    return () => {
    }
  }, [])

  const submit = (data) => {
      navigation.navigate('CheckoutScreen',{saveShippment: { ...data } })
  }


  const getShipping = () => {
    showLoading();
    let variables = {
        input:{
            cod: false,
            productId: 3,
            for_order: true,
            userAddressIdDestination: 268,
            userAddressIdOrigin: 1,
        }
        
    }
    console.log(variables)
    Client.mutate({mutation: queryGetShipper, variables})
      .then(res => {
          if(res.data.shipperGetPriceDomestic){
            setList(res.data.shipperGetPriceDomestic.pricings)
          }
        hideLoading()
        console.log(res)
        
      })
      .catch(reject => {
        hideLoading()
        alert(reject.message)
        console.log(reject.message, 'reject');
      });
  };

  return (
    <Scaffold
          header={
            <Header 
              customIcon 
              title='Pilih Pengiriman' 
              type='regular' 
              centerTitle={false}
            />
          }
        >
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, }}>
          <View style={{ marginBottom: 40 }}>
            {list.map((val, id) => (
                <TouchableOpacity onPress={() => submit(val)} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                  <Row>
                    <Col>
                      <Text align='left' size={13}>{val.logistic.name}</Text>
                      <Text align='left' size={10}>{val.min_day} - {val.max_day} hari</Text>
                    </Col>
                    <Col style={{ justifyContent: 'center' }}>
                      <Text align='right' size={12}>{FormatMoney.getFormattedMoney(val.final_price)}</Text>
                    </Col>
                  </Row>
                </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      {/* <Loading {...loadingProps} /> */}
    </Scaffold>
  );
}

export default ListShipping;