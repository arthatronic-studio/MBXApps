import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  onRefresh,
  RefreshControl,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import Banner from 'src/components/Banner';
import {useColor} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import {queryBannerList} from 'src/lib/query/banner';
import {Row, Divider} from 'src/styled';
import {accessClient} from 'src/utils/access_client';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons';
import client from 'src/lib/apollo';
import HighlightContentProductV2 from 'src/components/Content/HighlightContentProductV2';
import moment from 'moment';

const NewsScreenV2 = ({navigation, route}) => {
  const {title, userProfileId} = route.params;

  const user = useSelector(state => state['user.auth'].login.user);
  const {Color} = useColor();
  const isFocused = useIsFocused();

  const [loadingBanner, setLoadingBanner] = useState(true);
  const [listBanner, setListBanner] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const colorOutputRange = [Color[accessClient.ColorBgParallax], Color.theme];
  let canGeneratedContent = accessClient.UserGeneratedContent === 'ALL_USER';
  if (
    accessClient.UserGeneratedContent === 'ONLY_ADMIN' &&
    user &&
    user.isDirector === 1
  )
    canGeneratedContent = true;
  else if (
    accessClient.UserGeneratedContent === 'ONLY_MEMBER' &&
    user &&
    user.organizationId
  )
    canGeneratedContent = true;

  useEffect(() => {
    fetchBannerList();
    onRefresh();
  }, [isFocused]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const fetchBannerList = () => {
    const variables = {
      categoryId: 7,
    };

    client
      .query({
        query: queryBannerList,
        variables,
      })
      .then(res => {
        console.log('res banner list', res);
        setListBanner(res.data.bannerList);
        setLoadingBanner(false);
      })
      .catch(err => {
        console.log(err, 'err banner list');
        setLoadingBanner(false);
      });
  };

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
        <AntDesign
          onPress={() => navigation.goBack()}
          name={'arrowleft'}
          size={20}
          style={{marginRight: 12}}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('SearchArticle')}
          style={{flex: 1, height: '80%', justifyContent: 'center'}}>
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
        {canGeneratedContent && <IonIcons
          onPress={() => navigation.navigate('Saved')}
          name={'md-bookmarks-outline'}
          size={18}
          style={{marginHorizontal: 12}}
        />}
        {canGeneratedContent && <IonIcons
          onPress={() =>
            navigation.navigate('CreateNews', {
              title,
              productType: Config.INITIAL_CODE,
              productCategory: 'ARTIKEL',
            })
          }
          name={'add'}
          size={24}
        />}
      </View>
    );
  };

  return (
    <Scaffold
      header={<ArticleHeader />}
      translucent
      useSafeArea={false}
      statusBarColor={Color.primarySoft}
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <Divider />
        <Banner data={listBanner} showHeader={false} loading={loadingBanner} forArticle={true} leftIndicator/>
        <Divider height={15} />
        <HighlightContentProductV2
          productCategory="ARTIKEL"
          name="Artikel"
          title="Artikel Terbaru"
          nav="ShowAllNews"
          refresh={refreshing}
          timeStart={moment().subtract(7,'d').format('YYYY-MM-DD')}
          showSeeAllText={true}
          showEmpty={true}
        />
        <HighlightContentProductV2
            productCategory='ARTIKEL'
            name='Artikel'
            title='Artikel Terfavorit'
            nav='ShowAllNews'
            refresh={refreshing}
            orderBy="like"
            showSeeAllText={true}
            showEmpty={true}
          />
        <HighlightContentProductV2
            productCategory='ARTIKEL'
            name='Artikel'
            title='Semua Artikel'
            nav='ShowAllNews'
            refresh={refreshing}
            showSeeAllText={true}
            showEmpty={true}
          />
      </ScrollView>
    </Scaffold>
  );
};

export default NewsScreenV2;
