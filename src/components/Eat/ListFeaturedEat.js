import React, { useState, useEffect } from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';

import { ScreenEmptyData } from '@src/components';
import { Container, Divider, Row } from 'src/styled';
import PostingSkeleton from '../Posting/PostingSkeleton';
import { initialItemState } from 'src/utils/constants';
import { fetchContentProduct, fetchContentUserProduct } from 'src/api/content';
import CardFeaturedEat from './CardFeaturedEat';
import { getAPI } from 'src/api-rest/httpService';
import PostingHeader from '../Posting/PostingHeader';
import { useSelector } from 'react-redux';

const propTypes = {
    userProfileId: PropTypes.number,
    productCategory: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    horizontal: PropTypes.bool,
    style: PropTypes.object,
    onLoadingEnd: PropTypes.func,
    showSeeAllText: PropTypes.bool,
};

const defaultProps = {
    userProfileId: null,
    productCategory: '',
    name: '',
    horizontal: false,
    style: {},
    onLoadingEnd: () => { },
    ListHeaderComponent: null,
    title: '',
    showSeeAllText: false,
    showHeader: false,
};

const ListFeaturedEat = ({ userProfileId, productCategory, name, horizontal, style, onLoadingEnd, ListHeaderComponent, showHeader, title, showSeeAllText, }) => {
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
        baseEndpoint = baseEndpoint + `?type=eat&isRecommended=1`;
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

        return;

        // let variables = {
        //     page: itemData.page + 1,
        // };
        // if (productCategory) {
        //     variables.productCategory = productCategory;
        // };
        // if (userProfileId !== null) {
        //     variables.userProfileId = userProfileId;
        // }

        // const result = userProfileId !== null ?
        //     await fetchContentUserProduct(variables) :
        //     await fetchContentProduct(variables);

        // setItemData({
        //     ...itemData,
        //     data: itemData.data.concat(result.data),
        //     page: result.status === false ? itemData.page : result.data.length > 0 ? itemData.page + 1 : -1,
        //     loading: false,
        //     loadNext: false,
        //     message: result.message,
        //     refresh: false,
        // });

        // onLoadingEnd(false);
    }

    const renderHeader = () => {
        return (
            <PostingHeader
                title={title}
                onSeeAllPress={() => {
                    // navigation.navigate(nav, { title, userProfileId });
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

    return (
        <View style={{ }}>
            {showHeader && horizontal && renderHeader()}

            {itemData.loading ?
                renderSkeleton()
                :
                <FlatList
                    keyExtractor={(item, index) => item.toString() + index}
                    data={itemData.data}
                    horizontal={horizontal}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 16, ...style }}
                    onEndReachedThreshold={0.3}
                    onEndReached={() => setItemData({ ...itemData, loadNext: true })}
                    {...extraProps}
                    pagingEnabled
                    renderItem={({ item, index }) => {
                        if (index === 0) {
                            return (
                                <>
                                    <CardFeaturedEat
                                        productCategory={productCategory}
                                        item={item}
                                        horizontal={horizontal}
                                        {...extraProps}
                                    />
                                </>
                            )
                        }

                        return (
                            <CardFeaturedEat
                                productCategory={productCategory}
                                item={item}
                                horizontal={horizontal}
                                {...extraProps}
                            />
                        )
                    }
                    }
                    ListHeaderComponent={
                        <>
                            {ListHeaderComponent}

                            {showHeader && !horizontal && renderHeader()}
                        </>
                    }
                    ListEmptyComponent={() => {
                        return (
                            <>
                                <ScreenEmptyData
                                    message={`${name} belum tersedia`}
                                    style={{ width: width - 16 }}
                                />
                            </>
                        )
                    }}
                />
            }
        </View>
    )
}

ListFeaturedEat.propTypes = propTypes;
ListFeaturedEat.defaultProps = defaultProps;
export default ListFeaturedEat;