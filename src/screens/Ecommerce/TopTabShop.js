import * as React from 'react';
import { View, FlatList, Button} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Col, Row, TouchableOpacity, useColor, Text} from '@src/components';
import ImagesPath from 'src/components/ImagesPath';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import IonIcons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import { ScrollView } from 'react-native-gesture-handler';
import ListMyProduct from 'src/screens/Ecommerce/ListMyProduct';

function EcomerceBeranda() {
    const { Color } = useColor();
    
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Color.semiwhite,
        }}>
          <View style={{ paddingTop: 10 }}>
            <ListMyProduct />
          </View>
      </View>
  );
}

function EcomerceEtalase() {
  const { Color } = useColor();

  return (
    <ScrollView>
      <View
      style={{
        flex: 1,
        backgroundColor: Color.semiwhite,
        alignItems: 'center'
      }}>
        <View style={{marginTop: 15, backgroundColor: Color.theme, width: '95%', borderRadius: 5}}>
            {/* {['Semua Produk', 'Fashion', 'Gedget', 'Frozen Food', 'Asbak Unik'].map((val,id) => (
                <View>
                    <Row style={{ marginHorizontal: 10, paddingVertical: 15, backgroundColor: Color.theme, borderBottomWidth: 1, borderBottomColor: Color.secondary }}>
                        <Col style={{flexDirection: 'row'}}>
                            <Text>Hello</Text>
                            <Text align='left' style={{fontSize: 10}}>{val}</Text>
                        </Col>
                    </Row>
                </View>
            ))} */}
            <FlatList
        data={[
          {etalase: 'Semua Produk', icon: <AntDesign size={18} name={'appstore1'} style={{color: Color.info}}/>},
          {etalase: 'Produk Diskon' , icon: <MaterialCommunityIcons size={18} name={'sack-percent'} style={{color: Color.primary}}/>},
          {etalase: 'Fashion', icon: <IonIcons name={'shirt'} size={18} style={{color: Color.error}}/>},
          {etalase: 'Gadget', icon: <MaterialIcons name={'smartphone'} size={18} style={{color: Color.success}}/>},
          {etalase: 'Frozen Food', icon: <IonIcons name={'fast-food'} size={18} style={{color: Color.warning}}/>},
          {etalase: 'Aksesoris', icon: <MaterialCommunityIcons name={'ring'} size={18} style={{color: Color.icon}}/>},
          {etalase: 'Asbak Unik', icon: <Entypo name={'flickr'} size={16} style={{color: Color.success}}/>},
        ]}
        renderItem={({item}) => 
        <View style={{flexDirection: 'row',paddingVertical: 20,borderBottomWidth: 1, borderBottomColor: Color.border, width: '95%', height: 55,alignSelf: 'center'}}>
          <Text style={{height: 20, marginHorizontal: 3}}>{item.icon}</Text>
          <Text style={{fontSize: 12, textAlign: 'left', marginHorizontal: 10}}>{item.etalase}</Text>
        </View>
      }
      />
            <TouchableOpacity style={{marginVertical: 15,marginHorizontal: 30,borderWidth: 1, borderColor: Color.error, borderStyle: 'dashed',justifyContent: 'center',flexDirection: 'row',backgroundColor: Color.theme, borderRadius: 20, paddingVertical: 10, width: '83%'}}>
                    <AntDesign name={'pluscircleo'} size={16} style={{color: Color.error, marginHorizontal: 10}}/>
                    <Text type='semibold' color={Color.error} size={12}>Tambah Kategori</Text>
            </TouchableOpacity>
        </View>
    </View>
    </ScrollView>
  );
}

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  const { Color } = useColor();

  return (
    <Tab.Navigator
      initialRouteName="EcomerceBeranda"
      tabBarOptions={{
        indicatorStyle: {backgroundColor: Color.primary, height: '100%'},
        activeTintColor: Color.textInput,
        labelStyle: {fontSize: 12, fontWeight: 'bold', color: Color.textInput},
        style: {backgroundColor: Color.secondary,borderRadius: 30, marginVertical: 0, overflow: 'hidden', marginHorizontal: 16},
      }}>
      <Tab.Screen
        name="EcomerceBeranda"
        component={EcomerceBeranda}
        options={{ tabBarLabel: 'Beranda' }}
      />
      <Tab.Screen
        name="EcomerceEtalase"
        component={EcomerceEtalase}
        options={{ tabBarLabel: 'Etalase' }}
      />
    </Tab.Navigator>
  );
}

export default function TopTabShop() {
  return <MyTabs />;
}
