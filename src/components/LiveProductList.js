import * as React from 'react';
import {View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {useColor} from '@src/components';
import CardListLelang from './Card/CardListLelang';

function Semua() {
  const {Color} = useColor();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Color.semiwhite,
      }}>
      <View style={{marginVertical: 10}}>
        <CardListLelang />
      </View>
    </View>
  );
}

function Seharihari() {
  const {Color} = useColor();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Color.semiwhite,
      }}>
      <View style={{marginVertical: 10}}>
        <CardListLelang />
      </View>
    </View>
  );
}
function BendaKoleksi() {
  const {Color} = useColor();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Color.semiwhite,
      }}>
      <View style={{marginVertical: 10}}>
        <CardListLelang />
      </View>
    </View>
  );
}

function Perhiasan() {
  const {Color} = useColor();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Color.semiwhite,
      }}>
      <View style={{marginVertical: 10}}>
        <CardListLelang />
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
        scrollEnabled: true,
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
          borderBottomColor: Color.theme,
          borderBottomWidth: 2,
        },
        labelStyle: {
          fontSize: 12,
        },
      }}>
      <Tab.Screen
        name="Semua"
        component={Semua}
        options={{tabBarLabel: 'Semua'}}
      />
      <Tab.Screen
        name="BendaKoleksi"
        component={BendaKoleksi}
        options={{tabBarLabel: 'Benda Koleksi'}}
      />
      <Tab.Screen
        name="Sehari-hari"
        component={Seharihari}
        options={{tabBarLabel: 'Sehari-hari'}}
      />
      <Tab.Screen
        name="Perhiasan"
        component={Perhiasan}
        options={{tabBarLabel: 'Perhiasan'}}
      />
    </Tab.Navigator>
  );
}

export default function LiveProductList() {
  return <MyTabs />;
}
