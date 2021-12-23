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

const CartScreen = ({ navigation, route }) => {
  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const { Color } = useColor();

  
  useEffect(() => {
  }, []);

  return (
    <Scaffold
          header={<Header customIcon title='Keranjang' type='regular' color={Color.white} backgroundColor='blackContent' centerTitle={false} />}
          color='black'
          onPressLeftButton={() => navigation.pop()}
        >

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View>
                <Row style={{ marginHorizontal: 16, marginTop: 20 }}>
                    <View style={{ justifyContent: 'center' }}>
                        <TouchableOpacity style={{ height: 13, width: 13, marginRight: 16, borderColor: Color.white, borderWidth: 1, borderRadius: 2 }}>
                            
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 56, width: 56, marginRight: 14, backgroundColor: Color.white, borderRadius: 8 }} />
                    <Col>
                        <Row>
                            <Text color={Color.white} textAlign='left'>Pashmina Pink</Text>
                        </Row>
                        <View style={{ justifyContent: 'flex-end', flex: 1 }}>
                            <Row>
                                <View>
                                    <Text size={13} color={Color.white}>Rp. 100.000</Text>
                                </View>
                                <Col>
                                    <Row style={{  justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <TouchableOpacity>
                                            <FontAwesome name='trash-o' size={15} color='#FF7373' />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ marginLeft: 24 }}>
                                            <AntDesign name='minuscircleo' color='#999999' size={15} />
                                        </TouchableOpacity>
                                        <Text color={Color.white} style={{ marginHorizontal: 8 }}>99</Text>
                                        <TouchableOpacity>
                                            <AntDesign name='pluscircleo' color='#FAC255' size={15} />
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
        <Row style={{ backgroundColor: Color.blackContent, padding: 16 }}>
            <Col align='flex-start' justify='center'>
                <Text size={10} color={Color.white}>Total Harga</Text>
                <Text type='bold' color={Color.white} >Rp. 160.000</Text>
            </Col>
            <Col>
                <TouchableOpacity style={{ backgroundColor: Color.primaryYellow, borderRadius: 8, paddingVertical: 10 }}>
                    <Text type='semibold'>Checkout</Text>
                </TouchableOpacity>
            </Col>
        </Row>
      {/* <Loading {...loadingProps} /> */}
    </Scaffold>
  );
}

export default CartScreen;