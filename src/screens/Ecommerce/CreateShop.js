import React, { useState, useEffect, useRef } from 'react';
import { View, Pressable,FlatList,Image, TextInput, Keyboard} from 'react-native';
import { useSelector } from 'react-redux';
import IonIcons from 'react-native-vector-icons/Ionicons'
import MapView, {Marker} from 'react-native-maps'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Modal from "react-native-modal";
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';

import {
  Text,
  // TouchableOpacity,
  Loading, useLoading,
  Scaffold,
  Row, Col,
  Submit,
  useColor,
  Header
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import ImagesPath from 'src/components/ImagesPath';
import { Divider } from 'src/styled';
import { ScrollView } from 'react-native-gesture-handler';

import Client from '@src/lib/apollo';

import { queryCreateMerchant } from 'src/lib/query/ecommerce';

const CreateShop = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state['user.auth'].login.user);

  const [userData, setUserData] = useState({
    userId: user.userId,
    name: '',
    noTelp: '',
    alamat: '',
    instagram: '',
    profileImg: '',
    isVerified: true,
    isOfficial: true,
  });

  const [thumbImage, setThumbImage] = useState('');
  const [mimeImage, setMimeImage] = useState('image/jpeg');

  const [error, setError] = useState({
    userId: null,
    name: null,
    noTelp: null,
    alamat: null,
    instagram: null,
    profileImg: '',
    isVerified: null,
    isOfficial: null,
  });

  const isValueError = (name) => {
    const newError = validate(name, userData[name]);
    setError({ ...error, [name]: newError });
  }

  const onChangeUserData = (key, val) => {
    setUserData({ ...userData, [key]: val });
  };

  const loading = useSelector(state => state['user.auth'].loading);
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const { Color } = useColor();
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const onSubmit = () => {
    Keyboard.dismiss();

    showLoading()

    let variables = {
      body: {
        userId: userData.userId,
        name: userData.name,
        noTelp: userData.noTelp,
        alamat: userData.alamat,
        socialMedia: {
          instagram: userData.instagram,
        },
        profileImg: 'data:image/png;base64,' + thumbImage,
        isVerified: userData.isVerified,
        isOfficial: userData.isOfficial,
      }
    }

    Client.query({query: queryCreateMerchant, variables})
      .then((res) => {
        const data = res.data

        if (data) {
          showLoading('success', 'Berhasil Membuat Toko');
          
          setTimeout(() => {
              navigation.popToTop();
          }, 2500);
        } else {
          showLoading('error', 'Gagal Membuat Toko');
        }
      }) .catch((err) => {
        showLoading('error', 'Gagal membuat toko, Harap ulangi kembali');
      });
  }
  
  useEffect(() => {
  }, []);

  return (
    <Scaffold
        style={{backgroundColor: Color.theme}}
          header={
            <Header 
              customIcon
              title="Buat Toko"
              type='regular'
              centerTitle={false}
            />
          }
          onPressLeftButton={() => navigation.pop()}
    >
        <ScrollView>
          <View style={{flexDirection: 'row', marginHorizontal: 10}}>
              <TouchableOpacity
                onPress={() => {
                    const options = {
                        mediaType: 'photo',
                        maxWidth: 640,
                        maxHeight: 640,
                        quality: 1,
                        includeBase64: true,
                    }

                    launchImageLibrary(options, (callback) => {
                        setThumbImage(callback.base64);
                        setMimeImage(callback.type);
                    })
                }}
              >
                {thumbImage!=='' &&
                  <Image source={{ uri: `data:${mimeImage};base64,${thumbImage}` }} style={{resizeMode: 'contain', width: 40, height: 40, borderRadius: 50}} />
                }
                {thumbImage=='' && 
                  <View style={{justifyContent: 'center', alignItems: 'center',backgroundColor: Color.border, width: 40, height: 40, borderRadius: 50}}>
                      <IonIcons name={"camera-outline"} size={17}/>
                  </View>
                }
              </TouchableOpacity>
              <View style={{marginHorizontal: 10}}>
                  <Text style={{fontSize: 11, color: Color.text, fontWeight: 'bold', textAlign: 'left'}}>Unggah Foto Profile Toko</Text>
                  <Text style={{fontSize: 8, color: Color.secondary}}>Ukuran foto maks. 1MB dengan format JPEG, PNG, atau JPG</Text>
                  <Text style={{fontSize: 8, color: Color.primary, textAlign: 'left'}}>Unggah Foto</Text>
              </View>
          </View>
          <Divider/>
              <Text style={{fontSize: 10, fontWeight: 'bold',marginHorizontal: 10, textAlign: 'left'}}>Informasi Toko</Text>
              <View>
                  <TextInput 
                    placeholder='Toko Sumber Daya Abadi . . .' 
                    style={{
                      marginTop: 8,
                      width: '95%', 
                      borderWidth: 1, 
                      borderColor: Color.border, 
                      height: 45, 
                      borderRadius: 5, 
                      alignSelf: 'center', 
                      fontSize: 12, 
                      paddingHorizontal: 10, 
                      paddingTop: 22
                    }}
                    autoCorrect={false}
                    onChangeText={(text) => onChangeUserData('name', text)}
                    selectionColor={Color.text}
                    value={userData.name}
                  />
                  <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left', position: 'absolute', marginVertical: 13, marginHorizontal: 20}}>Nama Toko</Text>
                  <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'right', marginHorizontal: 15, marginVertical: 2}}>0/200</Text>
              </View>
              <View>
                  <TextInput 
                    placeholder='813-1234-5678' 
                    style={{
                      marginVertical: 8,
                      width: '95%', 
                      borderWidth: 1, 
                      borderColor: Color.border, 
                      height: 45, 
                      borderRadius: 5, 
                      alignSelf: 'center', 
                      fontSize: 12, 
                      paddingHorizontal: 32,
                      paddingTop: 22
                    }}
                    autoCorrect={false}
                    onChangeText={(text) => onChangeUserData('noTelp', text)}
                    selectionColor={Color.text}
                    value={userData.noTelp}
                    keyboardType='numeric'
                  />
                  <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left', position: 'absolute', marginVertical: 13, marginHorizontal: 20}}>No. Telpon Toko</Text>
                  <Text style={{fontSize: 12, position: 'absolute', marginVertical: 25.8, marginHorizontal: 15}}>+62</Text>
              </View>
              <View>
                  <TextInput 
                    placeholder='Masukkan Alamat Toko' 
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
                      paddingTop: 22
                    }}
                    autoCorrect={false}
                    onChangeText={(text) => onChangeUserData('alamat', text)}
                    selectionColor={Color.text}
                    value={userData.alamat}
                  />
                  <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left', position: 'absolute', marginVertical: 13, marginHorizontal: 20}}>Alamat Toko</Text>
              </View>
              <View>
                  <TextInput 
                    placeholder='tokojayaabadi' 
                    style={{
                      marginVertical: 8,
                      width: '95%', 
                      borderWidth: 1, 
                      borderColor: Color.border, 
                      height: 45, 
                      borderRadius: 5, 
                      alignSelf: 'center', 
                      fontSize: 12, 
                      paddingHorizontal: 25, 
                      paddingTop: 22
                    }}
                    autoCorrect={false}
                    onChangeText={(text) => onChangeUserData('instagram', text)}
                    selectionColor={Color.text}
                    value={userData.instagram}
                  />
                  <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left', position: 'absolute', marginVertical: 13, marginHorizontal: 20}}>Instagram Toko</Text>
                  <Text style={{fontSize: 12, position: 'absolute', marginVertical: 25, marginHorizontal: 20}}>@</Text>
              </View>
              <Divider/>
              <Text style={{fontSize: 10, fontWeight: 'bold', textAlign: 'left', marginHorizontal: 10}}>Titik Lokasi</Text>
              <View style={{width: '100%', height: 200, marginVertical: 10, alignItems: 'center'}}>
                <MapView style={{width: '95%', height: 200}} initialRegion={{
                  latitude: -6.173696,
                  longitude: 106.824707,
                  latitudeDelta: 0.004,
                  longitudeDelta: 0.004
                }}>
                  <Marker coordinate={{latitude: -6.175200397040409, longitude: 106.82714206826583}}/>
                </MapView>
              </View>

        </ScrollView>
        <Submit
            buttonLabel='Lanjut'
            buttonColor={Color.primary}
            type='bottomSingleButton'
            buttonBorderTopWidth={0}
            style={{backgroundColor: Color.theme, paddingTop: 25, paddingBottom: 25}}
            onPress={()=>{
            onSubmit()
          }}
        />

        <Loading {...loadingProps} />

            {/* Ini Modal */}
      <Modal isVisible={isModalVisible}>
        <View style={{width: '100%', height: 495, backgroundColor: Color.theme, borderRadius: 5}}>
          <Text style={{marginVertical: 15,fontSize: 24, fontWeight: 'bold'}}>Syarat & Ketentuan</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={{textAlign: 'left', paddingHorizontal: 20,fontSize: 18, fontWeight: 'bold'}}>1. Disclaimer</Text>
            <Text style={{fontSize: 14, textAlign: 'justify', paddingHorizontal: 20, lineHeight: 22, marginVertical: 10}}>
            Gingerbread cake jelly cupcake donut. Wafer dragée dragée sweet 
            ice cream gummies icing sweet. Cheesecake chupa chups chocolate 
            cake cheesecake cake. Candy fruitcake gummies candy canes powder 
            tart cake. {'\n'}{'\n'}Cupcake caramels gummies topping marshmallow 
            marshmallow sweet gingerbread. Sesame snaps tart apple pie 
            chupa chups ice cream sugar plum jelly bonbon. Pudding 
            fruitcake toffee biscuit oat cake soufflé oat cake sesame snaps. 
            Jelly bonbon cake chupa chups pudding. {'\n'}{'\n'}Gummies soufflé 
            marshmallow wafer candy canes sesame snaps jelly powder jelly 
            beans. Pie liquorice brownie macaroon halvah pastry cotton candy.
            Marshmallow bonbon bonbon icing tart candy sesame snaps. Chocolate bar pastry 
            muffin chocolate cake pastry. Pastry tiramisu liquorice chocolate cake macaroon 
            tootsie roll brownie jujubes. Chocolate bar macaroon danish donut gummies halvah. Liquorice cotton candy tiramisu muffin 
            cookie gingerbread pie bonbon. {'\n'}{'\n'}Lemon drops chocolate cake pudding topping icing cake jelly shortbread. Wafer tiramisu powder 
            jelly-o liquorice shortbread marshmallow jelly beans. Carrot cake fruitcake brownie gingerbread jelly beans.
            Chocolate cake bonbon toffee jelly candy brownie jujubes. Cotton candy dragée tiramisu chocolate bar candy danish lollipop 
            chocolate cake candy canes. {'\n'}{'\n'}Oat cake danish tart chupa chups marshmallow cheesecake. Lollipop muffin jujubes pie jujubes marzipan cupcake gummies. 
            Jujubes gingerbread cookie pastry brownie. Lollipop lemon drops jelly beans fruitcake macaroon.
              </Text>
              <Text style={{textAlign: 'left', paddingHorizontal: 20,fontSize: 18, fontWeight: 'bold'}}>2. Disclaimer</Text>
            <Text style={{fontSize: 14, textAlign: 'justify', paddingHorizontal: 20, lineHeight: 22, marginVertical: 10}}>Cookie donut dessert dessert bonbon. 
              Tiramisu sweet dessert icing candy canes dessert. 
              Pudding sweet chocolate cake chocolate topping sweet 
              chocolate bar cotton candy. Wafer wafer candy lemon drops 
              cheesecake gingerbread gingerbread brownie. Powder chocolate 
              shortbread chocolate pudding jelly-o jujubes chocolate bar. 
              Croissant lollipop powder cupcake pudding chocolate cake sweet 
              roll ice cream. Brownie tiramisu 
              cotton candy chocolate cake jelly beans marzipan pie.</Text>
              <Text style={{textAlign: 'left', paddingHorizontal: 20,fontSize: 18, fontWeight: 'bold'}}>1. Disclaimer</Text>
            <Text style={{fontSize: 14, textAlign: 'justify', paddingHorizontal: 20, lineHeight: 22, marginVertical: 10}}>Cookie donut dessert dessert bonbon. 
              Tiramisu sweet dessert icing candy canes dessert. 
              Pudding sweet chocolate cake chocolate topping sweet 
              chocolate bar cotton candy. Wafer wafer candy lemon drops 
              cheesecake gingerbread gingerbread brownie. Powder chocolate 
              shortbread chocolate pudding jelly-o jujubes chocolate bar. 
              Croissant lollipop powder cupcake pudding chocolate cake sweet 
              roll ice cream. Brownie tiramisu 
              cotton candy chocolate cake jelly beans marzipan pie.</Text>
          </ScrollView>
          <View style={{width: '100%', height: 60, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={toggleModal} style={{backgroundColor: Color.primary, width: '95%', height: 42, borderRadius: 20, justifyContent: 'center'}}>
              <Text style={{fontSize: 12, fontWeight: 'bold', color: Color.textInput}}>Saya Setuju</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
            {/* End Modal */}
    </Scaffold>
  )
}

export default CreateShop