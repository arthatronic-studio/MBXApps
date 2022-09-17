import { Platform } from 'react-native';

let shadowStyle = {
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
};
  
if (Platform.OS === 'android') {
    shadowStyle = { elevation: 2 };
}

export {
    shadowStyle
};