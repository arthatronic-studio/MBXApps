import {store} from '@src/state/redux';
import {useSelector} from 'react-redux';

const staticColors = {
  primary: '#EBC300',
  primaryDark: '#4B4639',
  primaryMoreDark: '#33302A',
  primarySoft: '#D6C694',
  secondary: '#6A7479',
  tertiary: '#D4FAD9',
  textButtonInline: '#4B4639',
  oldGreen: '#557D09',
  disabled: '#7B776F',
  success: '#0BBC2E',
  info: '#0787D7',
  warning: '#F5B72C',
  error: '#D83030',
  green: '#59A12F',
  gray: '#666666',
  textGray: '#9CA3A5',
  grayLight: '#CDD1D2',
  red: '#D83030',
  yellow: '#FFD35B',
  black: '#000000',
  white: '#FFFFFF',
  blue: '#027BC9',
  black: '#000000',
  blueLight: '#D5E2FD',
  timer: '#F94918',
  icon: '#667786',
  bid: '#E6E9EA',
  infosecond: '#DAE9F2',
  placeholder: '#979080',
  danger: '#F73347',
  lightInfo: '#2C70F7'
};

export const lightModeColors = {
  ...staticColors,
  colorDominant: 'light',
  overflow: 'rgba(0, 0, 0, 0.3)',
  theme: '#FFFFFE',
  text: '#0D0006',
  textInput: '#FFFFFF',
  border: '#E0E0E0',
  semiwhite: '#E5E5E5',
};

export const darkModeColors = {
  ...staticColors,
  colorDominant: 'dark',
  overflow: 'rgba(f, f, f, 0.3)',
  theme: '#1D1B16',
  text: '#E8E2D9',
  textInput: '#1D1B16',
  border: '#979080',
  semiwhite: '#353535',
};

export const useColor = isRoot => {
  const theme = isRoot
    ? store.getState()['theme'].theme
    : useSelector(state => state['theme'].theme);

  const Color = darkModeColors; // theme === 'dark' ? darkModeColors : lightModeColors;
  return {Color};
};

export default lightModeColors;
