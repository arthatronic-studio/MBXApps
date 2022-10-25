import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import TrackPlayer from 'react-native-track-player';
import { LogBox } from 'react-native';

const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
import indonesia from 'moment/locale/id';

momentDurationFormatSetup(moment);
moment.updateLocale('id', indonesia);
typeof moment.duration.fn.format === "function";
typeof moment.duration.format === "function";

LogBox.ignoreAllLogs();
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);

TrackPlayer.registerPlaybackService(() => require('./service.js'));