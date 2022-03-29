import React, { useState, useEffect } from 'react';

import ListForumVertical from '@src/screens/MainForum/ListForumVertical';
import Client from '@src/lib/apollo';
import { queryContentMyProduct } from '@src/lib/query';
import Config from 'react-native-config';

const initialListData = {
  data: [],
  loading: true,
  message: '',
  loadNext: false,
  page: 0,
  refresh: false,
};

const TabForumMyPost = ({ navigation, route }) => {
  // state
  const [listMyPost, setListMyPost] = useState(initialListData);

  useEffect(() => {
    fecthData();
  }, []);

  const fecthData = async () => {
    const newListMyPost = await fetchContentMyProduct(Config.PRODUCT_TYPE, 'FORUM', 'ALL');
    setListMyPost({
      ...listMyPost,
      data: newListMyPost,
      loading: false,
    });
  }

  const fetchContentMyProduct = async (productType, productCategory, productSubCategory) => {
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

    try {
      const result = await Client.query({
        query: queryContentMyProduct,
        variables,
      });
  
      if (result && result.data && result.data.contentMyProduct && Array.isArray(result.data.contentMyProduct)) {
        return result.data.contentMyProduct;
      }
      
      return [];
    } catch (error) {
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
    <ListForumVertical
        data={listMyPost.data}
        loading={listMyPost.loading}
        showHeader={false}
        // onPressShowAll={() => {
        //   navigation.navigate('ShowAllFromForum', {
        //     title: 'Sedang ramai didiskusikan',
        //     subTitle: 'Audio Book',
        //     componentType: 'GRID',
        //     productType: "PODDIUM_FORUM",
        //     productCategory: '',
        //     productSubCategory: '',
        //   });
        // }}
        onPress={(item) => {
          onSelected(item);
          navigation.navigate('DetailForumScreen', { item });
        }}
      />
  );
}

export default TabForumMyPost;