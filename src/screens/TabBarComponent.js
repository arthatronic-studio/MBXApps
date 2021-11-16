import React, { useState, useRef, useEffect } from 'react'
import { View, SafeAreaView, Image, Animated, useWindowDimensions } from 'react-native';
import { TouchableOpacity as TouchableOpacityAbs } from 'react-native-gesture-handler';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';

import Text from '@src/components/Text';
import TouchableOpacity from 'src/components/Button/TouchableDebounce';
import { useColor } from '@src/components/Color';

import { shadowStyle } from 'src/styles';
import { CommonActions } from '@react-navigation/routers';
import { isIphoneNotch } from 'src/utils/constants';
import { startAnimation } from '@src/utils/animations';
import { Divider, Line } from 'src/styled';

const Scaler = Styled(View)`
    flexDirection: row;
    height: 100%;
    width: 100%;
`;

const TabBarComponent = (props) => {
    const { state } = props;

    const { index: activeRouteIndex } = state;
        
    const [menus] = useState([
        {id: 'ber', name: 'Beranda', iconName: 'home', iconType: 'Entypo', nav: 'MainHome', ref: useRef(new Animated.Value(1)).current, viewRef: useRef(new Animated.Value(0)).current },
        {id: 'eme', name: 'Emergency', iconName: 'vibration', iconType: 'MaterialIcons', nav: 'CreateEmergencyScreen', ref: useRef(new Animated.Value(0.4)).current, viewRef: useRef(new Animated.Value(1)).current },
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
                return <MaterialIcons name={iconName} size={33} color={isRouteActive ? Color.textInput : Color.textInput} />
            case 'AntDesign':
                return <AntDesign name={iconName} size={20} color={isRouteActive ? Color.primary : Color.gray} />
            case 'Ionicons': 
                return <Ionicons name={iconName} size={20} color={isRouteActive ? Color.primary : Color.gray} />
            case 'Entypo':
                return <Entypo name={iconName} size={22} color={isRouteActive ? Color.primary : Color.gray} />
        }
    }

    const renderFloatingMenu = () => {
        const isRouteActive = 1 === activeRouteIndex;

        return (
            <View
                style={{
                    bottom: 70 + (isIphoneNotch() ? 23 : 28),
                    height: width / 5 - 8,
                    width: width / 5 - 8,
                    borderRadius: width / 5 - 8,
                    backgroundColor: Color.primary,
                    alignSelf: 'center',
                    ...shadowStyle
                }}
            >
                <TouchableOpacityAbs
                    onPress={() => {
                        props.navigation.navigate('CreateEmergencyScreen', { 
                            routeIndex: 1, 
                            title: 'Emergency Area',
                            productType: 'TRIBES',
                            productCategory: 'SCENE',
                            productSubCategory: 'SURPRISE', 
                        });
                    }}
                    style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}
                >
                    {getIconMenu('MaterialIcons', 'vibration', isRouteActive)}
                </TouchableOpacityAbs>
            </View>
        )
    }

    return (
        <SafeAreaView
            style={{
                width,
                height: 70,
                backgroundColor: Color.textInput,
            }}
        >
            {activeRouteIndex < menus.length && <Animated.View
                style={{
                    height: 30,
                    width: 30,
                    position: 'absolute',
                    left: (width / menus.length) / 2 - 15,
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

            <Line width={width - 32} color={Color.border} style={{position: 'absolute', top: 0}} />

            <Scaler>
                {menus.map((route, routeIndex) => {
                    const isRouteActive = routeIndex === activeRouteIndex;

                    return (
                        <TouchableOpacity
                            key={routeIndex}
                            activeOpacity={1}
                            style={{
                                width: width / menus.length,
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
                                    height: 30,
                                    width: 30,
                                    position: 'absolute',
                                    top: 12,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    // backgroundColor: routeIndex === 2 ? 'transparent' : Color.blueStroke,
                                    // opacity: route.viewRef,
                                }}
                            >
                                {route.id !== 'eme' ?
                                        getIconMenu(route.iconType, route.iconName, isRouteActive)
                                    : 
                                        <Divider />
                                }
                            </Animated.View>

                            <Animated.Text
                                style={{
                                    fontSize: 10,
                                    fontWeight: '500',
                                    color: Color.text,
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
            </Scaler>

            {renderFloatingMenu()}
        </SafeAreaView>
    )
}

export default TabBarComponent;