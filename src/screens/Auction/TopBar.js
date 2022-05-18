import * as React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {useColor} from '@src/components';
import CartShop from '@src/screens/Ecommerce/CartShop';
import CartAuction from '@src/screens/Auction/CartAuction';
import { useNavigation, useRoute } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  const {Color} = useColor();
  const navigation = useNavigation();
  const route = useRoute();

  // return <CartShop navigation={navigation} route={route} />

  // hide tab
  // const {routeName} = route.params
  return (
    <Tab.Navigator
      initialRouteName={routeName}
      tabBarOptions={{
        indicatorStyle: {backgroundColor: Color.theme, height: '100%'},
        activeTintColor: Color.primary,
        activeBackgroundColor: Color.primary,
        inactiveTintColor: Color.secondary,
        labelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          color: Color.secondary,
        },
        indicatorStyle: {
          borderBottomColor: Color.primary,
          borderBottomWidth: 2,
        },
        labelStyle: {
          fontSize: 12,
        },
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
