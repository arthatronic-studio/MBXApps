import React, {useState, useEffect, useRef} from 'react';
import {View, Image, ScrollView,FlatList,Row,TextInput,Animated,Keyboard} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import { ModalUnlock } from 'src/components';
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
import FormInput from 'src/components/FormInput';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import { ModalListText } from 'src/components';
import {
  
  iconsmile,
  icongif,
  icongalery,
  icontext,
  iconcameravidio,
  iconListNumbers,
  iconTextAlignCenter,
  iconTextAlignJustify,
  iconTextBolder,
  iconTextItalic,
  iconTextStrikethrough,
  iconTextUnderline,
  
} from '@assets/images/home';
const ForumBuatDetailScreen = ({navigation, route}) => {
  const {item} = route.params;
  const modalOptionsRef = useRef();
  const modalUnlockRef = useRef();
  const user = useSelector(state => state['user.auth'].login.user);
  const [showSection, setShowSection] = useState(true);
  const [textIsi, setTextisi] = useState('');
  const [showfeature, setShowFeature] = useState(true);
  const modalListTextckRef = useRef();

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading] = useLoading();
  const [disabled, setDisabled] = useState(true);
  const {Color} = useColor();

 const onValueText = (e) => {
      
        
        if (e === ''  ) {
            setDisabled(true);
        }else{
            setDisabled(false);
        }
       
    }

    const onSubmit = () => {
      Keyboard.dismiss();

      showLoading('success', 'Thread berhasil dibuat!');

      setTimeout(() => {
       
          navigation.navigate('ForumGroupScreen', { });
          // navigation.popToTop();
      }, 2500);
  }
   
  
    const renderPopUpNavigation = () => {
      return (
        <Animated.View
          style={[
            {position: 'absolute', bottom: 300, height: 36, width: '100%',  justifyContent: 'space-evenly', paddingHorizontal: 16},
          ]}
        >
       <View style={{flexDirection:'row',justifyContent:'space-between'}}>
  
       
         <TouchableOpacity>
            <Image
                                          style={{ height:30, width: 30,marginTop:9 }}
                                          source={icongalery}/>
         </TouchableOpacity>
  
         <TouchableOpacity>
            <Image
                                          style={{ height: 45, width: 35 }}
                                          source={iconcameravidio}/>
         </TouchableOpacity>
         <TouchableOpacity>
            <Image
                                          style={{ height: 45, width: 25 }}
                                          source={iconsmile}/>
         </TouchableOpacity>
         <TouchableOpacity>
            <Image
                                          style={{ height: 45, width: 25 }}
                                          source={icongif}/>
         </TouchableOpacity>
         <TouchableOpacity onPress={()=>{
          
             Keyboard.dismiss();
          modalListTextckRef.current.open();
  
        }} >
            <Image
                                          style={{ height: 45, width: 25 }}
                                          source={icontext}/>
         </TouchableOpacity>
        
       </View>
        </Animated.View>
      )
    }


  return (
    <Scaffold
    loadingProps={loadingProps}
    header={
      <Header
        title='Buat Posting'
        centerTitle={false}
        actions={
          <Submit
          buttonLabel='Posting'
          buttonColor={disabled ? Color.grayLight: Color.primary}
          disabled={disabled}
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
      <Divider />

      <View style={{ width: '100%', borderRadius: 4, borderColor: Color.border,borderWidth:0, justifyContent: 'center' }}>
                    <TextInput
                        placeholder='Tulis pendapatmu...'
                        placeholderTextColor={Color.border}
                        autoFocus={true}
                        style={{ fontWeight:'medium', fontSize: 12, fontFamily: 'Inter-Regular', color: Color.text, marginTop: 8, marginBottom: 500, paddingLeft: 16, paddingRight: 40 }}
                        value={textIsi}
                        multiline
                        onChangeText={(e) => { setTextisi(e);onValueText(e) } }
                    />

                 
                </View>

                {showfeature ? (
              renderPopUpNavigation()
            ) : (
              <Text></Text>
            )}

                
<ModalListText
          onClose={() => setShowSection(!showSection)}
          ref={modalListTextckRef}
          data={[
            // hide options chat
            {
              id: 0,
              name: 'Hurub Tebal',
              color: Color.text,
              image: iconTextBolder,
              onPress: () => {
                navigation.navigate('ForumGroupScreen')
                showLoading('wait', 'Permintaan kamu sedang di tinjau oleh moderator');
                setShowSection(!showSection);
               
              },
            },
            {
              id: 1,
              name: 'Italic',
              image: iconTextItalic,
              color: Color.text,
              onPress: () => {
                navigation.navigate('ForumGroupScreen')
                showLoading('wait', 'Permintaan kamu sedang di tinjau oleh moderator');
                setShowSection(!showSection);
               
              },
            },
            {
              id: 2,
              name: 'Underline',
              color: Color.text,
              image: iconTextUnderline,
              onPress: () => {
                navigation.navigate('ForumGroupScreen')
                showLoading('wait', 'Permintaan kamu sedang di tinjau oleh moderator');
                setShowSection(!showSection);
               
              },
            },
            {
              id: 3,
              name: 'Strikethrough',
              color: Color.text,
              image: iconTextStrikethrough,
              onPress: () => {
                navigation.navigate('ForumGroupScreen')
                showLoading('wait', 'Permintaan kamu sedang di tinjau oleh moderator');
                setShowSection(!showSection);
               
              },
            },
            {
              id: 4,
              name: 'Justify',
              color: Color.text,
              image: iconTextAlignJustify,
              onPress: () => {
                navigation.navigate('ForumGroupScreen')
                showLoading('wait', 'Permintaan kamu sedang di tinjau oleh moderator');
                setShowSection(!showSection);
               
              },
            },
            {
              id: 5,
              name: 'Center',
              color: Color.text,
              image: iconTextAlignCenter,
              onPress: () => {
                navigation.navigate('ForumGroupScreen')
                showLoading('wait', 'Permintaan kamu sedang di tinjau oleh moderator');
                setShowSection(!showSection);
               
              },
            },
            {
              id: 6,
              name: 'List',
              color: Color.text,
              image: iconListNumbers,
              onPress: () => {
                navigation.navigate('ForumGroupScreen')
                showLoading('wait', 'Permintaan kamu sedang di tinjau oleh moderator');
                setShowSection(!showSection);
               
              },
            },
            
          ]}
        />
                

    </Scaffold>
  );
};

export default ForumBuatDetailScreen;