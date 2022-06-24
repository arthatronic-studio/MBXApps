import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import Banner from 'src/components/Banner';
import {useColor} from '@src/components';
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
  const {title, userProfileId} = route.params;
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
        }}>
        <AntDesign
          onPress={() => navigation.goBack()}
          name={'arrowleft'}
          size={20}
          style={{marginHorizontal: 12}}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('SearchArticle')}
          style={{width: '70%', height: '80%', justifyContent: 'center'}}>
          <TextInput
            editable={false}
            placeholder="Cari berita hari ini . . ."
            style={{
              width: '100%',
              height: '80%',
              backgroundColor: Color.theme,
              fontSize: 12,
              borderRadius: 6,
              paddingHorizontal: 10,
            }}></TextInput>
          <AntDesign
            size={14}
            name={'search1'}
            style={{
              position: 'absolute',
              color: Color.secondary,
              alignSelf: 'flex-end',
              right: 10,
            }}
          />
        </TouchableOpacity>
        <IonIcons
          onPress={() => navigation.navigate('Saved')}
          name={'md-bookmarks-outline'}
          size={18}
          style={{marginHorizontal: 12}}
        />
        <IonIcons
          onPress={() =>
            navigation.navigate('CreateNews', {
              title,
              productType: Config.INITIAL_CODE,
              productCategory: 'ARTIKEL',
            })
          }
          name={'add'}
          size={24}
        />
      </View>
    );
  };

  return (
    <Scaffold header={<ArticleHeader />} style={{ marginBottom: 32 }}>
      <ListContentProductV2
        userProfileId={userProfileId}
        productCategory="ARTIKEL"
        name={title}
      />
    </Scaffold>
  );
};

export default ShowAllNews;
