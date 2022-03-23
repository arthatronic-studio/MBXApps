import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList,Image, TextInput} from 'react-native';
import { useSelector } from 'react-redux';
import IonIcons from 'react-native-vector-icons/Ionicons'
import MapView, {Marker} from 'react-native-maps'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

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

const CreateShop = () => {
    const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const { Color } = useColor();
  
  useEffect(() => {
  }, []);

  return (
    <Scaffold
        style={{backgroundColor: Color.theme}}
          header={
            <Header 
              customIcon
              title="Buat Toko"
              type='regular'
              centerTitle={false}
            />
          }
          onPressLeftButton={() => navigation.pop()}
    >
        <View style={{flexDirection: 'row', marginHorizontal: 10}}>
            <View style={{justifyContent: 'center', alignItems: 'center',backgroundColor: Color.border, width: 40, height: 40, borderRadius: 50}}>
                <IonIcons name={"camera-outline"} size={17}/>
            </View>
            <View style={{marginHorizontal: 10}}>
                <Text style={{fontSize: 11, color: Color.text, fontWeight: 'bold', textAlign: 'left'}}>Unggah Foto Profile Toko</Text>
                <Text style={{fontSize: 8, color: Color.secondary}}>Ukuran foto maks. 1MB dengan format JPEG, PNG, atau JPG</Text>
                <Text style={{fontSize: 8, color: Color.primary, textAlign: 'left'}}>Unggah Foto</Text>
            </View>
        </View>
        <Divider/>
            <Text style={{fontSize: 10, fontWeight: 'bold',marginHorizontal: 10, textAlign: 'left'}}>Informasi Toko</Text>
            <View>
                <TextInput placeholder='Toko Sumber Daya Abadi . . .' style={{marginTop: 8,width: '95%', borderWidth: 1, borderColor: Color.border, height: 45, borderRadius: 5, alignSelf: 'center', fontSize: 12, paddingHorizontal: 10, paddingTop: 22}}/>
                <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left', position: 'absolute', marginVertical: 13, marginHorizontal: 20}}>Nama Toko</Text>
                <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'right', marginHorizontal: 15, marginVertical: 2}}>0/200</Text>
            </View>
            <View>
                <TextInput placeholder='813-1234-5678' style={{marginVertical: 8,width: '95%', borderWidth: 1, borderColor: Color.border, height: 45, borderRadius: 5, alignSelf: 'center', fontSize: 12, paddingHorizontal: 32, paddingTop: 22}}/>
                <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left', position: 'absolute', marginVertical: 13, marginHorizontal: 20}}>No. Telpon Toko</Text>
                <Text style={{fontSize: 12, position: 'absolute', marginVertical: 25.8, marginHorizontal: 15}}>+62</Text>
            </View>
            <View>
                <TextInput placeholder='Masukkan Alamat Toko' style={{marginVertical: 8,width: '95%', borderWidth: 1, borderColor: Color.border, height: 85, borderRadius: 5, alignSelf: 'center', fontSize: 12, paddingHorizontal: 10, paddingTop: 22}}/>
                <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left', position: 'absolute', marginVertical: 13, marginHorizontal: 20}}>Alamat Toko</Text>
            </View>
            <View>
                <TextInput placeholder='tokojayaabadi' style={{marginVertical: 8,width: '95%', borderWidth: 1, borderColor: Color.border, height: 45, borderRadius: 5, alignSelf: 'center', fontSize: 12, paddingHorizontal: 25, paddingTop: 22}}/>
                <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left', position: 'absolute', marginVertical: 13, marginHorizontal: 20}}>No. Telpon Toko</Text>
                <Text style={{fontSize: 12, position: 'absolute', marginVertical: 25, marginHorizontal: 20}}>@</Text>
            </View>
            <Divider/>
            <Text style={{fontSize: 10, fontWeight: 'bold', textAlign: 'left', marginHorizontal: 10}}>Titik Lokasi</Text>
            <View style={{width: '100%', height: 200, marginVertical: 10, alignItems: 'center'}}>
              <MapView style={{width: '95%', height: 200}} initialRegion={{
                latitude: -6.173696,
                longitude: 106.824707,
                latitudeDelta: 0.004,
                longitudeDelta: 0.004
              }}>
                <Marker coordinate={{latitude: -6.175200397040409, longitude: 106.82714206826583}}/>
              </MapView>
            </View>
            <Divider height={70}/>
            <TouchableOpacity style={{alignSelf: 'center',justifyContent: 'center',backgroundColor: Color.primary, width: '90%', height: 40, borderRadius: 20}}>
                <Text style={{color: Color.textInput, fontSize: 12, fontWeight: 'bold'}}>Lanjut</Text>
            </TouchableOpacity>
    </Scaffold>
  )
}

export default CreateShop