import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarComponent from '@src/screens/TabBarComponent';
import TabBarComponentOtomotif from '@src/screens/TabBarComponentOtomotif';
import MainHome from '@src/screens/MainHome/MainHome';
import MainProfile from '@src/screens/MainProfile/MainProfile';
import CreateEmergencyScreen from '@src/screens/CreateEmergencyScreen';
import MerchScreen from '@src/screens/Ecommerce/MerchScreen';
import { listKomotoFamily } from 'src/utils/constants';
import Config from 'react-native-config';

const { Navigator, Screen } = createBottomTabNavigator();

const BottomTabsNavigator = () => {
    return (
        <Navigator
            initialRouteName="Home"
            tabBar={(props) =>
                listKomotoFamily.includes(Config.INITIAL_CODE) ?
                <TabBarComponentOtomotif {...props} /> :
                <TabBarComponent {...props} />
            }
        >
            <Screen name='MainHome' component={MainHome} />
            {
                listKomotoFamily.includes(Config.INITIAL_CODE) ?
                <Screen name='CreateEmergencyScreen' component={CreateEmergencyScreen} /> :
                <Screen name='MainMerch' component={MerchScreen} /> 
            }
            <Screen name='MainProfile' component={MainProfile} />
        </Navigator>
    )
}

export default BottomTabsNavigator;