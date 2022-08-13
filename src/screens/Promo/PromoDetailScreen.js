import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, ScrollView, useWindowDimensions, Dimensions, Animated } from 'react-native';
import Styled from 'styled-components';
import ImagesPath from 'src/components/ImagesPath';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { TabView, TabBar } from 'react-native-tab-view';

import {
    useLoading,
    usePopup,
    useColor,
    Header
} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';

import { Container, Divider, Row } from '@src/styled';
import { shadowStyle } from '@src/styles';
import { adsPopup } from 'assets/images/popup';
import { FormatMoney } from 'src/utils';
import { isIphoneNotch, statusBarHeight } from 'src/utils/constants';

const TabBarHeight = 48;
const HeaderHeight = Dimensions.get('window').height / 1.9;
const tab1ItemSize = (Dimensions.get('window').width - 30) / 2;
const tab2ItemSize = (Dimensions.get('window').width - 40) / 3;

const TabScene = ({
    numCols,
    data,
    renderItem,
    onGetRef,
    scrollY,
    onScrollEndDrag,
    onMomentumScrollEnd,
    onMomentumScrollBegin,
}) => {
    const windowHeight = Dimensions.get('window').height;

    return (
        <Animated.FlatList
            scrollToOverflowEnabled={true}
            numColumns={numCols}
            ref={onGetRef}
            scrollEventThrottle={16}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                useNativeDriver: true,
            })}
            onMomentumScrollBegin={onMomentumScrollBegin}
            onScrollEndDrag={onScrollEndDrag}
            onMomentumScrollEnd={onMomentumScrollEnd}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListHeaderComponent={() => <View style={{ height: 10 }} />}
            contentContainerStyle={{
                paddingTop: HeaderHeight + TabBarHeight,
                paddingHorizontal: 10,
                minHeight: windowHeight - TabBarHeight,
            }}
            showsHorizontalScrollIndicator={false}
            data={data}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
        />
    );
};

const PromoDetailScreen = ({ navigation, route }) => {
    const { params } = route;

    const [state, setState] = useState();

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading] = useLoading();

    const { Color } = useColor();
    const { width, height } = useWindowDimensions();
    const [tabIndex, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'tab1', title: 'Deskripsi' },
        { key: 'tab2', title: 'Syarat & Ketentuan' },
    ]);
    const [tab1Data] = useState(Array(40).fill(0));
    const [tab2Data] = useState(Array(30).fill(0));
    const scrollY = useRef(new Animated.Value(0)).current;
    let listRefArr = useRef([]);
    let listOffset = useRef({});
    let isListGliding = useRef(false);

    useEffect(() => {
        scrollY.addListener(({ value }) => {
            const curRoute = routes[tabIndex].key;
            listOffset.current[curRoute] = value;
        });
        return () => {
            scrollY.removeAllListeners();
        };
    }, [routes, tabIndex]);

    const syncScrollOffset = () => {
        const curRouteKey = routes[tabIndex].key;
        listRefArr.current.forEach((item) => {
            if (item.key !== curRouteKey) {
                if (scrollY._value < HeaderHeight && scrollY._value >= 0) {
                    if (item.value) {
                        item.value.scrollToOffset({
                            offset: scrollY._value,
                            animated: false,
                        });
                        listOffset.current[item.key] = scrollY._value;
                    }
                } else if (scrollY._value >= HeaderHeight) {
                    if (
                        listOffset.current[item.key] < HeaderHeight ||
                        listOffset.current[item.key] == null
                    ) {
                        if (item.value) {
                            item.value.scrollToOffset({
                                offset: HeaderHeight,
                                animated: false,
                            });
                            listOffset.current[item.key] = HeaderHeight;
                        }
                    }
                }
            }
        });
    };

    const onMomentumScrollBegin = () => {
        isListGliding.current = true;
    };

    const onMomentumScrollEnd = () => {
        isListGliding.current = false;
        syncScrollOffset();
    };

    const onScrollEndDrag = () => {
        syncScrollOffset();
    };

    const renderHeader = () => {
        const y = scrollY.interpolate({
            inputRange: [0, HeaderHeight],
            outputRange: [0, -HeaderHeight],
            // extrapolateRight: 'clamp',
        });
        return (
            <Animated.View
                style={[
                    styles.header,
                    { backgroundColor: Color.theme, },
                    { transform: [{ translateY: y }]}
                ]}
            >
                <Header />

                <Container width={width} height={width * 0.7} paddingTop={16}>
                    <Image
                        source={adsPopup}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    />
                </Container>

                <View style={{ padding: 16 }}>
                    <Text size={16} type='medium' align='left' letterSpacing={0.15}>
                        Bursa Kuliner : Promo Makanan & Minuman s/d 90%
                    </Text>

                    <Divider />

                    <Container color={Color.primary} radius={8} padding={10}>
                        <Row>
                            <Container flex={1}>
                                <Text align='left' size={11} type='medium' color={Color.border} letterSpacing={0.5}>Periode Promo</Text>
                                <Text align='left' letterSpacing={0.25}>22 Juni - 22 Juli 2022</Text>
                            </Container>
                            <Container flex={1}>
                                <Text align='left' size={11} type='medium' color={Color.border} letterSpacing={0.5}>Periode Pemakaian</Text>
                                <Text align='left' letterSpacing={0.25}>Senin - Jumat</Text>
                            </Container>
                        </Row>
                        <Divider height={10} />
                        <Row>
                            <Container flex={1}>
                                <Text align='left' size={11} type='medium' color={Color.border} letterSpacing={0.5}>Min. Transaksi</Text>
                                <Text align='left' letterSpacing={0.25}>{FormatMoney.getFormattedMoney(100000)}</Text>
                            </Container>
                            <Container flex={1}>
                                <Text align='left' size={11} type='medium' color={Color.border} letterSpacing={0.5}>Penggunaan Promo</Text>
                                <Text align='left' letterSpacing={0.25}>Offline</Text>
                            </Container>
                        </Row>
                    </Container>
                </View>
            </Animated.View>
        );
    };

    const rednerTab1Item = ({ item, index }) => {
        return (
            <View
                style={{
                    borderRadius: 16,
                    marginLeft: index % 2 === 0 ? 0 : 10,
                    width: tab1ItemSize,
                    height: tab1ItemSize,
                    backgroundColor: '#aaa',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text>{index}</Text>
            </View>
        );
    };

    const rednerTab2Item = ({ item, index }) => {
        return (
            <View
                style={{
                    marginLeft: index % 3 === 0 ? 0 : 10,
                    borderRadius: 16,
                    width: tab2ItemSize,
                    height: tab2ItemSize,
                    backgroundColor: '#aaa',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text>{index}</Text>
            </View>
        );
    };

    const renderLabel = ({ route, focused }) => {
        return (
            <Text color={focused ? Color.primary : Color.disabled}>
                {route.title}
            </Text>
        );
    };

    const renderScene = ({ route }) => {
        const focused = route.key === routes[tabIndex].key;
        let numCols;
        let data;
        let renderItem;
        switch (route.key) {
            case 'tab1':
                numCols = 2;
                data = tab1Data;
                renderItem = rednerTab1Item;
                break;
            case 'tab2':
                numCols = 3;
                data = tab2Data;
                renderItem = rednerTab2Item;
                break;
            default:
                return null;
        }
        return (
            <TabScene
                numCols={numCols}
                data={data}
                renderItem={renderItem}
                scrollY={scrollY}
                onMomentumScrollBegin={onMomentumScrollBegin}
                onScrollEndDrag={onScrollEndDrag}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onGetRef={(ref) => {
                    if (ref) {
                        const found = listRefArr.current.find((e) => e.key === route.key);
                        if (!found) {
                            listRefArr.current.push({
                                key: route.key,
                                value: ref,
                            });
                        }
                    }
                }}
            />
        );
    };

    const renderTabBar = (props) => {
        const y = scrollY.interpolate({
            inputRange: [0, HeaderHeight],
            outputRange: [HeaderHeight, 0],
            extrapolateRight: 'clamp',
        });
        return (
            <Animated.View
                style={{
                    top: 0,
                    zIndex: 1,
                    position: 'absolute',
                    transform: [{ translateY: y }],
                    width: '100%',
                }}>
                <TabBar
                    {...props}
                    onTabPress={({ route, preventDefault }) => {
                        if (isListGliding.current) {
                            preventDefault();
                        }
                    }}
                    style={[styles.tab, { backgroundColor: Color.theme }]}
                    renderLabel={renderLabel}
                    indicatorStyle={{
                        backgroundColor: Color.primary
                    }}
                />
            </Animated.View>
        );
    };

    const renderTabView = () => {
        return (
            <TabView
                onIndexChange={(index) => setIndex(index)}
                navigationState={{ index: tabIndex, routes }}
                renderScene={renderScene}
                renderTabBar={renderTabBar}
                initialLayout={{
                    height: 0,
                    width: Dimensions.get('window').width,
                }}
            />
        );
    };

    return (
        <Scaffold
        
        >
            {renderHeader()}
            {renderTabView()}
        </Scaffold>
    );
};

const styles = StyleSheet.create({
    header: {
        top: isIphoneNotch() ? statusBarHeight : 0,
        // height: HeaderHeight,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    },
    tab: { elevation: 0, shadowOpacity: 0 },
});

export default PromoDetailScreen;