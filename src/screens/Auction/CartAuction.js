import React, {useState, useEffect, useRef} from 'react';
import {View, ScrollView, Image, SafeAreaView} from 'react-native';
import Styled from 'styled-components';
import {useSelector} from 'react-redux';
import {useIsFocused, useRoute} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
import ListForum from '@src/screens/MainForum/ListForum';

import {shadowStyle} from '@src/styles';

import Client from '@src/lib/apollo';
import {queryContentProduct} from '@src/lib/query';
import { queryGetCartAuction } from 'src/lib/query/auction';
import { FormatMoney } from 'src/utils';
import ModalFilter from 'src/components/Modal/ModalFilter';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const CartAuction = ({navigation, route}) => {
  // selector
  const user = useSelector(state => state['user.auth'].login.user);

  const [list, setList] = useState([]);
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [loading, setLoading] = useState(true);
  const {Color} = useColor();

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
      limit:20,
      cartType: 'CART',
      orderDirection: 'DESC',
      orderBy: 'CREATEDATE'
    };
    console.log(variables);
    Client.query({query: queryGetCartAuction, variables})
      .then(res => {
        // hideLoading()
        console.log(res, 'auction');
        if (res.data.auctionCartList.id) {
            setList(res.data.auctionCartList.items)
        }
        setLoading(false);
      })
      .catch(reject => {
        console.log(reject, 'reject auction');
        setLoading(false);
      });
  };

  const submit = (val) => {
    const dataq = [{
      type: 'auction',
      products: [{...val,id: val.productId, imageUrl: val.image.length > 0 ? val.image : '',
        qty: val.quantity,
        price: val.latestBidPrice}],
      
    }]
    navigation.navigate('CheckoutScreen',{item: {tempData: [{...val, id: val.productId, imageUrl: val.image.length > 0 ? val.image[0] : '',
    qty: 1,
    price: val.latestBidPrice}]}, list: dataq})
  }

  return (
    <Scaffold header={<View />} style={{backgroundColor: Color.semiwhite}}>
        {list.map((val, id) => (
          <View
            style={{
              marginHorizontal: 15,
              marginTop: 10,
              padding: 15,
              borderRadius: 5,
              backgroundColor: Color.theme,
            }}>
            <Row style={{}}>
              <Image
                source={{ uri: val.image }}
                style={{
                  height: 74,
                  width: 74,
                  marginRight: 14,
                  backgroundColor: Color.semiwhite,
                  borderRadius: 8,
                }}
              />
              <Col>
                <Row>
                  <Col size={8} alignItems="flex-start">
                    <Text
                      color={Color.text}
                      style={{
                        textAlign: 'left',
                        marginBottom: 15,
                      }}
                      type="bold">
                      {val.name}
                    </Text>
                  </Col>
                  <Col>
                    <View
                      style={{
                        height: 28,
                        width: 65,
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginHorizontal: 10,
                        marginRight: 8,
                        backgroundColor: '#E3F7BC',
                        borderColor: '#76AE0B',
                        borderWidth: 1,
                      }}>
                      <Text size={10} color="#76AE0B">
                        {val.status}
                      </Text>
                    </View>
                  </Col>
                </Row>
                <View style={{justifyContent: 'flex-end', flex: 1}}>
                  <Row>
                    <View
                      style={{
                        alignItems: 'flex-start',
                        marginTop: 4,
                        justifyContent: 'flex-end',
                      }}>
                      <Text size={10} color={Color.gray}>
                        Harga
                      </Text>
                      <Text
                        size={14}
                        color={Color.text}
                        type="bold"
                        style={{marginRight: 5}}>
                        {FormatMoney.getFormattedMoney(val.latestBidPrice)}
                      </Text>
                    </View>
                    <AntDesign
                      name={'questioncircle'}
                      size={10}
                      style={{
                        color: Color.secondary,
                        alignSelf: 'flex-end',
                        marginBottom: 3,
                      }}
                    />
                    <Col>
                      <TouchableOpacity
                        onPress={() => submit(val)}
                        style={{
                          flex: 1,
                          justifyContent: 'flex-end',
                          alignItems: 'flex-end',
                          flexDirection: 'row',
                        }}>
                        <Text
                          size={10}
                          style={{color: Color.primary, marginHorizontal: 5}}>
                          Checkout
                        </Text>
                        <AntDesign
                          name={'arrowright'}
                          style={{color: Color.primary}}
                        />
                      </TouchableOpacity>
                    </Col>
                  </Row>
                </View>
              </Col>
            </Row>
          </View>
        ))}

      {/* <Loading {...loadingProps} /> */}
    </Scaffold>
  );
};

export default CartAuction;
