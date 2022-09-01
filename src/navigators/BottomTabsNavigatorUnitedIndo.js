import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarComponent from '@src/screens/TabBarComponent';
import MainHome from '@src/screens/MainHome/MainHome';
import PlaceScreen from 'src/screens/Posting/Place/Index';
import EventScreen from 'src/screens/Posting/Event/Index';
import NewsScreen from 'src/screens/Posting/News/Index';
import MainProfile from 'src/screens/MainProfile/MainProfile';
import NotificationScreen from 'src/screens/Notification/NotificationScreen';
import TabBarComponentUnitedIndo from 'src/screens/TabBarComponentUnitedIndo';

const { Navigator, Screen } = createBottomTabNavigator();

const BottomTabsNavigatorUnitedIndo = () => {
    return (
        <Navigator
            initialRouteName="Home"
            tabBar={(props) =>
                <TabBarComponentUnitedIndo {...props} />
            }
        >
            <Screen name='MainHome' component={MainHome} />
            <Screen name="NotificationScreen" component={NotificationScreen} />
            <Screen name='MainProfile' component={MainProfile} />
            {/* <Screen name='EventScreen' component={EventScreen} /> */}
            {/* <Screen name='PlaceScreen' component={PlaceScreen} />
            <Screen name='PostingScreen' component={NewsScreen} /> */}
        </Navigator>
    )
}

export default BottomTabsNavigatorUnitedIndo;