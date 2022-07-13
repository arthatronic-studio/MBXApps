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

const itemPerPage = 10;

const TabForumMyPost = ({ navigation, route }) => {
  // state
  const [listMyPost, setListMyPost] = useState(initialListData);

  useEffect(() => {
    fecthData();
  }, []);

  useEffect(() => {
    if (listMyPost.loadNext) {
      fecthData();
    }
  }, [listMyPost.loadNext]);


  const fecthData = async () => {
    const newListMyPost = await fetchContentMyProduct(Config.PRODUCT_TYPE, 'FORUM');
    setListMyPost({
      ...listMyPost,
      data: newListMyPost,
      data: listMyPost.data.concat(newListMyPost),
      loading: false,
      page: newListMyPost.length === itemPerPage ? listMyPost.page + 1 : -1,
      loadNext: false,
      refresh: false,
    });
  }

  const fetchContentMyProduct = async (productType, productCategory, productSubCategory) => {
    const variables = {
      page: listMyPost.page + 1,
      itemPerPage,
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

    console.log('variables', variables);

    try {
      const result = await Client.query({
        query: queryContentMyProduct,
        variables,
      });

      console.log('variables', variables);
  
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
        loadNext={listMyPost.loadNext}
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
        onEndReached={() => listMyPost.page !== -1 && setListMyPost({ ...listMyPost, loadNext: true })}
      />
  );
}

export default TabForumMyPost;