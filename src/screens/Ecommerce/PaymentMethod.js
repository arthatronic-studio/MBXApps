import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList,Image, TextInput} from 'react-native';
import { useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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

const PaymentMethod = () => {
    const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const { Color } = useColor();
  
  const [bca, setBCA] = useState(false);
  const [bri, setBRI] = useState(false);
  const [bni, setBNI] = useState(false);
  const [mandiri, setMandiri] = useState(false);
  const [permata, setPermata] = useState(false);
  const [atm, setATM] = useState("");

  const [checked, setChecked] = useState('circle-o');
  
  useEffect(() => {
  }, []);
  return (
    <Scaffold
        style={{backgroundColor: Color.semiwhite}}
          header={
            <Header 
              customIcon 
              title='Metode Pembayaran' 
              type='regular'
              centerTitle={false}
            />
          }
          onPressLeftButton={() => navigation.pop()}
    >
        <Divider/>
        <View style={{borderRadius: 1,backgroundColor: Color.theme, width: '93%', alignSelf: 'center'}}>
            <View style={{flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10,height: 38, justifyContent: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 14, width: '95%', textAlign: 'left'}}>Transfer ATM</Text>
                <MaterialIcons name={'keyboard-arrow-down'} size={20}/>
            </View>
            <View style={{backgroundColor: Color.border, width: '95%', height: 1, alignSelf: 'center'}}/>
            <Divider height={10}/>
            <FlatList
                data={[
                {bank: 'Bank BCA',
                image: ImagesPath.bca},
                {bank: 'Bank BNI',
                image: ImagesPath.bni},
                {bank: 'Bank BRI',
                image: ImagesPath.bri},
                {bank: 'Bank Mandiri',
                image: ImagesPath.mandiri},
                {bank: 'Bank Permata',
                image: ImagesPath.permata},
                ]}
                renderItem={({item}) => 
                (<View style={{flexDirection: 'row', paddingHorizontal: 10, marginVertical: 6}}>
                    <TouchableOpacity style={{paddingVertical: 7.5}}>
                        <FontAwesome name={'circle-o'} size={10} style={{color: Color.border}}/>
                    </TouchableOpacity>
                    <Text style={{textAlign: 'left',paddingHorizontal: 10, paddingVertical: 5,fontSize: 10, width: '80%'}}>{item.bank}</Text>
                    <View style={{backgroundColor: 'yellow', width: 55, height: 18}}>
                        <Image source={item.image} style={{width: '100%', height: '100%'}}/>
                    </View>
                </View>
                )}
            />
        </View>
        <Divider/>
        <View style={{borderRadius: 1,backgroundColor: Color.theme, width: '93%', alignSelf: 'center'}}>
            <View style={{flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10,height: 38, justifyContent: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 14, width: '95%', textAlign: 'left'}}>Dompet Virtual</Text>
                <MaterialIcons name={'keyboard-arrow-down'} size={20}/>
            </View>
            <View style={{backgroundColor: Color.border, width: '95%', height: 1, alignSelf: 'center'}}/>
            <Divider height={10}/>
            <FlatList
                data={[
                {bank: 'Bank BCA',
                image: ImagesPath.bca},
                {bank: 'Bank BNI',
                image: ImagesPath.bni},
                {bank: 'Bank BRI',
                image: ImagesPath.bri},
                {bank: 'Bank Mandiri',
                image: ImagesPath.mandiri},
                {bank: 'Bank Permata',
                image: ImagesPath.permata},
                ]}
                renderItem={({item}) => 
                (<View style={{flexDirection: 'row', paddingHorizontal: 10, marginVertical: 6}}>
                    <TouchableOpacity style={{paddingVertical: 7.5}}>
                        <FontAwesome name={'circle-o'} size={10} style={{color: Color.border}}/>
                    </TouchableOpacity>
                    <Text style={{textAlign: 'left',paddingHorizontal: 10, paddingVertical: 5,fontSize: 10, width: '80%'}}>{item.bank}</Text>
                    <View style={{backgroundColor: 'yellow', width: 55, height: 18}}>
                        <Image source={item.image} style={{width: '100%', height: '100%'}}/>
                    </View>
                </View>
                )}
            />
        </View>
        <Divider height={50}/>
        <View style={{backgroundColor: Color.theme, width: '100%', height: '100%', paddingHorizontal: 12}}>
            <Divider height={20}/>
            <Text style={{fontSize: 11, fontWeight: 'bold',textAlign: 'left'}}>Ringkasan Pembayaran</Text>
            <View style={{flexDirection: 'row', marginVertical: 10}}>
                <Text style={{color: Color.secondary,fontSize: 10, fontWeight: 'normal', textAlign: 'left', width: '82%'}}>Total Tagihan</Text>
                <Text style={{fontSize: 10, fontWeight: 'bold',}}>Rp. 171.000</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{color: Color.secondary,fontSize: 10, fontWeight: 'normal', textAlign: 'left', width: '82%'}}>Biaya Administrasi</Text>
                <Text style={{fontSize: 10, fontWeight: 'bold',}}>Rp. 171.000</Text>
            </View>
            <Divider height={30}/>
            <View style={{flexDirection: 'row'}}>
                <View style={{width: '57%', justifyContent: 'center'}}>
                    <Text style={{textAlign: 'left', color: Color.secondary, fontSize: 10}}>Total Pembayaran</Text>
                    <Text style={{textAlign: 'left', fontWeight: 'bold'}}>Rp. 176.000</Text>
                </View>
                <TouchableOpacity style={{justifyContent: 'center',backgroundColor: Color.primary, width: '42%', height: 40, borderRadius: 20}}>
                    <Text style={{fontSize: 14, color: Color.textInput, fontWeight: 'bold'}}>Bayar</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Scaffold>
  )
}

export default PaymentMethod