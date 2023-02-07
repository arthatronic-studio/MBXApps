import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  onRefresh,
  RefreshControl,
  Platform,
  useWindowDimensions,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import Banner from 'src/components/Banner';
import {useColor, Text} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import {queryBannerList} from 'src/lib/query/banner';
import {Row, Divider} from 'src/styled';
import {accessClient} from 'src/utils/access_client';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons';
import client from 'src/lib/apollo';
import HighlightContentProductV2 from 'src/components/Content/HighlightContentProductV2';
import moment from 'moment';
import {useCurrentUser} from 'src/hooks/useCanGenerateContent';
import HighlightPicuWujudkan from './HighlightPicuWujudkan';
import BannerPicuWujudkan from './BannerPicuWujudkan';
// import ListTenantItem from 'src/screens/Tenant/ListTenantItem';
// import ListArticle from './ListArticle';

const PicuWujudkanScreen = ({navigation, route}) => {
  const {Color} = useColor();
  const {height, width} = useWindowDimensions();

  return (
    <Scaffold
      translucent={Platform.OS === 'ios' ? true : false}
      useSafeArea={Platform.OS === 'ios' ? false : true}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <HighlightPicuWujudkan
          title="● SEMARAK"
          showSeeAllText={true}
          type="OTHER"
          numColumns={1}
          contentType="all"
          contentName="SEMARAK"
          category="semarak"
        />
        <HighlightPicuWujudkan
          title="● GERAK"
          showSeeAllText={true}
          type="OTHER"
          numColumns={1}
          contentType="all"
          contentName="GERAK"
          category="gerak"
        /> */}
        <BannerPicuWujudkan
          title="● SEMARAK"
          showSeeAllText={true}
          type="OTHER"
          numColumns={1}
          contentType="all"
          contentName="SEMARAK"
          category="semarak"
        />
        <BannerPicuWujudkan
          title="● GERAK"
          showSeeAllText={true}
          type="OTHER"
          numColumns={1}
          contentType="all"
          contentName="GERAK"
          category="gerak"
        />
        <BannerPicuWujudkan
          title="● DAMPAK"
          showSeeAllText={true}
          type="OTHER"
          numColumns={1}
          contentType="all"
          contentName="DAMPAK"
          category="dampak"
        />
        <BannerPicuWujudkan
          title="● RUANG IDE"
          showSeeAllText={true}
          type="OTHER"
          numColumns={1}
          contentType="all"
          contentName="RUANG IDE"
          category="ruang_ide"
        />
        {/* <HighlightPicuWujudkan
          title="● DAMPAK"
          showSeeAllText={true}
          type="OTHER"
          numColumns={1}
          contentType="all"
          contentName="DAMPAK"
          category="dampak"
        />
        <HighlightPicuWujudkan
          title="● RUANG IDE"
          showSeeAllText={true}
          type="OTHER"
          numColumns={1}
          contentType="all"
          contentName="RUANG IDE"
          category="ruang_ide"
        /> */}
      </ScrollView>
    </Scaffold>
  );
};

export default PicuWujudkanScreen;
