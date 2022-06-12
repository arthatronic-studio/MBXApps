import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification, { Importance } from "react-native-push-notification";
import { Platform } from 'react-native';
import Color from 'src/components/Color';

class LocalPushNotification {
    configure = (onOpenNotification) => {
        // Must be outside of any component LifeCycle (such as `componentDidMount`).
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function (token) {
            console.log("TOKEN:", token);
            },
        
            // (required) Called when a remote is received or opened, or local notification is opened
            onNotification: function (notification) {
            console.log("NOTIFICATION:", notification);
        
            // process the notification
            // if (!notification) {
            //     return;
            // }
        
            // if (notification && !notification.data) {
            //     return;
            // }
        
            // (required) Called when a remote is received or opened, or local notification is opened
            notification.finish(PushNotificationIOS.FetchResult.NoData);
            },
        
            // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
            onAction: function (notification) {
            console.log("ACTION:", notification.action);
            console.log("NOTIFICATION:", notification);
        
            // process the action
            },
        
            // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
            onRegistrationError: function(err) {
            console.error(err.message, err);
            },
        
            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
            alert: true,
            badge: true,
            sound: true,
            },
        
            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,
        
            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             * - if you are not using remote notification or do not have Firebase installed, use this:
             *     requestPermissions: Platform.OS === 'ios'
             */
            requestPermissions: true,
        });
    }

    unregister = () => {
        PushNotification.unregister();
    }

    showNotification = (data) => {
        const { messageId, title, body: message, channelId, soundName } = data;

        if (Platform.OS === 'ios') {
            PushNotificationIOS.addNotificationRequest({
                id: messageId,
                title,
                body: message,
                sound: soundName,
            });
        } else {
            PushNotification.localNotification({
                channelId,
                title,
                message,
                color: Color.primary,
                soundName,
            });
        }
    }

    cancelAllNotification = () => {
        if (Platform.OS === 'ios') {
            PushNotificationIOS.removeAllDeliveredNotifications();
        } else {
            PushNotification.cancelAllLocalNotifications();
        }
    }

    removeDeliveredNotificationById = (id) => {
        PushNotification.cancelLocalNotifications({ id: `${id}`})
    }
}

export const localPushNotification = new LocalPushNotification();