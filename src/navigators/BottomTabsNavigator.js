import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarComponent from '@src/screens/TabBarComponent';
import MainHome from '@src/screens/MainHome/MainHome';
import MainHistory from '@src/screens/MyBooking/MainHistory';
import MainSchedule from '@src/screens/MainSchedule/MainSchedule';
import MainForum from '@src/screens/MainForum/MainForum';
import MainProfile from '@src/screens/MainProfile/MainProfile';

const { Navigator, Screen } = createBottomTabNavigator();

const BottomTabsNavigator = () => {
    return (
        <Navigator
            initialRouteName="Home"
            tabBar={(props) => <TabBarComponent {...props} />}
        >
            <Screen name='MainHome' component={MainHome} />
            <Screen name='MainHistory' component={MainHistory} />
            <Screen name='MainSchedule' component={MainSchedule} />
            <Screen name='MainForum' component={MainForum} />
            <Screen name='MainProfile' component={MainProfile} />
        </Navigator>
    )
}

export default BottomTabsNavigator;