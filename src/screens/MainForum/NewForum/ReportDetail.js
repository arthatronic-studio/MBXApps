import React, {useState, useEffect, useRef} from 'react';
import {View, Image, ScrollView,FlatList,Row,TextInput,Keyboard} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';

import {useLoading, usePopup, useColor,Header,Submit} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import {Container, Divider} from '@src/styled';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {iconWarning, iconHeart, iconShare, iconBookmarks} from '@assets/images/home';
import { useSelector } from 'react-redux';
import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';

import { analyticMethods, GALogEvent } from 'src/utils/analytics';

const ReportDetail = ({navigation, route}) => {
  const {item} = route.params;
  const modalOptionsRef = useRef();

  const user = useSelector(state => state['user.auth'].login.user);
  const [textIsi, setTextisi] = useState('');
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading] = useLoading();

  const {Color} = useColor();

  // useEffect(() => {
    //     const timeout = trigger ? setTimeout(() => {
    //         fetchAddLike();
    //     }, 500) : null;

    //     return () => {
    //         clearTimeout(timeout);
    //     }
    // }, [trigger]);

   
  console.log('user', item);
  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'Pelecehan',
      sub: 'Memalukan penghinaan terhadap seseorang atau individu'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Spam',
      sub:'Melakukan penjualan barang ilegal, penipuan, dll'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Rasisme',
      sub:'Melakukan penghinaan terhadap kerpercayaan sebuah individu atau kelompok'
    },
    {
      id: '58694a0f-3da1-4701f-bd96-145571e29d72',
      title: 'Lainya',
    },
  ];
  const onSubmit = () => {
    Keyboard.dismiss();

    showLoading('success', 'Laporan berhasil dibuat!');

    setTimeout(() => {
     
        navigation.navigate('ForumGroupScreen', { });
        // navigation.popToTop();
    }, 2500);
}

  return (
    <Scaffold
      fallback={false}
      empty={false}
      popupProps={popupProps}
      
      loadingProps={loadingProps}
      header={
        <Header
          title='Buat Posting'
          centerTitle={false}
          actions={
            <Submit
            buttonLabel='Posting'
            buttonColor={  Color.primary}
            disabled={false}
           style={{width:120,marginTop:10}}
            type='bottomSingleButton'
            buttonBorderTopWidth={0.5}
            onPress={() => {
              // showLoading('success', 'Thread berhasil dibuat!');
            
              onSubmit();
            }}
        />
          }
          
        />
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
       <View style={{marginHorizontal:16,marginVertical:10, flexDirection:'row'}}>
      <Text size={14}type="bold">Pilih alasan report</Text>
       </View>
     
        <View style={{marginHorizontal:16}}>
          <Text style={{textAlign:'left'}} type="bold">Rasisme</Text>
          <Text style={{textAlign:'left',color:Color.grayLight}}>Melakukan penghinaan terhadap kerpercayaan sebuah individu atau kelompok</Text>
        </View>
        <View style={{ marginVertical:17, borderRadius: 4, borderColor: Color.border,borderWidth:1,marginHorizontal: 17 }}>
                    <TextInput
                        placeholder='Opsional : Jelaskan laporan ini'
                        placeholderTextColor={Color.border}
                        autoFocus={true}
                        style={{ fontWeight:'medium', fontSize: 12, fontFamily: 'Inter-Regular', color: Color.text, marginTop: 8, marginBottom: 50, paddingLeft: 16, paddingRight: 40 }}
                        value={textIsi}
                        multiline
                        onChangeText={(e) => { setTextisi(e) } }
                    />

                 
                </View>
        
        <Divider />
      </ScrollView>
      <ModalContentOptions
        ref={modalOptionsRef}
        // isOwner={user && user.userId === item.ownerId}
        item={item}
      />
    </Scaffold>
  );
};

export default ReportDetail;