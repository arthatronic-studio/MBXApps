import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, SafeAreaView, TextInput as TextInputs } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Text,
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
  const [group, setGroup] = useState([]);
  const [idx, setIndex] = useState(0);
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
    let products = []
    route.params.item.product.forEach(element => {
      products.push({id: element.id, qty: element.qty})
      // products.push(element.id)
    });
    console.log(products)
    let variables = {
        input:{
            cod: false,
            productIds: products,
            for_order: true,
            userAddressIdDestination: route.params.item.userAddressIdDestination,
            userAddressIdOrigin: route.params.item.userAddressIdDestination,
        }
    }
    console.log(variables)
    Client.mutate({mutation: queryGetShipper, variables})
      .then(res => {
          if(res.data.shipperGetPriceDomestic){
            // const sort = res.data.shipperGetPriceDomestic.pricings.sort((a,b) => (a.logistic.name > b.logistic.name) ? 1 : ((b.logistic.name > a.logistic.name) ? -1 : 0))
            //  const groupByCategory = sort.reduce((group, product) => {
            //         const { name } = product.rate;
            //         group[name] = group[name] ?? [];
            //         group[name].push(product);
            //         return group;
            //       }, {});
            //       setGroup(groupByCategory)
            //       console.log(groupByCategory)
           
            setGroup(res.data.shipperGetPriceDomestic.groupListing)
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
            {Object.keys(group).map(function(key, index) {
               return(
                 <>
                  {key != '__typename' && group[key].length != 0 && <TouchableOpacity onPress={() => setIndex(index == idx ? null : index)} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                    <Row>
                      <Text align='left' size={13} type='bold'>{key}</Text>
                      <Col style={{ justifyContent: 'center',alignItems: 'flex-end' }}>
                        <AntDesign name={idx == index ? 'down' : 'right'} color='#07181F' />
                      </Col>
                    </Row>
                    {idx == index && group[key].length != 0 &&  group[key].map((val, id) => (
                      <TouchableOpacity onPress={() => submit(val)} style={{ paddingLeft: 15, paddingVertical: 12 }}>
                        <Row>
                          <Col>
                            <Text align='left' type='semibold' size={13}>{val.logisticName}</Text>
                            <Text align='left' size={9}>{val.estimation} hari</Text>
                          </Col>
                          <Col style={{ justifyContent: 'center' }}>
                            <Text align='right' size={11} type='bold'>{FormatMoney.getFormattedMoney(val.price)}</Text>
                          </Col>
                        </Row>
                      </TouchableOpacity>
                    ))}
                  </TouchableOpacity>}
                </>
               )
                    // console.log(key,groupByCategory[key], index)
            })}
            {/* {list.map((val, id) => (
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
            ))} */}
          </View>
        </ScrollView>
      {/* <Loading {...loadingProps} /> */}
    </Scaffold>
  );
}

export default ListShipping;