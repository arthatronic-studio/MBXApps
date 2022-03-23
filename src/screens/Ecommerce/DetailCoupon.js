import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Platform,
  SafeAreaView,
  TextInput as TextInputs,
  Image,
  FlatList,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import Styled from 'styled-components';
import {useSelector} from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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
  TouchableOpacity,
} from '@src/components';

import Filter from 'src/components/Filter';

import ImagesPath from 'src/components/ImagesPath';
import Category from 'src/components/Category';
import CardReview from './CardReview';
import {Container} from 'src/styled';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;

const DATA = [
  {
    id: 1,
    no: 1,
    text: ' Gummies toffee croissant marzipan candy bear claw cupcake.Pie sesame snaps wafer topping cake pastry marzipan',
  },
  {
    id: 2,
    no: 2,
    text: ' Gummies toffee croissant marzipan candy bear claw cupcake.Pie sesame snaps wafer topping cake pastry marzipan',
  },
  {
    id: 3,
    no: 3,
    text: ' Gummies toffee croissant marzipan candy bear claw cupcake.Pie sesame snaps wafer topping cake pastry marzipan',
  },
  {
    id: 4,
    no: 4,
    text: ' Gummies toffee croissant marzipan candy bear claw cupcake.Pie sesame snaps wafer topping cake pastry marzipan',
  },
  {
    id: 5,
    no: 5,
    text: ' Gummies toffee croissant marzipan candy bear claw cupcake.Pie sesame snaps wafer topping cake pastry marzipan',
  },
];
const DetailCoupon = ({navigation, route}) => {
  const {Color} = useColor();

  const [selectedItem, setSelectedItem] = useState(null);
  useEffect(() => {}, []);

  const styles = StyleSheet.create({
    coupon: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    buttonCode: {
      paddingVertical: 8,
      paddingHorizontal: 24,
      borderRadius: 120,
      backgroundColor: Color.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <Scaffold
      header={<Header customIcon type="regular" centerTitle={false} />}
      onPressLeftButton={() => navigation.pop()}>
      <ScrollView>
   
          <View
            style={{
              marginHorizontal: 16,
              alignSelf: 'flex-start',
              backgroundColor: Color.lightInfo,
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderRadius: 4,
              marginBottom: 16,
            }}>
            <Text size="8" style={{color: Color.textInput}}>
              Promo Pengguna Baru
            </Text>
          </View>
          <View
            style={{
              marginHorizontal: 16,
              alignItems: 'flex-start',
            }}>
            <Text type="semibold" size="18" style={{marginBottom: 4}}>
              Cashback 10% Untuk Pengguna Baru
            </Text>
            <Text type="medium">Berlaku sebelum : 28 Februari 2022</Text>
          </View>
          <View
            style={{
              marginVertical: 24,
              height: 132,
              backgroundColor: Color.primarySoft,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 24,
            }}>
            <ImageBackground source={ImagesPath.coupon} style={styles.coupon}>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 26,
                  marginVertical: 24,
                  justifyContent: 'space-between',
                }}>
                <View style={{alignItems: 'flex-start'}}>
                  <Text size="8" type="medium" style={{color: Color.secondary}}>
                    Kode Kupon
                  </Text>
                  <Text size="18" type="semibold">
                    HELLOWRLD22
                  </Text>
                </View>
                <TouchableOpacity style={styles.buttonCode}>
                  <Text
                    type="semibold"
                    size="12"
                    style={{color: Color.textInput}}>
                    Salin Kode
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>

          <View style={{marginHorizontal: 16, alignItems: 'flex-start'}}>
            <Text type="bold" size="11" style={{marginBottom: 4}}>
              Deskripsi
            </Text>
            <Text
              lineHeight="25"
              align="left"
              size="14"
              style={{color: Color.secondary}}>
              Chocolate cake croissant gingerbread oat cake gingerbread jelly-o
              candy canes gingerbread. Jelly croissant fruitcake jelly beans
              jujubes. Soufflé shortbread lollipop donut marzipan gingerbread
              jelly beans dessert cheesecake. Cheesecake powder tart toffee
              cookie pastry cake. Liquorice pudding brownie jelly-o chocolate
              lollipop liquorice wafer caramels.
            </Text>
          </View>

          <View
            style={{
              width: '90%',
              marginLeft: 16,
              marginRight: 16,
              alignItems: 'flex-start',
              marginVertical: 16,
            }}>
            <Text type="bold" size="11" style={{marginBottom: 4}}>
              Syarat & Ketentuan
            </Text>

            <View>
            <FlatList
              data={DATA}
              keyExtractor={(item, index) => item.toString() + index}
              renderItem={({item}) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <View style={{marginHorizontal: 6}}>
                      <Text style={{color: Color.secondary}}>{item.no}.</Text>
                    </View>
                    <View style={{width: '95%'}}>
                      <Text
                        style={{color: Color.secondary}}
                        lineHeight="25"
                        align="left">
                        {item.text}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
            </View>
            
          </View>
  
      </ScrollView>
    </Scaffold>
  );
};

export default DetailCoupon;
