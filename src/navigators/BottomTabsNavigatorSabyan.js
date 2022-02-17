import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarComponentSabyan from '@src/screens/TabBarComponentSabyan';
import MainHome from '@src/screens/MainHome/MainHome';
import MainProfile from '@src/screens/MainProfile/MainProfile';
import MerchScreen from '@src/screens/Ecommerce/MerchScreen';

const { Navigator, Screen } = createBottomTabNavigator();

const BottomTabsNavigatorsabyan = () => {
    return (
        <Navigator
            initialRouteName="Home"
            tabBar={(props) =>
                <TabBarComponentSabyan {...props} />
            }
        >
            <Screen name='MainHome' component={MainHome} />
            {/* <Screen name='MainMerch' component={MerchScreen} /> */}
            <Screen name='MainProfile' component={MainProfile} />
        </Navigator>
    )
}

export default BottomTabsNavigatorsabyan;