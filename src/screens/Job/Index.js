import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';

import {
    TouchableOpacity,
    useLoading,
    usePopup,
    useColor
} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import ListJob from 'src/components/List/ListJob';

import Client from '@src/lib/apollo';
import { queryMaudiProduct } from '@src/lib/query';
import { shadowStyle } from '@src/styles';
import { listPrivilegeUser } from 'src/utils/constants';

const Example = Styled(View)`
`;

export default ({ navigation, route }) => {
    const [state, changeState] = useState({
        fallback: true,
        listCategory: [],
        listProduct: [],
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
        const listProduct = await getMaudiProduct('TRIBES', '', 'TRIBES_KERJA');
    
        setState({
            fallback: false,
            listCategory,
            listProduct,
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
            headerTitle='Loker'
            iconRightButton={<MaterialIcons name='bookmarks' color={Color.primary} size={24} />}
            fallback={state.fallback}
            empty={false}
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
            {user && listPrivilegeUser.includes(user.userId) && <Text
                color={Color.textInput}
                style={{backgroundColor: Color.primary, paddingTop: 2, paddingBottom: 6}}
                onPress={() => navigation.navigate('CreateThreadScreen', {
                  title: 'Kerja',
                  productType: "TRIBES",
                  productCategory: '',
                  productSubCategory: 'TRIBES_KERJA',
                })}
              >
                Buat
            </Text>}

            <View style={{padding: 16}}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('MainSearch')}
                  style={{height: 50, width: '100%', borderRadius: 25, flexDirection: 'row', backgroundColor: Color.textInput, paddingHorizontal: 16, alignItems: 'center', ...shadowStyle}}>
                    <Ionicons name='search' size={22} color={Color.primary} />
                    <Text style={{opacity: 0.6, paddingLeft: 12}}>Cari</Text>
                </TouchableOpacity>
            </View>

            <ListJob
                title='Rekomendasi Buat Kamu'
                showAll={false}
                data={state.listProduct}
                onPress={(item) => navigation.navigate('JobDetail', { item })}
                style={{paddingBottom: 160}}
            />
        </Scaffold>
    )
}