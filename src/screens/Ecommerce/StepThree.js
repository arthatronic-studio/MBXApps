import React, {
  useState,
  useEffect,
  useRef,
  Component,
  AppRegistry,
} from 'react';
import {
  TextInput,
  View,
  Image,
  ScrollView,
  Platform,
  SafeAreaView,
  TextInput as TextInputs,
  Pressable,
  Button,
} from 'react-native';
import Styled from 'styled-components';
import {useSelector} from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import {
  Text,
  // TouchableOpacity,
  Loading,
  useLoading,
  Scaffold,
  Row,
  Col,
  HeaderBig,
  useColor,
  Header,
  Popup,
} from '@src/components';
import {TouchableOpacity} from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';

import {shadowStyle} from '@src/styles';

import Client from '@src/lib/apollo';
import {queryContentProduct} from '@src/lib/query';
import TopTabShop from './TopTabShop';
import ImagesPath from 'src/components/ImagesPath';
import {queryAddProduct, queryEditProduct} from 'src/lib/query/ecommerce';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;

const StepThree = ({navigation, route}) => {
  const props = route.params.tempData;

  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    navigation.navigate('MyShop')
  };

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const {Color} = useColor();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Hijab', value: 'hijab'},
    {label: 'Fashion', value: 'fashion'},
    {label: 'Music', value: 'music'},
    {label: 'Buku', value: 'buku'},
    {label: 'Banana', value: 'banana'},
    {label: 'Banana', value: 'banana'},
    {label: 'Hai', value: 'hai'},
  ]);

  const [etalase, setEtalase] = useState(false);
  const [valueEtalase, setValueEtalase] = useState(null);
  const [itemsEtalase, setItemsEtalase] = useState([
    {label: 'Hijab', value: 'hijab'},
    {label: 'Fashion', value: 'fashion'},
    {label: 'Music', value: 'music'},
    {label: 'Buku', value: 'buku'},
    {label: 'Banana', value: 'banana'},
    {label: 'Banana', value: 'banana'},
    {label: 'Hai', value: 'hai'},
  ]);

  const [price, setPrice] = useState(0);

  useEffect(() => {
    if(route.params.type == 'edit'){
      console.log('edit boss')
      setPrice(String(route.params.item.price))
    }
  }, []);

  const submit = () => {
    let variables = {
      products: [
        {
          ...props,
          imageUrl: route.params.type == 'edit' && props.imageUrl == route.params.item.imageUrl ? undefined :  props.imageUrl,
          initialPrice: 0,
          id: route.params.type == 'edit' ? route.params.item.id : undefined,
          price: parseInt(price),
          status: 'SHOW',
        },
      ],
    };
    console.log(variables)
    Client.mutate({mutation: route.params.type == 'edit' ? queryEditProduct : queryAddProduct, variables})
      .then(res => {
        console.log('BERHASIL KIRIM', res);
        setModalVisible(!isModalVisible);
        setTimeout(() => {
          navigation.popToTop()
        }, 2000);
        
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  return (
    <Scaffold
      style
      header={
        <Header
          customIcon
          title={route.params.type =="edit" ?"Edit Produk" : "Tambah Produk"}
          type="regular"
          centerTitle={false}
        />
      }
      onPressLeftButton={() => navigation.pop()}>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}>
          <Image source={ImagesPath.stepthree} />
          <View
            style={{
              paddingVertical: 5,
              alignItems: 'flex-start',
              paddingHorizontal: 20,
            }}>
            <Text style={{fontWeight: 'bold', fontSize: 14}}>
              Sedikit Lagi!
            </Text>
            <Text style={{color: Color.secondary, fontSize: 10}}>
              Masukkan harga serta etalase untuk produk
            </Text>
          </View>
        </View>
        <View style={{width: '100%', height: 25}} />
        <View>
          <Text
            style={{
              textAlign: 'left',
              fontSize: 10,
              paddingHorizontal: 20,
              paddingVertical: 12,
              fontWeight: 'bold',
            }}>
            Harga Produk
          </Text>
        </View>
        <View>
          <TextInput
            keyboardType="numeric"
            onChangeText={value => setPrice(parseFloat(value))}
            value={price}
            placeholder={'0'}
            style={{
              borderWidth: 1,
              borderColor: Color.secondary,
              height: 45,
              width: '90%',
              paddingHorizontal: 12,
              paddingTop: 18,
              marginHorizontal: 20,
              borderRadius: 5,
              fontSize: 12,
            }}
          />

          <Text
            style={{
              paddingHorizontal: 32,
              paddingVertical: 5,
              color: Color.secondary,
              fontSize: 8,
              fontWeight: '400',
              position: 'absolute',
            }}>
            Harga Produk
          </Text>
        </View>

        <View
          style={{
            height: 300,
            width: '90%',
            marginHorizontal: 20,
            marginVertical: 10,
          }}>
          <Text
            style={{
              paddingHorizontal: 15,
              paddingTop: 5,
              color: Color.secondary,
              fontSize: 8,
              fontWeight: '400',
              textAlign: 'left',
            }}>
            Satuan Barang
          </Text>
          <DropDownPicker
            zIndex={3000}
            zIndexInverse={1000}
            placeholder="- Potongan Harga -"
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            dropDownContainerStyle={{height: 165}}
            style={{
              height: 28,
              width: '99%',
              marginHorizontal: 2,
              borderWidth: 0,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: 47,
              borderWidth: 1,
              borderColor: Color.secondary,
              borderRadius: 5,
            }}
          />
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                textAlign: 'left',
                fontSize: 10,
                paddingHorizontal: 5,
                paddingVertical: 12,
                fontWeight: 'bold',
                width: '50%',
              }}>
              Etalase Produk
            </Text>
            <Pressable style={{width: '50%'}}>
              <Text
                style={{
                  textAlign: 'left',
                  fontSize: 10,
                  paddingHorizontal: 5,
                  paddingVertical: 12,
                  fontWeight: 'bold',
                  color: Color.primary,
                  textAlign: 'right',
                }}>
                + Tambah Etalase
              </Text>
            </Pressable>
          </View>
          <View>
            <Text
              style={{
                paddingHorizontal: 15,
                paddingTop: 5,
                color: Color.secondary,
                fontSize: 8,
                fontWeight: '400',
                textAlign: 'left',
              }}>
              Etalase Produk
            </Text>
            <DropDownPicker
              zIndex={2000}
              zIndexInverse={2000}
              placeholder="- Pilih Etalase -"
              open={etalase}
              value={valueEtalase}
              items={itemsEtalase}
              setOpen={setEtalase}
              setValue={setValueEtalase}
              setItems={setItemsEtalase}
              dropDownContainerStyle={{height: 165}}
              style={{
                height: 28,
                width: '99%',
                marginHorizontal: 2,
                borderWidth: 0,
              }}
            />
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: 47,
                borderWidth: 1,
                borderColor: Color.secondary,
                borderRadius: 5,
              }}
            />
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: 'white',
          width: '100%',
          height: 70,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: Color.primary,
            width: '80%',
            height: 45,
            borderRadius: 30,
            justifyContent: 'center',
            textAlign: 'center',
          }}
          onPress={() => submit()}>
          <Text style={{color: Color.textInput, fontWeight: 'bold'}}>
            Selesai
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{height: 100, backgroundColor: Color.textInput}}>
        <Modal isVisible={isModalVisible}>
          <View
            style={{
              backgroundColor: Color.textInput,
              height: 300,
              borderRadius: 20,
            }}>
            <Image
              source={ImagesPath.checkCircle}
              style={{alignSelf: 'center', marginVertical: 10}}
            />
            <Text
              style={{marginVertical: 10, fontWeight: 'bold', fontSize: 16}}>
              Produk Berhasil Ditambahkan
            </Text>
            <Text
              style={{
                color: Color.secondary,
                fontSize: 12,
                lineHeight: 20,
                width: '80%',
                marginHorizontal: 34,
                marginVertical: 8,
              }}>
              Yeay, produk kamu berhasil ditambahkan ke barang daganganmu!
              Produk akan muncul setelah proses upload selesai
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 20,
              }}>
              <Pressable
                style={{
                  width: '80%',
                  backgroundColor: Color.gray,
                  height: 50,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={toggleModal}>
                <Text style={{color: Color.textInput, fontWeight: 'bold'}}>
                  Mengerti
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </Scaffold>
  );
};

export default StepThree;
