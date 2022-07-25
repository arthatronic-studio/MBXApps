import React, { useState, useEffect } from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';

import { ScreenEmptyData } from '@src/components';
import { Container, Row } from 'src/styled';
import PostingSkeleton from '../Posting/PostingSkeleton';
import { initialItemState } from 'src/utils/constants';
import { fetchContentProduct, fetchContentUserProduct, fetchContentSavedProduct } from 'src/api/content';
import CardContentProductV2 from '@src/components/Content/CardContentProductV2';
import { fetchEventList } from 'src/api/event/event';

const propTypes = {
    userProfileId: PropTypes.number,
    productCategory: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    horizontal: PropTypes.bool,
    saved: PropTypes.bool,
    style: PropTypes.object,
    onLoadingEnd: PropTypes.func,
    orderBy: PropTypes.string,
    timeStart: PropTypes.string,
};

const defaultProps = {
    userProfileId: null,
    productCategory: '',
    name: '',
    horizontal: false,
    saved: false,
    style: {},
    orderBy: '',
    timeStart: '',
    tag: [],
    onLoadingEnd: () => {},
};

const ListContentProductV2 = ({ userProfileId, productCategory, name, horizontal, style, orderBy, onLoadingEnd, saved, timeStart, tag}) => {
    const { width } = useWindowDimensions();
    const [itemData, setItemData] = useState(initialItemState);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (itemData.loadNext && itemData.page !== -1) {
            fetchData();
        }
    }, [itemData.loadNext]);

    const fetchData = async() => {
        let variables = {
            page: itemData.page + 1,
        };
        if (productCategory) {
            variables.productCategory = productCategory;
        };
        if (userProfileId !== null) {
            variables.userProfileId = userProfileId;
        }

        if (orderBy != null && orderBy != ''){
            variables.orderBy = orderBy;
        }
        if (timeStart != null && timeStart != ''){
            variables.timeStart = timeStart;
        }

        if(tag.length != 0){
            variables.tag = tag;
        }

        const result = userProfileId !== null ?
            await fetchContentUserProduct(variables) :
            saved === true ?
            await fetchContentSavedProduct(variables) :
            await fetchContentProduct(variables);
        
        setItemData({
            ...itemData,
            data: itemData.data.concat(result.data),
            page: result.status === false ? itemData.page : result.data.length > 0 ? itemData.page + 1 : -1,
            loading: false,
            loadNext: false,
            message: result.message,
            refresh: false,
        });

        onLoadingEnd(false);
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
        <View style={{paddingBottom: 8}}>
            {itemData.loading ?
                renderSkeleton()
            :
                <FlatList
                    keyExtractor={(item, index) => item.toString() + index}
                    data={itemData.data}
                    horizontal={horizontal}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingVertical: 16, paddingHorizontal: 8, ...style}}
                    onEndReachedThreshold={0.3}
                    onEndReached={() => setItemData({ ...itemData, loadNext: true })}
                    { ...extraProps }
                    renderItem={({ item, index }) =>
                        <CardContentProductV2
                            productCategory={productCategory}
                            item={item}
                            horizontal={horizontal}
                            { ...extraProps }
                        />
                    }
                    ListEmptyComponent={() => {
                        return (
                            <ScreenEmptyData
                                message={`${name} belum tersedia`}
                                style={{width: width - 16}}
                            />
                        )
                    }}
                />
            }
        </View>
    )
}

ListContentProductV2.propTypes = propTypes;
ListContentProductV2.defaultProps = defaultProps;
export default ListContentProductV2;