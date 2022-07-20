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
  ImageBackground,
  ScrollView,
  Platform,
  SafeAreaView,
  TextInput as TextInputs,
  Pressable,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import Styled from 'styled-components';
import {useSelector} from 'react-redux';
import {useIsFocused, useRoute} from '@react-navigation/native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import { Divider } from 'src/styled';
import {
  Text,
  // TouchableOpacity,
  Loading,
  useLoading,
  Scaffold,
  useColor,
  Header,
} from '@src/components';
import {
  iconBengkel,
  iconToko,
  iconKafe,
  iconResto,
  iconLainnya, iconStar,
  iconAddPlace,
  iconSendok,
  iconCoffe,
  iconBar,
  iconTree,
  iconGym,
  iconBook,
  iconRenang,
  iconBioskop,
  IconMuseum,
  iconCar,
  iconCuciMobil,
  iconHotel,
  iconPangkas,
  iconShop,
  iconCart,
  iconMontir,
  iconGaleryAdd
} from 'assets/images/place';
import {TouchableOpacity} from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';

import {shadowStyle} from '@src/styles';

import Client from '@src/lib/apollo';
import {queryContentProduct} from '@src/lib/query';

import ImagesPath from 'src/components/ImagesPath';
import {updateCurrentUserProfile} from 'src/state/actions/user/auth';
import {
  queryGetCategory,
  queryGetMyProduct,
  queryEditProduct,
} from 'src/lib/query/ecommerce';
import { AlertModal } from '@src/components';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;

const CreateReview = ({navigation, route}) => {
  const {height} = useWindowDimensions();
  const [name, setName] = useState();
  const [categoryFreeText, setCategoryFreeText] = useState();
  const [thumbImage, setThumbImage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mimeImage, setMimeImage] = useState('image/jpeg');
  const [listThumbImage, setListThumbImage] = useState([]);
  const [listEditThumbImage, setListEditThumbImage] = useState([]);
  const [listIndexDelete, setListIndexDelete] = useState([]);
  const [image, setImage] = useState([]);

  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const {Color} = useColor();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const [items, setItems] = useState([]);
  const [dataToko, setDataToko] = useState([]);

  useEffect(() => {
    getToko();
    Client.query({
      query: queryGetCategory,
      variables: {
        page: 1,
        itemPerPage: 10,
      },
    }).then(res => {
      // console.log('aku adalah', res.data.ecommerceProductCategoryList);
      // if(route.params.type == 'edit'){
      //   const idx = res.data.ecommerceProductCategoryList.findIndex(val => val.id == route.params.item.categoryId)
      //   setValue(res.data.ecommerceProductCategoryList[idx].id);
      // }
      setItems(res.data.ecommerceProductCategoryList);
    });
  }, []);

  const save = () => {
    const resImage = listThumbImage.filter(data => !data.startsWith("http://"));
    if((resImage.length != 0 || listIndexDelete.length == 0) && name != undefined && name.length != 0 && categoryFreeText != undefined && categoryFreeText.length != 0 ){
      let variables = {
        products: [
          {
            id: route.params.item.id,
            imageProducts: resImage,
            name,
            // categoryId: value,
            status: 'DELETE',
            indexImageDeleted: listIndexDelete,
            categoryFreeText, 
          },
        ],
      };

      console.log('variablesss', variables);
      Client.mutate({mutation: queryEditProduct, variables})
        .then(res => {
          console.log('BERHASIL EDIT', res);
          alert('Berhasi Menyimpan');
          setTimeout(() => {
            navigation.navigate('EditProduct');
          }, 1000);
        })
        .catch(err => {
          console.log('error', err);
        });
    }else{
      setIsModalVisible(true);
    }
  };

  const submit = () => {
    if(listThumbImage.length != 0 && name != undefined && name.length != 0 && categoryFreeText != undefined && categoryFreeText.length != 0 ){
      // const tempData = {imageUrl: thumbImage ? 'data:image/png;base64,'+thumbImage : route.params.type == 'edit' ? route.params.item.imageUrl : undefined, name, categoryId:value, merchantId: dataToko.id};
      const tempData = {
        imageProducts: listThumbImage,
        name,
        // categoryId: value,
        merchantId: dataToko.id,
        categoryFreeText,
      };

      navigation.navigate('StepTwo', {
        tempData,
        type: route.params.type,
        item: route.params.item,
      });
    }else{
      setIsModalVisible(true);
    }
  };

  const getToko = id => {
    showLoading();
    Client.query({query: queryGetMyProduct})
      .then(res => {
        // hideLoading()
        console.log(res, "hasil get toko");
        if (res.data.ecommerceGetMerchant) {
          setDataToko(res.data.ecommerceGetMerchant);
        }
      })
      .catch(reject => {
        hideLoading();
        console.log(reject.message, 'error');
      });
  };

  const addImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 640,
      maxHeight: 640,
      quality: 1,
      includeBase64: true,
    };

    launchImageLibrary(options, callback => {
      if (callback.base64) {
        setThumbImage(callback.base64);
        setMimeImage(callback.type);
        // listThumbImage.push('data:image/png;base64,'+ callback.base64)
        pushImage(callback.base64, callback.type);
      }
    });
  };
  const onChangeUserData = (key, val) => {
    setUserData({...userData, [key]: val});
  };
  const [userData, setUserData] = useState({
    userId: user.userId,
    name: '',
    noTelp: '',
    alamat: '',
    instagram: '',
    profileImg: '',
    isVerified: false,
    isOfficial: false,
    countryId: 228,
    provinceId: null,
    cityId: null,
    suburbId: null,
    areaId: null,
    postalCode: '',
    latitude: '-6.173696',
    longitude: '106.824707',
  });
  const delImage = (item) => {
    if(route.params.type == 'edit' && listIndexDelete.length < listEditThumbImage.length){
      const index = listEditThumbImage.indexOf(item);
      setListIndexDelete([...listIndexDelete, index]);
    }

    if(item === 0){
      setImage([]);
      setListThumbImage([]);
      setThumbImage('');
    }else{
      const temp = listThumbImage.filter(data => data !== item);
      setImage(temp);
      setListThumbImage(temp);
    }
  }

  const pushImage = (thumbImage, mimeImage) => {
    const tempThumbImage = thumbImage
      ? 'data:image/png;base64,' + thumbImage
      : route.params.type == 'edit'
      ? route.params.item.imageUrl
      : undefined;

    const tempImage = `data:${mimeImage};base64,${thumbImage}`;
    setImage([...image, tempImage]);
    setListThumbImage([...listThumbImage, tempThumbImage]);
  };

  return (
    <Scaffold
      style
      
      onPressLeftButton={() => navigation.pop()}>
      <ScrollView style={{backgroundColor: Color}}>
      
        <View style={{width: '100%', height: 25}} />
        <View>

        <View>
          <TextInput
            placeholder="Masukkan Alamat Toko"
            style={{
              marginVertical: 8,
              width: '95%',
              borderWidth: 1,
              borderColor: Color.border,
              height: 85,
              borderRadius: 5,
              alignSelf: 'center',
              fontSize: 12,
              paddingHorizontal: 10,
              paddingTop: 22,
            }}
            autoCorrect={false}
            onChangeText={text => onChangeUserData('alamat', text)}
            selectionColor={Color.text}
            value={userData.alamat}
          />
          <Text
            style={{
              fontSize: 8,
              color: Color.secondary,
              textAlign: 'left',
              position: 'absolute',
              marginVertical: 13,
              marginHorizontal: 20,
            }}>
            Alamat Toko
          </Text>
        </View>

     

          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                width: '50%',
                textAlign: 'left',
                paddingHorizontal: 20,
                fontWeight: 'bold',
                fontSize: 10,
              }}>
              
            </Text>
            <Text
              onPress={() => {
                addImage();
              }}
              style={{
                width: '50%',
                textAlign: 'right',
                paddingHorizontal: 20,
                color: Color.primary,
                fontSize: 10,
              }}>
              + Tambah Foto
            </Text>
          </View>
          {listThumbImage.length === 0 ? (
              <TouchableOpacity onPress={() => {
                addImage();
              }}>
              <View style={{flexDirection:'row', alignSelf:'center', borderRadius:20,borderWidth:1,borderColor:Color.grayLight,paddingHorizontal:120,paddingVertical:10}}>
              
              <Image
              source={iconGaleryAdd}
              style={{ height: 20, width: 20,  }}
              resizeMode='contain'
            />

            <Text> Tambahkan Foto</Text>
              </View>
              </TouchableOpacity>
          ) : (
            <View
              style={{
                padding: 16,
                marginVertical: 10,
                width: '100%',
                height: height / 3,
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              {listThumbImage.length === 1 ? (
                <ImageBackground
                        style={{
                          height: '100%',
                          aspectRatio: 1,
                          alignItems: 'flex-end',
                          justifyContent: 'flex-start',
                          marginRight: 10,
                        }}
                        imageStyle={{ borderRadius: 4, }}
                        source={{uri: listThumbImage[0]}}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            delImage(route.params.type == 'edit'? listThumbImage[0] : 0);
                          }}
                          style={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                          }}>
                            <Ionicons name='trash' color={Color.textInput} size={16} />
                        </TouchableOpacity>
                      </ImageBackground>
              ) : ( 
                <FlatList
                  data={listThumbImage}
                  horizontal={true}
                  keyExtractor={(item, index) => item.toString() + index}
                  renderItem={({item}) => {
                    return (
                      <ImageBackground
                        style={{
                          height: '100%',
                          aspectRatio: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 10,
                        }}
                        imageStyle={{ borderRadius: 4, }}
                        source={{uri: item}}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            delImage(item);
                          }}
                          style={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                          }}>
                            <Ionicons name='trash' color={Color.textInput} size={16} />
                        </TouchableOpacity>
                      </ImageBackground>
                    );
                  }}
                />
              )}
            </View>
          )}

          <Text
            style={{
              textAlign: 'left',
              paddingHorizontal: 20,
              fontSize: 8,
              lineHeight: 14,
              color: Color.secondary,
            }}>
            Pastikan anda mengupload gambar dengan kondisi pencahayaan yang baik
          
          </Text>
        
        </View>
        <Divider height={16}/>
     
        
      </ScrollView>
      <View
        style={{
          backgroundColor: 'white',
          width: '100%',
          height: 70,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {route.params.type == 'edit' ? (
          <TouchableOpacity
            style={{
              backgroundColor: Color.primary,
              width: '80%',
              height: 45,
              borderRadius: 30,
              justifyContent: 'center',
              textAlign: 'center',
            }}
            //   onPress={() => navigation.navigate('StepTwo')}
            onPress={() => save()}>
            <Text style={{color: Color.textInput, fontWeight: 'bold'}}>
              Simpan
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: Color.primary,
              width: '80%',
              height: 45,
              borderRadius: 30,
              justifyContent: 'center',
              textAlign: 'center',
            }}
            //   onPress={() => navigation.navigate('StepTwo')}
            onPress={() => submit()}>
            <Text style={{color: Color.textInput, fontWeight: 'bold'}}>
              Lanjut
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <AlertModal visible={isModalVisible} message="Data belum lengkap" type="error" onClose={() => setIsModalVisible(false)} onSubmit={() => setIsModalVisible(false)}/>
    </Scaffold>
  );
};

export default CreateReview;
