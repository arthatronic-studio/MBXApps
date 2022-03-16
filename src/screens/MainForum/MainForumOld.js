import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, SafeAreaView } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Text,
  // TouchableOpacity,
  Loading, useLoading,
  HeaderBig,
  useColor
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const ContentView = Styled(View)`
    width: 100%;
    marginTop: 16px;
    paddingHorizontal: 16px;
`;

const MainMenuView = Styled(View)`
    width: 100%;
    borderRadius: 8px;
    marginTop: 12px;
    padding: 20px 0px;
    flexDirection: row;
    flexWrap: wrap;
`;

const PerUserIcons = Styled(TouchableOpacity)`
    width: 33.33%;
    aspectRatio: 1.3;
    flexDirection: column;
    paddingHorizontal: 8px;
`;

const UserIcon = Styled(View)`
    height: 100%;
    justifyContent: center;
    alignItems: center;
`;

const paramsDiscussion = {
  title: 'Diskusi',
  componentType: 'GRID',
  productType: "PODDIUM_FORUM",
  productCategory: '',
  productSubCategory: 'FORUM_DISCUSSION',
};

const paramsGroupReader = {
  title: 'Grup Baca',
  componentType: 'LIST',
  productType: "PODDIUM_FORUM",
  productCategory: '',
  productSubCategory: 'FORUM_GROUP_READER',
};

const paramsQuotes = {
  title: 'Quotes',
  componentType: 'GRID',
  productType: "PODDIUM_FORUM",
  productCategory: '',
  productSubCategory: 'FORUM_QUOTES',
};

const MainForumOld = ({ navigation, route }) => {
  // state
  const [listMostDiscussion, setListMostDiscussion] = useState([]);
  const [listGroupReader, setListGroupReader] = useState([]);
  const [listFavoriteDiscussion, setListFavoriteDiscussion] = useState([]);

  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const { Color } = useColor();

  const mainMenu = [
    { id: 0, name: 'Group Baca', images: <MaterialIcons name='group' color={Color.theme} size={22} />, nav: 'ForumSegmentScreen', params: paramsGroupReader },
    { id: 1, name: 'Diskusi', images: <MaterialCommunityIcons name='comment-text-multiple' color={Color.theme} size={20} />, nav: 'ForumSegmentScreen', params: paramsDiscussion },
    { id: 2, name: 'Quotes', images: <MaterialCommunityIcons name='format-quote-close-outline' color={Color.theme} size={24} />, nav: 'ForumSegmentScreen', params: paramsQuotes },
  ];
  
  useEffect(() => {
    fecthData();
  }, [route]);

  const fecthData = async() => {
    showLoading();

    const newListMostDiscussion = await fetchContentProduct('PODDIUM_FORUM', '', '');
    setListMostDiscussion(newListMostDiscussion);

    const newListGroupReader = await fetchContentProduct('PODDIUM_FORUM', '', 'FORUM_GROUP_READER');
    setListGroupReader(newListGroupReader);

    const newListFavoriteDiscussion = await fetchContentProduct('PODDIUM_FORUM', '', 'FORUM_DISCUSSION');
    setListFavoriteDiscussion(newListFavoriteDiscussion);

    hideLoading();
  }

  const fetchContentProduct = async(productType, productCategory, productSubCategory) => {
    const variables = {
      page: 0,
      itemPerPage: 6,
    };

    if (productType !== '') {
      variables.productType = productType;
    }

    if (productCategory !== '') {
      variables.productCategory = productCategory;
    }

    if (productSubCategory !== '') {
      variables.productSubCategory = productSubCategory;
    }
    
    const result = await Client.query({
      query: queryContentProduct,
      variables,
    });

    if (result && result.data && result.data.contentProduct && Array.isArray(result.data.contentProduct)) {
      return result.data.contentProduct;
    } else {
      return [];
    }
  }

  const onSelected = (item) => {
    const uri = item.videoFilename;
    const type = uri.substr(uri.length - 3);

    // if (type === 'pdf') {
    // }
    // else if (type === 'mp3') {
    // }
  }

  return (
    <MainView style={{backgroundColor: Color.theme}}>
      <HeaderBig
        title='Forum'
        style={{paddingTop: 16}}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
          <ContentView style={{backgroundColor: Color.theme}}>
            <MainMenuView
              style={{...shadowStyle, shadowOpacity: 0.02, backgroundColor: Color.border}}
            >
              {mainMenu.map((menu, idx) => {
                if (Platform.OS === 'ios' && menu.comingsoon) {
                  return null;
                }

                return (
                  <PerUserIcons
                    key={idx}
                    activeOpacity={0.75}
                    disabled={menu.comingsoon}
                    onPress={() => navigation.navigate(menu.nav, { ...menu.params })}
                  >
                    <UserIcon>
                      <View style={{width: 48, height: 48, borderRadius: 24, backgroundColor: Color.primary, justifyContent: 'center', alignItems: 'center', ...shadowStyle}}>
                          {menu.images}
                      </View>
                      <View style={{marginTop: 8}}>
                        <Text size={12} type='semibold' style={menu.comingsoon && {opacity: 0.3}}>{menu.name}</Text>
                      </View>
                    </UserIcon>
                  </PerUserIcons>
                )
              })}
            </MainMenuView>
          </ContentView>

          <View style={{height: 12}} />
          
          <ListForum
              componentType='GENERAL'
              data={listMostDiscussion}
              title='Sedang ramai didiskusikan'
              showAll
              onPressShowAll={() => {
                navigation.navigate('ShowAllFromForum', {
                  title: 'Sedang ramai didiskusikan',
                  subTitle: 'Audio Book',
                  componentType: 'GRID',
                  productType: "PODDIUM_FORUM",
                  productCategory: '',
                  productSubCategory: '',
                });
              }}
              onPress={(item) => {
                onSelected(item);
                navigation.navigate('DetailForumScreen', { item });
              }}
          />

          <ListForum
              componentType='LIST'
              data={listGroupReader}
              title='Rekomendasi Grup Baca'
              showAll
              onPressShowAll={() => {
                navigation.navigate('ShowAllFromForum', {
                  title: 'Rekomendasi Grup Baca',
                  subTitle: 'Audio Book',
                  componentType: 'LIST',
                  productType: "PODDIUM_FORUM",
                  productCategory: '',
                  productSubCategory: 'FORUM_GROUP_READER',
                });
              }}
              onPress={(item) => {
                onSelected(item);
                navigation.navigate('DetailForumScreen', { item });
              }}
          />

          <ListForum
              componentType='GRID'
              data={listFavoriteDiscussion}
              title='Dikusi Buku Favorite-mu'
              showAll={false}
              onPressShowAll={() => {
                navigation.navigate('ShowAllFromForum', {
                  title: 'Dikusi Buku Favorite-mu',
                  subTitle: 'Audio Story',
                  componentType: 'GRID',
                  productType: "PODDIUM_FORUM",
                  productCategory: '',
                  productSubCategory: 'FORUM_DISCUSSION',
                });
              }}
              onPress={(item) => {
                onSelected(item);
                navigation.navigate('DetailForumScreen', { item });
              }}
          />
      </ScrollView>

      <Loading {...loadingProps} />
    </MainView>
  );
}

export default MainForumOld;