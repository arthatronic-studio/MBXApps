import React, {useState, useEffect, useRef} from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import { ScreenEmptyData, Text, useColor } from '@src/components';
import { useNavigation } from '@react-navigation/native';
import CardAuction from 'src/components/Posting/CardAuction';
import { Container, Row } from 'src/styled';
import PostingSkeleton from './PostingSkeleton';
import { queryGetAuction } from 'src/lib/query/auction';
import Client from 'src/lib/apollo';

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
    const [listProduct, setListProduct] = useState([]);
    const {Color} = useColor();
    const navigation = useNavigation();
    const { height, width } = useWindowDimensions();
    const isFocused = useIsFocused();

    useEffect(() => {
        getAuction();
    // });
    }, []);

    const getAuction = () => {
        let variables = {
          page: 1,
          limit: 10,
          type: "HOMEPAGE",
          status: "ONGOING",
        }
        
        Client.query({query: queryGetAuction, variables})
          .then(res => {
            console.log(res)
            // if (res.data.ecommerceProductList) {
            //   setListProduct(res.data.ecommerceProductList);
            // }
    
            // hideLoading();
            // navigation.navigate('TopUpScreen');
          })
          .catch(reject => {
            console.log(reject);
          });
      };

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
                <Text type="bold">Pelelangan Saat ini</Text>
            </Container>
        )
    }

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
            {showHeader && renderHeader()}

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