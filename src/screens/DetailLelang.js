import React from 'react';
import {View, Image, FlatList, StatusBar} from 'react-native';
import Banner from 'src/components/Banner';
import ImagesPath from 'src/components/ImagesPath';
import {Scaffold, useColor, Header, Text} from '@src/components';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import CardListLelang from 'src/components/Card/CardListLelang';
import LiveProductList from 'src/components/LiveProductList';
import { Divider } from 'src/styled';

const DetailLelang = () => {
  const {Color} = useColor();
  return (
    <Scaffold
      header={
        <Header
          type="regular"
          color={Color.text}
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
            <Text size={18} type='bold' align='left'>
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
                backgroundColor: Color.text,
                width: 90,
                height: 40,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text size={8} color={Color.textInput}>Sisa Waktu</Text>
                <Text color={Color.textInput}>12:53</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Detail Harga */}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            paddingVertical: 8,
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              width: '50%',
              justifyContent: 'center',
            }}>
            <Text align='left'>
              Harga saat ini
            </Text>
            <Divider height={4} />
            <Text size={16} type='bold' align='left'>
              Rp. 150.000
            </Text>
          </View>
          <View style={{width: '50%', justifyContent: 'center'}}>
            <Text align='right'>
              Harga permulaan
            </Text>
            <Divider height={4} />
            <Text size={16} type='bold' align='right'>
              Rp. 10.000
            </Text>
          </View>
        </View>
        {/* Jenis Barang */}
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 8,
          }}>
          <View
            style={{
              width: '94%',
              height: 60,
              backgroundColor: Color.semiwhite,
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Text size={10} color={Color.gray}>Jenis Barang</Text>
              <Text size={10} type='medium'>Hijab</Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Text size={10} color={Color.gray}>Jumlah</Text>
              <Text size={10} type='medium'>1 Unit</Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Text size={10} color={Color.gray}>Jam Mulai</Text>
              <Text size={10} type='medium'>13:05 WIB</Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Text size={10} color={Color.gray}>Durasi</Text>
              <Text size={10} type='medium'>15 Menit</Text>
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
          }}
        >
          <Text
            color={Color.gray}
            align='left'
          >
            Deskripsi
          </Text>
        </View>
        <View style={{width: '100%', marginTop: 8, paddingHorizontal: 16}}>
          <Text
            align='left'
            lineHeight={20}
          >
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
            backgroundColor: Color.info,
            borderRadius: 30,
            marginHorizontal: 15,
            paddingVertical: 10,
          }}>
          <Text color={Color.textInput}>
            Ikuti Lelang
          </Text>
        </TouchableOpacity>
      </View>
    </Scaffold>
  );
};

export default DetailLelang;
