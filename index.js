import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import TrackPlayer from 'react-native-track-player';

const moment = require('moment');
const momentTZ = require('moment-timezone');
const momentDurationFormatSetup = require('moment-duration-format');
import indonesia from 'moment/locale/id';

momentDurationFormatSetup(moment);
momentTZ(moment);
momentTZ.tz.setDefault('Etc/UTC');
moment.locale('id', indonesia);
typeof moment.duration.fn.format === "function";
typeof moment.duration.format === "function";

console.disableYellowBox = true;

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);

TrackPlayer.registerPlaybackService(() => require('./service.js'));