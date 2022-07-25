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

const itemPerPage = 10;

const TabForumNewPost = ({ navigation, route }) => {
  const { params } = route;
  console.log('params params', params);
  // state
  const [listNewPost, setListNewPost] = useState(initialListData);

  useEffect(() => {
    fecthData();
  }, []);

  useEffect(() => {
    if (listNewPost.loadNext) {
      fecthData();
    }
  }, [listNewPost.loadNext]);

  const fecthData = async () => {
    const newListNewPost = await fetchContentUserProduct(Config.PRODUCT_TYPE, "FORUM");
    console.log('newListNewPost', newListNewPost);
    setListNewPost({
      ...listNewPost,
      data: listNewPost.data.concat(newListNewPost),
      loading: false,
      page: newListNewPost.length === itemPerPage ? listNewPost.page + 1 : -1,
      loadNext: false,
      refresh: false,
    });
  }

  const fetchContentUserProduct = async (productType, productCategory, productSubCategory) => {
    const variables = {
      page: listNewPost.page + 1,
      itemPerPage,
    };

    if (productType) {
      variables.productType = productType;
    }

    if (productCategory) {
      variables.productCategory = productCategory;
    }

    if (productSubCategory) {
      variables.productSubCategory = productSubCategory;
    }

    if (params && typeof params.groupId !== 'undefined') {
      variables.groupId = params.groupId;
    }

    console.log('variables tab forum new post', variables);

    try {
      const result = await Client.query({
        query: queryContentUserProduct,
        variables,
      });

      if (result && result.data && result.data.contentUserProduct && Array.isArray(result.data.contentUserProduct)) {
        return result.data.contentUserProduct;
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

  console.log(listNewPost, 'listNewPost');

  return (
    <ListForumVertical
      data={listNewPost.data}
      loading={listNewPost.loading}
      loadNext={listNewPost.loadNext}
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
      onEndReached={() => listNewPost.page !== -1 && setListNewPost({ ...listNewPost, loadNext: true })}
    />
  );
}

export default TabForumNewPost;