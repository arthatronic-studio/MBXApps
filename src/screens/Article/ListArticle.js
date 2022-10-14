import React, { useState, useEffect } from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';

import { ScreenEmptyData } from '@src/components';
import { Container, Divider, Row } from 'src/styled';
import PostingSkeleton from 'src/components/Posting/PostingSkeleton';
import { initialItemState } from 'src/utils/constants';
import { getAPI } from 'src/api-rest/httpService';
import PostingHeader from 'src/components/Posting/PostingHeader';
import { useSelector } from 'react-redux';
import CardTenantList from 'src/screens/Tenant/CardTenantList';
import CardArticle from './CardArticle';
import imageAssets from 'assets/images';

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
};

const ListArticle = ({ tenantType, productCategory, name, horizontal, style, onLoadingEnd, ListHeaderComponent, showHeader, title, showSeeAllText, }) => {
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
        baseEndpoint = baseEndpoint + `?type=${tenantType}`;
        // if (auth.user.activityInfo.location) {
            // baseEndpoint = baseEndpoint + `?bloc_location_id=${auth.user.activityInfo.location.id}&type=eat`;
        // }
        console.log('baseEndpoint', baseEndpoint);
        const result = await getAPI(baseEndpoint);

        console.log('result', result);

        const newArr = [
            {
              id: 1,
              image: imageAssets.article1,
            }
          ]

        setItemData({
            ...itemData,
            data: newArr,
            // data: itemData.data.concat(result.data),
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
                style={{ paddingHorizontal: 8 }}
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
                    contentContainerStyle={{ paddingBottom: 16, ...style, paddingHorizontal: 8 }}
                    // onEndReachedThreshold={0.3}
                    numColumns={2}
                    // onEndReached={() => setItemData({ ...itemData, loadNext: true })}
                    renderItem={({ item, index }) => {
                        console.log('itemitem', item);
                        return (
                            <CardArticle
                                key={index}
                                index={index}
                                item={item}
                                numColumns={2}
                                horizontal={false}
                            />
                        )
                    }
                    }
                    ListHeaderComponent={
                        <>
                            {ListHeaderComponent}

                            {showHeader && !horizontal && itemData.data.length > 0 && renderHeader()}
                        </>
                    }
                />
            }
        </View>
    )
}

ListArticle.propTypes = propTypes;
ListArticle.defaultProps = defaultProps;
export default ListArticle;