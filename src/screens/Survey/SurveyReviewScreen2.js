import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Image,
  ScrollView,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import Styled from 'styled-components';
import RNSimpleCrypto from 'react-native-simple-crypto';
import axios from 'axios';

import CarouselView from 'src/components/CarouselView';
import {
  Text,
  TouchableOpacity,
  useColor,
  Scaffold,
  Alert,
  Button,
  useLoading,
} from '@src/components';
import {shadowStyle} from '@src/styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Popup, {usePopup} from '@src/components/Modal/Popup';

import Client from '@src/lib/apollo';
import {queryJoinCommunityManage} from '@src/lib/query/joinCommunityManage';
import {Container, Divider, Row} from 'src/styled';
import {accessClient} from 'src/utils/access_client';
import {getSizeByRatio} from 'src/utils/get_ratio';
import {joinCommunityMember} from 'src/lib/query/joinCommunityMember';
import {useSelector} from 'react-redux';
import CircularProgress from 'src/components/CircularProgress';
import moment from 'moment';
import {useIsFocused, useRoute} from '@react-navigation/native';
const EmailRoundedView = Styled(View)`
  width: 100%;
  alignItems: flex-start;
  justifyContent: center;
  flexDirection: column;
  padding: 6px 0px;
`;

const FieldView = Styled(View)`
  width: 100%;
  alignItems: flex-start;
`;

const LabelInput = Styled(View)`
  width: 100%;
  justifyContent: flex-start;
  alignItems: flex-start;
  paddingTop: 4px;
`;

const SurveyReviewScreen2 = ({navigation, route}) => {
 

  const user = useSelector(state => state['user.auth'].login.user);
  const {width, height} = useWindowDimensions();
  const {Color} = useColor();
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();

  const [loading, setLoading] = useState(false);
  const [useSurveyFile, setUseSurveyFile] = useState(false);
    const isFocused = useIsFocused();
  const [list, setList] = useState({
    data: [],
    loading: false,
    message: 'error',
  });

  console.log('ini list', list.data);


  useEffect(() => {
    fetchSurvey();
  }, [isFocused]);


  const fetchSurvey = async () => {
    let data = [];

    const dataq = {
      user_id : user.userId
    };

    console.log(dataq, 'dataq');
    
      const PostsURL = `http://panel.survey.tribesocial.id/get-surveys?user_id=${dataq.user_id}`;
    
      axios.get(PostsURL).then(res => {
          
        try {
           showLoading();
           const data = res.data.data;
          
        let newData = [];
        if (data) {
          newData = data;
        }

        setList({
          ...list,
          data: newData,
          loading: false,
          message: '',
        });
          
          hideLoading();
        } catch (error) {
          hideLoading();
          alert('Gagal Mengambil  survey, silakan coba kembali');
          console.log(error, 'error apicall');
           
           setList({
             ...list,
             loading: false,
             message: '',
           });
        }
        
      });
   
    
  
  };
const renderItem = ({item, index}) => (
  <View
    style={{
      marginBottom: 12,
    }}>
    <TouchableOpacity
      onPress={() => {
        // setmodalWebView(true);
        // setcontent(item.page_content);
        navigation.navigate('SurveyDetailHistory', {
          surveyId: item.id,
        });
      }}
      style={{
        paddingVertical: 16,
        borderRadius: 6,
        backgroundColor: Color.textInput,
        paddingLeft: 12,
        ...shadowStyle,
      }}>
      <Text size={12} align="left" type="bold">
        Survey {item.survey_date} 
      </Text>
    </TouchableOpacity>
  </View>
);
  return (
    <Scaffold
      headerTitle="Survey History"
      fallback={loading}
      popupProps={popupProps}
      loadingProps={loadingProps}>
      <ScrollView>
        <View
          style={{
            flex: 1,
            marginTop: 20,
            marginHorizontal: 10,
          }}>
          {list.data  ?
            <FlatList
            data={list.data}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id + index.toString()}
            contentContainerStyle={{
              paddingHorizontal: 8,
              paddingVertical: 8,
            }}
            />
            :
            <Text>Data Masih Kosong</Text>
          }
          
        </View>
      </ScrollView>
    </Scaffold>
  );
};

export default SurveyReviewScreen2;
