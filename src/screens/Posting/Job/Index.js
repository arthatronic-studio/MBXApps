import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
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
import { queryContentProduct } from '@src/lib/query';
import { listPrivilegeUser } from 'src/utils/constants';
import ListJob from 'src/components/Posting/ListJob';
import { Row } from 'src/styled';

const Example = Styled(View)`
`;

export default ({ navigation, route }) => {
    const [state, changeState] = useState({
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

        const listProduct = await fetchContentProduct(Config.PRODUCT_TYPE, 'JOBS', '');
    
        setState({
            listProduct,
            fallback: false,
        });
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
              <Header
                title= "Lowongan Pekerjaan"
                actions={
                  <Row justify='center' align='center'>
                    <Ionicons
                      name='search'
                      size={22}
                      onPress={() => navigation.navigate('MainSearch')}
                    />
                    {/* <Divider /> */}
                    <MaterialIcons
                      name='add'
                      size={26}
                      onPress={() => navigation.navigate('CreateThreadScreen', {
                        title: route.params && route.params.title ? route.params.title : '',
                        productType: Config.PRODUCT_TYPE,
                        productCategory: '',
                        productSubCategory: 'JOBS',
                      })}
                      style={{marginLeft: 20}}
                    />
                  </Row>
                }
              />
            }
            fallback={state.fallback}
            empty={!state.fallback && state.listProduct.length === 0}
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
            {/* {user && listPrivilegeUser.includes(user.userId) && <Text
                color={Color.textInput}
                style={{backgroundColor: Color.primary, paddingTop: 2, paddingBottom: 6}}
                onPress={() => navigation.navigate('CreateThreadScreen', {
                  title: route.params && route.params.title ? route.params.title : '',
                  productType: Config.PRODUCT_TYPE,
                  productCategory: '',
                  productSubCategory: 'JOBS',
                })}
              >
                Buat
            </Text>} */}

            <ListJob
                data={state.listProduct}
                showHeader={false}
                onPress={(item) => {
                  // navigation.navigate('JobDetail', { item });
                  navigation.navigate('JobDetail', {item});
                }}
                style={{
                  paddingBottom: 45
                }}
            />
            {/* {console.log(state.listProduct)} */}
        </Scaffold>
    )
}