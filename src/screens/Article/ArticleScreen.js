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
import HighlightArticle from './HighlightArticle';
import ListTenantItem from 'src/screens/Tenant/ListTenantItem';
import ListArticle from './ListArticle';

const ArticleScreen = ({navigation, route}) => {
  const {Color} = useColor();
  const {height, width} = useWindowDimensions();

  return (
    <Scaffold
      translucent={Platform.OS === 'ios' ? true : false}
      useSafeArea={Platform.OS === 'ios' ? false : true}>
      <ListArticle
        tenantType="shop"
        productCategory="SHOP"
        name="Toko"
        title="ALL ARTICLES"
        // nav='EatScreen'
        // refresh={refreshing || isFocused}
        showHeader={true}
        style={{
          paddingBottom: height / 7,
        }}
        ListHeaderComponent={
          <>
            <HighlightArticle
              title="● HIGHLIGHT ARTICLE"
              numColumns={1}
              type="HIGHLIGHT"
              showSeeAllText={false}
              style={{ paddingHorizontal: 0 }}
            />
            <Divider height={18}/>
            <View
              style={{ 
                borderColor: Color.black,
                borderWidth: 1,
                marginHorizontal: 8,
                justifyContent: 'center',
                paddingHorizontal: 16,
                height: width * 0.4
               }}
            >
              <Text align="center" size={18} type="semibold" lineHeight={20.4} color={Color.black}>
                Interested in contributing your writing to the larger community?
              </Text>
            </View>
            <Divider height={16}/>
          </>
        }
      />
    </Scaffold>
  );
};

export default ArticleScreen;
