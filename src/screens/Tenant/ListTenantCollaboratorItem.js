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
import CardTenantItem from './CardTenantItem';
import CardTenantList from 'src/screens/Tenant/CardTenantList';

const propTypes = {
    productCategory: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    horizontal: PropTypes.bool,
    style: PropTypes.object,
    onLoadingEnd: PropTypes.func,
    showSeeAllText: PropTypes.bool,
    refresh: PropTypes.bool,
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
    refresh: false,
};

const ListTenantCollaboratorItem = ({ tenantType, productCategory, name, horizontal, style, onLoadingEnd, ListHeaderComponent, ListFooterComponent, showHeader, title, showSeeAllText, refresh}) => {
    const { width } = useWindowDimensions();
    const [itemData, setItemData] = useState(initialItemState);
    const auth = useSelector(state => state['auth']);

    useEffect(() => {
        fetchData(true);
    }, []);
    
    useEffect(() => {
        if(refresh){
            fetchData(true);
        }
    }, [refresh]);

    useEffect(() => {
        if (itemData.loadNext && itemData.page !== -1) {
            fetchData(false);
        }
    }, [itemData.loadNext]);

    const fetchData = async (first) => {
        let baseEndpoint = 'location';
        baseEndpoint = baseEndpoint + `?type=${tenantType}&category=x_collaborator`;

        // if (auth.user.activityInfo.location) {
            // baseEndpoint = baseEndpoint + `?bloc_location_id=${auth.user.activityInfo.location.id}&type=eat`;
        // }
        console.log('baseEndpoint', baseEndpoint);

        let newArr = [];

        const result = await getAPI(baseEndpoint);

        console.log('result', result);

        if (result.status && Array.isArray(result.data)) {
            newArr = result.data;
        }

        setItemData({
            ...itemData,
            data: first ? newArr : itemData.data.concat(newArr),
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
            <>
                <PostingHeader
                    title={title}
                    onSeeAllPress={() => {
                        // navigation.navigate(nav, { title });
                    }}
                    productCategory={productCategory}
                    showSeeAllText={showSeeAllText}
                />
                <Divider height={8} />
            </>
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

    let extraProps = {};
    // let extraProps = { numColumns: 2 };
    // if (productCategory === 'NEARBY_PLACE') extraProps.numColumns = 2;
    // if (horizontal) extraProps = {};

    if (!itemData.loading && itemData.data.length === 0) {
        return <View />;
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
                    contentContainerStyle={{ paddingBottom: 16, ...style }}
                    onEndReachedThreshold={0.3}
                    onEndReached={() => setItemData({ ...itemData, loadNext: true })}
                    {...extraProps}
                    renderItem={({ item, index }) => {
                        return (
                            // <CardTenantItem
                            //     index={index}
                            //     productCategory={productCategory}
                            //     item={item}
                            //     horizontal={horizontal}
                            //     {...extraProps}
                            // />
                            <CardTenantList
                                index={index}
                                item={item}
                                numColumns={1}
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
                    ListFooterComponent={ListFooterComponent}
                />
            }
        </View>
    )
}

ListTenantCollaboratorItem.propTypes = propTypes;
ListTenantCollaboratorItem.defaultProps = defaultProps;
export default ListTenantCollaboratorItem;