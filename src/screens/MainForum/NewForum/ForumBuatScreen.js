import React, {useState, useEffect, useRef} from 'react';
import {View, Image, ScrollView,FlatList,Row,TextInput,Animated} from 'react-native';
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
const ForumBuatScreen = ({navigation, route}) => {
  const {item} = route.params;
  const modalOptionsRef = useRef();
  const modalUnlockRef = useRef();
  const user = useSelector(state => state['user.auth'].login.user);
  const [showSection, setShowSection] = useState(true);
  const [textJudul, setTextJudul] = useState('');



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
   
  
  const renderPopUpNavigation = () => {
    return (
      <Animated.View
        style={[
          {position: 'absolute', bottom: 20, height: 36, width: '100%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16},
        ]}
      >
        <View style={{width: '100%', height: 43, backgroundColor: Color.primary, borderRadius: 24, alignItems: 'center', justifyContent: 'center',
            shadowColor: "#00000029",
            shadowOffset: { width: 0, height: 2, },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            
          }}
        >
              <Submit
                buttonLabel='Lanjut'
                buttonColor={disabled ? Color.grayLight: Color.primary}
                disabled={disabled}
                type='bottomSingleButton'
                buttonBorderTopWidth={0.5}
                onPress={() => {
                    navigation.navigate('ForumBuatDetailScreen',{});
                }}
            />
        </View>
      </Animated.View>
    )
  }


  return (
    <Scaffold
    header={
      <Header
        title='Buat Posting'
        centerTitle={false}
        
      />
    }
    >
      <Divider />

                    <Container paddingHorizontal={16} marginBottom={12}>
                <FormInput
                    label="Judul Posting"
                    placeholder="Masukan Judul Posting"
                    hideErrorHint
                    value={textJudul}
                    // onChangeText={(e) => setTextComment(e)}
                    onChangeText={(e) => { setTextJudul(e);onValueText(e) } }
                    multiline={false}
                />
            </Container>

 {renderPopUpNavigation()}

                

    </Scaffold>
  );
};

export default ForumBuatScreen;