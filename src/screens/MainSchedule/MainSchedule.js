import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import {
    useLoading,
    usePopup,
    useColor
} from '@src/components';
import Text from '@src/components/Text';
import HeaderBig from '@src/components/HeaderBig';
import Scaffold from '@src/components/Scaffold';
import ListNews from 'src/components/List/ListNews';

import Client from '@src/lib/apollo';
import { queryMaudiProduct } from '@src/lib/query';
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

    const newListCategory = await getMaudiProduct('TRIBES', '', '');
    setListCategory(newListCategory);

    const newListProduct = await getMaudiProduct('TRIBES', '', 'TRIBES_BUSSINESS_DIRECTORY');
    setListProduct(newListProduct);

    setFallback(false);
  }

  const getMaudiProduct = async(productType, productCategory, productSubCategory) => {
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
      query: queryMaudiProduct,
      variables,
    });

    if (result && result.data && result.data.maudiProduct && Array.isArray(result.data.maudiProduct)) {
      return result.data.maudiProduct;
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
          title: 'Tampil',
          productType: "TRIBES",
          productCategory: '',
          productSubCategory: 'TRIBES_TAMPIL',
        })}
      >
        Buat
      </Text>}

      <ListNews
        data={listProduct}
        onPress={(item) => {
          navigation.navigate('NewsDetail', {
            item
          });
        }}
        style={{
          paddingBottom: 80
        }}
      />
    </Scaffold>
  )
}