import * as React from 'react';
import {Text, View, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useColor} from '@src/components';

function Description() {
  const {Color} = useColor();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Color.white,
      }}>
      <Text
        style={{
          fontSize: 14,
          color: Color.black,
          fontWeight: '400',
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}>
        Cupcake ipsum dolor sit amet jelly cookie. Chocolate cake gingerbread
        gummi bears chocolate cake muffin toffee pastry. Sweet brownie bonbon
        lollipop pie biscuit candy canes cake. Carrot cake sesame snaps
        liquorice croissant fruitcake lollipop. Danish dessert gummi bears
        dragée jelly-o. Halvah gummi bears powder wafer jelly beans tootsie roll
        dessert. Toffee sweet roll donut tiramisu macaroon cake. Lemon drops
        jelly cheesecake tiramisu icing ice cream chocolate marzipan.
        Gingerbread marshmallow tiramisu macaroon jelly brownie caramels
        liquorice halvah.{'\n'}
        {'\n'}
        Pudding sweet roll dessert jujubes halvah caramels. Jelly-o chocolate
        bar chocolate bar cake tart jelly tiramisu cake shortbread. Pastry sweet
        topping cheesecake chupa chups chocolate bar. Toffee muffin bonbon
        pudding dragée. Croissant pie lollipop bonbon jelly tootsie roll jelly-o
        croissant. Topping pudding dessert tootsie roll halvah gummi bears
        sesame snaps. Cake jelly-o lemon drops fruitcake jujubes candy jelly.
        Chocolate cake sesame snaps shortbread shortbread sesame snaps. {'\n'}
        {'\n'}
        Bear claw bear claw pastry lollipop gummi bears toffee gummi bears gummi
        bears. Gummi bears croissant macaroon icing toffee. Tart cookie pudding
        marzipan ice cream cheesecake jelly beans toffee. Jelly beans sweet
        fruitcake sugar plum marzipan. Muffin candy wafer danish jelly-o powder
        chocolate. Jelly-o wafer wafer croissant chocolate bar jelly beans
        macaroon. Powder icing gummi bears danish bonbon. Sugar plum jelly icing
        candy canes marzipan chupa chups pie fruitcake.
      </Text>
    </View>
  );
}

function Review() {
  const {Color} = useColor();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Color.white,
        paddingVertical: 14,
        paddingHorizontal: 20,
      }}>
      <Text style={{fontSize: 14, color: Color.black, fontWeight: '400'}}>
        Cupcake ipsum dolor sit amet jelly cookie. Chocolate cake gingerbread
        gummi bears chocolate cake muffin toffee pastry. Sweet brownie bonbon
        lollipop pie biscuit candy canes cake. Carrot cake sesame snaps
        liquorice croissant fruitcake lollipop. Danish dessert gummi bears
        dragée jelly-o. Halvah gummi bears powder wafer jelly beans tootsie roll
        dessert. Toffee sweet roll donut tiramisu macaroon cake. Lemon drops
        jelly cheesecake tiramisu icing ice cream chocolate marzipan.
        Gingerbread marshmallow tiramisu macaroon jelly brownie caramels
        liquorice halvah.{'\n'}
        {'\n'}
        Pudding sweet roll dessert jujubes halvah caramels. Jelly-o chocolate
        bar chocolate bar cake tart jelly tiramisu cake shortbread. Pastry sweet
        topping cheesecake chupa chups chocolate bar. Toffee muffin bonbon
        pudding dragée. Croissant pie lollipop bonbon jelly tootsie roll jelly-o
        croissant. Topping pudding dessert tootsie roll halvah gummi bears
        sesame snaps. Cake jelly-o lemon drops fruitcake jujubes candy jelly.
        Chocolate cake sesame snaps shortbread shortbread sesame snaps. {'\n'}
        {'\n'}
        Bear claw bear claw pastry lollipop gummi bears toffee gummi bears gummi
        bears. Gummi bears croissant macaroon icing toffee. Tart cookie pudding
        marzipan ice cream cheesecake jelly beans toffee. Jelly beans sweet
        fruitcake sugar plum marzipan. Muffin candy wafer danish jelly-o powder
        chocolate. Jelly-o wafer wafer croissant chocolate bar jelly beans
        macaroon. Powder icing gummi bears danish bonbon. Sugar plum jelly icing
        candy canes marzipan chupa chups pie fruitcake.
      </Text>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  const {Color} = useColor();
  return (
    <Tab.Navigator
      initialRouteName="Description"
      tabBarOptions={{
        activeTintColor: Color.blue,
        labelStyle: {fontSize: 12, fontWeight: 'bold'},
        style: {backgroundColor: Color.white},
      }}>
      <Tab.Screen
        name="Description"
        component={Description}
        options={{tabBarLabel: 'Description'}}
      />
      <Tab.Screen
        name="Review"
        component={Review}
        options={{tabBarLabel: 'Review'}}
      />
    </Tab.Navigator>
  );
}

export default function TopBar() {
  return <MyTabs />;
}
