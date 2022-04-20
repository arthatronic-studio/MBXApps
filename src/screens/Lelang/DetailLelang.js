import React,{useState} from 'react';
import {View, Image, FlatList, StatusBar} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import ImagesPath from 'src/components/ImagesPath';
import {Scaffold, useColor, Header, Text} from '@src/components';
import { Divider } from 'src/styled';
import { FormatMoney } from 'src/utils';
import moment from 'moment';
import Entypo from 'react-native-vector-icons/Entypo'

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
          actions={
            <>
              <Entypo name={'dots-three-vertical'} size={20}/>
            </>
          }
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
              width: '60%',
              justifyContent: 'center',
              paddingHorizontal: 15,
            }}>
            <Text size={18} type='bold' align='left'>
              Pashmina Pink Nissa Sabyan
            </Text>
          </View>
          <View
            style={{
              width: '40%',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingHorizontal: 15,
            }}>
            <View
              style={{
                backgroundColor: '#3C58C1',
                width: 90,
                height: 40,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text size={5} color={Color.textInput}>Sisa Waktu</Text>
                <Text style={{fontWeight: 'bold'}} color={Color.textInput} size={11}>{moment.unix((product.time_end/1000) - moment().unix()).format("DD") > 0 ? moment.unix((product.time_end/1000) - moment().unix()).format("DD")+'Hari ' : ''}{moment.unix((product.time_end/1000) - moment().unix()).format("HH:mm")}</Text>
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
              width: '40%',
              justifyContent: 'center',
            }}>
            <Text align='left' style={{fontSize: 10, color: Color.secondary}}>
              Harga tertinggi
            </Text>
            <Divider height={1} />
            <Text size={18} type='bold' align='left'>
              {FormatMoney.getFormattedMoney(product.buy_now_price)}
            </Text>
          </View>
          <View style={{width: '60%', justifyContent: 'center'}}>
            <Text align='left' style={{fontSize: 10, color: Color.secondary}}>
              Harga Buka
            </Text>
            <Divider height={1} />
            <Text size={14} align='left'>
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
              borderRadius: 5
            }}>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Text size={10} color={Color.gray} align='left'>Jenis Barang</Text>
              <Divider height={1}/>
              <Text size={11} type='bold' align='left'>Hijab</Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Text size={10} color={Color.gray}>Jumlah</Text>
              <Divider height={1}/>
              <Text size={11} type='bold'>{product.quantity} Unit</Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Text size={10} color={Color.gray}>Jam Mulai</Text>
              <Divider height={1}/>
              <Text size={11} type='bold'>{moment.unix(product.time_start/1000).format("HH:mm")} WIB</Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Text size={10} color={Color.gray}>Durasi</Text>
              {console.log( (product.time_end / 1000) - moment().unix()  )}
              <Divider height={1}/>
              <Text size={11} type='bold'>{moment.unix((product.time_start/1000) + moment().unix()).format("HH:mm")}</Text>
            </View>
          </View>
        </View>
        {/* Foto Produk */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
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
            size={10}
          >
            Deskripsi
          </Text>
        </View>
        <View style={{width: '100%', marginTop: 3, paddingHorizontal: 16}}>
          <Text
            align='left'
            lineHeight={20}
          >
           {product.description}
          </Text>
        </View>
      </ScrollView>
      <View>
        <Text style={{fontSize: 10, fontWeight: 'bold', marginVertical: 5}}>Males Ikutan Lelang?</Text>
        <TouchableOpacity
          onPress={()=> navigation.navigate('DirectOrder')}
          style={{
            width: '92%',
            height: 45,
            backgroundColor: Color.theme,
            borderWidth: 1,
            borderColor: Color.primary,
            borderRadius: 30,
            marginHorizontal: 15,
            paddingVertical: 10,
            marginVertical: 5
          }}>
          <Text color={Color.primary} style={{fontSize: 14}}>
            Beli Langsung Aja
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '92%',
            height: 45,
            backgroundColor: Color.primary,
            borderRadius: 30,
            marginHorizontal: 15,
            paddingVertical: 10,
            marginVertical: 10
          }}>
          <Text color={Color.textInput} onPress={()=> navigation.navigate('JoinLelang')}>
            Ikuti Lelang
          </Text>
        </TouchableOpacity>
      </View>
    </Scaffold>
  );
};

export default DetailLelang;
