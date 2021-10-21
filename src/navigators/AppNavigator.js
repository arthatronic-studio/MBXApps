import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// uncanny
import MainPage from '@src/navigators/BottomTabsNavigator';
import KnowMeScreen from '@src/screens/KnowMeScreen';
import CreatePanicScreen from '@src/screens/CreatePanicScreen';

// user
import LoginScreen from '@src/screens/User/LoginScreen';
import RegisterScreen from '@src/screens/User/RegisterScreen';
import ForgotPasswordScreen from '@src/screens/User/ForgotPasswordScreen';
import UserChangePassword from '@src/screens/User/UserChangePassword';

// topup
import TopUpScreen from '@src/screens/Topup/TopUpScreen';

// screen
import CommentListScreen from '@src/screens/CommentListScreen';
import DetailEbookScreen from '@src/screens/DetailEbookScreen';
import MainSearch from '@src/screens/MainHome/MainSearch';

// forum
import ShowAllFromForum from '@src/screens/MainForum/ShowAllFromForum';
import ForumSegmentScreen from '@src/screens/MainForum/ForumSegmentScreen';
import CreateThreadScreen from '@src/screens/MainForum/CreateThreadScreen';
import DetailForumScreen from '@src/screens/MainForum/DetailForumScreen';

// profile
import ChangeProfile from '@src/screens/MainProfile/ChangeProfile';
import SettingScreen from '@src/screens/MainProfile/SettingScreen';
import ShowAllFromProfile from '@src/screens/MainProfile/ShowAllFromProfile';
import RegisterKomunitas from '@src/screens/MainProfile/RegisterKomunitas/Register'
import ReferralCodeScreen from '@src/screens/MainProfile/ReferralCodeScreen';

// News
import NewsScreen from 'src/screens/News/Index';
import NewsDetail from 'src/screens/News/Detail';

// Place
import PlaceScreen from 'src/screens/Place/Index';
import PlaceDetail from 'src/screens/Place/Detail';

// Workshop
import WorkshopScreen from 'src/screens/Workshop/Index';
import WorkshopDetail from 'src/screens/Workshop/Detail';

// Job
import JobScreen from 'src/screens/Job/Index';
import JobDetail from 'src/screens/Job/Detail';

// payment
import PaymentScreen from '@src/screens/Payment/PaymentScreen';
import PaymentDetail from '@src/screens/Payment/PaymentDetail';
import PaymentInstruction from '@src/screens/Payment/PaymentInstruction';
import PaymentSucceed from '@src/screens/Payment/PaymentSucceed';

// PPOB
import PulsaScreen from '@src/screens/PPOB/PulsaScreen';
import PlnScreen from '@src/screens/PPOB/PlnScreen';
import PdamScreen from '@src/screens/PPOB/PdamScreen';

// order
// import OrderListScreen from '@src/screens/MyBooking/OrderList';
import OrderListPerProduct from '@src/screens/MyBooking/OrderListPerProduct';

const {Navigator, Screen} = createStackNavigator();

function MainStackNavigator() {
    return (
        <Navigator
            initialRouteName='KnowMeScreen'
            screenOptions={{
                gestureEnabled: false,
                headerShown: false,
            }}
        >
            {/* uncanny */}
            <Screen name='MainPage' component={MainPage} />
            <Screen name="KnowMeScreen" component={KnowMeScreen} />
            <Screen name='CreatePanicScreen' component={CreatePanicScreen} />
            {/* user */}
            <Screen name='LoginScreen' component={LoginScreen} />
            <Screen name='RegisterScreen' component={RegisterScreen} />
            <Screen name='ForgotPasswordScreen' component={ForgotPasswordScreen} />
            <Screen name='UserChangePassword' component={UserChangePassword} />
            {/* topup */}
            <Screen name='TopUpScreen' component={TopUpScreen} />
            {/* News */}
            <Screen name='NewsScreen' component={NewsScreen} />
            <Screen name='NewsDetail' component={NewsDetail} />
            {/* Place */}
            <Screen name='PlaceScreen' component={PlaceScreen} />
            <Screen name='PlaceDetail' component={PlaceDetail} />
            {/* Workshop */}
            <Screen name='WorkshopScreen' component={WorkshopScreen} />
            <Screen name='WorkshopDetail' component={WorkshopDetail} />
            {/* Job */}
            <Screen name='JobScreen' component={JobScreen} />
            <Screen name='JobDetail' component={JobDetail} />

            {/* screen */}
            <Screen name='CommentListScreen' component={CommentListScreen} />
            <Screen name='DetailEbookScreen' component={DetailEbookScreen} />
            <Screen name='MainSearch' component={MainSearch} />
            {/* forum */}
            <Screen name='ShowAllFromForum' component={ShowAllFromForum} />
            <Screen name='ForumSegmentScreen' component={ForumSegmentScreen} />
            <Screen name='CreateThreadScreen' component={CreateThreadScreen} />
            <Screen name='DetailForumScreen' component={DetailForumScreen} />
            {/* profile */}
            <Screen name='ChangeProfile' component={ChangeProfile} />
            <Screen name='ShowAllFromProfile' component={ShowAllFromProfile} />
            <Screen name='SettingScreen' component={SettingScreen} />
            <Screen name='RegisterKomunitas' component={RegisterKomunitas} />
            <Screen name="ReferralCodeScreen" component={ReferralCodeScreen} />
            {/* payment */}
            <Screen name='PaymentScreen' component={PaymentScreen} />
            <Screen name='PaymentDetail' component={PaymentDetail} />
            <Screen name='PaymentInstruction' component={PaymentInstruction} />
            <Screen name='PaymentSucceed' component={PaymentSucceed} />
            {/* PPOB */}
            <Screen name='PulsaScreen' component={PulsaScreen} />
            <Screen name='PlnScreen' component={PlnScreen} />
            <Screen name='PdamScreen' component={PdamScreen} />
            {/* order */}
            {/* <Screen name='OrderListScreen' component={OrderListScreen} options={{ headerShown: true, headerTitle: 'Riwayat Pesanan' }} /> */}
            <Screen name='OrderListPerProduct' component={OrderListPerProduct} />
        </Navigator>
    );
}

export default MainStackNavigator;
