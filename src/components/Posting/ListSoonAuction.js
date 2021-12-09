import React from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';
import CardSoonAuction from './CardSoonAuction';
import { Container, Row } from 'src/styled';
import PostingSkeleton from './PostingSkeleton';
import { ScreenEmptyData, Text } from '@src/components';

const defaultProps = {
    data: [],
    horizontal: false,
    onPress: () => {},
    style: {},
    showHeader: true,
    loading: false,
}

const ListSoonAuction = (props) => {
    const {
        data, horizontal, style, onPress, showHeader, loading
    } = props;

    const { width } = useWindowDimensions();

    const renderHeader = () => {
        return (
            <Container
                width='100%'
                align='center'
                justify='space-between'
                paddingHorizontal={16}
                style={{
                    flexDirection: 'row',
                }}
            >
                <Text type="bold">Pelalangan Akan Datang</Text>
            </Container>
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

    let extraProps = { numColumns: 2 };
    if (horizontal) extraProps = {};

    return (
        <View style={{flex: 1, paddingBottom: 8, paddingTop: showHeader ? 0 : 8, flexDirection: 'column'}}>
            {showHeader && renderHeader()}
            
            {loading ?
                renderSkeleton()
            :
                data.length ? 
                    data.map((item, idx) => {
                        return(
                            <CardSoonAuction
                                key={idx}
                                item={item}
                                onPress={() => onPress(item)}
                            />
                        )
                    })
                :
                    <ScreenEmptyData
                        message='Soon Auction belum tersedia'
                        style={{width: width - 16}}
                    />
            }
        </View>
    )
}

ListSoonAuction.defaultProps = defaultProps;

export default ListSoonAuction;