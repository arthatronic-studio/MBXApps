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
import CardContentProduct from 'src/components/Content/CardContentProduct';
import { getAPI } from 'src/api-rest/httpService';
import imageAssets from 'assets/images';
import MasonryList from '@react-native-seoul/masonry-list';
import { FlatList } from 'react-native-gesture-handler';

const propTypes = {
    userProfileId: PropTypes.number,
    productCategory: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string,
    category: PropTypes.string,
    nav: PropTypes.string,
    refresh: PropTypes.bool,
    horizontal: PropTypes.bool,
    style: PropTypes.object,
    showHeader: PropTypes.bool,
    showEmpty: PropTypes.bool,
    showSeeAllText: PropTypes.bool,
};

const defaultProps = {
    userProfileId: null,
    productCategory: '',
    name: '',
    title: '',
    category: '',
    nav: '',
    refresh: false,
    horizontal: false,
    style: {},
    showHeader: true,
    showEmpty: false,
    showSeeAllText: true,
};

const HighlightFestArts = (props) => {
    const {
        userProfileId,
        productCategory,
        name,
        title,
        category,
        nav,
        refresh,
        horizontal,
        style,
        showHeader,
        showEmpty,
        showSeeAllText,
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
        const result = await getAPI('event');
        console.log('result event', result);
        let newData = [];
 
        if (result.status) {
            if(productCategory === 'FEST_ARTS_GRAFIC'){
                newData = [
                    {
                        id: 1,
                        image: imageAssets.arts1,
                        name: "Insinyur Joko Widodo",
                        width: 716,
                        height: 960,
                    },
                    {
                        id: 2,
                        image: imageAssets.arts3,
                        name: "Bob Marley",
                        width: 1024,
                        height: 1536,
                    },
                    {
                        id: 3,
                        image: imageAssets.arts2,
                        name: "Barong",
                        width: 600,
                        height: 450,
                    },
                ];
            }else if(productCategory === 'FEST_ARTS_ARCHITECTURE'){
                newData = [
                    {
                        id: 1,
                        image: imageAssets.arsitektur1,
                        name: 'Dupli Casa',
                        width: 600,
                        height: 364,
                    },
                    {
                        id: 2,
                        image: imageAssets.arsitektur2,
                        name: 'NIKO | Architect',
                        width: 564,
                        height: 399,
                    },
                    {
                        id: 3,
                        image: imageAssets.arsitektur3,
                        name: 'National Museum of Qatar',
                        width: 800,
                        height: 418,
                    }
                ];
            }else{
                newData = result.data;
            }
        }

        console.log(newData, "dataa", productCategory);

        setItemData({
            ...itemData,
            data: newData,
            loading: false,
            loadNext: false,
            message: result.message,
            refresh: false,
        });

        // let variables = {
        //     page: 1,
        //     itemPerPage:
        //         userProfileId !== null || productCategory === 'YOUTUBE_VIDEO' ? 1 :
        //         productCategory === 'NEARBY_PLACE' ? 4 :
        //         productCategory === 'POSTING' ? 3 :
        //         2,
        // }
        // if (productCategory) {
        //     variables.productCategory = productCategory;
        // }
        // if (userProfileId !== null) {
        //     variables.userProfileId = userProfileId;
        // }

        // const result = userProfileId !== null ? 
        //     await fetchContentUserProduct(variables) :
        //     await fetchContentProduct(variables);

        // setItemData({
        //     ...itemData,
        //     data: result.data,
        //     loading: false,
        //     loadNext: false,
        //     message: result.message,
        //     refresh: false,
        // });
    }

    const renderHeader = () => {
        return (
            <PostingHeader
                title={title}
                onSeeAllPress={() => {
                    navigation.navigate(nav, { title, userProfileId });
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

    let extraProps = { numColumns: 1 };
    if (horizontal) extraProps = {};
    if (productCategory === 'FEST_LITERATURE') extraProps.numColumns = 2;
    if (productCategory === 'FEST_ARTS_GRAFIC') extraProps.numColumns = 2;
    if (productCategory === 'FEST_ARTS_ARCHITECTURE') extraProps.numColumns = 2;
    if (productCategory === 'FEST_MUSIC_HORIZONTAL') extraProps.numColumns = 2;

    const renderCardContent = (item, index, isHorizontal) => (
        <CardContentProduct
            key={index}
            productCategory={productCategory}
            category={category}
            item={item}
            horizontal={isHorizontal}
            { ...extraProps }
        />
    )

    const renderItem = () => {
        if (horizontal) {
            if (typeof extraProps.numColumns !== 'undefined' && extraProps.numColumns === 2) {
                return (
                    <FlatList
                        data={itemData.data}
                        keyExtractor={(item, index) => item.id + index.toString()}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 8,
                        }}
                        renderItem={({ item, index }) =>
                            renderCardContent(item, index, false)
                        }
                    />
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
                <View style={{ width: '100%', aspectRatio: 16/9 }}>
                    <ScreenEmptyData
                        message={`${name} belum tersedia`}
                        style={{width: width - 16, aspectRatio: 16/9}}
                    />
                </View>
            }
        </View>
    )
}

HighlightFestArts.propTypes = propTypes;
HighlightFestArts.defaultProps = defaultProps;
export default HighlightFestArts;