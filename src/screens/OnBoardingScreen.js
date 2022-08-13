import React, { useRef, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Animated,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import {
    Submit,
    usePopup,
    useColor
} from '@src/components';
import Scaffold from '@src/components/Scaffold';

import HeaderBig from 'src/components/HeaderBig';
import client from 'src/lib/apollo';
import { queryBannerList } from 'src/lib/query/banner';
import { onBoarding1, onBoarding2, onBoarding3 } from 'assets/images';

const listBoarding = [
    {imageAsset: onBoarding1, title: 'SELAMAT DATANG DI APLIKASI', subTitle: 'Cari apapun yang kamu butuhkan disini dengan mudah, hanya dengan sentuhan jari di satu aplikasi.'},
    {imageAsset: onBoarding2, title: 'SALING TERKONEKSI', subTitle: 'Makin mudah menjalin relasi dan berkomunikasi dengan sesama member/anggota bahkan yang jauh sekalipun.'},
    {imageAsset: onBoarding3, title: 'YUK LOGIN', subTitle: 'Login Sekarang'},
];

const DOT_SIZE = 32;

const Item = ({
    title,
    subTitle,
    image,
    imageAsset,
    scrollOffsetAnimatedValue,
}) => {
    const { Color } = useColor();

    const inputRange = [0, 0.5, 0.99];
    const inputRangeOpacity = [0, 0.5, 0.99];
    const scale = scrollOffsetAnimatedValue.interpolate({
        inputRange,
        outputRange: [1, 0, 1],
    });

    const opacity = scrollOffsetAnimatedValue.interpolate({
        inputRange: inputRangeOpacity,
        outputRange: [1, 0, 1],
    });

    return (
        <View style={styles.itemStyle}>
            <View style={{ flex: 1 }} />

            <View style={{ flex: 4, justifyContent: 'center' }}>
                <Animated.Image
                    source={imageAsset}
                    style={[
                        styles.imageStyle,
                        {
                            transform: [{ scale }],
                        },
                    ]}
                />
            </View>

            <View style={{ flex: 1, paddingHorizontal: 32 }}>
                <Animated.Text
                    style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Medium',
                        color: Color.text,
                        opacity,
                        marginBottom: 8,
                        textAlign: 'center',
                    }}
                >
                    {title}
                </Animated.Text>
                {subTitle !== '' && <Animated.Text
                    style={{
                        fontSize: 11,
                        fontFamily: 'Inter-Regular',
                        color: Color.text,
                        opacity,
                        textAlign: 'center',
                    }}
                >
                    {subTitle}
                </Animated.Text>}
            </View>
        </View>
    );
};

const Pagination = ({
    data,
    scrollOffsetAnimatedValue,
    positionAnimatedValue,
    indexPosition,
}) => {
    const { Color } = useColor();

    const inputRange = [0, data.length];
    const translateX = Animated.add(
        scrollOffsetAnimatedValue,
        positionAnimatedValue
    ).interpolate({
        inputRange,
        outputRange: [0, data.length * DOT_SIZE],
    });

    return (
        <View style={[styles.pagination]}>
            {/* <Animated.View
                style={[
                    styles.paginationIndicator,
                    {
                        borderColor: Color.primary,
                        position: 'absolute',
                        transform: [{ translateX: translateX }],
                    },
                ]}
            /> */}
            
            {data.map((item, idx) => {
                return (
                    <View key={idx} style={styles.paginationDotContainer}>
                        <View
                            style={[styles.paginationDot, { backgroundColor: indexPosition === idx ? Color.primaryDark : Color.border }]}
                        />
                    </View>
                );
            })}
        </View>
    );
};

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const OnBoardingScreen = ({ navigation }) => {
    const { Color } = useColor();
    const [popupProps, showPopup] = usePopup();
    const pagerViewRef = useRef();

    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const user = useSelector(state => state['user.auth'].login.user);
    const { loading, error } = useSelector(state => state['user.auth']);

    // const [listBoarding, setListBoarding] = useState([]);
    // const [loadingBoarding, setLoadingBoarding] = useState(true);

    useEffect(() => {
        dispatch({ type: 'USER.CLEAR_LOADING' });
    }, []);

    useEffect(() => {
        if (isFocused) {
            if (user) {
                redirectTo('MainPage');
            } else {
                // fetchOnBoarding();
            }
        }
    }, [user, error, isFocused]);

    // const fetchOnBoarding = () => {
    //     const variables = {
    //         categoryId: 5
    //     };

    //     client.query({
    //         query: queryBannerList,
    //         variables,
    //     })
    //     .then((res) => {
    //         console.log('res onboarding', res);

    //         const data = res.data.bannerList;
    //         let newData = [];

    //         if (Array.isArray(data)) {
    //             newData = data.reverse();
    //         }

    //         if (newData.length === 0) {
    //             redirectTo('LoginScreen');
    //         }

    //         setListBoarding(newData);
    //         setLoadingBoarding(false);
    //     })
    //     .catch((err) => {
    //         console.log('err onboarding', err);

    //         setLoadingBoarding(false);
    //         redirectTo('LoginScreen');
    //     });
    // }

    const redirectTo = nav => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: nav }],
            }),
        );
    };

    const scrollOffsetAnimatedValue = useRef(new Animated.Value(0)).current;
    const positionAnimatedValue = useRef(new Animated.Value(0)).current;

    const [indexPosition, setIndexPosition] = useState(0);

    const isFinish = indexPosition === (listBoarding.length - 1);

    return (
        <Scaffold
            header={
                user ?
                    <View />
                    :
                    <HeaderBig
                        title=' '
                        titleRight='Lewati'
                        titleRightColor={Color.text}
                        onPressRightButton={() => redirectTo('LoginScreen')}
                        style={{ backgroundColor: 'transparent', paddingTop: 16 }}
                    />
            }
            fallback={user || loading}
            popupProps={popupProps}
        >
            <AnimatedPagerView
                ref={pagerViewRef}
                initialPage={0}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPageScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                offset: scrollOffsetAnimatedValue,
                                position: positionAnimatedValue,
                            },
                        },
                    ],
                    {
                        listener: ({ nativeEvent: { offset, position } }) => {
                            setIndexPosition(position);
                        },
                        useNativeDriver: true,
                    }
                )}
            >
                {listBoarding.map((item, index) => (
                    <View
                        key={index}
                        collapsable={false}
                        style={{
                            flex: 1,
                        }}
                    >
                        <Item
                            {...item}
                            scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
                            positionAnimatedValue={positionAnimatedValue}
                        />
                    </View>
                ))}
            </AnimatedPagerView>

            <Pagination
                data={listBoarding}
                scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
                positionAnimatedValue={positionAnimatedValue}
                indexPosition={indexPosition}
            />

            <Submit
                buttonLabel={isFinish ? "Login" : "Lanjut"}
                buttonColor={Color.primary}
                type="bottomSingleButton"
                buttonBorderTopWidth={0}
                onPress={() => {
                    // dispatch(guestLogin());

                    if (isFinish) {
                        redirectTo('LoginScreen');
                    } else {
                        pagerViewRef.current.setPage(indexPosition + 1);
                    }
                }}
                style={{ backgroundColor: 'transparent' }}
            />
        </Scaffold>
    );
}

const styles = StyleSheet.create({
    itemStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    imageStyle: {
        flex: 0.8,
        aspectRatio: 1,
        resizeMode: 'contain',
    },
    pagination: {
        alignSelf: 'center',
        flexDirection: 'row',
        height: DOT_SIZE,
    },
    paginationDot: {
        width: DOT_SIZE * 0.3,
        height: DOT_SIZE * 0.3,
        borderRadius: DOT_SIZE * 0.15,
    },
    paginationDotContainer: {
        width: DOT_SIZE / 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paginationIndicator: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        borderWidth: 2,
    },
});

export default OnBoardingScreen;