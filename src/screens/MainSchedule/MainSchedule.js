import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import Config from 'react-native-config';

import {
    useLoading,
    usePopup,
    useColor
} from '@src/components';
import Text from '@src/components/Text';
import HeaderBig from '@src/components/HeaderBig';
import Scaffold from '@src/components/Scaffold';
import ListNews from 'src/components/Posting/ListNews';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import { listPrivilegeUser } from 'src/utils/constants';

export default ({ navigation, route }) => {
  // state
  const [fallback, setFallback] = useState(true);
  const [listCategory, setListCategory] = useState([]);
  const [listProduct, setListProduct] = useState([]);

  // selector
  const user = useSelector(
    state => state['user.auth'].login.user
  );

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();

  const { Color } = useColor();

  useEffect(() => {
      fecthData();
  }, []);

  const fecthData = async() => {
    setFallback(true);

    const newListCategory = await fetchContentProduct(Config.PRODUCT_TYPE, '', '');
    setListCategory(newListCategory);

    const newListProduct = await fetchContentProduct(Config.PRODUCT_TYPE, '', 'TRIBES_BUSSINESS_DIRECTORY');
    setListProduct(newListProduct);

    setFallback(false);
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

  return (
    <Scaffold
      header={
        <HeaderBig title='Jadwal' style={{paddingTop: 16}} />
      }
      fallback={fallback}
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}
  >
      {user && listPrivilegeUser.includes(user.userId) && <Text
        color={Color.textInput}
        style={{backgroundColor: Color.primary, paddingTop: 2, paddingBottom: 6}}
        onPress={() => navigation.navigate('CreateThreadScreen', {
          title: 'Artikel',
          productType: Config.PRODUCT_TYPE,
          productCategory: '',
          productSubCategory: 'POSTING',
        })}
      >
        Buat
      </Text>}

      <ListNews
        data={listProduct}
        onPress={(item) => {
          navigation.navigate('NewsDetail', { item });
          // navigation.navigate('PostingDetail', {item});
        }}
        style={{
          paddingBottom: 80
        }}
      />
    </Scaffold>
  )
}