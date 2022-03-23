import React, { useState, useEffect } from 'react';

import ListForumVertical from '@src/screens/MainForum/ListForumVertical';
import Client from '@src/lib/apollo';
import { queryContentUserProduct } from '@src/lib/query';
import Config from 'react-native-config';

const initialListData = {
  data: [],
  loading: true,
  message: '',
  loadNext: false,
  page: 0,
  refresh: false,
};

const TabForumNewPost = ({ navigation, route }) => {
  // state
  const [listNewPost, setListNewPost] = useState(initialListData);

  useEffect(() => {
    fecthData();
  }, []);

  const fecthData = async () => {
    const newListNewPost = await fetchContentUserProduct(Config.PRODUCT_TYPE, "FORUM", "ALL");
    setListNewPost({
      ...listNewPost,
      data: newListNewPost,
      loading: false,
    });
  }

  const fetchContentUserProduct = async (productType, productCategory, productSubCategory) => {
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
      query: queryContentUserProduct,
      variables,
    });

    console.log("resultttt", result)

    if (result && result.data && result.data.contentUserProduct && Array.isArray(result.data.contentUserProduct)) {
      return result.data.contentUserProduct;
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
    <ListForumVertical
      data={listNewPost.data}
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

export default TabForumNewPost;