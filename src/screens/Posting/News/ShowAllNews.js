import React, {useEffect, useState} from 'react';
import {View, TextInput, ScrollView, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import Banner from 'src/components/Banner';
import {useColor, Text} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import {queryBannerList} from 'src/lib/query/banner';
import {Row, Divider} from 'src/styled';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons';
import client from 'src/lib/apollo';
import HighlightContentProductV2 from 'src/components/Content/HighlightContentProductV2';
import {fetchContentProduct, fetchContentUserProduct} from 'src/api/contentV2';
import ListContentProductV2 from 'src/components/Content/ListContentProductV2';

const ShowAllNews = ({navigation, route}) => {
  const {title, userProfileId, orderBy, timeStart, tag} = route.params;
  const user = useSelector(state => state['user.auth'].login.user);
  const {Color} = useColor();

  const ArticleHeader = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: Color.primarySoft,
          width: '100%',
          height: 60,
          flexDirection: 'row',
          paddingHorizontal: 16,
        }}>
        <View style={{width: '10%'}}>
          <AntDesign
            onPress={() => navigation.goBack()}
            name={'arrowleft'}
            size={20}
          />
        </View>
        <View style={{width: '80%', alignItems: 'center'}}>
          <Text
            align="center"
            type="bold"
            size={16}
            letterSpacing={0.23}
            color={Color.text}>
            {title}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Scaffold header={<ArticleHeader />} style={{marginBottom: 32}}>
      <ListContentProductV2
        userProfileId={userProfileId}
        productCategory="ARTIKEL"
        name={title}
        orderBy={orderBy}
        timeStart={timeStart}
        tag={tag}
      />
    </Scaffold>
  );
};

export default ShowAllNews;
