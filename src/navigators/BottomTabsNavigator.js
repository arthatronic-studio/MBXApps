import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarComponent from '@src/screens/TabBarComponent';
import TabBarComponentV2 from 'src/screens/TabBarComponentV2';
import MainHome from '@src/screens/MainHome/MainHome';
import MainProfile from '@src/screens/MainProfile/MainProfile';
import NotificationScreen from 'src/screens/Notification/NotificationScreen';
import TabNotification from 'src/screens/Notification/TabNotification';

const { Navigator, Screen } = createBottomTabNavigator();

const BottomTabsNavigator = () => {
    return (
        <Navigator
            initialRouteName="MainHome"
            tabBar={(props) =>
                <TabBarComponentV2 {...props} />
            }
        >
            <Screen name='MainHome' component={MainHome} />
            <Screen name='MainNotif' component={TabNotification} />
            <Screen name='MainNotif2' component={TabNotification} />
            <Screen name='MainProfile' component={MainProfile} />
        </Navigator>
    )
}

export default BottomTabsNavigator;