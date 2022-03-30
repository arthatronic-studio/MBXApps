import React, { useState, useRef, useEffect } from 'react'
import { View, SafeAreaView, Image, Animated, useWindowDimensions } from 'react-native';
import { TouchableOpacity as TouchableOpacityAbs } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import Text from '@src/components/Text';
import TouchableOpacity from 'src/components/Button/TouchableDebounce';
import { useColor } from '@src/components/Color';

import { shadowStyle } from 'src/styles';
import { CommonActions } from '@react-navigation/routers';
import { startAnimation } from '@src/utils/animations';
import { Divider, Line } from 'src/styled';
import { isIphoneNotch } from 'src/utils/constants';

const TabBarComponentSabyan = (props) => {
    const { state } = props;

    const { index: activeRouteIndex } = state;
        
    const [menus] = useState([
        {id: 'ber', name: 'Beranda', iconName: 'home', iconType: 'Entypo', nav: 'MainHome', ref: useRef(new Animated.Value(1)).current, viewRef: useRef(new Animated.Value(0)).current },
        // {id: 'mer', name: 'Merch', iconName: 'store', iconType: 'MaterialIcons', nav: 'MyShopHomepage', ref: useRef(new Animated.Value(0.4)).current, viewRef: useRef(new Animated.Value(1)).current },
        {id: 'med', name: 'Album', iconName: 'play', iconType: 'EvilIcons', nav: 'MainMediaPlayer', ref: useRef(new Animated.Value(0.4)).current, viewRef: useRef(new Animated.Value(1)).current },
        {id: 'pro', name: 'Profil', iconName: 'person', iconType: 'Ionicons', nav: 'MainProfile', ref: useRef(new Animated.Value(0.4)).current, viewRef: useRef(new Animated.Value(1)).current },
    ]);
    
    const { Color } = useColor();
    const { width, height } = useWindowDimensions();
    
    const bgAnimatedRef = useRef(new Animated.Value(width / menus.length)).current;

    useEffect(() => {
        menus.map((_, i) => {
            startAnimation(_.ref, i === activeRouteIndex ? 1 : 0.4);
            startAnimation(_.viewRef, i === activeRouteIndex ? 0 : 1);

            Animated.spring(bgAnimatedRef, {
                toValue: activeRouteIndex * (width / menus.length),
                velocity: 10,
                useNativeDriver: true,
            }).start();
        });
    }, [activeRouteIndex, width]);

    const redirectTo = (name, params) => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name, params }
                ],
            })
        );
    }

    const getIconMenu = (iconType, iconName, isRouteActive) => {
        switch(iconType) {
            case 'MaterialIcons':
                return <MaterialIcons name={iconName} size={32} color={isRouteActive ? Color.primary : Color.gray} />
            case 'AntDesign':
                return <AntDesign name={iconName} size={28} color={isRouteActive ? Color.primary : Color.gray} />
            case 'Ionicons': 
                return <Ionicons name={iconName} size={28} color={isRouteActive ? Color.primary : Color.gray} />
            case 'Entypo':
                return <Entypo name={iconName} size={30} color={isRouteActive ? Color.primary : Color.gray} />
            case 'Feather':
                return <Feather name={iconName} size={30} color={isRouteActive ? Color.primary : Color.gray} />
            case 'EvilIcons':
                return <EvilIcons name={iconName} size={40} color={isRouteActive ? Color.primary : Color.gray} />
        }
    }

    return (
        <SafeAreaView
            style={{
                width,
                height: isIphoneNotch() ? height * ((height/width) / 15) : 112,
                backgroundColor: Color.theme,
                paddingBottom: 16,
            }}
        >
            {activeRouteIndex < menus.length && <Animated.View
                style={{
                    // height: 30,
                    // width: 30,
                    position: 'absolute',
                    left: (width / menus.length) / 2 - 15 - 32,
                    top: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // backgroundColor: activeRouteIndex === 2 ? 'transparent' : Color.primary,
                    transform: [{ translateX: bgAnimatedRef }],
                }}
            >
                {menus[activeRouteIndex].image !== '' && <Image
                    source={menus[activeRouteIndex].image}
                    style={{height: 20, width: 20, transform: [{ rotate: '330deg' }]}}
                    resizeMode='contain'
                />}
            </Animated.View>}

            <Line
                width={width}
                height={0.5}
                color={Color.border}
                style={{position: 'absolute', top: 0}}
            />

            <View style={{paddingHorizontal: 16, paddingTop: 16, paddingBottom: 2}}>
                <View
                    style={{
                        flexDirection: 'row',
                        height: '100%',
                        width: '100%',
                        backgroundColor: Color.theme,
                        borderRadius: 120,
                        ...shadowStyle,
                    }}
                >
                    {menus.map((route, routeIndex) => {
                        const isRouteActive = routeIndex === activeRouteIndex;

                        return (
                            <TouchableOpacity
                                key={routeIndex}
                                activeOpacity={1}
                                style={{
                                    width: (width - 32) / menus.length,
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    if (route.nav === 'MainHome') {
                                        redirectTo(route.nav);
                                        return;                                    
                                    }

                                    props.navigation.navigate(route.nav, { routeIndex });
                                }}
                            >
                                <Animated.View
                                    style={{
                                        // height: 30,
                                        // width: 30,
                                        position: 'absolute',
                                        top: 12,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        // backgroundColor: routeIndex === 2 ? 'transparent' : Color.primary,
                                        // opacity: route.viewRef,
                                    }}
                                >
                                    {getIconMenu(route.iconType, route.iconName, isRouteActive)}
                                </Animated.View>

                                <Animated.Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '500',
                                        color: isRouteActive ? Color.primary : Color.text,
                                        position: 'absolute',
                                        bottom: 12,
                                        opacity: route.ref,
                                    }}
                                >
                                    {route.name}
                                </Animated.Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
        </SafeAreaView>
    )
}

export default TabBarComponentSabyan;