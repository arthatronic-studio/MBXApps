import React from 'react';
import {View, Text, Image, FlatList, StatusBar} from 'react-native';
import Banner from 'src/components/Banner';
import ImagesPath from 'src/components/ImagesPath';
import {Scaffold, useColor, Header} from '@src/components';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import CardListLelang from 'src/components/Card/CardListLelang';
import LiveProductList from 'src/components/LiveProductList';

const DATA = [
  {
    id: 1,
    no: 1,
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

const JoinLelang = () => {
  const {Color} = useColor();
  const renderItem = ({item}) => <Text>{item.title}</Text>;
  return (
    <Scaffold
      header={
        <Header
          type="regular"
          color={Color.white}
          backgroundColor="green"
          centerTitle={false}
          customIcon
          title="Lelang"
        />
      }>
      <View style={{width: '100%', height: 180}}>
        <View style={{backgroundColor: 'white', flexDirection: 'row'}}>
          <View
            style={{
              width: '25%',
              height: 100,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={ImagesPath.produklelang}
              style={{width: 80, height: 80, borderRadius: 10}}
            />
          </View>
          <View style={{width: '40%', height: 100, paddingVertical: 10}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#121212'}}>
              Pashmina Pink Nissa Sabyan
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontWeight: 'bold',
                color: 'grey',
                paddingVertical: 5,
              }}>
              Hijab
            </Text>
          </View>
          <View
            style={{
              width: '35%',
              paddingVertical: 10,
              paddingHorizontal: 10,
              alignItems: 'flex-end',
            }}>
            <View
              style={{
                backgroundColor: 'black',
                width: 75,
                height: 35,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: 'white', fontSize: 8}}>Sisa waktu</Text>
              <Text style={{color: 'white', fontSize: 12}}>12:05</Text>
            </View>
          </View>
        </View>
        {/* Detail */}
        <View
          style={{
            width: '100%',
            height: 70,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: '95%',
              height: '90%',
              borderRadius: 10,
              backgroundColor: '#e9e7e4',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}>
            <View style={{width: '35%'}}>
              <Text style={{color: 'grey', fontSize: 9}}>
                Penawaran saat ini
              </Text>
              <Text
                style={{color: '#121212', fontSize: 18, fontWeight: 'bold'}}>
                Rp. 150.000
              </Text>
            </View>
            <View style={{width: '30%'}}>
              <Text style={{color: 'grey', fontSize: 9}}>Penawaranmu</Text>
              <Text style={{color: 'grey', fontSize: 14}}>Rp.0</Text>
            </View>
            <View style={{width: '35%'}}>
              <Text style={{color: 'grey', fontSize: 9}}>Penawaran Awal</Text>
              <Text style={{color: 'grey', fontSize: 14, fontWeight: 'bold'}}>
                Rp. 50.000
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          width: '100%',
          height: 55,
          backgroundColor: '#96C63B',
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            color: 'white',
            width: '30%',
            height: '100%',
            paddingHorizontal: 15,
            paddingVertical: 15,
          }}>
          Penawar
        </Text>
        <View style={{width: '70%'}}></View>
      </View>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </Scaffold>
  );
};

export default JoinLelang;
