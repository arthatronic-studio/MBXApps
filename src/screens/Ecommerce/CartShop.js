import React, {useState, useEffect, useRef} from 'react';
import {View, ScrollView, FlatList, SafeAreaView, Image} from 'react-native';
import Styled from 'styled-components';
import {useSelector} from 'react-redux';
import {useIsFocused, useRoute} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Text,
  // TouchableOpacity,
  useLoading,
  Scaffold,
  Row,
  Col,
  HeaderBig,
  useColor,
  Header,
} from '@src/components';
import Loading from 'src/components/Modal/Loading';
import {TouchableOpacity} from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';

import {shadowStyle} from '@src/styles';

import Client from '@src/lib/apollo';
import {queryContentProduct} from '@src/lib/query';
import {
  queryDeleteItemCart,
  queryCheckout,
  queryUpdateItemCart,
  queryGetCart,
} from 'src/lib/query/ecommerce';
import {FormatMoney} from 'src/utils';
import ImagesPath from 'src/components/ImagesPath';

const CartShop = ({navigation, route}) => {
  const {Color} = useColor();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState([]);
  const [cart, setCart] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [loadingProps, showLoading, hideLoading] = useLoading();

  const isFocused = useIsFocused();
  let temp = [];

  useEffect(() => {
    temp = [];
    getCart();
  }, [isFocused]);

  const getCart = () => {
    console.log(route, 'props');
    // showLoading();
    let variables = {
      page: 1,
      limit: 10,
    };
    console.log(variables);
    Client.query({query: queryGetCart, variables})
      .then(res => {
        // hideLoading()
        console.log(res);
        if (res.data.ecommerceCartList.id) {
          setCart(res.data.ecommerceCartList);
          const dataq = res.data.ecommerceCartList.items.map((val, id) => {
            const dateq = {
              ...val,
              checked: false,
            };
            const products = val.products.map((value, idx) => {
              return {
                ...value,
                checked: false
                }
              })
              return {
                ...dateq,
                products
              }
            })
            console.log(dataq)
            // res.data.ecommerceCartList.products.forEach((items, index) => {
            //     temp.push({...items, checked: false, ...res.data.ecommerceCartList.productCartInfo[index]})
            // });
            // setList(temp)
            setList(dataq)
            setChecked(temp)
        }

        setLoading(false);
      })
      .catch(reject => {
        // hideLoading()
        console.log(reject, 'reject');
        setLoading(false);
      });
  };

  const deleteProduct = (id, index) => {
    console.log(route, 'props');
    showLoading();
    let variables = {
      productId: id,
    };
    console.log(variables);
    Client.mutate({mutation: queryDeleteItemCart, variables})
      .then(res => {
        // const tempx = list
        // tempx.splice(index, 1)
        // setList(tempx)
        // setRefresh(refresh+1)
        getCart();
        hideLoading();
        console.log(res);
        // if (res.data.ecommerceCartList) {
        //     setList(res.data.ecommerceCartList)
        // }
      })
      .catch(reject => {
        // hideLoading()
        alert(reject.message);
        console.log(reject.message, 'reject');
      });
  };

  const updateQty = (item, qty, index, id) => {
    console.log(item)
    const tempx = list
    console.log(tempx[index]['products'][id])
    // tempx[id][index]['quantity'] = item.quantity + qty
    //       console.log(tempx, 111)
    //       setList(tempx)
    //       setRefresh(refresh+1)
    // console.log(route, 'props')
    if (item.quantity + qty == 0) return deleteProduct(item.id);
    showLoading();
    let variables = {
        productId: item.id,
        quantity: item.quantity + qty,
        checked: item.checked,
        updateType: qty > 0 ? "ADD" : "DELETE"
    }
    console.log(variables)
    Client.mutate({mutation: queryUpdateItemCart, variables})
      .then(res => {
        const tempx = list;
        tempx[index]['products'][id]['quantity'] = item.quantity + qty;
        console.log(tempx, 111);
        setList(tempx);
        setRefresh(refresh + 1);
        // getCart()
        hideLoading();
        console.log(res);
        // if (res.data.ecommerceCartList) {
        //     setList(res.data.ecommerceCartList)
        // }
      })
      .catch(reject => {
        hideLoading();
        alert(reject.message);
        console.log(reject.message, 'reject');
      });
  };

  const submit = () => {
    console.log(route, 'props');
    let tempData = [];
    list.forEach(element => {
      element.products.forEach(element => {
        if (element.checked)
          tempData.push({
            id: element.id,
            price: element.price,
            qty: element.quantity,
          });
      });
    });
    const item = {
      isFromCart: true,
      tempData,
    };
    let dataq = [];
    list.forEach(val => {
      let datTem = [];
      val.products.forEach(element => {
        if (element.checked) {
          datTem.push(element);
        }
      });
      const valid = val.products.findIndex(vall => vall.checked == true)
      if(valid > -1) dataq.push({...val, products: datTem});
      
      
    });
    console.log(dataq);
    navigation.navigate('CheckoutScreen', {item, list: dataq});
  };

  function onChecked(index, id, value, name) {
    const tempx = list;
    if (name == 'product') {
      tempx[index]['products'][id]['checked'] = !value;
      setList(tempx);
      setRefresh(refresh + 1);
    } else {
      tempx[index]['checked'] = !value;
      tempx[index]['products'].forEach((element, idx) => {
        tempx[index]['products'][idx]['checked'] = !value;
      });
      console.log(tempx, 111);
      setList(tempx);
      setRefresh(refresh + 1);
    }
  }

  const renderItem = ({item, index}) => (
    <View style={{borderBottomColor: '#00000020', borderBottomWidth: 1}}>
      <View
        style={{
          marginBottom: 24,
          marginTop: 14,
        }}>
        <Row style={{marginHorizontal: 10}}>
          <View style={{justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => onChecked(index, null, item.checked, 'shop')}
              style={{
                height: 16,
                width: 16,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
                borderColor: Color.text,
                borderWidth: 1,
                borderRadius: 4,
              }}>
              {item.checked && <AntDesign name="check" />}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('DetailProduct', {val})}
            style={{marginRight: 14}}>
            <Text align="left" size={12} type="bold">
              {item.name}
            </Text>
            <Text align="left" color="#606060" size={9}>
              {item.alamat}
            </Text>
          </TouchableOpacity>
        </Row>
      </View>
      {item.products.map((val, id) => (
        <View key={id}>
          <Row style={{paddingHorizontal: 10, paddingBottom: 20}}>
            <View
              style={{
                paddingVertical: 20,
              }}>
              <TouchableOpacity
                onPress={() => onChecked(index, id, val.checked, 'product')}
                style={{
                  height: 16,
                  width: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                  borderColor: Color.text,
                  borderWidth: 1,
                  borderRadius: 4,
                }}>
                {val.checked && <AntDesign name="check" />}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DetailProduct', {item: {...val}})
              }
              style={{height: 56, width: 56, marginRight: 14}}>
              <Image
                source={{uri: val.imageUrl}}
                resizeMode="cover"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 10,
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
            <Col>
              <View style={{alignItems: 'flex-start'}}>
                <Text
                  size={14}
                  color={Color.text}
                  style={{textAlign: 'left', marginBottom: 10}}
                  type="medium">
                  {val.name}
                </Text>
              </View>
              <Row>
                <Entypo name={'star'} style={{color: Color.warning}} />
                <Text
                  style={{
                    fontSize: 10,
                    color: Color.secondary,
                    marginHorizontal: 5,
                  }}>
                  4.5
                </Text>
                <Text style={{fontSize: 9, color: Color.secondary}}>|</Text>
                <Text
                  style={{
                    marginHorizontal: 5,
                    fontSize: 10,
                    color: Color.secondary,
                  }}>
                  2,5rb Terjual
                </Text>
              </Row>
              <Row>
                <Col style={{justifyContent: 'flex-end'}}>
                  <Text
                    size={13}
                    color={Color.text}
                    style={{textAlign: 'left'}}
                    type="bold">
                    {FormatMoney.getFormattedMoney(val.price)}
                  </Text>
                </Col>
                <View style={{justifyContent: 'flex-end', flex: 1}}>
                  <Text size={10} color={Color.text} align="left" />
                  <Row
                    style={{justifyContent: 'flex-end', alignItems: 'center'}}>
                    <TouchableOpacity
                      onPress={() => deleteProduct(val.id, index, id)}>
                      <FontAwesome
                        name="trash-o"
                        size={19}
                        color={Color.error}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => updateQty(val, -1, index, id)}
                      style={{marginLeft: 24}}>
                      <AntDesign
                        name="minuscircleo"
                        color={Color.disabled}
                        size={19}
                      />
                    </TouchableOpacity>
                    <View>
                      <Text
                        color={Color.text}
                        size={18}
                        style={{marginHorizontal: 8}}>
                        {val.quantity}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => updateQty(val, 1, index, id)}>
                      <AntDesign
                        name="pluscircleo"
                        color={'#F3771D'}
                        size={19}
                      />
                    </TouchableOpacity>
                  </Row>
                </View>
              </Row>
            </Col>
          </Row>
        </View>
      ))}
    </View>
  );

  const totalProduct = item => {
    let total = 0;
    if (item) {
      item.forEach((element, index) => {
        element.products.forEach(element => {
          if (element.checked)
            total = total + element.price * element['quantity'];
        });
      });
      return total;
    }
  };

  const checkButton = data => {
    let valid = true;
    if (data) {
      if(data.length > 0){
        data.forEach((element, index) => {
          element.products.forEach(element => {
            if (element.checked) valid = false;
          });
        });
      }
      return valid;
    }
    return valid
  };

  return (
    <Scaffold
      showHeader={false}
      fallback={loading}
    >
      {!loading && list.length === 0 && <View style={{ marginTop: '20%' }}>
        <Image source={ImagesPath.ShoppingCartEmpty} style={{ alignSelf: 'center' }} />
        <Text align='center' size={14} color='#9CA3A5'>Kamu belum memasukkan barang</Text>
        <Text align='center' size={14} color='#9CA3A5'>apapun ke keranjang</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MerchScreen')} color='#F3771D' style={{ backgroundColor: '#F3771D', paddingVertical: 10, width: '60%', alignSelf: 'center', marginTop: 30, borderRadius: 40 }}>
          <Text color='#fff'>Belanja Sekarang</Text>
        </TouchableOpacity>
      </View>}

      <FlatList
        numColumns={1}
        extraData={refresh}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        data={list}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingBottom: 20,
        }}
      />

      <View
        style={{
          backgroundColor: '#rgba(255, 255, 254, 0.2)',
          height: 2,
          marginTop: 24,
        }}
      />
        
      <Row style={{padding: 16}}>
        <Col align="flex-start" justify="center">
          <Text size={10} color={Color.text}>
            Total Harga
          </Text>
          <Text type="bold" color={Color.text}>
            {list && list.length > 0
              ? FormatMoney.getFormattedMoney(totalProduct(list))
              : FormatMoney.getFormattedMoney(0)}
          </Text>
        </Col>
        <Col>
          <TouchableOpacity
            disabled={checkButton(list)}
            onPress={() => submit()}
            style={{
              backgroundColor: checkButton(list) ? '#bcbcbc' : Color.primary,
              borderRadius: 20,
              paddingVertical: 10,
            }}>
            <Text type="semibold" color={Color.textInput}>
              Checkout
            </Text>
          </TouchableOpacity>
        </Col>
      </Row>
      <Loading {...loadingProps} />
    </Scaffold>
  );
};

export default CartShop;
