import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Dimensions, SafeAreaView, TextInput, Image, Pressable } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import ImagesPath from '../../components/ImagesPath'

const { width } = Dimensions.get('window');

import {
  Text,
  // TouchableOpacity,
  Loading, useLoading,
  HeaderBig,
  Header,
  Scaffold,
  useColor
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const ContentView = Styled(View)`
    width: 100%;
    marginTop: 16px;
    paddingHorizontal: 16px;
`;

const MainMenuView = Styled(View)`
    width: 100%;
    borderRadius: 8px;
    marginTop: 12px;
    padding: 20px 0px;
    flexDirection: row;
    flexWrap: wrap;
`;

const PerUserIcons = Styled(TouchableOpacity)`
    width: 33.33%;
    aspectRatio: 1.3;
    flexDirection: column;
    paddingHorizontal: 8px;
`;

const UserIcon = Styled(View)`
    height: 100%;
    justifyContent: center;
    alignItems: center;
`;

const MerchantSetting = ({ navigation, route }) => {

    const {Color} = useColor()

  return (
    <MainView style={{backgroundColor: '#F4F4F4'}}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <Scaffold
              header={<Header customIcon title="Pengaturan Toko" type="bold" style={{paddingTop: 17, marginBottom: 10}} centerTitle={false} />}
              onPressLeftButton={() => navigation.pop()}
            />

            <View style={{backgroundColor: Color.theme}}>
                <View style={{
                    paddingHorizontal: 16,
                    paddingVertical: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Entypo name={'shop'} size={24} style={{marginRight: 16}} />
                    <Text type='bold' align='left' size={16}>Seputar Toko</Text>
                </View>

                <Pressable style={{
                    paddingHorizontal: 48,
                    paddingVertical: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Text align='left' size={16}>Edit Informasi Toko</Text>
                    <SimpleLineIcons name={'arrow-right'} size={16} />
                </Pressable>

                <Pressable style={{
                    paddingHorizontal: 48,
                    paddingVertical: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Text align='left' size={16}>Edit Catatan Toko</Text>
                    <SimpleLineIcons name={'arrow-right'} size={16} />
                </Pressable>

                <Pressable style={{
                    paddingHorizontal: 48,
                    paddingVertical: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Text align='left' size={16}>Atur Jam Operasional</Text>
                    <SimpleLineIcons name={'arrow-right'} size={16} />
                </Pressable>

                <Pressable style={{
                    paddingHorizontal: 48,
                    paddingVertical: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 28
                }}>
                    <Text align='left' size={16}>Atur Notifikasi Penjual</Text>
                    <SimpleLineIcons name={'arrow-right'} size={16} />
                </Pressable>
            </View>
        </ScrollView>
    </MainView>
  )
}

export default MerchantSetting