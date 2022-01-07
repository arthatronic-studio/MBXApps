import * as React from 'react';
import { View, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Col, Row, TouchableOpacity, useColor, Text} from '@src/components';
import CardListProduk from 'src/components/Card/CardListProduct';

function Description() {
    const { Color } = useColor();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Color.white
      }}>
        <View style={{ paddingTop: 10 }}>
            <CardListProduk />
        </View>
        <Row style={{ backgroundColor: Color.white, padding: 16 }}>
            <Col size={5}>
                <TouchableOpacity onPress={() => navigation.navigate('CheckoutScreen')} style={{ backgroundColor: Color.white, borderWidth: 1, borderColor: Color.blue, borderRadius: 20, paddingVertical: 10 }}>
                    <Text type='semibold' color={Color.blue}>Hapus Produk</Text>
                </TouchableOpacity>
            </Col>
            <Col size={0.5} />
            <Col>
                <TouchableOpacity onPress={() => navigation.navigate('CheckoutScreen')} style={{ backgroundColor: Color.blue, borderRadius: 20, paddingVertical: 10 }}>
                    <Text type='semibold' color={Color.white}>Tambah Produk</Text>
                </TouchableOpacity>
            </Col>
        </Row>
    </View>
  );
}

function Review() {
    const { Color } = useColor();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Color.white
      }}>
        <View style={{ marginTop: 15 }}>
            {['Semua Produk', 'Fashion', 'Gedget', 'Frozen Food'].map((val,id) => (
                <View>
                    <Row style={{ marginHorizontal: 15, paddingVertical: 15, backgroundColor: Color.white, borderBottomWidth: 1, borderBottomColor: '#12121230' }}>
                        <Col>
                            <Text align='left'>{val}</Text>
                        </Col>
                    </Row>
                </View>
            ))}
            <TouchableOpacity style={{ borderColor: Color.blue, borderWidth: 1, marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, alignSelf: 'center' }}>
                <Text color={Color.blue}>Tambah Kategori</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Description"
      tabBarOptions={{
        indicatorStyle: {backgroundColor: '#96C63B', height: '100%'},
        activeTintColor: '#fff',
        labelStyle: {fontSize: 12, fontWeight: 'bold'},
        style: {backgroundColor: '#CCCCCC' , borderRadius: 30, marginVertical: 0, overflow: 'hidden', marginHorizontal: 16},
      }}>
      <Tab.Screen
        name="Description"
        component={Description}
        options={{tabBarLabel: 'Etalase'}}
      />
      <Tab.Screen
        name="Review"
        component={Review}
        options={{tabBarLabel: 'Kategori'}}
      />
    </Tab.Navigator>
  );
}

export default function TopTabShop() {
  return <MyTabs />;
}
