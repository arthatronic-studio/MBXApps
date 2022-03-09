import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarComponentKomoto from 'src/screens/TabBarComponentKomoto';
import MainHome from '@src/screens/MainHome/MainHome';
import MainProfile from '@src/screens/MainProfile/MainProfile';
import CreateEmergencyScreen from '@src/screens/CreateEmergencyScreen';

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
            <Screen name='CreateEmergencyScreen' component={CreateEmergencyScreen} />
            <Screen name='MainProfile' component={MainProfile} />
        </Navigator>
    )
}

export default BottomTabsNavigator;