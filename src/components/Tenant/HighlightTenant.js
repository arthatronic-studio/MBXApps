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
import PostingHeader from '../Posting/PostingHeader';
import { getAPI } from 'src/api-rest/httpService';
import { useSelector } from 'react-redux';
import { Container, Divider } from 'src/styled';
import { useNavigation } from '@react-navigation/native';

const defaultProps = {
    title: '',
    tenantType: null,
    numColumns: 2,
};

const HighlightTenant = ({ title, tenantType, numColumns }) => {

    const auth = useSelector(state => state['auth']);
    const { Color } = useColor();
    const navigation = useNavigation();

    const [itemData, setItemData] = useState([]);

    const ref = useRef();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        let baseEndpoint = 'location?';
        if (tenantType) {
            baseEndpoint = baseEndpoint + `type=${tenantType}&`;
        }
        baseEndpoint = baseEndpoint + `isRecommended=1`;
        // if (auth.user.activityInfo.location) {
        //     baseEndpoint = baseEndpoint + `?bloc_location_id=${auth.user.activityInfo.location.id}&isRecommended=1`;
        // }
        const result = await getAPI(baseEndpoint);

        console.log('result baseEndpoint', result);

        let newArr = [];
        if (result.status) {
            newArr = result.data;
        }

        setItemData(newArr);
    }

    const renderCard = (item, idx) => {
        let orderNumber = (idx + 1).toString();
        if (orderNumber.length <= 1) orderNumber = '0'+orderNumber;
        
        return (
            <View
                key={idx}
                style={{ width: `${100/numColumns}%`, padding: 8 }}
            >
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('TenantDetailScreen', { item })
                    }}
                    style={{ width: '100%', flexDirection: 'row', borderBottomWidth: 1, paddingBottom: 12, paddingHorizontal: 16, borderColor: Color.primary }}
                >
                    <View style={{justifyContent: 'center'}}>
                        <Text size={11} type='medium' color={Color.textSoft}>{orderNumber}</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-start', paddingHorizontal: 32}}>
                        <Text size={18} type='medium'>{item.name}</Text>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <Text size={11} type='medium' color={Color.textSoft}>View</Text>
                        <View style={{ borderBottomWidth: 1, borderColor: Color.textSoft }} />
                    </View>
                </TouchableOpacity>
            </View>
        )
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
                    return renderCard(item, idx);
                })}
            </View>
        </View>
    )
}

HighlightTenant.defaultProps = defaultProps;
export default HighlightTenant;