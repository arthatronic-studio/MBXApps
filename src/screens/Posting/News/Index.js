import React, {useState, useEffect, useRef} from 'react';
import {Image, ImageBackground, useWindowDimensions, View} from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import Config from 'react-native-config';

import {
    useLoading,
    usePopup,
    useColor,
    Header,
} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import ListNews from 'src/components/Posting/ListNews';

import Client from '@src/lib/apollo';
import {queryBannerList, queryContentProduct} from '@src/lib/query';
import {listPrivilegeUser} from 'src/utils/constants';
import Banner from 'src/components/Banner';
import ImagesPath from 'src/components/ImagesPath';
import CarouselView from 'src/components/CarouselView';
import {Container, Divider} from 'src/styled';
import {ScrollView} from 'react-native-gesture-handler';

import { Divider, Row } from 'src/styled';
import {iconBookmarks} from '@assets/images/home';

const Example = Styled(View)`
`;

export default ({navigation, route}) => {
  const [state, changeState] = useState({
    listProduct: [],
    fallback: true,
  });

  const setState = obj => {
    changeState({...state, ...obj});
  };

  // selector
  const user = useSelector(state => state['user.auth'].login.user);

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();

  const {width} = useWindowDimensions();

  const {Color} = useColor();

  const ref = useRef();

  useEffect(() => {
    fecthData();
  }, []);

  const fecthData = async () => {
    setState({
      fallback: true,
    });

    const listProduct = await fetchContentProduct(
      Config.PRODUCT_TYPE,
      'POSTING',
      '',
    );

    setState({
      listProduct,
      fallback: false,
    });
  };

  const fetchContentProduct = async (
    productType,
    productCategory,
    productSubCategory,
  ) => {
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

    if (
      result &&
      result.data &&
      result.data.contentProduct &&
      Array.isArray(result.data.contentProduct)
    ) {
      return result.data.contentProduct;
    } else {
      return [];
    }
  };

  const dummyData = [1, 2, 3];

  return (
    <Scaffold
      headerTitle={route.params && route.params.title ? route.params.title : ''}
      iconRightButton={<Image source={iconBookmarks} />}
      fallback={state.fallback}
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}>
      {user && listPrivilegeUser.includes(user.userId) && (
        <Text
          color={Color.textInput}
          style={{
            backgroundColor: Color.primary,
            paddingTop: 2,
            paddingBottom: 6,
          }}
          onPress={() =>
            navigation.navigate('CreateThreadScreen', {
              title:
                route.params && route.params.title ? route.params.title : '',
              productType: Config.PRODUCT_TYPE,
              productCategory: '',
              productSubCategory: 'POSTING',
            })
          }>
          Buat
        </Text>
      )}

      <CarouselView
        delay={3000}
        showIndicator
        leftIndicator
        style={{width, height: 250}}>
        {dummyData.map(e => {
          return (
            <Container width="100%">
              <ImageBackground
                source={ImagesPath.newsImage}
                style={{
                  width: '100%',
                  height: 250,
                  resizeMode: 'contain',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start',
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    width: '70%',
                    paddingLeft: 10,
                    paddingBottom: 35,
                  }}>
                  <Text
                    style={{fontWeight: 'bold', color: Color.textInput}}
                    align="left"
                    size={19}>
                    Pakar AS Sebut Masker N95 dan KN95 Bisa Dipakai Berulang,
                    Begini Caranya
                  </Text>
                  <Text style={{color: Color.textInput}} align="left" size={11}>
                    Detik.com
                  </Text>
                </View>
              </ImageBackground>
            </Container>
          );
        })}
      </CarouselView>

      <Divider height={30} />

      <ScrollView>
        <Text
          style={{
            fontWeight: 'bold',
            alignSelf: 'flex-start',
            fontSize: 18,
            marginStart: 10,
          }}>
          Berita Terbaru
        </Text>
        <ListNews
          data={state.listProduct}
          showHeader={false}
          onPress={item => {
            // navigation.navigate('NewsDetail', { item });
            navigation.navigate('NewsDetail', {item});
          }}
          style={{
            paddingBottom: 76,
          }}
        />
      </ScrollView>
    </Scaffold>
  );
};
