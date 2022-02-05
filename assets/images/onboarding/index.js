import Config from 'react-native-config';

import {listRRIDBoarding} from './rrid';

const iconOnboarding1 = require('./icon-1.png');
const iconOnboarding2 = require('./icon-2.png');
const iconOnboarding3 = require('./icon-3.png');

const listDefaultBoarding = [
    {imageAsset: iconOnboarding1, title: 'Smart Technology', subTitle: 'Tribesocial is an intelligent community platform that delivers personalized content recommendations to every user based on their interests.'},
    {imageAsset: iconOnboarding2, title: 'Diversified Community', subTitle: 'Users are actively engaged on Tribesocial, they like to express, discuss, show their attitudes and share content with others.'},
    {imageAsset: iconOnboarding3, title: 'High Quality Users', subTitle: 'Users are loyal to our platform, they use Tribesocial frequently.'},
];

const listBoarding =
    Config.INITIAL_CODE === 'TRIBESXRRID' ?
    listRRIDBoarding:
    listDefaultBoarding;

export {listBoarding};