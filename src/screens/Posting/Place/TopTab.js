import React, { useEffect, useState } from 'react';
import {View, Button, FlatList, Image} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Row, useColor, Col, Text, ScreenEmptyData} from '@src/components';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ImagesPath from 'src/components/ImagesPath';
import { Divider } from 'src/styled';
import { ScrollView } from 'react-native-gesture-handler';
import client from 'src/lib/apollo';
import { queryEcommerceProductUlasan } from 'src/lib/query/ecommerce/queryEcommerceProductUlasan';
import moment from 'moment';
import PlaceReview from './PlaceReview';
import PlaceDeskripsi from './PlaceDeskripsi';
import PlaceGalery from './PlaceGalery';
function Description(props) {``
  const {Color} = useColor();

  console.log(props);

  return (
    <ScrollView>
    <View
      style={{
        backgroundColor: Color.theme,
        padding: 16,
        alignItems: 'flex-start',
      }}>
        <Text align='left'>
        kdjfkj
        </Text>
        <Text align='left'>
        kdjfkj
        </Text>

    </View>
    </ScrollView>
  );
}

function Review(props) {
  const {Color} = useColor();

  console.log('props', props);

  const [listReview, setListReview] = useState([]);

  useEffect(() => {
    fetchEcommerceProductUlasan();
  }, []);

  const fetchEcommerceProductUlasan = () => {
    const variables = {
      page: 1,
      itemPerPage: 3,
      productId: props.detail.id
    };

    console.log('variables', variables);

    client.query({
      query: queryEcommerceProductUlasan,
      variables
    })
    .then((res) => {
      console.log('res ecom prd ulasan', res);

      const data = res.data.ecommerceProductUlasan;
      if (Array.isArray(data)) {
        setListReview(data);
      }
    })
    .catch((err) => {
      console.log('err ecom prd ulasan', err);
    });
  }

  const renderItem = ({ item, index }) => (
    <Row key={index} style={{marginBottom: 20}}>
      <Image source={{ uri: item.image }} />
      <Col style={{marginHorizontal:10}}>
        <Text align='left' style={{fontSize: 10, fontWeight: 'bold'}}>{item.firstName} {item.lastName}</Text>
        <Text align='left' style={{fontSize: 8, color: Color.secondary, marginVertical: 3}}>{moment(item.createdAt).fromNow()}</Text>
        <Row style={{marginVertical: 5}}>
          {[1,2,3,4,5].map((e, idx) => {
            const isActive = e <= item.rating;
            return (
              <AntDesign
                key={idx}
                name={'star'}
                size={25}
                color={isActive ? Color.primary : Color.secondary}
                style={{marginHorizontal: 8}}
              />
            )
          })}
        </Row>
        <Text style={{width: '100%', textAlign: 'justify'}}>{item.ulasan}</Text>
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

        <Divider />

        <View
          style={{marginVertical: 5}}
        >
          {listReview.length > 0 ?
            listReview.map((item, index) => renderItem({ item, index }))
          :
            <ScreenEmptyData message='Ulasan belum tersedia' />
          }
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
      initialRouteName="PlaceReview"
      tabBarOptions={{
        indicatorStyle: {backgroundColor: Color.primary, height: '100%'},
        activeTintColor: Color.primary,
        activeBackgroundColor: Color.primary,
        inactiveTintColor: Color.secondary,
        labelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          color: Color.secondary,
        },
        indicatorStyle: {
          backgroundColor: Color.primary,
        
        },
        labelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="PlaceReview"
        component={PlaceReview}
        options={{tabBarLabel: 'Review'}}
      />
      <Tab.Screen
        name="Galery"
        component={PlaceGalery}
        options={{tabBarLabel: 'Galery'}}
      />
        <Tab.Screen
        name="Deskripsi"
        component={PlaceDeskripsi}
        options={{tabBarLabel: 'Deskripsi'}}
      />
    </Tab.Navigator>
  );
}

export default function TopBar(props) {
  return <MyTabs detail={1} />;
}
