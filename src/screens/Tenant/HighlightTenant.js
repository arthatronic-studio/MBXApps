import React, { useState, useEffect, useRef } from 'react';
import { Image, View } from 'react-native';

import {
    Alert,
    AlertModal,
    Button,
    Grid,
    Header,
    Loading, useLoading,
    Popup, usePopup,
    ScreenEmptyData,
    ScreenIndicator,
    ListSlider,
    Submit,
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import PostingHeader from '../../components/Posting/PostingHeader';
import { getAPI } from 'src/api-rest/httpService';
import { useSelector } from 'react-redux';
import { Container, Divider } from 'src/styled';
import { useNavigation } from '@react-navigation/native';
import CardTenantList from './CardTenantList';

const defaultProps = {
    title: '',
    tenantType: null,
    numColumns: 2,
};

const HighlightTenant = ({ title, tenantType, numColumns, productCategory }) => {

    const auth = useSelector(state => state['auth']);
    const { Color } = useColor();
    const navigation = useNavigation();

    const [itemData, setItemData] = useState([]);

    const ref = useRef();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        let newArr = [];
        if(tenantType == 'eat'){
            let baseEndpoint = 'favorite-tenant/popular';
            if(auth.user.isCheckin && auth.user.activityInfo.location){
                baseEndpoint = baseEndpoint + `?bloc_location_id=${auth.user.activityInfo.location.id}`;
            }else if(auth.selectedLocation){
                baseEndpoint = baseEndpoint + `?bloc_location_id=${auth.selectedLocation.id}`;
            }
            const result = await getAPI(baseEndpoint);
            console.log('result baseEndpoint', result, baseEndpoint);
            if (result.status) {
                const tempA = Object.values(result.data);
                const tempB = tempA.map((item) => item[0].location);
                newArr = tempB;
            }
        }else{
            let baseEndpoint = 'location?';
            if (tenantType) {
                baseEndpoint = baseEndpoint + `type=${tenantType}&`;
            }
            baseEndpoint = baseEndpoint + `isRecommended=1`;
            if (auth.user.activityInfo.location) {
                baseEndpoint = baseEndpoint + `?bloc_location_id=${auth.user.activityInfo.location.id}&isRecommended=1`;
            }
            const result = await getAPI(baseEndpoint);
            console.log('result baseEndpoint', result, baseEndpoint);
            if (result.status) {
                newArr = result.data;
            }
        }



        setItemData(newArr);
    }

    if (itemData.length === 0) return <View />

    return (
        <View>
            <PostingHeader
                title={title}
                showSeeAllText={false}
            />

            <View style={{ marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', width: '100%', paddingHorizontal: 8 }}>
                {itemData.map((item, idx) => {
                    return (
                        <CardTenantList
                            key={idx}
                            index={idx}
                            item={item}
                            numColumns={numColumns}
                            productCategory={productCategory}
                        />
                    )
                })}
            </View>
        </View>
    )
}

HighlightTenant.defaultProps = defaultProps;
export default HighlightTenant;