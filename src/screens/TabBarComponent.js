import React, { useState, useRef, useEffect } from 'react'
import { View, SafeAreaView, Image, Animated, useWindowDimensions, LayoutAnimation, UIManager, Platform, } from 'react-native';
import { TouchableOpacity as TouchableOpacityAbs } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';

import Text from '@src/components/Text';
import TouchableOpacity from 'src/components/Button/TouchableDebounce';
import { useColor } from '@src/components/Color';

import { shadowStyle } from 'src/styles';
import { CommonActions } from '@react-navigation/routers';
import { startAnimation } from '@src/utils/animations';
import { Divider, Line } from 'src/styled';
import { isIphoneNotch, statusBarHeight } from 'src/utils/constants';

const sizePerMenu = 24;

const TabBarComponent = (props) => {
    const { state } = props;

    const { index: activeRouteIndex } = state;
        
    const [menus] = useState([
        {id: 'ber', name: 'Beranda', iconName: 'home', iconType: 'Entypo', nav: 'MainHome', ref: useRef(new Animated.Value(1)).current, viewRef: useRef(new Animated.Value(0)).current },
        // {id: 'mer', name: 'Ecommerce', iconName: 'store', iconType: 'MaterialIcons', nav: 'Ecommerce', ref: useRef(new Animated.Value(0.4)).current, viewRef: useRef(new Animated.Value(1)).current },
        {id: 'pro', name: 'Profil', iconName: 'person', iconType: 'Ionicons', nav: 'MainProfile', ref: useRef(new Animated.Value(0.4)).current, viewRef: useRef(new Animated.Value(1)).current },
    ]);
    
    const { Color } = useColor();
    const { width } = useWindowDimensions();
    
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
                return <MaterialIcons name={iconName} size={32} color={isRouteActive ? Color.textInput : Color.secondary} />
            case 'AntDesign':
                return <AntDesign name={iconName} size={28} color={isRouteActive ? Color.textInput : Color.secondary} />
            case 'Ionicons': 
                return <Ionicons name={iconName} size={28} color={isRouteActive ? Color.textInput : Color.secondary} />
            case 'Entypo':
                return <Entypo name={iconName} size={30} color={isRouteActive ? Color.textInput : Color.secondary} />
        }
    }

    return (
        <SafeAreaView
            style={{
                width: '100%',
                height: 45 + 16 + (isIphoneNotch() ? 32 : 16),
                backgroundColor: Color.theme,
            }}
        >
            <Line
                width={width}
                height={0.5}
                color={Color.border}
                style={{position: 'absolute', top: 0}}
            />

            <View
                style={{
                    width: '100%',
                    height: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16
                }}
            >
                {menus.map((route, routeIndex) => {
                    const isRouteActive = routeIndex === activeRouteIndex;

                    return (
                        <TouchableOpacity
                            key={routeIndex}
                            activeOpacity={1}
                            style={{
                                flex: isRouteActive ? 3 : 1,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                paddingTop: 16,
                                paddingBottom: isIphoneNotch() ? 0 : 16,
                            }}
                            onPress={() => {
                                if (Platform.OS === 'ios') {
                                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                } else {
                                    // UIManager.setLayoutAnimationEnabledExperimental &&
                                    //     UIManager.setLayoutAnimationEnabledExperimental(true);
                                }

                                if (route.nav === 'MainHome') {
                                    redirectTo(route.nav);
                                    return;                                    
                                }

                                props.navigation.navigate(route.nav, { routeIndex });
                            }}
                        >
                            <Animated.View
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    borderRadius: 120,
                                    alignItems: 'center',
                                    paddingLeft: isRouteActive ? 16 : 0,
                                    justifyContent: isRouteActive ? 'flex-start' : 'center',
                                    flexDirection: 'row',
                                    backgroundColor: isRouteActive ? Color.primary : 'transparent',
                                    // opacity: route.viewRef,
                                    opacity: route.ref,
                                }}
                            >
                                {getIconMenu(route.iconType, route.iconName, isRouteActive)}
                                {isRouteActive && <Divider width={15} />}
                                {isRouteActive && <Animated.Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '500',
                                        color: isRouteActive ? Color.textInput : Color.secondary,
                                        opacity: route.ref,
                                    }}
                                >
                                    {route.name}
                                </Animated.Text>}
                            </Animated.View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </SafeAreaView>
    )
}

export default TabBarComponent;