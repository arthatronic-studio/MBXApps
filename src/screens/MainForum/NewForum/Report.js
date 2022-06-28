import React, {useState, useEffect, useRef} from 'react';
import {View, Image, ScrollView,FlatList,Row} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';

import {useLoading, usePopup, useColor} from '@src/components';
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

const Report = ({navigation, route}) => {
  const {item} = route.params;
  const modalOptionsRef = useRef();

  const user = useSelector(state => state['user.auth'].login.user);

  

  const [isSelected, setSelected] = useState(true);

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
   const renderItem = ({ item }) => (
    <View>
        <View style={{flexDirection:'row'}}>
          <View style={{marginLeft:16,borderRadius:50,marginVertical:10}}>
          <TouchableOpacity
                                
                                onPress={() => {
                                 navigation.navigate('ForumReportDetail',{});
                                }}
                                style={{ paddingRight: 16, marginBottom: 8 }}
                            >
                               
                            <View
                                style={{ height: 20, width: 20, borderRadius: 15, backgroundColor: Color.primary, justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        {/* {item.setSelected && <View style={{ height: 14, width: 14, borderRadius: 7, backgroundColor: Color.textInput }} />} */}
                                  <View style={{ height: 14, width: 14, borderRadius: 7, backgroundColor: Color.textInput }} />
                                  </View>
                            </TouchableOpacity>
          </View>
        <View>
          <Text style={{textAlign:'left'}} type="bold">{item.title}</Text>
          <Text style={{textAlign:'left'}}>{item.sub !== 'Lainya' ? item.sub : ''}</Text>
        </View>
        </View>
      </View>

  );

  return (
    <Scaffold
      fallback={false}
      empty={false}
      popupProps={popupProps}
      iconRightButton={<Feather name='more-vertical' size={20} color={Color.text} />}
      onPressRightButton={() => {
        modalOptionsRef.current.open();
      }}
      loadingProps={loadingProps}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
       <View style={{marginHorizontal:16,marginVertical:10, flexDirection:'row'}}>
      <Text size={14}type="bold">Pilih alasan report</Text>
       </View>
     
       <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

        
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

export default Report;