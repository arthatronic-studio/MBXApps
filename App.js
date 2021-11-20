import React, { useState, useEffect, createRef } from 'react';
import 'react-native-gesture-handler';
import { StatusBar, Platform, Appearance, SafeAreaView, Alert } from 'react-native';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { NavigationContainer } from "@react-navigation/native";
import { Host } from 'react-native-portalize';
import messaging from '@react-native-firebase/messaging';

import AppNavigator from '@src/navigators/AppNavigator';
import { persistor, store } from '@src/state/redux';
import { useColor } from '@src/components';
import { localPushNotification } from '@src/lib/pushNotification';

export let navigationRef = createRef();

const App = () => {
  const { Color } = useColor('root');

  const onReady = () => {
    SplashScreen.hide();
  }

  // ===========================================
  // ========== START FIREBASE NOTIFICATION ==========
  // ===========================================
  useEffect(() => {
      registerAppWithFCM();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
      registerListener(onRegister, onNotification, onOpenNotification);
      
      localPushNotification.configure(onOpenNotification);

      function onRegister(token) {
        console.log('=== register ===', token)
      }

      function onNotification(data) {
        const { messageId, title, body } = data;
        // console.log('=== notif ===', notif);
        localPushNotification.showNotification(
          messageId,
          title,
          body
        );
      }

      function onOpenNotification(notif) {
        console.log('=== open notif ===', notif);
      }

      const unsub = messaging().onMessage(async remoteMessage => {
        console.log('=== A new FCM message arrived! ===', remoteMessage);

        if (remoteMessage) {
          console.log('=== remoteMessage ===', remoteMessage);
          const data = {
            messageId: remoteMessage.messageId,
            title: Platform.OS === 'ios' ? remoteMessage.data.notification.title : remoteMessage.notification.title,
            body: Platform.OS === 'ios' ? remoteMessage.data.notification.body : remoteMessage.notification.body,
          };

          onNotification(data);
        }
      });
      
      return () => {
        unsub;
        localPushNotification.unregister();
      }
  }, [])

  const requestUserPermission = async (onRegister) => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFcmToken(onRegister);
    }
  }

  const registerAppWithFCM = async() => {
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  }

  const registerListener = (onRegister, onNotification, onOpenNotification) => {
    messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          getFcmToken(onRegister);
        } else {
          requestUserPermission(onRegister);
        }
      })

    createNotificationListener(onRegister, onNotification, onOpenNotification);
  }

  const getFcmToken = async (onRegister) => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
     onRegister(fcmToken);
    } else {
     console.log("=== No token received ===", fcmToken);
    }
  }

  const deleteToken = () => {
    messaging().deleteToken()
  }

  const createNotificationListener = (onRegister, onNotification, onOpenNotification) => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      // console.log('=== on notification opened app', remoteMessage);
      onOpenNotification(remoteMessage.notification);
    })

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log('=== get initial ===', remoteMessage)
        if (remoteMessage) {
          onOpenNotification(remoteMessage.notification);
        }
      });

      messaging().onTokenRefresh(fcmToken => {
        onRegister(fcmToken);
      })
  }
  // ==========================================
  // ========== END FIREBASE NOTIFICATION ==========
  // ==========================================

  const colorScheme = Appearance.getColorScheme();

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaView style={{flex: 1, backgroundColor: Color.theme}}>
          <StatusBar
            backgroundColor={Color.primary}
            barStyle={Color.colorDominant === 'dark' ? 'light-content' : 'dark-content'}
          />
          <NavigationContainer
            ref={navigationRef}
            onReady={onReady}
          >
            <Host>
              <AppNavigator />
            </Host>
          </NavigationContainer>
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default App;