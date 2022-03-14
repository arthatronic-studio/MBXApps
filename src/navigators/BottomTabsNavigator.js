import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarComponent from '@src/screens/TabBarComponent';
import MainHome from '@src/screens/MainHome/MainHome';
import MainProfile from '@src/screens/MainProfile/MainProfile';
import Ecommerce from 'src/screens/Ecommerce/Ecommerce';

const { Navigator, Screen } = createBottomTabNavigator();

const BottomTabsNavigator = () => {
    return (
        <Navigator
            initialRouteName="Home"
            tabBar={(props) =>
                <TabBarComponent {...props} />
            }
        >
            <Screen name='MainHome' component={MainHome} />
            <Screen name='Ecommerce' component={Ecommerce} />
            <Screen name='MainProfile' component={MainProfile} />
        </Navigator>
    )
}

export default BottomTabsNavigator;