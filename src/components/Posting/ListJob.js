import React from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';

import { useColor } from '@src/components';
import CardJob from 'src/components/Posting/CardJob';
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

const ListJob = (props) => {
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

    const renderHeader = () => {
        return (
            <PostingHeader
                title='Lowongan Pekerjaan'
                onSeeAllPress={() => {
                    navigation.navigate('JobScreen', {title: 'Lowongan Pekerjaan'})
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
                    key='ListJob'
                    keyExtractor={(item, index) => item.toString() + index}
                    data={data}
                    numColumns={1}
                    horizontal={horizontal}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingTop: 16, paddingHorizontal: 8, ...style}}
                    renderItem={({ item, index }) => {
                        return (
                            <CardJob
                                item={item}
                                numColumns={1}
                                onPress={() => onPress(item)}
                            />
                        )
                    }}
                />
            }
        </View>
    )
}

ListJob.propTypes = propTypes;
ListJob.defaultProps = defaultProps;
export default ListJob;