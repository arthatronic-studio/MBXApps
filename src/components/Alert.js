import { Alert as ReactAlert } from 'react-native';

export const Alert = (title, message, onPress) => {
    ReactAlert.alert(
      title,
      message,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Ya', style: 'ok', onPress: () => onPress && onPress() }
      ]
    );
};