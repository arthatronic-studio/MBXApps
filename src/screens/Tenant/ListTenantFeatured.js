import React, { useState, useEffect } from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';

import { ScreenEmptyData } from '@src/components';
import { Container, Divider, Row } from 'src/styled';
import PostingSkeleton from 'src/components/Posting/PostingSkeleton';
import { initialItemState } from 'src/utils/constants';
import { fetchContentProduct, fetchContentUserProduct } from 'src/api/content';
import CardTenantFeatured from 'src/screens/Tenant/CardTenantFeatured';
import { getAPI } from 'src/api-rest/httpService';
import PostingHeader from 'src/components/Posting/PostingHeader';
import { useSelector } from 'react-redux';

const propTypes = {
    productCategory: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    horizontal: PropTypes.bool,
    style: PropTypes.object,
    onLoadingEnd: PropTypes.func,
    showSeeAllText: PropTypes.bool,
};

const defaultProps = {
    tenantType: 'eat',
    productCategory: '',
    name: '',
    horizontal: false,
    style: {},
    onLoadingEnd: () => { },
    ListHeaderComponent: null,
    title: '',
    showSeeAllText: false,
    showHeader: false,
    showEmpty: false,
};

const ListTenantFeatured = ({ tenantType, productCategory, name, horizontal, style, onLoadingEnd, ListHeaderComponent, showHeader, showEmpty, title, showSeeAllText, }) => {
    const { width } = useWindowDimensions();
    const [itemData, setItemData] = useState(initialItemState);
    const auth = useSelector(state => state['auth']);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (itemData.loadNext && itemData.page !== -1) {
            fetchData();
        }
    }, [itemData.loadNext]);

    const fetchData = async () => {
        let baseEndpoint = 'location';
        baseEndpoint = baseEndpoint + `?type=${tenantType}&isRecommended=1`;
        // if (auth.user.activityInfo.location) {
            // baseEndpoint = baseEndpoint + `?bloc_location_id=${auth.user.activityInfo.location.id}&type=eat&isRecommended=1`;
        // }
        console.log('baseEndpoint', baseEndpoint);
        const result = await getAPI(baseEndpoint);

        console.log('result', result);

        setItemData({
            ...itemData,
            data: itemData.data.concat(result.data),
            // data: [],
            // page: result.status === false ? itemData.page : result.data.length > 0 ? itemData.page + 1 : -1,
            page: -1,
            loading: false,
            loadNext: false,
            message: result.message,
            refresh: false,
        });

        onLoadingEnd(false);
    }

    const renderHeader = () => {
        return (
            <PostingHeader
                title={title}
                onSeeAllPress={() => {
                    // navigation.navigate(nav, { title });
                }}
                productCategory={productCategory}
                showSeeAllText={showSeeAllText}
            />
        )
    }

    const renderSkeleton = () => {
        return (
            <Container paddingLeft={16} paddingTop={16} paddingRight={32}>
                <Row>
                    <PostingSkeleton />
                    <PostingSkeleton />
                </Row>
            </Container>
        )
    }

    let extraProps = { numColumns: 2 };
    if (productCategory === 'NEARBY_PLACE') extraProps.numColumns = 2;
    if (horizontal) extraProps = {};

    const doesntShowEmpty = !showEmpty && !itemData.loading && itemData.data.length === 0;

    return (
        <View style={{ }}>
            {!doesntShowEmpty && showHeader && horizontal && renderHeader()}

            {itemData.loading ?
                renderSkeleton()
                :
                <FlatList
                    keyExtractor={(item, index) => item.toString() + index}
                    data={itemData.data}
                    horizontal={horizontal}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: doesntShowEmpty ? 0 : 16, ...style }}
                    onEndReachedThreshold={0.3}
                    onEndReached={() => setItemData({ ...itemData, loadNext: true })}
                    {...extraProps}
                    pagingEnabled
                    renderItem={({ item, index }) => {
                        return (
                            <CardTenantFeatured
                                productCategory={productCategory}
                                item={item}
                                horizontal={horizontal}
                                {...extraProps}
                            />
                        )
                    }}
                    ListHeaderComponent={
                        <>
                            {ListHeaderComponent}

                            {!doesntShowEmpty && showHeader && !horizontal && renderHeader()}
                        </>
                    }
                    ListEmptyComponent={
                        showEmpty && (
                            <>
                                <ScreenEmptyData
                                    message={`${name} belum tersedia`}
                                    style={{ width: width - 16 }}
                                />
                            </>
                        )
                    }
                />
            }
        </View>
    )
}

ListTenantFeatured.propTypes = propTypes;
ListTenantFeatured.defaultProps = defaultProps;
export default ListTenantFeatured;