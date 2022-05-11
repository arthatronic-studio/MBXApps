import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Platform,
  Image,
  FlatList,
  SafeAreaView,
  TextInput as TextInputs,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import Styled from 'styled-components';
import {useSelector} from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Text,
  // TouchableOpacity,
  useLoading,
  Scaffold,
  Col,
  HeaderBig,
  useColor,
  Header,
  Alert,
} from '@src/components';
import {TouchableOpacity} from '@src/components/Button';
import {FormatMoney} from '@src/utils';
import ListForum from '@src/screens/MainForum/ListForum';

import {Divider, Circle, Container, Row} from '@src/styled';
import {shadowStyle} from '@src/styles';
import Client from '@src/lib/apollo';
import {queryContentProduct} from '@src/lib/query';
import {TextInput} from 'src/components/Form';
import TopTabShop from '../Ecommerce/TopTabShop';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MyShopHeader from '../Ecommerce/MyShopHeader';
import {queryGetMyProduct, queryGetMyShop} from 'src/lib/query/ecommerce';
import {useIsFocused} from '@react-navigation/native';

export default function AddProductAuction({navigation}) {
  const {Color} = useColor();
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const getProductList = id => {
    let variables = {
      merchantId: id,
    };
    Client.query({query: queryGetMyProduct, variables})
      .then(res => {
        console.log(res);
        if (res.data.ecommerceGetMerchant) {
          setData(res.data.ecommerceGetMerchant.productList);
        }
      })
      .catch(reject => {
        console.log(reject.message, 'error');
      });
  };

  const submit = () => {
    const item = data.find(item => item.id === selectedId);
    if (item) {
      navigation.navigate('AddProductAuctionSecond', {item: item});
    } else {
      alert('Item belum dipilih');
    }
  };

  const renderItem = ({item}) => {
    const isSelected = item.id === selectedId;
    return (
      <TouchableOpacity
        onPress={() => setSelectedId(item.id)}
        style={{
          backgroundColor: isSelected ? Color.grayLight : Color.theme,
          width: '44%',
          paddingHorizontal: 10,
          paddingVertical: 10,
          height: 280,
          marginHorizontal: 10,
          borderRadius: 10,
          marginVertical: 8,
        }}>
        <Image
          source={{uri: item.imageUrl}}
          style={{
            width: '100%',
            height: '58%',
            marginBottom: 10,
            borderRadius: 10,
          }}
        />
        <Text style={{fontWeight: 'bold', textAlign: 'left', lineHeight: 20}}>
          {item.name}
        </Text>
        <Text
          style={{
            fontSize: 8,
            textAlign: 'left',
            color: Color.secondary,
            marginVertical: 8,
          }}>
          {item.stock} stok
        </Text>
        <Text
          style={{
            fontSize: 8,
            textAlign: 'left',
            color: Color.secondary,
            marginBottom: 3,
          }}>
          Harga
        </Text>
        <Text
          style={{
            fontSize: 12,
            textAlign: 'left',
            color: Color.text,
            fontWeight: 'bold',
          }}>
          {FormatMoney.getFormattedMoney(item.price)}
        </Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    getProductList();
  }, []);

  return (
    <Scaffold
      style={{backgroundColor: Color.semiwhite}}
      header={
        <Header
          title={'Tambah Barang Lelang'}
          customIcon
          type="bold"
          centerTitle={false}
        />
      }
      onPressLeftButton={() => navigation.pop()}>
      <Row
        style={{
          backgroundColor: Color.theme,
          paddingHorizontal: 15,
          paddingVertical: 15,
        }}>
        <Image source={ImagesPath.one} style={{width: 40, height: 40}} />
        <Col style={{paddingHorizontal: 10}}>
          <Text style={{fontWeight: 'bold', fontSize: 14, textAlign: 'left'}}>
            Pilih Barang
          </Text>
          <Text
            style={{
              lineHeight: 15,
              fontSize: 8,
              color: Color.secondary,
              textAlign: 'left',
            }}>
            Pilih atau tambahkan produk baru untuk dilelang. Barang yang dipilih
            akan . . .
          </Text>
        </Col>
        <View style={{width: '32%'}} />
      </Row>
      <ScrollView>
        <Text
          style={{
            fontSize: 12,
            fontWeight: 'bold',
            marginHorizontal: 15,
            marginVertical: 15,
            textAlign: 'left',
          }}>
          Etalase Kamu
        </Text>
        <FlatList
          numColumns={2}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}></FlatList>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AddProduct', {type: 'add', item: {}})
          }
          style={{
            borderWidth: 1,
            borderColor: '#3C58C1',
            borderStyle: 'dashed',
            marginVertical: 10,
            flexDirection: 'row',
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            width: '92%',
            borderRadius: 20,
            alignSelf: 'center',
          }}>
          <IonIcons name={'add-circle-outline'} size={18} color={'#3C58C1'} />
          <Text style={{marginHorizontal: 5, fontSize: 12, color: '#3C58C1'}}>
            Tambah Produk
          </Text>
        </TouchableOpacity>
        <Divider height={10} />
      </ScrollView>
      <Row
        style={{
          backgroundColor: Color.theme,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={submit}
          style={{
            backgroundColor: Color.primary,
            width: '95%',
            height: '65%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
          }}>
          <Text
            style={{marginHorizontal: 5, fontSize: 12, color: Color.textInput}}>
            Lanjutkan
          </Text>
        </TouchableOpacity>
      </Row>
    </Scaffold>
  );
}
