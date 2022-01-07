import React from 'react';
import {View, Text, Image, FlatList, StatusBar} from 'react-native';
import Banner from 'src/components/Banner';
import ImagesPath from 'src/components/ImagesPath';
import {Scaffold, useColor, Header} from '@src/components';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import CardListLelang from 'src/components/Card/CardListLelang';

const Lelang = () => {
  const {Color} = useColor();
  const renderItem = ({item}) => (
    <Image
      source={item.image}
      style={{width: 300, height: 250, resizeMode: 'cover', marginVertical: 10}}
    />
  );
  return (
    <Scaffold
      header={
        <Header
          type="regular"
          color={Color.black}
          backgroundColor="white"
          centerTitle={false}
          customIcon
          title="Lelang"
        />
      }
      color="black"
      onPressLeftButton={() => navigation.pop()}>
      <ScrollView style={{backgroundColor: '#E5E5E5'}}>
        {/* Bagian Banner */}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: 240,
          }}>
          <View
            style={{
              width: '95%',
              height: 213,
            }}>
            <Banner />
          </View>
        </View>
        {/* Bagian Judul */}
        <View
          style={{
            height: 50,
            width: '100%',
            paddingHorizontal: 5,
            paddingVertical: 5,
          }}>
          <View
            style={{
              height: '50%',
              width: '100%',
            }}>
            <Text
              style={{
                paddingHorizontal: 10,
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              Pelelangan
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              height: '50%',
            }}>
            <View
              style={{
                height: '100%',
                width: '60%',
              }}>
              <Text
                style={{
                  paddingHorizontal: 10,
                  fontSize: 16,
                  fontWeight: 'normal',
                }}>
                Sedang Berlangsung
              </Text>
            </View>
            <View
              style={{
                height: '100%',
                width: '40%',
                justifyContent: 'center',
              }}>
              <TouchableOpacity>
                <Text
                  style={{
                    textAlign: 'right',
                    paddingHorizontal: 15,
                    fontSize: 14,
                    fontWeight: 'normal',
                    color: '#027BC9',
                  }}>
                  Lihat Semua
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Bagian Card List */}
        <View>
          <CardListLelang />
        </View>
        <View style={{paddingHorizontal: 20, paddingVertical: 20}}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>Pelelangan</Text>
          <Text style={{fontSize: 16, fontWeight: 'normal'}}>
            yang akan datang
          </Text>
          <View style={{width: '100%', height: 300}}></View>
        </View>
      </ScrollView>
    </Scaffold>
  );
};

export default Lelang;
