import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Pressable,
  FlatList,
  Image,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useIsFocused, useRoute} from '@react-navigation/native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MapView, {Marker} from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/core';
import Modal from 'react-native-modal';
import Client from '@src/lib/apollo';
import {
  Text,
  // TouchableOpacity,
  useLoading,
  Scaffold,
  Row,
  Col,
  useColor,
  Header,
  ScreenIndicator,
} from '@src/components';
import {TouchableOpacity} from '@src/components/Button';
import ImagesPath from 'src/components/ImagesPath';
import {Container, Divider} from 'src/styled';
import {ScrollView} from 'react-native-gesture-handler';
import TopTabShop from './TopTabShop';
import {queryListOrder, queryNewListOrder} from 'src/lib/query/ecommerce';
import CardOrder from './CardOrder';

function BelumDibayar({data, getData}) {
  const {Color} = useColor();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log("ISfoc open",isFocused)
    {isFocused ? getData('OPEN') : null}
    
  }, [isFocused]);
  return (
    <View style={{backgroundColor: Color.semiwhite}}>
      {data.loadingIncoming ? (
        <Container style={{height: '100%', marginTop: -10}}>
          <ScreenIndicator transparent />
        </Container>
      ) : (
        <View>
          {/* <View
            style={{
              flexDirection: 'row',
              marginVertical: 15,
              marginHorizontal: 5,
            }}>
            <TouchableOpacity
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '28%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12, paddingHorizontal: 5}}>Terbaru</Text>
              <MaterialIcons
                style={{paddingVertical: 5}}
                name={'keyboard-arrow-down'}
                size={20}
              />
            </TouchableOpacity>
            <Pressable
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '32%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12}}>Perlu Diproses</Text>
            </Pressable>
            <Pressable
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '32%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12}}>Telah Diproses</Text>
            </Pressable>
          </View> */}
          <FlatList
            data={data.data}
            keyExtractor={(item, index) => item.toString() + index}
            renderItem={({item}) => {
              return <CardOrder data={item} loading={data.loadingIncoming} />;
            }}
          />
        </View>
      )}
    </View>
  );
}

function SudahDibayar({data, getData}) {
  const {Color} = useColor();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log("ISfoc open",isFocused)
    {isFocused ? getData('CHECKOUT') : null}
    
  }, [isFocused]);
  return (
    <View style={{backgroundColor: Color.semiwhite}}>
      {data.loadingIncoming ? (
        <Container style={{height: '100%', marginTop: -10}}>
          <ScreenIndicator transparent />
        </Container>
      ) : (
        <View>
          {/* <View
            style={{
              flexDirection: 'row',
              marginVertical: 15,
              marginHorizontal: 5,
            }}>
            <TouchableOpacity
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '28%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12, paddingHorizontal: 5}}>Terbaru</Text>
              <MaterialIcons
                style={{paddingVertical: 5}}
                name={'keyboard-arrow-down'}
                size={20}
              />
            </TouchableOpacity>
            <Pressable
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '32%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12}}>Perlu Diproses</Text>
            </Pressable>
            <Pressable
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '32%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12}}>Telah Diproses</Text>
            </Pressable>
          </View> */}
          <FlatList
            data={data.data}
            keyExtractor={(item, index) => item.toString() + index}
            renderItem={({item}) => {
              return <CardOrder data={item} loading={data.loadingIncoming} />;
            }}
          />
        </View>
      )}
    </View>
  );
}

function Dikemas({data, getData}) {
  const {Color} = useColor();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
 

  useEffect(() => {
    console.log("dikemas dong")
    {isFocused ? getData('PACKED') : null}
  }, [isFocused]);

  return (
    <View style={{backgroundColor: Color.semiwhite}}>
      {data.loadingIncoming ? (
        <Container style={{height: '100%', marginTop: -10}}>
          <ScreenIndicator transparent />
        </Container>
      ) : (
        <View>
          {/* <View
            style={{
              flexDirection: 'row',
              marginVertical: 15,
              marginHorizontal: 5,
            }}>
            <TouchableOpacity
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '28%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12, paddingHorizontal: 5}}>Terbaru</Text>
              <MaterialIcons
                style={{paddingVertical: 5}}
                name={'keyboard-arrow-down'}
                size={20}
              />
            </TouchableOpacity>
            <Pressable
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '32%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12}}>Perlu Diproses</Text>
            </Pressable>
            <Pressable
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '32%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12}}>Telah Diproses</Text>
            </Pressable>
          </View> */}
          <FlatList
            data={data.data}
            keyExtractor={(item, index) => item.toString() + index}
            renderItem={({item}) => {
              return <CardOrder data={item} loading={data.loadingIncoming} />;
            }}
          />
        </View>
      )}
    </View>
  );
}

function Dikirim({data, getData}) {
  const {Color} = useColor();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
 

  useEffect(() => {
    
    console.log('Dikirim dong')

    {isFocused ? getData('SENT') : null}
  }, [isFocused]);

  return (
    <View style={{backgroundColor: Color.semiwhite}}>
      {data.loadingIncoming ? (
        <Container style={{height: '100%', marginTop: -10}}>
          <ScreenIndicator transparent />
        </Container>
      ) : (
        <View>
          {/* <View
            style={{
              flexDirection: 'row',
              marginVertical: 15,
              marginHorizontal: 5,
            }}>
            <TouchableOpacity
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '28%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12, paddingHorizontal: 5}}>Terbaru</Text>
              <MaterialIcons
                style={{paddingVertical: 5}}
                name={'keyboard-arrow-down'}
                size={20}
              />
            </TouchableOpacity>
            <Pressable
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '32%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12}}>Perlu Diproses</Text>
            </Pressable>
            <Pressable
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '32%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12}}>Telah Diproses</Text>
            </Pressable>
          </View> */}
          <FlatList
            data={data.data}
            keyExtractor={(item, index) => item.toString() + index}
            renderItem={({item}) => {
              return <CardOrder data={item} loading={data.loadingIncoming} />;
            }}
          />
        </View>
      )}
    </View>
  );
}

function Selesai({data, getData}) {
  const {Color} = useColor();
  const navigation = useNavigation();

  const isFocused = useIsFocused();
 

  useEffect(() => {
    console.log("ISfoc selesai",isFocused)
    console.log('Selesai dong')
    {isFocused ? getData('FINISHED') : null}
  }, [isFocused]);

  return (
    <View style={{backgroundColor: Color.semiwhite}}>
      {data.loadingIncoming ? (
        <Container style={{height: '100%', marginTop: -10}}>
          <ScreenIndicator transparent />
        </Container>
      ) : (
        <View>
          {/* <View
            style={{
              flexDirection: 'row',
              marginVertical: 15,
              marginHorizontal: 5,
            }}>
            <TouchableOpacity
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '28%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12, paddingHorizontal: 5}}>Terbaru</Text>
              <MaterialIcons
                style={{paddingVertical: 5}}
                name={'keyboard-arrow-down'}
                size={20}
              />
            </TouchableOpacity>
            <Pressable
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '32%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12}}>Perlu Diproses</Text>
            </Pressable>
            <Pressable
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '32%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12}}>Telah Diproses</Text>
            </Pressable>
          </View> */}
          <FlatList
            data={data.data}
            keyExtractor={(item, index) => item.toString() + index}
            renderItem={({item}) => {
              return <CardOrder data={item} loading={data.loadingIncoming} />;
            }}
          />
        </View>
      )}
    </View>
  );
}

function Komplainan({data, getData}) {
  const {Color} = useColor();
  const navigation = useNavigation();

  const isFocused = useIsFocused();
 

  useEffect(() => {
    console.log('Complaint dong')
    {isFocused ? getData('COMPLAINED') : null}
  }, [isFocused]);

  return (
    <View style={{backgroundColor: Color.semiwhite}}>
      {data.loadingIncoming ? (
        <Container style={{height: '100%', marginTop: -10}}>
          <ScreenIndicator transparent />
        </Container>
      ) : (
        <View>
          {/* <View
            style={{
              flexDirection: 'row',
              marginVertical: 15,
              marginHorizontal: 5,
            }}>
            <TouchableOpacity
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '28%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12, paddingHorizontal: 5}}>Terbaru</Text>
              <MaterialIcons
                style={{paddingVertical: 5}}
                name={'keyboard-arrow-down'}
                size={20}
              />
            </TouchableOpacity>
            <Pressable
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '32%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12}}>Perlu Diproses</Text>
            </Pressable>
            <Pressable
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '32%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12}}>Telah Diproses</Text>
            </Pressable>
          </View> */}
          <FlatList
            data={data.data}
            keyExtractor={(item, index) => item.toString() + index}
            renderItem={({item}) => {
              return <CardOrder data={item} loading={data.loadingIncoming} />;
            }}
          />
        </View>
      )}
    </View>
  );
}

function Dibatalkan({data, getData}) {
  const {Color} = useColor();
  const navigation = useNavigation();

  const isFocused = useIsFocused();
 

  useEffect(() => {
    console.log('BATALKAN DONG')
    {isFocused ? getData('CANCELED') : null}
  }, [isFocused]);

  return (
    <View style={{backgroundColor: Color.semiwhite}}>
      {data.loadingIncoming ? (
        <Container style={{height: '100%', marginTop: -10}}>
          <ScreenIndicator transparent />
        </Container>
      ) : (
        <View>
          {/* <View
            style={{
              flexDirection: 'row',
              marginVertical: 15,
              marginHorizontal: 5,
            }}>
            <TouchableOpacity
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '28%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12, paddingHorizontal: 5}}>Terbaru</Text>
              <MaterialIcons
                style={{paddingVertical: 5}}
                name={'keyboard-arrow-down'}
                size={20}
              />
            </TouchableOpacity>
            <Pressable
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '32%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12}}>Perlu Diproses</Text>
            </Pressable>
            <Pressable
              style={{
                marginHorizontal: 5,
                backgroundColor: Color.theme,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: Color.border,
                height: 34,
                width: '32%',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 12}}>Telah Diproses</Text>
            </Pressable>
          </View> */}
          <FlatList
            data={data.data}
            keyExtractor={(item, index) => item.toString() + index}
            renderItem={({item}) => {
              return <CardOrder data={item} loading={data.loadingIncoming} />;
            }}
          />
        </View>
      )}
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

const IncomingOrder = ({route, navigation}) => {
  const {Color} = useColor();
  const user = useSelector(state => state['user.auth'].login.user);
  const [data, setData] = useState();
  const [screenShow, setScreen] = useState(1);
  const [loadingIncoming, setLoadingIncoming] = useState(true);
  const {height} = useWindowDimensions();

  const getOrder = async type => {
    let variables = {
      status: type,
      userId: undefined,
      merchantId: route.params.item.id,
    };

    await Client.query({query: queryNewListOrder, variables})
      .then(res => {
        console.log(res, 'incoming order')
        if (res.data.allOrderList) {
          setData(res.data.allOrderList);
          setLoadingIncoming(false);
        }
      })
      .catch(reject => {
        console.log(reject);
      });
  };

  // useEffect(() => {
  //   getOrder();
  // }, []);
  const {routeName} = route.params

  return (
    <Scaffold
      style={{backgroundColor: Color.theme}}
      header={
        <Header
          customIcon
          title="Pesanan Masuk"
          type="regular"
          centerTitle={false}
        />
      }
      onPressLeftButton={() => navigation.pop()}>
      <Tab.Navigator
        initialRouteName={routeName}
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
            borderBottomColor: Color.primary,
            borderBottomWidth: 2,
          },
          labelStyle: {
            fontSize: 12,
          },
        }}>
        <Tab.Screen
          name="BelumDibayar"
          children={() => (
            <BelumDibayar data={{data, loadingIncoming, height}} getData={getOrder} />
          )}
          options={{tabBarLabel: 'Belum Dibayar'}}
        />
        <Tab.Screen
          name="SudahDibayar"
          children={() => (
            <SudahDibayar data={{data, loadingIncoming, height}} getData={getOrder} />
          )}
          options={{tabBarLabel: 'Sudah Dibayar'}}
        />
        <Tab.Screen
          name="Dikemas"
          children={() => (
            <Dikemas data={{data, loadingIncoming, height}} show={screenShow} getData={getOrder} />
          )}
          options={{tabBarLabel: 'Dikemas'}}
        />
        <Tab.Screen
          name="Dikirim"
          children={() => (
            <Dikirim data={{data, loadingIncoming, height}} show={screenShow} getData={getOrder} />
          )}
          options={{tabBarLabel: 'Dikirim'}}
        />
        <Tab.Screen
          name="Selesai"
          children={() => (
            <Selesai data={{data, loadingIncoming, height}} show={screenShow} getData={getOrder} />
          )}
          options={{tabBarLabel: 'Selesai'}}
        />
        <Tab.Screen
          name="Komplainan"
          children={() => (
            <Komplainan data={{data, loadingIncoming, height}} show={screenShow} getData={getOrder} />
          )}
          options={{tabBarLabel: 'Komplainan'}}
        />
        <Tab.Screen
          name="Dibatalkan"
          children={() => (
            <Dibatalkan data={{data, loadingIncoming, height}} show={screenShow} getData={getOrder} />
          )}
          options={{tabBarLabel: 'Dibatalkan'}}
        />
      </Tab.Navigator>
    </Scaffold>
  );
};

export default IncomingOrder;
