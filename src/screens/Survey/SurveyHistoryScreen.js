import React, { useState, useEffect } from 'react';
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
import Config from 'react-native-config';

import CarouselView from 'src/components/CarouselView';
import {
  Text,
  TouchableOpacity,
  useColor,
  Scaffold,
  useLoading,
} from '@src/components';
import { shadowStyle } from '@src/styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Popup, { usePopup } from '@src/components/Modal/Popup';
import Client from '@src/lib/apollo';
import { queryJoinCommunityManage } from '@src/lib/query/joinCommunityManage';
import { Container, Divider, Row } from 'src/styled';
import { accessClient } from 'src/utils/access_client';
import { getSizeByRatio } from 'src/utils/get_ratio';
import { joinCommunityMember } from 'src/lib/query/joinCommunityMember';
import { useSelector } from 'react-redux';
import CircularProgress from 'src/components/CircularProgress';
import moment from 'moment';
import { useIsFocused, useRoute } from '@react-navigation/native';

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

const SurveyHistoryScreen = ({ navigation, route }) => {
  const user = useSelector(state => state['user.auth'].login.user);
  const { width, height } = useWindowDimensions();
  const { Color } = useColor();
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

  useEffect(() => {
    fetchSurvey();
  }, [isFocused]);

  const fetchSurvey = async () => {
    showLoading();

    const dataq = {
      user_id: user.userId
    };

    console.log(dataq, 'dataq');

    const PostsURL = `${Config.SURVEY_API_URL}/get-surveys?user_id=${dataq.user_id}`;

    try {
      const res = await axios.get(PostsURL);

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
      console.log(error, 'error apicall');

      setList({
        ...list,
        loading: false,
        message: '',
      });
    }
  };

  const renderItem = ({ item, index }) => (
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

  console.log('aaaa', list);

  return (
    <Scaffold
      headerTitle="Survey History"
      fallback={loading}
      popupProps={popupProps}
      loadingProps={loadingProps}
      empty={!loading && list.data.length === 0}
    >
      <View
        style={{
          marginTop: 16,
          marginHorizontal: 16,
        }}
      >
        <FlatList
          keyExtractor={(item, index) => item.id + index.toString()}
          data={list.data}
          renderItem={renderItem}
        />
      </View>
    </Scaffold>
  );
};

export default SurveyHistoryScreen;