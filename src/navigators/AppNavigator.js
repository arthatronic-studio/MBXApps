import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// uncanny
import SplashScreen from 'src/screens/SplashScreen';
import MainPage from '@src/navigators/BottomTabsNavigator';
import KnowMeScreen from '@src/screens/KnowMeScreen';
import CreateEmergencyScreen from '@src/screens/CreateEmergencyScreen';

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
import EditThreadScreen from '@src/screens/MainForum/EditThreadScreen';

// profile
import ChangeProfile from '@src/screens/MainProfile/ChangeProfile';
import SettingScreen from '@src/screens/MainProfile/SettingScreen';
import ShowAllFromProfile from '@src/screens/MainProfile/ShowAllFromProfile';
import JoinCommunity from 'src/screens/MainProfile/JoinCommunity'
import ReferralCodeScreen from '@src/screens/MainProfile/ReferralCodeScreen';
import CommunityAdminPage from '@src/screens/MainProfile/CommunityAdmin/CommunityAdminPage';
import NumbersInput from 'src/screens/MainProfile/CommunityAdmin/NumbersInput';
import ApproveMember from 'src/screens/MainProfile/CommunityAdmin/ApproveMember';

// Posting
// import PostingScreen from 'src/screens/Posting/PostingScreen';
import PostingDetail from 'src/screens/Posting/PostingDetail';

// Emergency
import EmergencyScreen from 'src/screens/Posting/Emergency/Index';
import EmergencyDetail from 'src/screens/Posting/Emergency/Detail';

// News
import NewsScreen from 'src/screens/Posting/News/Index';
import NewsDetail from 'src/screens/Posting/News/Detail';

// Place
import PlaceScreen from 'src/screens/Posting/Place/Index';
import PlaceDetail from 'src/screens/Posting/Place/Detail';

// Event
import EventScreen from 'src/screens/Posting/Event/Index';
import EventDetail from 'src/screens/Posting/Event/Detail';

// Job
import JobScreen from 'src/screens/Posting/Job/Index';
import JobDetail from 'src/screens/Posting/Job/Detail';

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

// notification
import NotificationScreen from '@src/screens/Notification/NotificationScreen';
import NotificationDetail from '@src/screens/Notification/NotificationDetail';

// content-chat
import ChatRoomsScreen from '@src/screens/Chat/ChatRoomsScreen';
import ChatDetailScreen from '@src/screens/Chat/ChatDetailScreen';
import ChatUserListScreen from '@src/screens/Chat/ChatUserListScreen';
import ChatInfoScreen from '@src/screens/Chat/ChatInfoScreen';

const {Navigator, Screen} = createStackNavigator();

function MainStackNavigator() {
    return (
        <Navigator
            initialRouteName='SplashScreen'
            screenOptions={{
                gestureEnabled: false,
                headerShown: false,
            }}
        >
            {/* uncanny */}
            <Screen name='SplashScreen' component={SplashScreen} />
            <Screen name='MainPage' component={MainPage} />
            <Screen name="KnowMeScreen" component={KnowMeScreen} />
            <Screen name='CreateEmergencyScreen' component={CreateEmergencyScreen} />
            {/* user */}
            <Screen name='LoginScreen' component={LoginScreen} />
            <Screen name='RegisterScreen' component={RegisterScreen} />
            <Screen name='ForgotPasswordScreen' component={ForgotPasswordScreen} />
            <Screen name='UserChangePassword' component={UserChangePassword} />
            {/* topup */}
            <Screen name='TopUpScreen' component={TopUpScreen} />
            {/* Posting */}
            {/* <Screen name='PostingScreen' component={PostingScreen} /> */}
            <Screen name='PostingDetail' component={PostingDetail} />
            {/* Emergency */}
            <Screen name='EmergencyScreen' component={EmergencyScreen} />
            <Screen name='EmergencyDetail' component={EmergencyDetail} />
            {/* News */}
            <Screen name='NewsScreen' component={NewsScreen} />
            <Screen name='NewsDetail' component={NewsDetail} />
            {/* Place */}
            <Screen name='PlaceScreen' component={PlaceScreen} />
            <Screen name='PlaceDetail' component={PlaceDetail} />
            {/* Event */}
            <Screen name='EventScreen' component={EventScreen} />
            <Screen name='EventDetail' component={EventDetail} />
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
            <Screen name='EditThreadScreen' component={EditThreadScreen} />
            {/* profile */}
            <Screen name='ChangeProfile' component={ChangeProfile} />
            <Screen name='ShowAllFromProfile' component={ShowAllFromProfile} />
            <Screen name='SettingScreen' component={SettingScreen} />
            <Screen name='JoinCommunity' component={JoinCommunity} />
            <Screen name="CommunityAdminPage" component={CommunityAdminPage} />
            <Screen name="ReferralCodeScreen" component={ReferralCodeScreen} />
            <Screen name="NumbersInput" component={NumbersInput} />
            <Screen name="ApproveMember" component={ApproveMember} />
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

            {/* notification */}
            <Screen name='NotificationScreen' component={NotificationScreen} />
            <Screen name='NotificationDetail' component={NotificationDetail} />

            {/* content-chat */}
            <Screen name='ChatRoomsScreen' component={ChatRoomsScreen} />
            <Screen name='ChatDetailScreen' component={ChatDetailScreen} />
            <Screen name='ChatUserListScreen' component={ChatUserListScreen} />
            <Screen name='ChatInfoScreen' component={ChatInfoScreen} />
        </Navigator>
    );
}

export default MainStackNavigator;
