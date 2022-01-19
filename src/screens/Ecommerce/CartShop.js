import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, SafeAreaView } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
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

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const CartShop = ({ navigation, route }) => {
  // selector

  const { Color } = useColor();

  
  useEffect(() => {
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Color.theme }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View>
                <Row style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
                    <View style={{ justifyContent: 'center' }}>
                        <TouchableOpacity style={{ height: 13, width: 13, marginRight: 16, borderColor: Color.text, borderWidth: 1, borderRadius: 2 }}>
                            
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 56, width: 56, marginRight: 14, backgroundColor: Color.text, borderRadius: 8 }} />
                    <Col>
                        <View style={{ alignItems: 'flex-start' }}>
                            <Text color={Color.text} style={{ textAlign: 'left', marginBottom: 10 }} type='bold'>PlayStation 4 Pro 500 Million - Warraty Sony 1 Year</Text>
                        </View>
                        <View style={{ justifyContent: 'flex-end', flex: 1 }}>
                            <Row>
                                <View>
                                    <Text size={10} color={Color.text} align='left'>Total Harga</Text>
                                    <Text size={13} color={Color.text} type='bold'>Rp. 100.000</Text>
                                </View>
                                <Col style={{ flex: 1,  }}>
                                    <Text size={10} color={Color.text} align='left' />
                                    <Row style={{  justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <TouchableOpacity>
                                            <FontAwesome name='trash-o' size={15} color={Color.error} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ marginLeft: 24 }}>
                                            <AntDesign name='minuscircleo' color={Color.disabled} size={15} />
                                        </TouchableOpacity>
                                        <View>
                                            <Text color={Color.text} style={{ marginHorizontal: 8 }}>99</Text>
                                        </View>
                                        <TouchableOpacity>
                                            <AntDesign name='pluscircleo' color={Color.secondary} size={15} />
                                        </TouchableOpacity>

                                    </Row>
                                </Col>
                            </Row>
                        </View>
                    </Col>
                </Row>
                <View style={{ backgroundColor: '#rgba(255, 255, 254, 0.2)', height: 2, marginTop: 24 }} />
            </View>
            
        </ScrollView>
        <Row style={{padding: 16 }}>
            <Col align='flex-start' justify='center'>
                <Text size={10} color={Color.text}>Total Harga</Text>
                <Text type='bold' color={Color.text} >Rp. 160.000</Text>
            </Col>
            <Col>
                <TouchableOpacity onPress={() => navigation.navigate('CheckoutScreen')} style={{ backgroundColor: Color.info, borderRadius: 20, paddingVertical: 10 }}>
                    <Text type='semibold' color={Color.textInput}>Checkout</Text>
                </TouchableOpacity>
            </Col>
        </Row>
      {/* <Loading {...loadingProps} /> */}
    </View>
  );
}

export default CartShop;