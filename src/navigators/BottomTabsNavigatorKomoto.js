import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarComponent from '@src/screens/TabBarComponent';
import MainHome from '@src/screens/MainHome/MainHome';
import PlaceScreen from 'src/screens/Posting/Place/Index';
import EventScreen from 'src/screens/Posting/Event/Index';
import NewsScreen from 'src/screens/Posting/News/Index';
import MainProfile from 'src/screens/MainProfile/MainProfile';
import TabBarComponentKomoto from 'src/screens/TabBarComponentKomoto';

const { Navigator, Screen } = createBottomTabNavigator();

const BottomTabsNavigator = () => {
    return (
        <Navigator
            initialRouteName="Home"
            tabBar={(props) =>
                <TabBarComponentKomoto {...props} />
            }
        >
            <Screen name='MainHome' component={MainHome} />
            <Screen name='PlaceScreen' component={PlaceScreen} />
            <Screen name='EventScreen' component={EventScreen} />
            <Screen name='PostingScreen' component={NewsScreen} />
            <Screen name='MainProfile' component={MainProfile} />
        </Navigator>
    )
}

export default BottomTabsNavigator;