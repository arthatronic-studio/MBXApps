import React, { useState, useEffect } from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/core';

import { ScreenEmptyData, useColor } from '@src/components';
import PostingHeader from '../Posting/PostingHeader';
import { Container, Row } from 'src/styled';
import PostingSkeleton from '../Posting/PostingSkeleton';
import { useSelector } from 'react-redux';
import { initialItemState } from 'src/utils/constants';
import { fetchContentProduct, fetchContentUserProduct } from 'src/api/content';
import CardContentProduct from '@src/components/Content/CardContentProduct';

const propTypes = {
    userProfileId: PropTypes.number,
    productCategory: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string,
    nav: PropTypes.string,
    refresh: PropTypes.bool,
    horizontal: PropTypes.bool,
    style: PropTypes.object,
    showHeader: PropTypes.bool,
    showEmpty: PropTypes.bool,
};

const defaultProps = {
    userProfileId: null,
    productCategory: '',
    name: '',
    title: '',
    nav: '',
    refresh: false,
    horizontal: false,
    style: {},
    showHeader: true,
    showEmpty: false,
};

const HighlightContentProduct = (props) => {
    const {
        userProfileId,
        productCategory,
        name,
        title,
        nav,
        refresh,
        horizontal,
        style,
        showHeader,
        showEmpty,
    } = props;

    const { Color } = useColor();
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const user = useSelector(state => state['user.auth'].login.user);

    const [itemData, setItemData] = useState(initialItemState);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (itemData.refresh || refresh) {
            fetchData();
        }
    }, [itemData.refresh, refresh]);

    const fetchData = async() => {
        let variables = {
            page: 1,
            itemPerPage:
                userProfileId !== null || productCategory === 'YOUTUBE_VIDEO' ? 1 :
                productCategory === 'NEARBY_PLACE' ? 4 :
                productCategory === 'POSTING' ? 3 :
                2,
        }
        if (productCategory) {
            variables.productCategory = productCategory;
        }
        if (userProfileId !== null) {
            variables.userProfileId = userProfileId;
        }

        const result = userProfileId !== null ? 
            await fetchContentUserProduct(variables) :
            await fetchContentProduct(variables);

        setItemData({
            ...itemData,
            data: result.data,
            loading: false,
            loadNext: false,
            message: result.message,
            refresh: false,
        });
    }

    const renderHeader = () => {
        return (
            <PostingHeader
                title={title}
                onSeeAllPress={() => {
                    navigation.navigate(nav, { title, userProfileId });
                }}
                productCategory={productCategory}
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
    if (horizontal) extraProps = {};
    if (productCategory === 'NEARBY_PLACE') extraProps.numColumns = 2;

    const renderCardContent = (item, index, isHorizontal) => (
        <CardContentProduct
            key={index}
            productCategory={productCategory}
            item={item}
            horizontal={isHorizontal}
            { ...extraProps }
        />
    )

    const renderItem = () => {
        if (horizontal) {
            if (typeof extraProps.numColumns !== 'undefined' && extraProps.numColumns === 2) {
                return (
                    <View
                        style={{flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8, ...style}}
                    >
                        {itemData.data.map((item, index) =>
                            renderCardContent(item, index, false)
                        )}
                    </View>
                )
            }

            return (
                <ScrollView
                    horizontal={horizontal}
                    showsHorizontalScrollIndicator={false}
                >
                    <View
                        style={{flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8, ...style}}
                    >
                        {itemData.data.map((item, index) =>
                            renderCardContent(item, index, true)
                        )}
                    </View>
                </ScrollView>
            )
        }

        return itemData.data.map((item, index) =>
            <Container
                key={index}
                style={{paddingHorizontal: 8, ...style}}
            >
                {renderCardContent(item, index, false)}
            </Container>
        )
    }

    if (!showEmpty && !itemData.loading && itemData.data.length === 0) {
        return <View />
    }

    return (
        <View
            style={{
                paddingTop: 8,
                paddingBottom: ['POSTING', 'NEARBY_PLACE'].includes(productCategory) ? 16 : 8
            }}
        >
            {showHeader && renderHeader()}

            {itemData.loading ?
                renderSkeleton()
            : itemData.data.length > 0 ?
                renderItem()
            :
                <ScreenEmptyData
                    message={`${name} belum tersedia`}
                    style={{width: width - 16, aspectRatio: 16/9}}
                />
            }
        </View>
    )
}

HighlightContentProduct.propTypes = propTypes;
HighlightContentProduct.defaultProps = defaultProps;
export default HighlightContentProduct;