import {store} from '@src/state/redux';
import {useSelector} from 'react-redux';

const staticColors = {
  primary: '#EF2932',
  primaryDark: '#033F59',
  primarySoft: '#DAEBF2',
  secondary: '#FB9850',
  disabled: '#A1A1A1',
  overflow: 'rgba(0, 0, 0, 0.3)',
  success: '#0BBC2E',
  info: '#0787D7',
  warning: '#F5B72C',
  error: '#D83030',
  green: '#09990A',
  gray: '#666666',
  red: '#D83030',
  yellow: '#FFD35B',
};

export const lightModeColors = {
  ...staticColors,
  colorDominant: 'light',
  theme: '#F4F4F4',
  text: '#0D0006',
  textInput: '#FFFFFF',
  border: '#DDDDDD',
};

export const darkModeColors = {
  ...staticColors,
  theme: '#161c00',
  colorDominant: 'dark',
  text: '#FFFFFF',
  textInput: '#0D0006',
  border: '#707070',
};

export const useColor = (isRoot) => {
  const theme = isRoot
    ? store.getState()['theme'].theme
    : useSelector((state) => state['theme'].theme);

  const Color = theme === 'dark' ? darkModeColors : lightModeColors;
  return {Color};
};

export default lightModeColors;
