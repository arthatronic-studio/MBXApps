import * as React from 'react';
import { View, Button} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Col, Row, TouchableOpacity, useColor, Text} from '@src/components';
import CardListProduk from 'src/components/Card/CardListProduct';

function Description() {
    const { Color } = useColor();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Color.theme
      }}>
        <View style={{ paddingTop: 10 }}>
            <CardListProduk />
        </View>
        <Row style={{ backgroundColor: Color.theme, padding: 16 }}>
            <Col size={5}>
                <TouchableOpacity onPress={() => navigation.navigate('CheckoutScreen')} style={{ backgroundColor: Color.theme, borderWidth: 1, borderColor: Color.info, borderRadius: 20, paddingVertical: 10 }}>
                    <Text type='semibold' color={Color.info}>Hapus Produk</Text>
                </TouchableOpacity>
            </Col>
            <Col size={0.5} />
            <Col>
                <TouchableOpacity onPress={() => navigation.navigate('CheckoutScreen')} style={{ backgroundColor: Color.info, borderRadius: 20, paddingVertical: 10 }}>
                    <Text type='semibold' color={Color.textInput}>Tambah Produk</Text>
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
        backgroundColor: Color.theme
      }}>
        <View style={{ marginTop: 15 }}>
            {['Semua Produk', 'Fashion', 'Gedget', 'Frozen Food'].map((val,id) => (
                <View>
                    <Row style={{ marginHorizontal: 15, paddingVertical: 15, backgroundColor: Color.theme, borderBottomWidth: 1, borderBottomColor: Color.secondary }}>
                        <Col>
                            <Text align='left'>{val}</Text>
                        </Col>
                    </Row>
                </View>
            ))}
            <TouchableOpacity style={{ borderColor: Color.info, borderWidth: 1, marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, alignSelf: 'center' }}>
                <Text color={Color.info}>Tambah Kategori</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  const { Color } = useColor();

  return (
    <Tab.Navigator
      initialRouteName="Description"
      tabBarOptions={{
        indicatorStyle: {backgroundColor: Color.primary, height: '100%'},
        activeTintColor: Color.textInput,
        labelStyle: {fontSize: 12, fontWeight: 'bold'},
        style: {borderRadius: 30, marginVertical: 0, overflow: 'hidden', marginHorizontal: 16},
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
