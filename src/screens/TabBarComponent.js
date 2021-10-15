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
        { id: 'his', name: 'Riwayat', iconName: 'history', iconType: 'MaterialIcons', nav: 'MainHistory', params: { type: 'HISTORY', productType: 'ALL_SAMBATAN' } },
        { id: 'jad', name: 'Jadwal', iconName: 'calendar', iconType: 'Ionicons', nav: 'MainSchedule' },
        { id: 'for', name: 'Forum', iconName: 'people-outline', iconType: 'Ionicons', nav: 'MainForum' },
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
                return <MaterialIcons name={iconName} size={22} color={isRouteActive ? Color.primary : Color.gray} />
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
        <Scaler style={{backgroundColor: Color.textInput, ...shadowStyle}}>
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
                            {getIconMenu(route.iconType, route.iconName, isRouteActive)}
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