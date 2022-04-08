import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, useWindowDimensions } from 'react-native';
import Styled from 'styled-components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import { trackPlayerPlay } from '@src/utils/track-player-play';
import { Container, Divider } from 'src/styled';
import client from 'src/lib/apollo';
import { queryAddLike, queryContentProduct } from 'src/lib/query';
import { useNavigation } from '@react-navigation/native';
import { accessClient } from 'src/utils/access_client';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import { useSelector } from 'react-redux';
import { statusBarHeight } from 'src/utils/constants';

const MainView = Styled(View)`
`;

const defaultProps = {
    componentType: '',
    showAll: false,
    showHeader: true,
    withNumber: true,
    onPress: () => { },
    onLongPress: () => { },
    onPressShowAll: () => { },
    stickyHeaderIndices: [],
    ListHeaderComponent: null,
    topComponent: null,
    parentProductId: null,
    useCover: true,
}

const CardListMusic = ({
    activePlayingTrack,
    componentType, title, decimalWidth, decimalHeight, showAll, showHeader, withNumber,
    onPress, onLongPress, onPressShowAll, stickyHeaderIndices, ListHeaderComponent,
    topComponent, parentProductId, useCover,
}) => {
    const { Color } = useColor();
    const { width } = useWindowDimensions();
    const navigation = useNavigation();
    const user = useSelector(
        state => state['user.auth'].login.user
    );

    const [list, setList] = useState({
        data: [],
        loading: false,
        message: 'error',
    });
    const initialSelected = {
        id: -1,
        idx: -1,
        name: '',
    };
    const [selected, setSelected] = useState(initialSelected);

    useEffect(() => {
        fetchContentProduct();
    }, []);

    const fetchContentProduct = () => {
        const variables = {
            page: 1,
            itemPerPage: 50,
            productType: accessClient.InitialCode,
            productCategory: "MUSIC",
            // productSubCategory: "POPULAR"
        };

        if (parentProductId) {
            variables.parentProductId = parentProductId;
        }

        client.query({
            query: queryContentProduct,
            variables,
        })
            .then((res) => {
                console.log('res', res);

                let newData = [];
                if (res.data.contentProduct) {
                    newData = res.data.contentProduct;
                }

                setList({
                    ...list,
                    data: newData,
                    loading: false,
                    message: ''
                });
            })
            .catch((err) => {
                console.log('err', err);

                setList({
                    ...list,
                    loading: false,
                    message: ''
                });
            })
    }

    useEffect(() => {
        const timeout = selected.id !== -1 ? setTimeout(() => {
            fetchContentAddLike();
        }, 500) : null;

        return () => {
            clearTimeout(timeout);
        }
    }, [selected]);

    const fetchContentAddLike = () => {
        // showLoading();

        client.query({
            query: queryAddLike,
            variables: {
                productId: selected.id
            }
        })
            .then((res) => {
                console.log(res, 'res add like');

                if (res.data.contentAddLike.id) {
                    // onSuccessLike(id);

                    let newData = [...list.data];

                    if (res.data.contentAddLike.status === 1) {
                        // showLoading('success', 'Disukai');
                        newData[selected.idx].like += 1;
                        newData[selected.idx].im_like = true;

                        GALogEvent('Musik Populer', {
                            id: selected.id,
                            product_name: item.name,
                            user_id: user ? user.userId : '',
                            method: analyticMethods.like,
                        });
                    } else {
                        // showLoading('info', 'Batal menyukai');
                        newData[selected.idx].like -= 1;
                        newData[selected.idx].im_like = false;
                    }

                    setList({
                        ...list,
                        data: newData,
                    });
                } else {
                    // showLoading('error', 'Gagal menyukai');
                }

                setSelected(initialSelected);
            })
            .catch((err) => {
                console.log(err, 'err add like');

                setSelected(initialSelected);

                // showLoading('error', 'Gagal menyukai');
            })
    }

    const renderItemPopular = (item, index) => {
        if (item.header) {
            return item.header;
        }

        const isActive = activePlayingTrack && activePlayingTrack.id === item.code;
        const textType = isActive ? 'bold' : 'medium';

        return (
            <View style={{ flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center', marginBottom: 6 }}>
                {withNumber && <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <Text size={18} type={textType}>{index + 1}</Text>
                </View>}
                <TouchableOpacity
                    style={{ flex: 11 }}
                    onPress={async() => {
                        // const newData = [];
                        // list.data.map((e) => {
                        //     if (!e.header) {
                        //         newData.push(e);
                        //     }
                        // });
                        // console.log('here', list.data);
                        await trackPlayerPlay(list.data, index);
                        navigation.navigate('MusicPlayerScreen');
                    }}
                    onLongPress={() => onLongPress(item)}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 5, flexDirection: 'row', alignItems: 'center' }}>
                            {useCover ? <Image
                                source={{ uri: item.image }}
                                style={{ height: width * (decimalHeight || 0.2), width: width * (decimalWidth || 0.2), borderRadius: 8, borderWidth: isActive ? 2 : 0, borderColor: Color.primary }}
                            />
                            :
                                <View style={{ height: 40 }} />
                            }
                            
                            <View style={{ paddingLeft: 16 }}>
                                <Text type={textType} align='left' numberOfLines={2}>{item.productName}</Text>
                                <Divider height={2} />
                                <Text size={10} type={textType} align='left' numberOfLines={1} style={{ opacity: 0.6 }}>{item.productDescription}</Text>

                                <View style={{ flexDirection: 'row' }}>
                                    {/* <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 12}}>
                                        <SimpleLineIcons name='emotsmile' size={10} color={item && item.im_like ? Color.secondary : Color.text} />
                                        <Text size={12} color={item && item.im_like ? Color.secondary : Color.text} style={{marginTop: 3}}> {item && item.like ? item.like : 0}</Text>
                                    </View> */}

                                    {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <MaterialIcons name='comment' size={10} color={Color.text} />
                                        <Text size={12} style={{marginTop: 3}}> {item && item.comment ? item.comment : 0}</Text>
                                    </View> */}
                                </View>
                            </View>
                        </View>

                        {/* <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text>{item.like}</Text>
                            <Divider width={8} />
                            <TouchableOpacity
                                onPress={() => setSelected({
                                    id: item.id,
                                    idx: index,
                                    name: item.productName,
                                })}
                            >
                                <Container radius={50} padding={8} style={{ borderWidth: 1.5, borderColor: item.im_like ? Color.info : Color.text }}>
                                    <FontAwesome
                                        size={16}
                                        name='thumbs-o-up'
                                        color={item.im_like ? Color.info : Color.text}
                                    />
                                </Container>
                            </TouchableOpacity>
                        </View> */}

                        <TouchableOpacity
                            onPress={() => setSelected({
                                id: item.id,
                                idx: index,
                                name: item.productName,
                            })}
                            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}
                        >
                            <Text>{item.like}</Text>
                            <Divider width={8} />
                            <Container radius={50}>
                                {item.im_like ?
                                    <Ionicons name='heart' color={Color.error} size={20} />
                                    :
                                    <SimpleLineIcons name='heart' color={Color.text} size={16} />
                                }
                            </Container>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const renderItemDefault = (item, index) => {
        return (
            <TouchableOpacity
                onPress={async() => {
                    onPress(item);
                    await trackPlayerPlay(list.data, index);
                    navigation.navigate('MusicPlayerScreen');
                }}
                style={[{ marginRight: 10 }, index === 0 && { marginLeft: 16 }]}
            >
                <Image source={{ uri: item.image }} style={{ height: width * (decimalHeight || 0.3), width: width * (decimalWidth || 0.25), borderRadius: 4 }} />
                <Text size={10} style={{ marginTop: 6 }} numberOfLines={2}>{item.productName}</Text>
            </TouchableOpacity>
        )
    }

    if (list.data.length === 0) {
        if (topComponent) {
            return (
                <Container paddingTop={8}>
                    {topComponent}
                </Container>
            );
        }

        return <View />
    };

    if (componentType === 'POPULAR') {
        return (
            <MainView>
                <FlatList
                    keyExtractor={(item, index) => item.toString() + index}
                    data={list.data}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingTop: 8, paddingBottom: statusBarHeight }}
                    stickyHeaderIndices={stickyHeaderIndices}
                    ListHeaderComponent={ListHeaderComponent}
                    renderItem={({ item, index }) => {
                        if (index === 0 && topComponent) {
                            return (
                                <>
                                    {topComponent}
                                    {showHeader && <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, paddingTop: 24, paddingHorizontal: 16 }}>
                                        <Text type='bold'>{title}</Text>
                                        {showAll && <Text onPress={() => onPressShowAll()}>Lihat Semua</Text>}
                                    </View>}
                                    {renderItemPopular(item, index)}
                                </>
                            )
                        }

                        return renderItemPopular(item, index);
                    }}
                />
            </MainView>
        )
    }

    return (
        <MainView>
            <FlatList
                keyExtractor={(item, index) => item.toString() + index}
                data={list.data}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    if (index === 0 && topComponent) {
                        return (
                            <>
                                {topComponent}
                                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, paddingTop: 24, paddingHorizontal: 16 }}>
                                    <Text size={12}>{title}</Text>
                                    {showAll && <Text onPress={() => onPressShowAll()} size={12} color={Color.primary}>Lihat Semua</Text>}
                                </View>
                                {renderItemDefault(item, index)}
                            </>
                        )
                    }

                    return renderItemDefault(item, index);
                }}
            />
        </MainView>
    )
}

CardListMusic.defaultProps = defaultProps;
export default CardListMusic;