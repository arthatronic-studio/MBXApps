import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarComponent from '@src/screens/TabBarComponent';
import MainHome from '@src/screens/MainHome/MainHome';
import MainProfile from '@src/screens/MainProfile/MainProfile';
import MerchScreen from '@src/screens/Ecommerce/MerchScreen';
import MyShopHomepage from 'src/screens/Ecommerce/MyShopHomepage';

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
            <Screen name='MyShopHomepage' component={MerchScreen} />
            <Screen name='MainProfile' component={MainProfile} />
        </Navigator>
    )
}

export default BottomTabsNavigator;