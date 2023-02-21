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
import imageAssets from 'assets/images';
import { fetchGetArticle } from 'src/api-rest/fetchGetArticle';
import CardXperience from './CardXperience';

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

const ListXperience = ({ tenantType, productCategory, name, horizontal, style, onLoadingEnd, ListHeaderComponent, showHeader, title, showSeeAllText, }) => {
    const { width } = useWindowDimensions();
    const [itemData, setItemData] = useState({
        data: [],
        loading: true,
        message: '',
        nextUrl: null,
        loadNext: false,
        refresh: false,
    });
    const auth = useSelector(state => state['auth']);

    useEffect(() => {
        fetchData(true);
    }, []);

    useEffect(() => {
        if (itemData.loadNext && itemData.nextUrl != null) {
            fetchData(false);
        }
    }, [itemData.loadNext]);

    const fetchData = async (first) => {
        const param = itemData.nextUrl ? itemData.nextUrl : `?highlight=1&perPage=10`;
        const result = await fetchGetArticle(param);
        const newArr = result.data;
        console.log(newArr, 'list artilce');


        setItemData({
            ...itemData,
            data: first ? newArr : itemData.data.concat(newArr),
            nextUrl: result.nextUrl ? `?${result.nextUrl.split("?")[1]}`: null,
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
                    onEndReachedThreshold={0.3}
                    // numColumns={2}
                    onEndReached={() => setItemData({ ...itemData, loadNext: true })}
                    renderItem={({ item, index }) => {
                        console.log('itemitem', item);
                        return (
                            <CardXperience
                                key={index}
                                index={index}
                                item={item}
                                // numColumns={2}
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

ListXperience.propTypes = propTypes;
ListXperience.defaultProps = defaultProps;
export default ListXperience;