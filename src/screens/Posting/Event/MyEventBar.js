import * as React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {useColor} from '@src/components';
import EventHistory from './EventHistory';
import OwnEvent from './OwnEvent';
import { useNavigation, useRoute } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

function MyEventBar() {
  const {Color} = useColor();
  const navigation = useNavigation();
  const route = useRoute();

  // return <CartShop navigation={navigation} route={route} />

  // hide tab
  return (
    <Tab.Navigator
      initialRouteName="Shop"
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
        name="EventHistory"
        component={EventHistory}
        options={{tabBarLabel: 'Riwayat Event'}}
      />
      <Tab.Screen
        name="OwnEvent"
        component={OwnEvent}
        options={{tabBarLabel: 'Buatanku'}}
      />
    </Tab.Navigator>
  );
}

export default function TopBar() {
  return <MyEventBar />;
}
