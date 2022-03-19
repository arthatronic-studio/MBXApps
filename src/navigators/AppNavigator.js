import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {accessClient} from 'src/utils/access_client';

// uncanny
import SplashScreen from 'src/screens/SplashScreen';
import BottomTabsNavigator from '@src/navigators/BottomTabsNavigator';
import BottomTabsNavigatorKomoto from '@src/navigators/BottomTabsNavigatorKomoto';
import BottomTabsNavigatorsabyan from '@src/navigators/BottomTabsNavigatorSabyan';
import KnowMeScreen from '@src/screens/KnowMeScreen';
import CreateEmergencyScreen from '@src/screens/CreateEmergencyScreen';
import PDFReaderScreen from 'src/screens/PDFReaderScreen';
import MusicPlayerScreen from 'src/screens/MusicPlayerScreen';

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
import ForumScreen from 'src/screens/MainForum/ForumScreen';
import ForumSearch from 'src/screens/MainForum/ForumSearch';
import CardDetailForum from 'src/screens/MainForum/CardDetailForum';
// import CardForumPage from 'src/screens/MainForum/CardForumPage';
// profile
import ChangeProfile from '@src/screens/MainProfile/ChangeProfile';
import SettingScreen from '@src/screens/MainProfile/SettingScreen';
import ShowAllFromProfile from '@src/screens/MainProfile/ShowAllFromProfile';
import JoinCommunity from 'src/screens/MainProfile/JoinCommunity';
import ReferralCodeScreen from '@src/screens/MainProfile/ReferralCodeScreen';
import UserProfileScreen from '@src/screens/MainProfile/UserProfileScreen';
import TermsCondition from 'src/screens/MainProfile/TermCondition';

// community admin
import CommunityAdminPage from '@src/screens/MainProfile/CommunityAdmin/CommunityAdminPage';
import CardDetail from 'src/screens/MainProfile/CommunityAdmin/CardDetail';

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

// Video
import VideoDetail from 'src/screens/Posting/Video/Detail';

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

// auction
import AuctionDetail from '@src/screens/Posting/Auction/Detail';
import Bid from '@src/screens/Posting/Auction/Bid';

//Ecommerce & Tokoku
import CartScreen from '@src/screens/Ecommerce/CartScreen';
import CartShop from '@src/screens/Ecommerce/CartShop';
import CheckoutScreen from '@src/screens/Ecommerce/CheckoutScreen';
import FormPayment from '@src/screens/Ecommerce/FormPayment';
import MyShop from '@src/screens/Ecommerce/MyShop';
import MerchScreen from 'src/screens/Ecommerce/MerchScreen';
import DetailProduct from 'src/screens/Ecommerce/DetailProduct';
import CartAuction from 'src/screens/Auction/CartAuction';
import Lelang from 'src/screens/Lelang';
import LiveLelangScreen from 'src/screens/LiveLelangScreen';
import DetailLelang from 'src/screens/DetailLelang';
import DetailPromo from 'src/screens/Promo/DetailPromo';
import Ebook from 'src/screens/Posting/Ebook/Ebook';
import MyShopHomepage from 'src/screens/Ecommerce/MyShopHomepage';
import AddProduct from 'src/screens/Ecommerce/AddProduct';
import MyProduct from 'src/screens/Ecommerce/MyProduct';
import Review from 'src/screens/Ecommerce/Review';
import EditMerchantInfo from 'src/screens/Ecommerce/EditMerchantInfo';

import StepTwo from 'src/screens/Ecommerce/StepTwo';
import StepThree from 'src/screens/Ecommerce/StepThree';
import MerchantSetting from 'src/screens/Ecommerce/MerchantSetting';

// Media Player
import MediaPlayerScreen from 'src/screens/MediaPlayer/MediaPlayerScreen';
import UploadMusicScreen from 'src/screens/MediaPlayer/UploadMusicScreen';
import UploadVideoScreen from 'src/screens/MediaPlayer/UploadVideoScreen';

// Survey
import SurveyFirst from 'src/screens/Survey/SurveyFirst';
import SurveySecond from 'src/screens/Survey/SurveySecond';
import SurveyThird from 'src/screens/Survey/SurveyThird';
import SurveyFourth from 'src/screens/Survey/SurveyFourth';
import Ecommerce from 'src/screens/Ecommerce/Ecommerce';
import Wishlist from 'src/screens/Ecommerce/Wishlist';
import WishlistEmpty from 'src/screens/Ecommerce/WishlistEmpty';
import Cart from 'src/screens/Ecommerce/Cart';
import ListShipping from 'src/screens/Ecommerce/ListShipping';
 
// Transaction
import TransactionDetail from 'src/screens/Transaction/TransactionDetail';
import TransactionDetailSucces from 'src/screens/Transaction/TransactionDetailSucces';
import Notification from 'src/screens/Ecommerce/Notification';

const {Navigator, Screen} = createStackNavigator();
const MainPage =
  accessClient.BottomTabsNavigator.type === 'komoto'
    ? BottomTabsNavigatorKomoto
    : accessClient.BottomTabsNavigator.type === 'sabyan'
    ? BottomTabsNavigatorsabyan
    : BottomTabsNavigator;

function MainStackNavigator() {
  return (
    <Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        gestureEnabled: Platform.OS === 'ios',
        headerShown: false,
      }}>
      {/* uncanny */}
      <Screen name="SplashScreen" component={SplashScreen} />
      <Screen name="MainPage" component={MainPage} />
      <Screen name="KnowMeScreen" component={KnowMeScreen} />
      <Screen name="CreateEmergencyScreen" component={CreateEmergencyScreen} />
      <Screen name="PDFReaderScreen" component={PDFReaderScreen} />
      <Screen name="MusicPlayerScreen" component={MusicPlayerScreen} />

      {/* Auction */}
      <Screen name="CartAuction" component={CartAuction} />
      <Screen name="Lelang" component={Lelang} />
      <Screen name="DetailLelang" component={DetailLelang} />
      <Screen name="LiveLelangScreen" component={LiveLelangScreen} />

      {/* Promo Popup */}
      <Screen name="DetailPromo" component={DetailPromo} />

      {/* Ecommerce */}
      <Screen name="MerchScreen" component={MerchScreen} />
      <Screen name="DetailProduct" component={DetailProduct} />
      <Screen name="CartScreen" component={CartScreen} />
      <Screen name="CartShop" component={CartShop} />
      <Screen name="FormPayment" component={FormPayment} />
      <Screen name="MyShop" component={MyShop} />
      <Screen name="CheckoutScreen" component={CheckoutScreen} />
      <Screen name="MyShopHomepage" component={MyShopHomepage} />
      <Screen name="AddProduct" component={AddProduct} />
      <Screen name="StepTwo" component={StepTwo} />
      <Screen name="StepThree" component={StepThree} />
      <Screen name="Ecommerce" component={Ecommerce} />
      <Screen name="Wishlist" component={Wishlist} />
      <Screen name="WishlistEmpty" component={WishlistEmpty} />
      <Screen name="Cart" component={Cart} />
      <Screen name="ListShipping" component={ListShipping} />
      <Screen name="MerchantSetting" component={MerchantSetting} />
      <Screen name="MyProduct" component={MyProduct} />
      <Screen name="Review" component={Review} />
      <Screen name="EditMerchantInfo" component={EditMerchantInfo} />
      <Screen name="Notification" component={Notification} />

      {/* user */}
      <Screen name="LoginScreen" component={LoginScreen} />
      <Screen name="RegisterScreen" component={RegisterScreen} />
      <Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Screen name="UserChangePassword" component={UserChangePassword} />
      {/* topup */}
      <Screen name="TopUpScreen" component={TopUpScreen} />
      {/* Emergency */}
      <Screen name="EmergencyScreen" component={EmergencyScreen} />
      <Screen name="EmergencyDetail" component={EmergencyDetail} />
      {/* News */}
      <Screen name="NewsScreen" component={NewsScreen} />
      <Screen name="NewsDetail" component={NewsDetail} />
      {/* Place */}
      <Screen name="PlaceScreen" component={PlaceScreen} />
      <Screen name="PlaceDetail" component={PlaceDetail} />
      {/* Event */}
      <Screen name="EventScreen" component={EventScreen} />
      <Screen name="EventDetail" component={EventDetail} />
      {/* Job */}
      <Screen name="JobScreen" component={JobScreen} />
      <Screen name="JobDetail" component={JobDetail} />
      {/* Video */}
      <Screen name="VideoDetail" component={VideoDetail} />

      {/* screen */}
      <Screen name="Ebook" component={Ebook} />
      <Screen name="CommentListScreen" component={CommentListScreen} />
      <Screen name="DetailEbookScreen" component={DetailEbookScreen} />
      <Screen name="MainSearch" component={MainSearch} />
      {/* forum */}
      <Screen name="ShowAllFromForum" component={ShowAllFromForum} />
      <Screen name="ForumSegmentScreen" component={ForumSegmentScreen} />
      <Screen name="CreateThreadScreen" component={CreateThreadScreen} />
      <Screen name="DetailForumScreen" component={DetailForumScreen} />
      <Screen name="EditThreadScreen" component={EditThreadScreen} />
      <Screen name="ForumScreen" component={ForumScreen} />
      <Screen name="ForumSearch" component={ForumSearch} />
      <Screen name="CardDetailForum" component={CardDetailForum} />
      {/* <Screen name="CardForumPage" component={CardForumPage}/> */}
      {/* profile */}
      <Screen name="ChangeProfile" component={ChangeProfile} />
      <Screen name="ShowAllFromProfile" component={ShowAllFromProfile} />
      <Screen name="SettingScreen" component={SettingScreen} />
      <Screen name="JoinCommunity" component={JoinCommunity} />
      <Screen name="ReferralCodeScreen" component={ReferralCodeScreen} />
      <Screen name="TermsCondition" component={TermsCondition} />
      <Screen name="UserProfileScreen" component={UserProfileScreen} />

      {/* community admin */}
      <Screen name="CommunityAdminPage" component={CommunityAdminPage} />
      <Screen name="CardDetail" component={CardDetail} />
      {/* payment */}
      <Screen name="PaymentScreen" component={PaymentScreen} />
      <Screen name="PaymentDetail" component={PaymentDetail} />
      <Screen name="PaymentInstruction" component={PaymentInstruction} />
      <Screen name="PaymentSucceed" component={PaymentSucceed} />
      {/* PPOB */}
      <Screen name="PulsaScreen" component={PulsaScreen} />
      <Screen name="PlnScreen" component={PlnScreen} />
      <Screen name="PdamScreen" component={PdamScreen} />
      {/* order */}
      {/* <Screen name='OrderListScreen' component={OrderListScreen} options={{ headerShown: true, headerTitle: 'Riwayat Pesanan' }} /> */}
      <Screen name="OrderListPerProduct" component={OrderListPerProduct} />

      {/* notification */}
      <Screen name="NotificationScreen" component={NotificationScreen} />
      <Screen name="NotificationDetail" component={NotificationDetail} />

      {/* content-chat */}
      <Screen name="ChatRoomsScreen" component={ChatRoomsScreen} />
      <Screen name="ChatDetailScreen" component={ChatDetailScreen} />
      <Screen name="ChatUserListScreen" component={ChatUserListScreen} />
      <Screen name="ChatInfoScreen" component={ChatInfoScreen} />

      {/* auction */}
      <Screen name="AuctionDetail" component={AuctionDetail} />
      <Screen name="Bid" component={Bid} />

      {/* media player */}
      <Screen name="MediaPlayerScreen" component={MediaPlayerScreen} />
      <Screen name="UploadMusicScreen" component={UploadMusicScreen} />
      <Screen name="UploadVideoScreen" component={UploadVideoScreen} />

      {/* Survey */}
      <Screen name='SurveyFirst' component={SurveyFirst} />
      <Screen name='SurveySecond' component={SurveySecond} />
      <Screen name='SurveyThird' component={SurveyThird} />
      <Screen name='SurveyFourth' component={SurveyFourth} />
      {/* Transaction */}
      <Screen name='TransactionDetail' component={TransactionDetail} />
      <Screen name='TransactionDetailSucces'component={TransactionDetailSucces}/>

    </Navigator>
  );
}

export default MainStackNavigator;
