import React, { useState, useEffect } from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';

import { ScreenEmptyData } from '@src/components';
import { Container, Divider, Row } from 'src/styled';
import PostingSkeleton from '../Posting/PostingSkeleton';
import { initialItemState } from 'src/utils/constants';
import CardContentProduct from '@src/components/Content/CardContentProduct';
import { getAPI } from 'src/api-rest/httpService';
import PostingHeader from '../Posting/PostingHeader';
import ScreenEmptyEvent from '../Modal/ScreenEmptyEvent';
import { useSelector } from 'react-redux';

const propTypes = {
    productType: PropTypes.string,
    productCategory: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    horizontal: PropTypes.bool,
    style: PropTypes.object,
    onLoadingEnd: PropTypes.func,
    showSeeAllText: PropTypes.bool,
    pagination: PropTypes.bool,
};

const defaultProps = {
    productType: '',
    productCategory: '',
    name: '',
    horizontal: false,
    style: {},
    onLoadingEnd: () => { },
    onSeeAll: () => { },
    ListHeaderComponent: null,
    title: '',
    showSeeAllText: false,
    showHeader: false,
    headerLabelstyle: {},
    pagination: true,
    icon: null,
};

const ListContenCollaboratorEvent = ({ productType, productCategory, name, horizontal, style, onLoadingEnd, ListHeaderComponent, showHeader, title, showSeeAllText, headerLabelstyle, pagination, icon, onSeeAll }) => {
    const { width } = useWindowDimensions();
    const [itemData, setItemData] = useState(initialItemState);
    const auth = useSelector(state => state['auth']);

    useEffect(() => {
        setItemData(initialItemState);
        fetchData(true);
    }, []);

    useEffect(() => {
        if (itemData.loadNext && itemData.nextUrl != null && pagination) {
            fetchData(false);
        }
    }, [itemData.loadNext]);

    const fetchData = async (first) => {
        let baseEndpoint = 'event?perPage=9&category=x_collaborator';
        if(first){
            if(auth.user.isCheckin && auth.user.activityInfo.location){
                baseEndpoint = baseEndpoint + `&bloc_location_id=${auth.user.activityInfo.location.id}`;
            }else if(auth.selectedLocation){
                baseEndpoint = baseEndpoint + `&bloc_location_id=${auth.selectedLocation.id}`;
            }
            if (productType) {
                baseEndpoint = baseEndpoint + `&type=${productType}`   
            }
        }else{
            baseEndpoint = 'event?' + itemData.nextUrl;
        }

        let newArr = [];

        const result = await getAPI(baseEndpoint);

        console.log('result', baseEndpoint, result, first);

        if (result.status && Array.isArray(result.data)) {
            newArr = result.data;
        }

        if(result.status){
            setItemData({
                ...itemData,
                data: first ? newArr : itemData.data.concat(newArr),
                nextUrl: result.nextUrl ? `?${result.nextUrl.split("?")[1]}`: null,
                loading: false,
                loadNext: false,
                message: result.message,
                refresh: false,
            });
        }

        onLoadingEnd(false);
    }

    console.log(itemData, 'dataaa');

    const renderHeader = () => {
        return (
            <PostingHeader
                title={title}
                icon={icon}
                onSeeAllPress={() => {
                    onSeeAll();
                }}
                productCategory={productCategory}
                showSeeAllText={showSeeAllText}
                style={{paddingHorizontal: horizontal ? 16 : 8, ...headerLabelstyle}}
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

    let extraProps = { numColumns: 1 };
    if (productCategory === 'NEARBY_PLACE') extraProps.numColumns = 2;
    if (horizontal) extraProps = {};

    return (
        <View>
            {showHeader && horizontal && renderHeader()}

            {itemData.loading ?
                renderSkeleton()
                :
                <FlatList
                    keyExtractor={(_, index) => index.toString()}
                    data={itemData.data}
                    horizontal={horizontal}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 8, ...style }}
                    onEndReachedThreshold={0.3}
                    onEndReached={() => {
                        setItemData({ ...itemData, loadNext: true })
                    }}
                    {...extraProps}
                    renderItem={({ item, index }) => {
                        if (index === 0) {
                            return (
                                <>
                                    {showHeader && !horizontal && renderHeader()}

                                    <CardContentProduct
                                        productCategory={productCategory}
                                        item={item}
                                        horizontal={horizontal}
                                        {...extraProps}
                                    />
                                </>
                            )
                        }

                        return (
                            <CardContentProduct
                                productCategory={productCategory}
                                item={item}
                                horizontal={horizontal}
                                {...extraProps}
                            />
                        )
                    }
                    }
                    ListHeaderComponent={ListHeaderComponent}
                    ListEmptyComponent={() => {
                        return (
                            <>
                                {showHeader && !horizontal && !itemData.loading && itemData.data.length === 0 && renderHeader()}
                                
                                <ScreenEmptyEvent
                                    message="Belum ada event yang tersedia"
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

ListContenCollaboratorEvent.propTypes = propTypes;
ListContenCollaboratorEvent.defaultProps = defaultProps;
export default ListContenCollaboratorEvent;