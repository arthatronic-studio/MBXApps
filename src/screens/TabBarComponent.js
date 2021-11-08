import React, { useState, useEffect } from 'react'
import { View, TouchableNativeFeedback, Keyboard, SafeAreaView } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';

import {
    Text,
    useColor
} from '@src/components';
import { shadowStyle } from '@src/styles';
import TouchableDebounce from 'src/components/Button/TouchableDebounce';

const Scaler = Styled(View)`
    flexDirection: row;
    height: 60px;
    width: 100%;
    paddingHorizontal: 18px;
`;

const TabBarComponent = (props) => {
    const { state } = props;

    const { index: activeRouteIndex } = state;
        
    const [menus] = useState([
        { id: 'ber', name: 'Beranda', iconName: 'home', iconType: 'Entypo', nav: 'MainHome', },
        { id: 'eme', name: 'Emergency', iconName: 'vibration', iconType: 'MaterialIcons', nav: 'CreateEmergencyScreen' },
        { id: 'pro', name: 'Profil', iconName: 'person', iconType: 'Ionicons', nav: 'MainProfile' },
    ]);

    const [keyboardShow, setKeyboardShow] = useState(false);

    const { Color } = useColor();

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
        Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

        return () => {
            Keyboard.removeListener('keyboardDidShow', handleKeyboardShow);
            Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
        }
    }, []);

    const handleKeyboardShow = () => {
        setKeyboardShow(true);
    }

    const handleKeyboardHide = () => {
        setKeyboardShow(false);
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

    if (keyboardShow) return <View />;

    return (
        <Scaler style={{
            backgroundColor: Color.textInput,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            ...shadowStyle,
        }}>
            {menus.map((route, routeIndex) => {
                const isRouteActive = routeIndex === activeRouteIndex;
                return (
                    <TouchableNativeFeedback
                        key={routeIndex}
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            props.navigation.navigate(route.nav, { routeIndex });
                        }}
                        onLongPress={() => {}}
                    >
                        <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            
                            {route.id=='eme' && <TouchableDebounce 
                                onPress={() => {
                                    props.navigation.navigate(route.nav, { 
                                        routeIndex, 
                                        title: 'Emergency Area',
                                        productType: 'TRIBES',
                                        productCategory: 'SCENE',
                                        productSubCategory: 'SURPRISE', 
                                    });
                                }}
                                style={{
                                    top: -25,
                                    position: 'absolute',
                                    alignSelf: 'center',
                                    width: 56,
                                    height: 56,
                                    borderRadius: 28,
                                    backgroundColor: '#EE2D32',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                {getIconMenu(route.iconType, route.iconName, isRouteActive)}
                            </TouchableDebounce>}

                            {route.id!='eme' ?
                                getIconMenu(route.iconType, route.iconName, isRouteActive)
                            : 
                                <View 
                                    style={{
                                        height: 30
                                    }}> 
                                </View>}

                            <Text
                                size={10}
                                type='semibold'
                                color={isRouteActive ? Color.primary : Color.gray}
                                style={{marginTop: 4}}
                            >
                                {route.name}
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                )
            })}
        </Scaler>
    )
}

export default TabBarComponent;