import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarComponent from '@src/screens/TabBarComponent';
import MainHome from '@src/screens/MainHome/MainHome';
import MainProfile from '@src/screens/MainProfile/MainProfile';
import CreatePanicScreen from 'src/screens/CreatePanicScreen';


const { Navigator, Screen } = createBottomTabNavigator();

const BottomTabsNavigator = () => {
    return (
        <Navigator
            initialRouteName="Home"
            tabBar={(props) => <TabBarComponent {...props} />}
        >
            <Screen name='MainHome' component={MainHome} />
            {/* ganti name screen dan component screen disini */}
            <Screen name='CreatePanicScreen' component={CreatePanicScreen} /> 
            <Screen name='MainProfile' component={MainProfile} />
        </Navigator>
    )
}

export default BottomTabsNavigator;