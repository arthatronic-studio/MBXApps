import React from 'react';
import {View, Text, Image, FlatList, StatusBar} from 'react-native';
import Banner from 'src/components/Banner';
import ImagesPath from 'src/components/ImagesPath';
import {Scaffold, useColor, Header} from '@src/components';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import CardListLelang from 'src/components/Card/CardListLelang';
import LiveProductList from 'src/components/LiveProductList';

const DetailLelang = () => {
  const {Color} = useColor();
  return (
    <Scaffold
      header={
        <Header
          type="regular"
          color={Color.black}
          backgroundColor="white"
          centerTitle={false}
          customIcon
        />
      }>
      <ScrollView>
        <View
          style={{
            width: '100%',
            height: 80,
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: '50%',
              justifyContent: 'center',
              paddingHorizontal: 15,
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              Pashmina Pink Nissa Sabyan
            </Text>
          </View>
          <View
            style={{
              width: '50%',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingHorizontal: 15,
            }}>
            <View
              style={{
                backgroundColor: 'black',
                width: 90,
                height: 40,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: 'white', fontSize: 5}}>Sisa Waktu</Text>
                <Text style={{color: 'white', fontSize: 14}}>12:53</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Detail Harga */}
        <View
          style={{
            width: '100%',
            height: 60,
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: '35%',
              justifyContent: 'center',
              paddingHorizontal: 15,
            }}>
            <Text style={{fontSize: 9, color: '#666666', fontWeight: 'bold'}}>
              Harga saat ini
            </Text>
            <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>
              Rp. 150.000
            </Text>
          </View>
          <View style={{width: '65%', justifyContent: 'center'}}>
            <Text style={{fontSize: 9, color: '#666666', fontWeight: 'bold'}}>
              Harga permulaan
            </Text>
            <Text style={{fontSize: 14, color: '#666666', fontWeight: 'bold'}}>
              Rp. 10.000
            </Text>
          </View>
        </View>
        {/* Jenis Barang */}
        <View
          style={{
            width: '100%',
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '94%',
              height: 60,
              backgroundColor: '#e9e7e4',
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Text style={{fontSize: 10, color: '#666666'}}>Jenis Barang</Text>
              <Text style={{fontSize: 11, color: '#121212'}}>Hijab</Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Text style={{fontSize: 10, color: '#666666'}}>Jumlah</Text>
              <Text style={{fontSize: 11, color: '#121212'}}>1 Unit</Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Text style={{fontSize: 10, color: '#666666'}}>Jam Mulai</Text>
              <Text style={{fontSize: 11, color: '#121212'}}>13:05 WIB</Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Text style={{fontSize: 10, color: '#666666'}}>Durasi</Text>
              <Text style={{fontSize: 11, color: '#121212'}}>15 Menit</Text>
            </View>
          </View>
        </View>
        {/* Foto Produk */}
        <FlatList
          horizontal
          data={[
            {image: ImagesPath.produklelang},
            {image: ImagesPath.produklelang},
            {image: ImagesPath.produklelang},
          ]}
          renderItem={({item}) => (
            <Image
              source={item.image}
              style={{marginHorizontal: 15, marginVertical: 15}}
            />
          )}
        />
        {/* Deskripsi */}
        <View
          style={{
            width: '100%',
            height: 20,
            paddingHorizontal: 15,
          }}>
          <Text
            style={{
              width: '100%',
              height: 20,
              fontSize: 10,
              color: '#666666',
            }}>
            Deskripsi
          </Text>
        </View>
        <View style={{width: '100%', height: 400}}>
          <Text
            style={{
              color: '#121212',
              fontSize: 14,
              paddingHorizontal: 15,
              lineHeight: 22,
            }}>
            Cupcake donut caramels gummi bears cheesecake powder pie lollipop
            marzipan. Chocolate cake liquorice chocolate bar pudding lemon drops
            lollipop ice cream sweet. Candy cake wafer topping sweet roll tart.
            Cotton candy fruitcake donut muffin muffin gingerbread. Lollipop
            gingerbread candy canes topping candy canes. Cake muffin shortbread
            soufflé pie cake. Gingerbread danish chocolate cake powder jujubes.
            Bear claw cotton candy biscuit cheesecake ice cream sweet roll bear
            claw. Dragée wafer pastry lollipop bear claw fruitcake tiramisu
            toffee chocolate. Dragée danish carrot cake cake toffee. Cake oat
            cake dessert shortbread pastry fruitcake lollipop danish. Pudding
            oat cake gingerbread icing pie pudding shortbread. Wafer topping
            chocolate bar marshmallow sugar plum muffin cheesecake chocolate.
            Jelly beans tootsie roll danish shortbread candy powder bear claw
            marzipan brownie. Jelly beans carrot cake cookie pie lollipop candy
            canes chupa chups. Cupcake ice cream marshmallow apple pie apple pie
            ice cream.
          </Text>
        </View>
      </ScrollView>
      <View>
        <TouchableOpacity
          style={{
            width: '92%',
            height: 45,
            backgroundColor: '#027BC9',
            borderRadius: 30,
            marginHorizontal: 15,
            paddingVertical: 10,
          }}>
          <Text style={{textAlign: 'center', color: 'white'}}>
            Ikuti Lelang
          </Text>
        </TouchableOpacity>
      </View>
    </Scaffold>
  );
};

export default DetailLelang;
