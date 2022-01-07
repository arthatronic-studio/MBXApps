import * as React from 'react';
import {Text, View, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useColor} from '@src/components';
import CartShop from '@src/screens/Ecommerce/CartShop';
import CartAuction from '@src/screens/Auction/CartAuction';

function Shop() {
  return (
    <View
      style={{
        flex: 1,
      }}>
          <CartShop />
    </View>
  );
}

function Auction() {
  return (
    <View
      style={{
        flex: 1,
      }}>
      <CartAuction />
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Shop"
      tabBarOptions={{
        activeTintColor: '#121212',
        labelStyle: {fontSize: 12, },
        style: {backgroundColor: '#fff'},
      }}>
      <Tab.Screen
        name="Shop"
        component={CartShop}
        options={{tabBarLabel: 'Belanjaan'}}
      />
      <Tab.Screen
        name="Auction"
        component={CartAuction}
        options={{tabBarLabel: 'Barang Lelang'}}
      />
    </Tab.Navigator>
  );
}

export default function TopBar() {
  return <MyTabs />;
}
