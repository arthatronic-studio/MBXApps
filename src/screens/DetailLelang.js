import React,{useState} from 'react';
import {View, Image, FlatList, StatusBar} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

import ImagesPath from 'src/components/ImagesPath';
import {Scaffold, useColor, Header, Text} from '@src/components';
import { Divider } from 'src/styled';
import { FormatMoney } from 'src/utils';
import moment from 'moment';

const DetailLelang = ({route, navigation}) => {
  const [product, setProduct] = useState(route.params.item);
  console.log(product)
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
                <Text color={Color.textInput} size={12}>{moment.unix((product.time_end/1000) - moment().unix()).format("DD") > 0 ? moment.unix((product.time_end/1000) - moment().unix()).format("DD")+'Hari ' : ''}{moment.unix((product.time_end/1000) - moment().unix()).format("HH:mm")}</Text>
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
              {FormatMoney.getFormattedMoney(product.buy_now_price)}
            </Text>
          </View>
          <View style={{width: '50%', justifyContent: 'center'}}>
            <Text align='right'>
              Harga permulaan
            </Text>
            <Divider height={4} />
            <Text size={16} type='bold' align='right'>
              {FormatMoney.getFormattedMoney(product.start_price)}
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
              <Text size={10} type='medium'>{product.quantity} Unit</Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Text size={10} color={Color.gray}>Jam Mulai</Text>
              <Text size={10} type='medium'>{moment.unix(product.time_start/1000).format("HH:mm")} WIB</Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Text size={10} color={Color.gray}>Durasi</Text>
              {console.log( (product.time_end / 1000) - moment().unix()  )}
              <Text size={10} type='medium'>{moment.unix((product.time_start/1000) + moment().unix()).format("HH:mm")}</Text>
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
           {product.description}
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
