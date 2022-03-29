import React, { useState, useEffect, useRef } from 'react';
import { View,Pressable,FlatList,Image, TextInput} from 'react-native';
import { useSelector } from 'react-redux';
import IonIcons from 'react-native-vector-icons/Ionicons'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MapView, {Marker} from 'react-native-maps'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/core';
import Modal from "react-native-modal";
import Client from '@src/lib/apollo';
import {
  Text,
  // TouchableOpacity,
  useLoading,
  Scaffold,
  Row, Col,
  useColor,
  Header
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import ImagesPath from 'src/components/ImagesPath';
import { Divider } from 'src/styled';
import { ScrollView } from 'react-native-gesture-handler';
import TopTabShop from './TopTabShop';
import {queryListOrder} from 'src/lib/query/ecommerce';
import CardOrder from './CardOrder';


function BelumDibayar({data}) {
    const { Color } = useColor();
    const navigation = useNavigation();

  return (
      <View>
          <View style={{flexDirection: 'row', marginVertical: 15, marginHorizontal: 5,}}>
            <TouchableOpacity style={{marginHorizontal: 5,backgroundColor: Color.theme,justifyContent: 'center', alignItems: 'center',flexDirection: 'row', borderWidth: 2, borderColor: Color.border, height: 34, width: '28%', borderRadius: 20}}>
                <Text style={{fontSize: 12, paddingHorizontal: 5}}>Terbaru</Text>
                <MaterialIcons style={{paddingVertical: 5}} name={'keyboard-arrow-down'} size={20}/>
            </TouchableOpacity>
            <Pressable style={{marginHorizontal: 5,backgroundColor: Color.theme,justifyContent: 'center', alignItems: 'center',flexDirection: 'row', borderWidth: 2, borderColor: Color.border, height: 34, width: '32%', borderRadius: 20}}>
                <Text style={{fontSize: 12,}}>Perlu Diproses</Text>
            </Pressable>
            <Pressable style={{marginHorizontal: 5,backgroundColor: Color.theme,justifyContent: 'center', alignItems: 'center',flexDirection: 'row', borderWidth: 2, borderColor: Color.border, height: 34, width: '32%', borderRadius: 20}}>
                <Text style={{fontSize: 12,}}>Telah Diproses</Text>
            </Pressable>
            </View>

            <FlatList
            data={data}
            keyExtractor={(item, index) => item.toString() + index}
            renderItem={({item}) => {
            return <CardOrder data={item} />;
            }}
        />
        </View>
    


    
  );
}

function Dikemas() {
    const { Color } = useColor();
    const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Color.semiwhite,
      }}>
        <View style={{flexDirection: 'row', marginVertical: 15, marginHorizontal: 5,}}>
            <TouchableOpacity style={{marginHorizontal: 5,backgroundColor: Color.theme,justifyContent: 'center', alignItems: 'center',flexDirection: 'row', borderWidth: 2, borderColor: Color.border, height: 34, width: '28%', borderRadius: 20}}>
                <Text style={{fontSize: 12, paddingHorizontal: 5}}>Terbaru</Text>
                <MaterialIcons style={{paddingVertical: 5}} name={'keyboard-arrow-down'} size={20}/>
            </TouchableOpacity>
            <Pressable style={{marginHorizontal: 5,backgroundColor: Color.theme,justifyContent: 'center', alignItems: 'center',flexDirection: 'row', borderWidth: 2, borderColor: Color.border, height: 34, width: '32%', borderRadius: 20}}>
                <Text style={{fontSize: 12,}}>Perlu Diproses</Text>
            </Pressable>
            <Pressable style={{marginHorizontal: 5,backgroundColor: Color.theme,justifyContent: 'center', alignItems: 'center',flexDirection: 'row', borderWidth: 2, borderColor: Color.border, height: 34, width: '32%', borderRadius: 20}}>
                <Text style={{fontSize: 12,}}>Telah Diproses</Text>
            </Pressable>
        </View>
        <Pressable onPress={() => navigation.navigate('TransactionDetailSucces')} style={{paddingHorizontal: 10,paddingVertical: 15,backgroundColor: Color.theme, width: '95%', height: '43%', alignSelf: 'center', borderRadius: 5}}>
            <View style={{flexDirection: 'row'}}>
                    <Image source={ImagesPath.avatar4}/>
                <View style={{width: '70%', paddingHorizontal: 10, paddingVertical: 2}}>
                    <Text style={{fontSize: 11, textAlign: 'left', fontWeight: 'bold'}}>Hendra Helinsky</Text>
                    <Text style={{fontSize: 8,textAlign: 'left', color: Color.secondary}}>No. Pesanan : 100000012345678</Text>
                </View>
                <Text style={{fontSize: 10, marginVertical: 8, color: Color.primary}}>Perlu Dikirim</Text>
            </View>
            <Divider/>
        <View style={{width: '99%', height: 1, backgroundColor: Color.border}}/>
        <Divider/>
        <View style={{flexDirection: 'row'}}>
            <Image source={ImagesPath.produklelang} style={{width: 50, height: 50, borderRadius: 5}}/>
            <View style={{marginHorizontal: 10}}>
                <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'left',}}>Pashmina Pink Nissa Sabyan</Text>
                <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left'}}>Stok Barang : 150 pcs</Text>
                <Divider/>
                <View>
                    <View style={{flexDirection: 'row', marginVertical: 2}}>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left', width: '89%'}}>Jumlah pembelian</Text>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'right'}}> x1</Text>
                    </View>
                    <View style={{flexDirection: 'row',marginVertical: 2}}>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left',width: '77%'}}>Harga Barang</Text>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'right'}}> 150.000 Poin</Text>
                    </View>
                    <View style={{flexDirection: 'row',marginVertical: 2}}>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left',width: '77%'}}>Total pembelian</Text>
                        <Text style={{fontWeight: 'bold',fontSize: 8, color: Color.text, textAlign: 'right'}}> 150.000 Poin</Text>
                    </View>
                </View>
            </View>
        </View>
        <Divider height={10}/>
        <View style={{paddingHorizontal: 10,justifyContent: 'center',borderRadius: 3,backgroundColor: Color.border, width: '99%', height: 46}}>
            <Text style={{fontSize: 8, textAlign: 'left', paddingVertical: 2}}>Catatan Pembeli</Text>
            <Text style={{fontSize: 10, fontWeight: 'bold', textAlign: 'left',paddingVertical: 2}}>Tolong anternya pake buroq ya biar cepet hehehe</Text>
        </View>
        <Divider/>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{textAlign: 'left', width: '50%', marginHorizontal: 2}}>
                <Text style={{fontSize: 8, color: Color.secondary,lineHeight: 12, textAlign:'left'}}>Mohon melakukan pengiriman/pengaturan pengiriman sebelum tanggal 28 Januari 2022</Text>
            </Text>
            <TouchableOpacity style={{marginHorizontal: 15,backgroundColor: Color.primary, fontSize: 12, width: '43%', height: 33, borderRadius: 20, justifyContent: 'center'}}>
                <Text style={{fontSize: 12, fontWeight: 'bold', color: Color.textInput}}>Atur Pengiriman</Text>
            </TouchableOpacity>
        </View>
        </Pressable>
    </View>
  );
}

function Dikirim() {
    const { Color } = useColor();
    const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Color.semiwhite,
      }}>
        <View style={{flexDirection: 'row', marginVertical: 15, marginHorizontal: 5,}}>
            <TouchableOpacity style={{marginHorizontal: 5,backgroundColor: Color.theme,justifyContent: 'center', alignItems: 'center',flexDirection: 'row', borderWidth: 2, borderColor: Color.border, height: 34, width: '28%', borderRadius: 20}}>
                <Text style={{fontSize: 12, paddingHorizontal: 5}}>Terbaru</Text>
                <MaterialIcons style={{paddingVertical: 5}} name={'keyboard-arrow-down'} size={20}/>
            </TouchableOpacity>
        </View>
        <Pressable onPress={() => navigation.navigate('TransactionDetailSucces')} style={{paddingHorizontal: 10,paddingVertical: 15,backgroundColor: Color.theme, width: '95%', height: '43%', alignSelf: 'center', borderRadius: 5}}>
            <View style={{flexDirection: 'row'}}>
                    <Image source={ImagesPath.avatar4}/>
                <View style={{width: '70%', paddingHorizontal: 10, paddingVertical: 2}}>
                    <Text style={{fontSize: 11, textAlign: 'left', fontWeight: 'bold'}}>Hendra Helinsky</Text>
                    <Text style={{fontSize: 8,textAlign: 'left', color: Color.secondary}}>No. Pesanan : 100000012345678</Text>
                </View>
                <Text style={{fontSize: 10, marginVertical: 8, color: Color.primary}}>Sedang Dikirim</Text>
            </View>
            <Divider/>
        <View style={{width: '99%', height: 1, backgroundColor: Color.border}}/>
        <Divider/>
        <View style={{flexDirection: 'row'}}>
            <Image source={ImagesPath.produklelang} style={{width: 50, height: 50, borderRadius: 5}}/>
            <View style={{marginHorizontal: 10}}>
                <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'left',}}>Pashmina Pink Nissa Sabyan</Text>
                <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left'}}>Stok Barang : 150 pcs</Text>
                <Divider/>
                <View>
                    <View style={{flexDirection: 'row', marginVertical: 2}}>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left', width: '89%'}}>Jumlah pembelian</Text>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'right'}}> x1</Text>
                    </View>
                    <View style={{flexDirection: 'row',marginVertical: 2}}>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left',width: '77%'}}>Harga Barang</Text>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'right'}}> 150.000 Poin</Text>
                    </View>
                    <View style={{flexDirection: 'row',marginVertical: 2}}>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left',width: '77%'}}>Total pembelian</Text>
                        <Text style={{fontWeight: 'bold',fontSize: 8, color: Color.text, textAlign: 'right'}}> 150.000 Poin</Text>
                    </View>
                </View>
            </View>
        </View>
        <Divider height={10}/>
        <View style={{paddingHorizontal: 10,justifyContent: 'center',borderRadius: 3,backgroundColor: Color.border, width: '99%', height: 46}}>
            <Text style={{fontSize: 8, textAlign: 'left', paddingVertical: 2}}>Catatan Pembeli</Text>
            <Text style={{fontSize: 10, fontWeight: 'bold', textAlign: 'left',paddingVertical: 2}}>Tolong anternya pake buroq ya biar cepet hehehe</Text>
        </View>
        <Divider/>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: '50%'}}></View>
            <TouchableOpacity style={{marginHorizontal: 15,backgroundColor: Color.primary, fontSize: 12, width: '43%', height: 33, borderRadius: 20, justifyContent: 'center'}}>
                <Text style={{fontSize: 12, fontWeight: 'bold', color: Color.textInput}}>Lacak Pengiriman</Text>
            </TouchableOpacity>
        </View>
        </Pressable>
    </View>
  );
}


function Selesai() {
    const { Color } = useColor();
    const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Color.semiwhite,
      }}>
        <View style={{flexDirection: 'row', marginVertical: 15, marginHorizontal: 5,}}>
            <TouchableOpacity style={{marginHorizontal: 5,backgroundColor: Color.theme,justifyContent: 'center', alignItems: 'center',flexDirection: 'row', borderWidth: 2, borderColor: Color.border, height: 34, width: '28%', borderRadius: 20}}>
                <Text style={{fontSize: 12, paddingHorizontal: 5}}>Terbaru</Text>
                <MaterialIcons style={{paddingVertical: 5}} name={'keyboard-arrow-down'} size={20}/>
            </TouchableOpacity>
        </View>
        <Pressable onPress={() => navigation.navigate('TransactionDetailSucces')}  style={{paddingHorizontal: 10,paddingVertical: 15,backgroundColor: Color.theme, width: '95%', height: '43%', alignSelf: 'center', borderRadius: 5}}>
            <View style={{flexDirection: 'row'}}>
                    <Image source={ImagesPath.avatar4}/>
                <View style={{width: '78%', paddingHorizontal: 10, paddingVertical: 2}}>
                    <Text style={{fontSize: 11, textAlign: 'left', fontWeight: 'bold'}}>Hendra Helinsky</Text>
                    <Text style={{fontSize: 8,textAlign: 'left', color: Color.secondary}}>No. Pesanan : 100000012345678</Text>
                </View>
                <Text style={{fontSize: 10, marginVertical: 8, color: Color.primary}}>Selesai</Text>
            </View>
            <Divider/>
        <View style={{width: '99%', height: 1, backgroundColor: Color.border}}/>
        <Divider/>
        <View style={{flexDirection: 'row'}}>
            <Image source={ImagesPath.produklelang} style={{width: 50, height: 50, borderRadius: 5}}/>
            <View style={{marginHorizontal: 10}}>
                <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'left',}}>Pashmina Pink Nissa Sabyan</Text>
                <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left'}}>Stok Barang : 150 pcs</Text>
                <Divider/>
                <View>
                    <View style={{flexDirection: 'row', marginVertical: 2}}>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left', width: '89%'}}>Jumlah pembelian</Text>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'right'}}> x1</Text>
                    </View>
                    <View style={{flexDirection: 'row',marginVertical: 2}}>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left',width: '77%'}}>Harga Barang</Text>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'right'}}> 150.000 Poin</Text>
                    </View>
                    <View style={{flexDirection: 'row',marginVertical: 2}}>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left',width: '77%'}}>Total pembelian</Text>
                        <Text style={{fontWeight: 'bold',fontSize: 8, color: Color.text, textAlign: 'right'}}> 150.000 Poin</Text>
                    </View>
                </View>
            </View>
        </View>
        <Divider height={10}/>
        <View style={{paddingHorizontal: 10,justifyContent: 'center',borderRadius: 3,backgroundColor: Color.border, width: '99%', height: 46}}>
            <Text style={{fontSize: 8, textAlign: 'left', paddingVertical: 2}}>Catatan Pembeli</Text>
            <Text style={{fontSize: 10, fontWeight: 'bold', textAlign: 'left',paddingVertical: 2}}>Tolong anternya pake buroq ya biar cepet hehehe</Text>
        </View>
        <Divider/>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: '60%'}}></View>
            <TouchableOpacity style={{marginHorizontal: 15,backgroundColor: Color.primary, fontSize: 12, width: '35%', height: 33, borderRadius: 20, justifyContent: 'center'}}>
                <Text style={{fontSize: 12, fontWeight: 'bold', color: Color.textInput}}>Lihat Detail</Text>
            </TouchableOpacity>
        </View>
        </Pressable>
    </View>
  );
}

function Komplainan() {
  const { Color } = useColor();
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Color.semiwhite,
      }}>
        <View style={{flexDirection: 'row', marginVertical: 15, marginHorizontal: 5,}}>
            <TouchableOpacity style={{marginHorizontal: 5,backgroundColor: Color.theme,justifyContent: 'center', alignItems: 'center',flexDirection: 'row', borderWidth: 2, borderColor: Color.border, height: 34, width: '28%', borderRadius: 20}}>
                <Text style={{fontSize: 12, paddingHorizontal: 5}}>Terbaru</Text>
                <MaterialIcons style={{paddingVertical: 5}} name={'keyboard-arrow-down'} size={20}/>
            </TouchableOpacity>
        </View>
        <Pressable onPress={() => navigation.navigate('TransactionDetailSucces')}  style={{paddingHorizontal: 10,paddingVertical: 15,backgroundColor: Color.theme, width: '95%', height: '59%', alignSelf: 'center', borderRadius: 5}}>
            <View style={{flexDirection: 'row'}}>
                    <Image source={ImagesPath.avatar4}/>
                <View style={{width: '70%', paddingHorizontal: 10, paddingVertical: 2}}>
                    <Text style={{fontSize: 11, textAlign: 'left', fontWeight: 'bold'}}>Hendra Helinsky</Text>
                    <Text style={{fontSize: 8,textAlign: 'left', color: Color.secondary}}>No. Pesanan : 100000012345678</Text>
                </View>
                <Text style={{fontSize: 10, marginVertical: 8, color: Color.primary}}>Perlu Dikirim</Text>
            </View>
            <Divider/>
        <View style={{width: '99%', height: 1, backgroundColor: Color.border}}/>
        <Divider/>
        <View style={{flexDirection: 'row'}}>
            <Image source={ImagesPath.produklelang} style={{width: 50, height: 50, borderRadius: 5}}/>
            <View style={{marginHorizontal: 10}}>
                <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'left',}}>Pashmina Pink Nissa Sabyan</Text>
                <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left'}}>Stok Barang : 150 pcs</Text>
                <Divider/>
                <View>
                    <View style={{flexDirection: 'row', marginVertical: 2}}>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left', width: '89%'}}>Jumlah pembelian</Text>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'right'}}> x1</Text>
                    </View>
                    <View style={{flexDirection: 'row',marginVertical: 2}}>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left',width: '77%'}}>Harga Barang</Text>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'right'}}> 150.000 Poin</Text>
                    </View>
                    <View style={{flexDirection: 'row',marginVertical: 2}}>
                        <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left',width: '77%'}}>Total pembelian</Text>
                        <Text style={{fontWeight: 'bold',fontSize: 8, color: Color.text, textAlign: 'right'}}> 150.000 Poin</Text>
                    </View>
                </View>
            </View>
        </View>
        <Divider height={10}/>
        <View style={{paddingHorizontal: 10,justifyContent: 'center',borderRadius: 3,backgroundColor: Color.border, width: '99%', height: 46}}>
            <Text style={{fontSize: 8, textAlign: 'left', paddingVertical: 2}}>Catatan Pembeli</Text>
            <Text style={{fontSize: 10, fontWeight: 'bold', textAlign: 'left',paddingVertical: 2}}>Tolong anternya pake buroq ya biar cepet hehehe</Text>
        </View>
        <Divider height={10}/>
        <View style={{alignItems: 'center'}}>
            <View style={{width: '98%', marginHorizontal: 2}}>
                <Text style={{textAlign: 'left',fontSize: 8, color: Color.secondary, paddingVertical: 5}}>Deskripsi Komplainan</Text>
                <Text style={{textAlign: 'justify',fontSize: 12, color: Color.secondary,lineHeight: 20, textAlign:'left'}}>Soufflé soufflé lemon drops jelly-o bonbon sweet roll cake cookie. Marshmallow jujubes dessert dragée lollipop cake danish wafer sweet. Icing carrot cake bear claw bonbon ice cream muffin croissant lollipop.</Text>
            </View>
        </View>
        <TouchableOpacity style={{alignSelf: 'flex-end',marginHorizontal: 15,marginVertical: 15,backgroundColor: Color.primary, fontSize: 12, width: '36%', height: 33, borderRadius: 20, justifyContent: 'center'}}>
                <Text style={{fontSize: 12, fontWeight: 'bold', color: Color.textInput}}>Chat Pembeli</Text>
        </TouchableOpacity>
        </Pressable>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

const IncomingOrder = () => {

    const { Color } = useColor();
    const user = useSelector(state => state['user.auth'].login.user);
    const [data,setData]=useState()
    
    const getOrder =()=>{
        console.log(user)
        let variables = {
          page: 1,
          itemPerPage: 10,
          status: 'BOOKING',
          userId: 287 
        //   dummy userId (temporary)
        }
        
        console.log(variables)
        Client.query({query: queryListOrder, variables})
          .then(res => {
            console.log("haiiiii",res.data.ecommerceOrderList)
            if(res.data.ecommerceOrderList){
                setData(res.data.ecommerceOrderList);
            
            }
          })
          .catch(reject => {
            console.log(reject);
          });
          console.log("aku data",data)
          
    }
  
  useEffect(() => {
      getOrder()
  }, []);


  return (
    <Scaffold
        style={{backgroundColor: Color.theme}}
          header={
            <Header 
              customIcon
              title="Pesanan Masuk"
              type='regular'
              centerTitle={false}
            />
          }
          onPressLeftButton={() => navigation.pop()}
    >
        <Tab.Navigator
      initialRouteName="Description"
      tabBarOptions={{
        scrollEnabled:true,
        indicatorStyle: {backgroundColor: Color.theme, height: '100%'},
        activeTintColor: Color.primary,
        activeBackgroundColor: Color.primary,
        inactiveTintColor: Color.secondary,
        labelStyle: {fontSize: 12, fontWeight: 'bold', color: Color.secondary},
        indicatorStyle:{
            borderBottomColor: Color.primary,
            borderBottomWidth: 2
        },
        labelStyle:{
            fontSize: 12
        }
      }}
      >
      <Tab.Screen
        name="BelumDibayar"
        children={()=><BelumDibayar data={data}/>}
        options={{tabBarLabel: 'Belum Dibayar'}}
      />
      <Tab.Screen
        name="Dikemas"
        component={Dikemas}
        options={{tabBarLabel: 'Dikemas'}}
      />
      <Tab.Screen
        name="Dikirim"
        component={Dikirim}
        options={{tabBarLabel: 'Dikirim'}}
      />
      <Tab.Screen
        name="Selesai"
        component={Selesai}
        options={{tabBarLabel: 'Selesai'}}
      />
      <Tab.Screen
        name="Komplainan"
        component={Komplainan}
        options={{tabBarLabel: 'Komplainan'}}
      />
    </Tab.Navigator>
    </Scaffold>
  )
}

export default IncomingOrder