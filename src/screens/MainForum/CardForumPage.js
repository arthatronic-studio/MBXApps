import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Dimensions, SafeAreaView, TextInput, Image } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import ImagesPath from '../../components/ImagesPath'

const { width } = Dimensions.get('window');

import {
  Text,
  // TouchableOpacity,
  Loading, useLoading,
  HeaderBig,
  Header,
  Scaffold,
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

const CardForumPage = ({ navigation, route }) => {
  // state
  const [listMostDiscussion, setListMostDiscussion] = useState([]);
  const [listGroupReader, setListGroupReader] = useState([]);
  const [listFavoriteDiscussion, setListFavoriteDiscussion] = useState([]);

  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const { Color } = useColor();

  
  
  useEffect(() => {
    fecthData();
  }, [route]);

  const fecthData = async() => {
    showLoading();
    
    const newListMostDiscussion = await fetchContentProduct("TRIBES", "NEARBY_PLACE", "ALL");
    setListMostDiscussion(newListMostDiscussion);
    console.log('most diskusi', newListMostDiscussion)
    
    const newListGroupReader = await fetchContentProduct("TRIBES", "NEARBY_PLACE", "ALL");
    setListGroupReader(newListGroupReader);
    console.log('group reader', newListGroupReader)
    
    const newListFavoriteDiscussion = await fetchContentProduct("TRIBES", "NEARBY_PLACE", "ALL");
    setListFavoriteDiscussion(newListFavoriteDiscussion);
    console.log('fav diskusi', newListFavoriteDiscussion)
    
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

    console.log("resultttt",result)

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
      <ScrollView showsVerticalScrollIndicator={true}>
         

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

export default CardForumPage;