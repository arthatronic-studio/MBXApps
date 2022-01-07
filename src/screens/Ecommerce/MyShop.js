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
import CardListProduk from 'src/components/Card/CardListProduct';
import TopTabShop from './TopTabShop';

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
  const { Color } = useColor();

  
  useEffect(() => {
  }, []);

  return (
    <Scaffold
          header={<Header customIcon title='Toko Kamu' type='regular' color={Color.white} backgroundColor='primary' centerTitle={false} />}
          onPressLeftButton={() => navigation.pop()}
        >

        <View showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: Color.white }}>
          <View style={{  paddingBottom: 20, flex: 1 }}>
            <View style={{ height: 68, backgroundColor: Color.oldGreen }} />
            <View style={{ height: 72, backgroundColor: '#fff', position: 'absolute', elevation: 1, top: 36, zIndex: 1, left: 16, width: 72, borderRadius: 8 }} />
                <View style={{ paddingTop: 60, backgroundColor: Color.theme, paddingBottom: 32, paddingLeft: 16 }}>
                    <Text align='left' type='bold' size={18}>Toko Sumber Makmur</Text>
                    <Row>
                        <Col>
                            <Text size={10}>Tangerang, Banten</Text>
                        </Col>
                        <Col>
                            <Text size={10}>0813-1234-5678</Text>
                        </Col>
                        <Col>
                            <Text size={10}>@toksuma123</Text>
                        </Col>
                    </Row>
                </View>
                <TopTabShop />
            </View>
        </View>
        
      {/* <Loading {...loadingProps} /> */}
    </Scaffold>
  );
}

export default MyShop;