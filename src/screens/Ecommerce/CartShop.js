import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, FlatList, SafeAreaView } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import {useIsFocused, useRoute} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TopBar from '../Auction/TopBar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
import { queryDeleteItemCart, queryCheckout, queryUpdateItemCart, queryGetCart } from 'src/lib/query/ecommerce';
import { FormatMoney } from 'src/utils';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const CartShop = ({ navigation, route }) => {
  const { Color } = useColor();

  const [list, setList] = useState([]);
  const [cart, setCart] = useState(true);
  const isFocused = useIsFocused();
  let temp = []


  
  useEffect(() => {
      temp = []
    getCart()
  }, [isFocused]);

  const getCart = () => {
    console.log(route, 'props')
    // showLoading();
    let variables = {
      page: 1,
      limit: 50
    }
    console.log(variables)
    Client.query({query: queryGetCart, variables})
      .then(res => {
        // hideLoading()
        console.log(res)
        if (res.data.ecommerceCartList) {
            setCart(res.data.ecommerceCartList)
            res.data.ecommerceCartList.products.forEach((items, index) => {
                temp.push({...items, checked: false, ...res.data.ecommerceCartList.productCartInfo[index]})
            });
            setList(temp)
        }
      })
      .catch(reject => {
        // hideLoading()
        alert(reject.message)
        console.log(reject.message, 'reject');
      });
  };

  const deleteProduct = (id) => {
    console.log(route, 'props')
    // showLoading();
    let variables = {
        productId: id,
    }
    console.log(variables)
    Client.mutate({mutation: queryDeleteItemCart, variables})
      .then(res => {
        getCart()
        // hideLoading()
        console.log(res)
        // if (res.data.ecommerceCartList) {
        //     setList(res.data.ecommerceCartList)
        // }
      })
      .catch(reject => {
        // hideLoading()
        alert(reject.message)
        console.log(reject.message, 'reject');
      });
  };

  const updateQty = (item, qty) => {
    console.log(route, 'props')
    if(item.quantity + qty == 0) return deleteProduct()
    // showLoading();
    let variables = {
        productId: item.id,
        quantity: item.quantity + qty
    }
    console.log(variables)
    Client.mutate({mutation: queryUpdateItemCart, variables})
      .then(res => {
        getCart()
        // hideLoading()
        console.log(res)
        // if (res.data.ecommerceCartList) {
        //     setList(res.data.ecommerceCartList)
        // }
      })
      .catch(reject => {
        // hideLoading()
        alert(reject.message)
        console.log(reject.message, 'reject');
      });
  };

  const submit = (item, qty) => {
    console.log(route, 'props')
    // showLoading();
    let variables = {
        productId: item.id,
    }
    console.log(variables)
    Client.mutate({mutation: queryCheckout, variables})
      .then(res => {
        getCart()
        // hideLoading()
        console.log(res)
        // if (res.data.ecommerceCartList) {
        //     setList(res.data.ecommerceCartList)
        // }
      })
      .catch(reject => {
        // hideLoading()
        alert(reject.message)
        console.log(reject.message, 'reject');
      });
  };

  function onChecked(index, value){
      console.log(index, value)
      const tempx = list
      console.log(tempx)
      tempx[index]['checked'] = !value
      console.log(tempx, 111)
      setList(tempx)
      setCart(!value)
  }

  const renderItem = ({item, index}) => (
        <Row style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
            {console.log(item)}
            <View style={{ justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => onChecked(index, item.checked)} style={{ height: 13, width: 13, marginRight: 16, borderColor: Color.text, borderWidth: 1, borderRadius: 2 }}>
                    {item.checked && <AntDesign name='check' />}
                </TouchableOpacity>
            </View>
            <View style={{ height: 56, width: 56, marginRight: 14, backgroundColor: Color.text, borderRadius: 8 }} />
            <Col>
                <View style={{ alignItems: 'flex-start' }}>
                    <Text color={Color.text} style={{ textAlign: 'left', marginBottom: 10 }} type='bold'>{item.name}</Text>
                </View>
                <View style={{ justifyContent: 'flex-end', flex: 1 }}>
                    <Row>
                        <View>
                            <Text size={10} color={Color.text} align='left'>Total Harga</Text>
                            <Text size={13} color={Color.text} type='bold'>{FormatMoney.getFormattedMoney(item.price)}</Text>
                        </View>
                        <Col style={{ flex: 1,  }}>
                            <Text size={10} color={Color.text} align='left' />
                            <Row style={{  justifyContent: 'flex-end', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => deleteProduct(item.id)}>
                                    <FontAwesome name='trash-o' size={15} color={Color.error} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => updateQty(item, -1)} style={{ marginLeft: 24 }}>
                                    <AntDesign name='minuscircleo' color={Color.disabled} size={15} />
                                </TouchableOpacity>
                                <View>
                                    <Text color={Color.text} style={{ marginHorizontal: 8 }}>{item.quantity}</Text>
                                </View>
                                <TouchableOpacity onPress={() => updateQty(item, 1)}>
                                    <AntDesign name='pluscircleo' color={Color.secondary} size={15} />  
                                </TouchableOpacity>

                            </Row>
                        </Col>
                    </Row>
                </View>
            </Col>
        </Row>
  );

  const totalProduct = (item) => {
    let total = 0
    if(item){
        item.forEach((element, index) => {
            total = total + (element.price * element['quantity'])
        });
        return total
    }
    
  }

  return (
    <View style={{ flex: 1, backgroundColor: Color.theme }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View>
          {list && <FlatList
                numColumns={1}
                extraData={list}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                data={list}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingHorizontal: 8,
                    paddingBottom: 20,
                }}
            />}
                
                <View style={{ backgroundColor: '#rgba(255, 255, 254, 0.2)', height: 2, marginTop: 24 }} />
            </View>
            
        </ScrollView>
        <Row style={{padding: 16 }}>
            <Col align='flex-start' justify='center'>
                <Text size={10} color={Color.text}>Total Harga</Text>
                <Text type='bold' color={Color.text} >{list ? FormatMoney.getFormattedMoney(totalProduct(list)) : 0}</Text>
            </Col>
            <Col>
                <TouchableOpacity onPress={() => submit(list[0])} style={{ backgroundColor: Color.info, borderRadius: 20, paddingVertical: 10 }}>
                    <Text type='semibold' color={Color.textInput}>Checkout</Text>
                </TouchableOpacity>
            </Col>
        </Row>
      {/* <Loading {...loadingProps} /> */}
    </View>
  );
}

export default CartShop;