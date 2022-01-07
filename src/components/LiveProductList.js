import * as React from 'react';
import {Text, View, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useColor} from '@src/components';
import CardListLelang from './Card/CardListLelang';

function Semua() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#E5E5E5',
      }}>
      <View style={{marginVertical: 10}}>
        <CardListLelang />
      </View>
    </View>
  );
}

function Seharihari() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#E5E5E5',
        paddingVertical: 14,
        paddingHorizontal: 20,
      }}>
      <View style={{marginVertical: 10}}>
        <CardListLelang />
      </View>
    </View>
  );
}
function BendaKoleksi() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#E5E5E5',
        paddingVertical: 14,
        paddingHorizontal: 20,
      }}>
      <View style={{marginVertical: 10}}>
        <CardListLelang />
      </View>
    </View>
  );
}

function Perhiasan() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#E5E5E5',
        paddingVertical: 14,
        paddingHorizontal: 20,
      }}>
      <View style={{marginVertical: 10}}>
        <CardListLelang />
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
        activeTintColor: 'black',
        labelStyle: {fontSize: 11, fontWeight: 'bold'},
        style: {backgroundColor: 'white'},
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
