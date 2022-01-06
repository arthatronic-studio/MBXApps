import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, SafeAreaView } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const CartAuction = ({ navigation, route }) => {
  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const { Color } = useColor();

  
  useEffect(() => {
  }, []);

  return (
    <View style={{ flex: 1 }}>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {[1,2,3,4].map((val, id) => (
            <View style={{ backgroundColor: Color.white, marginHorizontal: 15, marginTop: 10, padding: 15, borderRadius: 10 }}>
                <Row style={{ }}>
                    <View style={{ height: 74, width: 74, marginRight: 14, backgroundColor: '#bcbcbc', borderRadius: 8 }} />
                    <Col>
                        <Row>
                            <Col size={8} alignItems='flex-start'>
                                <Text color={Color.text} textAlign='left' type='bold'>ZIPPO Pemantik Armor 5 Sisi . . .</Text>
                            </Col>
                            <Col>
                                <View style={{ height: 28, width: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E3F7BC', borderColor: '#76AE0B', borderWidth: 1 }}>
                                    <Text size={10} color='#76AE0B'>Menang</Text>
                                </View>
                            </Col>
                        </Row>
                        <View style={{ justifyContent: 'flex-end', flex: 1 }}>
                            <Row>
                                <View style={{ alignItems: 'flex-start', marginTop: 4, justifyContent: 'flex-end' }}>
                                    <Text size={10} color={'#999999'}>Harga</Text>
                                    <Text size={14} color={Color.text} type='bold'>Rp. 100.000</Text>

                                </View>
                                <Col>
                                    <TouchableOpacity onPress={() => navigation.navigate('CheckoutScreen')} style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                        <Text size={10} color={'#027BC9'}>Checkout</Text>
                                    </TouchableOpacity>
                                </Col>
                            </Row>
                        </View>
                    </Col>
                </Row>
            </View>
          ))}
            
        </ScrollView>
      {/* <Loading {...loadingProps} /> */}
    </View>
  );
}

export default CartAuction;