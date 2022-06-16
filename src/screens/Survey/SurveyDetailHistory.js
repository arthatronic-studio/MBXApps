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

const SurveyDetailHistory = ({navigation, route}) => {
  const { listHeader, valueContent } = route.params;
      const {params} = route;
      console.log('ini param', params);

  const user = useSelector(state => state['user.auth'].login.user);
  const {width, height} = useWindowDimensions();
  const {Color} = useColor();
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();

  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [listDataDetail, setListDataDetail] = useState([]);
  const [useSurveyFile, setUseSurveyFile] = useState(false);
  const isFocused = useIsFocused();
  
  console.log('listDataDetail', listDataDetail);
  const [list, setList] = useState({
    data: [],
    loading: false,
    message: 'error',
  });

  useEffect(() => {
    fetchSurvey();
  }, [isFocused]);

  const fetchSurvey = async () => {
    // params

    let data = [];

    const dataq = {
      user_id: user.userId,
      survey_id: params.surveyId,
      with_detail : 1
    };

    console.log(dataq, 'dataq');

    const PostsURL = `http://panel.survey.tribesocial.id/get-surveys?user_id=${dataq.user_id}&survey_id=${dataq.survey_id}&with_detail=${dataq.with_detail}`;
    console.log('PostsURL', PostsURL);


    axios.get(PostsURL).then(res => {
      try {
        setListData(res.data);
        setListDataDetail(res.data[0].details);
        showLoading();
        const data = res.data;
        console.log('ini Data', data);
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
  const renderUpload = (item, index) => {
    let arr = JSON.parse( item.value);
    console.log('arr', arr);
    return (
      <View key={index}>
        <Container paddingHorizontal={16}>
          <Text size={10} align="left" style={{marginBottom: 8}}>
            {item.label}
          </Text>
        </Container>
        <Text size={14} align="left" fontWeight="bold" style={{marginBottom: 2}}>
          {item.name}
        </Text>
        {arr.length != 0 && (
          <Row style={{flexWrap: 'wrap', flex: 1}}>
            {arr.map((val, id) => (
              <View
                key={id}
                style={{
                  borderWidth: 1,
                  borderColor: Color.border,
                  width: width / 2 - 40,
                  aspectRatio: 1,
                  justifyContent: 'center',

                  alignItems: 'center',
                  marginHorizontal: 20,
                  marginVertical: 5,
                }}>
                <Image
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  source={{uri: val.url}}
                />
              </View>
            ))}
          </Row>
        )}
      </View>
    );
    
     
   };
  return (
    <Scaffold
      headerTitle="Detail Survey History"
      fallback={loading}
      popupProps={popupProps}
      loadingProps={loadingProps}>
      <ScrollView>
        {listData.map(item => (
          <Container paddingHorizontal={16} paddingVertical={12}>
            <TouchableOpacity
              style={{
                paddingVertical: 16,
                borderRadius: 6,
                backgroundColor: Color.textInput,
                paddingLeft: 12,
                marginBottom: 13,
                ...shadowStyle,
              }}>
              <Text size={12} align="left" type="bold">
                Code Survey : {item.code_survey}
              </Text>
            </TouchableOpacity>
          </Container>
        ))}
        {listDataDetail.map((item, index) => (
          <Container key={index} paddingHorizontal={16} paddingVertical={12}>
            {item.type !== 'UPLOAD_IMAGE' ? (
              <TouchableOpacity
                style={{
                  paddingVertical: 16,
                  borderRadius: 6,
                  backgroundColor: Color.textInput,
                  paddingLeft: 12,
                  marginBottom: 13,
                  ...shadowStyle,
                }}>
                <Text size={12} align="left" type="bold">
                  {item.name} : {item.value}
                </Text>
              </TouchableOpacity>
            ) : (
               renderUpload(item, index)
            )}
          </Container>
        ))}
      </ScrollView>
    </Scaffold>
  );
};

export default SurveyDetailHistory;
