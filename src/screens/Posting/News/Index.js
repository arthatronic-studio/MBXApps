import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import {
    useLoading,
    usePopup,
    useColor
} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import ListNews from 'src/components/Posting/ListNews';

import Client from '@src/lib/apollo';
import { queryMaudiProduct } from '@src/lib/query';
import { listPrivilegeUser } from 'src/utils/constants';

const Example = Styled(View)`
`;

export default ({ navigation, route }) => {
    const [state, changeState] = useState({
        listCategory: [],
        listProduct: [],
        fallback: true,
    });

    const setState = (obj) => {
        changeState({ ...state, ...obj });
    };

    // selector
    const user = useSelector(
      state => state['user.auth'].login.user
    );

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading, hideLoading] = useLoading();

    const { Color } = useColor();

    const ref = useRef();

    useEffect(() => {
        fecthData();
    }, []);

    const fecthData = async() => {
        setState({
          fallback: true,
        });

        const listCategory = await getMaudiProduct('TRIBES', '', '');
        const listProduct = await getMaudiProduct('TRIBES', '', 'TRIBES_TAMPIL');
    
        setState({
            listCategory,
            listProduct,
            fallback: false,
        });
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
            headerTitle={route.params && route.params.title ? route.params.title : ''}
            iconRightButton={
              <Ionicons
                name='search'
                color={Color.primary}
                size={22}
                onPress={() => navigation.navigate('MainSearch')}
              />
            }
            fallback={state.fallback}
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
                data={state.listProduct}
                showHeader={false}
                onPress={(item) => {
                  navigation.navigate('NewsDetail', {
                    item
                  });
                }}
                style={{
                  paddingBottom: 76
                }}
            />
        </Scaffold>
    )
}