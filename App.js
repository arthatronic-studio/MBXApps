import React, { useState, useEffect, createRef } from 'react';
import 'react-native-gesture-handler';
import { Platform, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { NavigationContainer } from "@react-navigation/native";
import { Host } from 'react-native-portalize';
import messaging from '@react-native-firebase/messaging';
import NetInfo from '@react-native-community/netinfo';

import AppNavigator from '@src/navigators/AppNavigator';
import { persistor, store } from '@src/state/redux';
import { useColor } from '@src/components';
import { localPushNotification } from '@src/lib/pushNotification';
import { geoCurrentPosition, geoLocationPermission } from 'src/utils/geolocation';
import { trackPlayerInit } from '@src/utils/track-player-init';
import ModalNetInfo from '@src/components/ModalNetInfo';
import { requestTrackingPermission } from 'react-native-tracking-transparency';
import linking from 'src/navigators/linking';

export let navigationRef = createRef();

const App = () => {
  const { Color } = useColor('root');

  const [modalNetInfo, setModalNetInfo] = useState(false);

  const onReady = () => {}

  useEffect(() => {
    initTrackPlayer();
    initRequestTracking();

    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Connection Info", state);

      if (!state.isConnected && state.type !== 'none') {
        setModalNetInfo(true);
      } else {
        setModalNetInfo(false);
      }
    });

    return () => {
      unsubscribe();
    }
  }, []);

  const initTrackPlayer = async () => {
    await trackPlayerInit();
  }

  const initRequestTracking = async () => {
    await requestTrackingPermission();
  }

  // ===========================================
  // ========== START FIREBASE NOTIFICATION ==========
  // ===========================================
  useEffect(() => {
      requestLocationPermission();

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
  }, []);

  const requestLocationPermission = async () => {
    const isGranted = await geoLocationPermission();

    console.log('isGranted',isGranted);

    geoCurrentPosition(
      (res) => {
        console.log(res, 'res location');
      },
      (err) => {
        console.log(err, 'err location');
      }
    );
  }

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

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <View style={{flex: 1, backgroundColor: Color.theme}}>
          <NavigationContainer
            linking={linking}
            ref={navigationRef}
            onReady={onReady}
          >
            <Host>
              <AppNavigator />
              <ModalNetInfo
                visible={modalNetInfo}
                onRefresh={async() => {
                  setModalNetInfo(false);
                  const state = await NetInfo.fetch();
                  console.log('state', state);
                  if (!state.isConnected) {
                    setModalNetInfo(true);
                  } else {
                    setModalNetInfo(false);
                  }
                }}
              />
            </Host>
          </NavigationContainer>
        </View>
      </PersistGate>
    </Provider>
  );
};

export default App;