import * as React from 'react';
import {View, Button, FlatList, Image} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Row, useColor, Col, Text} from '@src/components';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ImagesPath from 'src/components/ImagesPath';
import { Divider } from 'src/styled';
import { ScrollView } from 'react-native-gesture-handler';

function Description({props}) {
  const {Color} = useColor();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Color.theme,
        padding: 16,
        alignItems: 'flex-start',
      }}>
        <Text>
          {props.detail.description}
        </Text>
    </View>
  );
}

function Review(props) {
  const {Color} = useColor();

  const renderItem = ({ item, index }) => (
    <Row style={{marginBottom: 20}}>
        <Image source={ImagesPath.avatar1}/>
        <Col style={{marginHorizontal:10}}>
          <Text style={{fontSize: 10, fontWeight: 'bold'}}>{item.personName}</Text>
          <Text style={{fontSize: 8, color: Color.secondary, marginVertical: 3}}>{item.time}</Text>
          <Row style={{marginVertical: 5}}>
            <AntDesign name={'star'} style={{color: Color.warning, marginRight: 3}}/>
            <AntDesign name={'star'} style={{color: Color.warning, marginRight: 3}}/>
            <AntDesign name={'star'} style={{color: Color.warning, marginRight: 3}}/>
            <AntDesign name={'star'} style={{color: Color.warning, marginRight: 3}}/>
            <AntDesign name={'star'} style={{color: Color.warning, marginRight: 3}}/>
          </Row>
          <Text style={{width: '100%', textAlign: 'justify'}}>{item.comment}</Text>
        </Col>
      </Row>
  )

  return (
    <ScrollView>
      <View
        style={{
          backgroundColor: Color.theme,
          paddingVertical: 14,
          paddingHorizontal: 20,
        }}>
        <View style={{paddingVertical: 15,width: '100%', backgroundColor: Color.border, height: 90, borderRadius: 8}}>
          <Text style={{fontSize: 12, color: Color.secondary, alignSelf: 'center'}}>Beri Nilai Produk</Text>
          <Row style={{justifyContent: 'center', marginVertical: 15}}>
            <AntDesign name={'star'} size={25} style={{marginHorizontal: 12,color: Color.secondary,}}/>
            <AntDesign name={'star'} size={25} style={{marginHorizontal: 12,color: Color.secondary}}/>
            <AntDesign name={'star'} size={25} style={{marginHorizontal: 12,color: Color.secondary}}/>
            <AntDesign name={'star'} size={25} style={{marginHorizontal: 12,color: Color.secondary}}/>
            <AntDesign name={'star'} size={25} style={{marginHorizontal: 12,color: Color.secondary}}/>
          </Row>
        </View>
        {/* <Text style={{fontWeight: 'bold', marginVertical: 15, fontSize: 12}}>Komentar orang lain</Text> */}
        {/* hide filter */}
        {/* <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center', justifyContent: 'center',borderRadius: 20,borderWidth: 1, borderColor: Color.text, width: 67, height: 23}}>
            <Text style={{fontSize: 10}}>Semua</Text>
            <MaterialIcons name={'keyboard-arrow-down'} style={{marginVertical: 5, marginLeft: 4}}/>
          </TouchableOpacity>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={[
              {star: 5},{star: 4},{star: 3},{star: 2},{star: 1},
            ]}
            renderItem={({item}) => 
            <View>
              <TouchableOpacity style={{alignItems: 'center',justifyContent: 'center',borderWidth: 1, borderColor: Color.border, width: 40, height: 23,borderRadius: 20,flexDirection: 'row', marginHorizontal: 9}}>
                <Text style={{fontSize: 10}}>{item.star}</Text>
                <AntDesign name={'star'} size={8} style={{marginVertical: 3, marginLeft: 3,color: Color.warning}}/>
              </TouchableOpacity>
            </View>
          }
          />
        </View> */}
        <Divider/>
        <View
          style={{marginVertical: 5}}
        >
          {[
            {personName: 'Adang Susanyo',
            time: '3 hari yang lalu',
            comment: 'Muffin pastry candy canes sesame snaps lemon drops muffin cheesecake cupcake. Sesame snaps candy halvah tootsie roll dessert carrot cake chupa chups dragée. Cookie marshmallow candy canes chocolate cake brownie jelly beans tiramisu cake.Marshmallow gummi bears pie cake halvah candy canes powder tart. Sweet roll croissant jelly beans croissant croissant chocolate cake bonbon.'
            },
            {personName: 'Adang Susanyo',
            time: '3 hari yang lalu',
            comment: 'Muffin pastry candy canes sesame snaps lemon drops muffin cheesecake cupcake. Sesame snaps candy halvah tootsie roll dessert carrot cake chupa chups dragée. Cookie marshmallow candy canes chocolate cake brownie jelly beans tiramisu cake.Marshmallow gummi bears pie cake halvah candy canes powder tart. Sweet roll croissant jelly beans croissant croissant chocolate cake bonbon.'
            },
            {personName: 'Adang Susanyo',
            time: '3 hari yang lalu',
            comment: 'Muffin pastry candy canes sesame snaps lemon drops muffin cheesecake cupcake. Sesame snaps candy halvah tootsie roll dessert carrot cake chupa chups dragée. Cookie marshmallow candy canes chocolate cake brownie jelly beans tiramisu cake.Marshmallow gummi bears pie cake halvah candy canes powder tart. Sweet roll croissant jelly beans croissant croissant chocolate cake bonbon.'
            },
          ].map((item, index) => renderItem({ item, index }))}
        </View>
      </View>
    </ScrollView>
  );
}

const Tab = createMaterialTopTabNavigator();

function MyTabs(props) {
  const {Color} = useColor();
  return (
    <Tab.Navigator
      initialRouteName="Description"
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
      }}
    >
      <Tab.Screen
        name="Description"
        component={() => <Description props={props} />}
        options={{tabBarLabel: 'Deskripsi'}}
      />
      <Tab.Screen
        name="Review"
        component={() => <Review props={props} />}
        options={{tabBarLabel: 'Review'}}
      />
    </Tab.Navigator>
  );
}

export default function TopBar(props) {
  return <MyTabs detail={props.detail} />;
}
