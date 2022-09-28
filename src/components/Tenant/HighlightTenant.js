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
};

const HighlightTenant = (props) => {

    const auth = useSelector(state => state['auth']);
    const { Color } = useColor();
    const navigation = useNavigation();

    const [itemData, setItemData] = useState([]);

    const ref = useRef();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        let baseEndpoint = 'location';
        if (auth.user.activityInfo.location) {
            baseEndpoint = baseEndpoint + `?bloc_location_id=${auth.user.activityInfo.location.id}&isRecommended=1`;
        }
        const result = await getAPI(baseEndpoint);

        console.log('result baseEndpoint', result);

        let newArr = [];
        if (result.status) {
            newArr = result.data;
        }

        setItemData(newArr);
    }

    const renderCard = (item, idx) => {
        return (
            <View
                key={idx}
                style={{ width: '50%', padding: 8 }}
            >
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('TenantDetailScreen', { item })
                    }}
                    style={{ width: '100%', aspectRatio: 1 }}
                >
                    <Image
                        source={{uri: Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : ''}}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 8,
                            backgroundColor: Color.border,
                        }}
                    />
                </TouchableOpacity>
                
                <Container align='flex-start' marginTop={8}>
                    <Text type='medium'>{item.name}</Text>
                    <Divider height={4} />
                    <Text size={12}>{item.category.name}</Text>
                </Container>
            </View>
        )
    }

    if (itemData.length === 0) return <View />

    return (
        <View>
            <PostingHeader
                title='Tenant Terpopuler'
                showSeeAllText={false}
            />

            <View style={{ marginTop: 4, flexDirection: 'row', flexWrap: 'wrap', width: '100%', paddingHorizontal: 8 }}>
                {itemData.map((item, idx) => {
                    return renderCard(item, idx);
                })}
            </View>
        </View>
    )
}

HighlightTenant.defaultProps = defaultProps;
export default HighlightTenant;