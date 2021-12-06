import React from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';

import { ScreenEmptyData, useColor } from '@src/components';
import CardEvent from 'src/components/Posting/CardEvent';
import { useNavigation } from '@react-navigation/core';
import PostingHeader from './PostingHeader';
import { Container, Row } from 'src/styled';
import PostingSkeleton from './PostingSkeleton';

const propTypes = {
    data: PropTypes.array,
    horizontal: PropTypes.bool,
    style: PropTypes.object,
    onPress: PropTypes.func,
    showHeader: PropTypes.bool,
    loading: PropTypes.bool,
}

const defaultProps = {
    data: [],
    horizontal: false,
    style: {},
    onPress: () => {},
    showHeader: true,
    loading: false,
}

const ListEvent = (props) => {
    const {
        data,
        horizontal,
        style,
        onPress,
        showHeader,
        loading,
    } = props;

    const { Color } = useColor();
    const navigation = useNavigation();
    const { width } = useWindowDimensions();

    const renderHeader = () => {
        return (
            <PostingHeader
                title='Event Terbaru'
                onSeeAllPress={() => {
                    navigation.navigate('EventScreen', {title: 'Event Terbaru'})
                }}
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
        <View style={{paddingBottom: 8}}>
            {showHeader && renderHeader()}

            {loading ?
                renderSkeleton()
            :
                <FlatList
                    key='List'
                    keyExtractor={(item, index) => item.toString() + index}
                    data={data}
                    numColumns={1}
                    horizontal={horizontal}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingTop: 16, paddingHorizontal: 8, ...style}}
                    renderItem={({ item, index }) => {
                        return (
                            <CardEvent
                                item={item}
                                numColumns={1}
                                horizontal={horizontal}
                                onPress={() => onPress(item)}
                            />
                        )
                    }}
                    ListEmptyComponent={() => {
                        return (
                            <ScreenEmptyData
                                message='Event belum tersedia'
                                style={{width: width - 16}}
                            />
                        )
                    }}
                />
            }
        </View>
    )
}

ListEvent.propTypes = propTypes;
ListEvent.defaultProps = defaultProps;
export default ListEvent;