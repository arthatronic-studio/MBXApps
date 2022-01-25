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

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;

const FormPayment = ({ navigation, route }) => {
  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const { Color } = useColor();

  
  useEffect(() => {
  }, []);

  return (
    <Scaffold
          header={
            <Header 
              customIcon 
              title='Ubah Alamat' 
              type='regular' 
              centerTitle={false}
            />
          }
        >
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, }}>
          <View style={{ marginBottom: 40 }}>
            <Text align='left' style={{ paddingLeft: 16, marginTop: 15 }} type='bold'>Detail Alamat</Text>
            <TextInput
              placeholder='Adang Susanyo'
              title='Nama Penerima'
              color={Color.text}
              placeholderTextColor={Color.gray}
              textInputStyle={{ borderWidth: 2, borderColor: Color.border, borderRadius: 5, paddingLeft: 10 }}
              style={{height: 50, color: Color.gray, fontSize: 14, borderWidth: 1, fontFamily: 'Inter-Regular', marginLeft: 8}}
            />
            <TextInput
              placeholder='813-1234-5678'
              title='No Telpon'
              keyboardType='numeric'
              color={Color.text}
              placeholderTextColor={Color.gray}
              textInputStyle={{ borderWidth: 2, borderColor: Color.border, borderRadius: 5, paddingLeft: 10 }}
              style={{height: 50, color: Color.gray, fontSize: 14, borderWidth: 1, fontFamily: 'Inter-Regular', marginLeft: 8}}
            />
            <Text align='left' style={{ marginTop: 15,  marginLeft: 16, color: Color.gray }} size={13}>Alamat Lengkap</Text>
            <TextInputs
              placeholder='Tuliskan Alamat . . . '
              numberOfLines={3}
              title='Alamat Lengkap'
              color={Color.text}
              multiline
              placeholderTextColor={Color.gray}
              style={{ borderWidth: 2, borderColor: Color.border, marginHorizontal: 16, borderRadius: 5, paddingLeft: 10 }}
            />
            <View>
              <Text align='left' style={{ marginTop: 15, marginLeft: 16, color: Color.gray }} size={13}>Provinsi</Text>
              <TouchableOpacity style={{ borderWidth: 2, borderColor: Color.border, marginHorizontal: 16, paddingVertical: 15, borderRadius: 5, paddingHorizontal: 10 }}>
                <Row>
                  <Col size={8}>
                    <Text align='left'>- PILIH PROVINSI -</Text>
                  </Col>
                  <Col alignItems='flex-end' justifyContent='center'>
                    <AntDesign name='down' color={Color.text} size={15} />
                  </Col>
                </Row>
              </TouchableOpacity>
            </View>
            <View>
              <Text align='left' style={{ marginTop: 15, marginLeft: 16, color: Color.gray }} size={13}>Kota / Kabupaten</Text>
              <TouchableOpacity style={{ borderWidth: 2, borderColor: Color.border, marginHorizontal: 16, paddingVertical: 15, borderRadius: 5, paddingHorizontal: 10 }}>
                <Row>
                  <Col size={8}>
                    <Text align='left'>- PILIH KOTA/KABUPATEN -</Text>
                  </Col>
                  <Col alignItems='flex-end' justifyContent='center'>
                    <AntDesign name='down' color={Color.text} size={15} />
                  </Col>
                </Row>
              </TouchableOpacity>
            </View>
            <View>
              <Text align='left' style={{ marginTop: 15, marginLeft: 16, color: Color.gray }} size={13}>Kecamatan</Text>
              <TouchableOpacity style={{ borderWidth: 2, borderColor: Color.border, marginHorizontal: 16, paddingVertical: 15, borderRadius: 5, paddingHorizontal: 10 }}>
                <Row>
                  <Col size={8}>
                    <Text align='left'>- PILIH KECAMATAN -</Text>
                  </Col>
                  <Col alignItems='flex-end' justifyContent='center'>
                    <AntDesign name='down' color={Color.text} size={15} />
                  </Col>
                </Row>
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder='12345'
              title='Kode Pos'
              keyboardType='numeric'
              color={Color.text}
              placeholderTextColor={Color.gray}
              textInputStyle={{ borderWidth: 2, borderColor: Color.border, borderRadius: 5, paddingLeft: 10 }}
              style={{height: 50, color: Color.gray, fontSize: 14, borderWidth: 1, fontFamily: 'Inter-Regular', marginLeft: 8}}
            />
          </View>
        </ScrollView>
        <View style={{ backgroundColor: Color.theme }}>
          <TouchableOpacity onPress={() => navigation.pop()} style={{ backgroundColor: Color.info, borderRadius: 30, margin: 15, paddingVertical: 10 }}>
              <Text type='semibold' color={Color.textInput}>Lanjutkan</Text>
          </TouchableOpacity>
        </View>
      {/* <Loading {...loadingProps} /> */}
    </Scaffold>
  );
}

export default FormPayment;