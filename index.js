import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
import indonesia from 'moment/locale/id';

momentDurationFormatSetup(moment);
moment.locale('id', indonesia);
typeof moment.duration.fn.format === "function";
typeof moment.duration.format === "function";

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);