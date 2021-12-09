import React from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';

import { ScreenEmptyData } from '@src/components';
import CardAuction from 'src/components/Posting/CardAuction';
import { Container, Row } from 'src/styled';
import PostingSkeleton from './PostingSkeleton';

const defaultProps = {
    data: [],
    subData: [],
    horizontal: false,
    onPress: () => {},
    style: {},
    // additional
    showAll: true,
    onPressShowAll: () => {},
    showHeader: true,
    loading: false,
}

const ListAuction = (props) => {
    const {
        data, horizontal, style, onPress, showHeader, loading
    } = props;

    const { width } = useWindowDimensions();

    const renderskeleton = () => {
        return (
            <Container paddingLeft={16} paddingTop={16} paddingRight={32}>
                <Row>
                    <PostingSkeleton/>
                    <PostingSkeleton/>
                </Row>
            </Container>
        )
    }

    let extraProps = { numColumns: 2 };
    if (horizontal) extraProps = {};

    return (
        <View style={{flex: 1, paddingBottom: 8, paddingTop: showHeader ? 0 : 8, flexDirection: 'column'}}>
            {loading ? 
                renderskeleton()
            :    
                <FlatList
                    key='ListAuction'
                    keyExtractor={(item, index) => item.toString() + index}
                    data={data}
                    {...extraProps}
                    horizontal={horizontal}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingTop: 16, paddingHorizontal: 8, ...style}}
                    renderItem={({ item, index }) => {
                        return (
                            <CardAuction
                                item={item}
                                numColumns={2}
                                horizontal={horizontal}
                                onPress={() => onPress(item)}
                            />
                        )
                    }}
                    ListEmptyComponent={() => {
                        return (
                            <ScreenEmptyData
                                message='Lelang belum tersedia'
                                style={{ width: width-16 }}
                            />
                        )
                    }}
                />
            }
        </View>
    )
}

ListAuction.defaultProps = defaultProps;

export default ListAuction;