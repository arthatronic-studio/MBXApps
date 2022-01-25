import * as React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {useColor} from '@src/components';
import CartShop from '@src/screens/Ecommerce/CartShop';
import CartAuction from '@src/screens/Auction/CartAuction';

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  const { Color } = useColor();
  
  return (
    <Tab.Navigator
      initialRouteName="Shop"
      tabBarOptions={{
        activeTintColor: Color.primary,
        labelStyle: {fontSize: 12, },
        style: {backgroundColor: Color.theme},
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
