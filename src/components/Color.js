import {store} from '@src/state/redux';
import {useSelector} from 'react-redux';

const staticColors = {
  primary: '#141414',
  primaryDark: '#141414',
  primaryMoreDark: '#141414',
  primarySoft: '#121212',
  secondary: '#6A7479',
  tertiary: '#645FF2',
  textButtonInline: '#4B4639',
  oldGreen: '#557D09',
  disabled: '#7B776F',
  success: '#3AA413',
  successLight: '#D1F8C4',
  info: '#0787D7',
  warning: '#F5B72C',
  warningLight: '#FFF3B8',
  error: '#D72A19',
  green: '#59A12F',
  gray: '#666666',
  textGray: '#9CA3A5',
  grayLight: '#CDD1D2',
  red: '#D83030',
  yellow: '#FFD35B',
  black: '#000000',
  white: '#FFFFFF',
  blue: '#027BC9',
  blueLight: '#D5E2FD',
  timer: '#F94918',
  icon: '#667786',
  bid: '#E6E9EA',
  infosecond: '#DAE9F2',
  placeholder: '#979080',
  danger: '#F73347',
};

export const lightModeColors = {
  ...staticColors,
  colorDominant: 'light',
  overflow: 'rgba(0, 0, 0, 0.3)',
  theme: '#FFFFFE',
  text: '#141414',
  textSoft: '#575651',
  textInput: '#FFFFFF',
  border: '#EEEEEE',
  borderLight: '#F4F4F4',
  borderDark: '#CCCCCC',
  semiwhite: '#E5E5E5',
};

export const darkModeColors = {
  ...staticColors,
  colorDominant: 'dark',
  overflow: 'rgba(f, f, f, 0.3)',
  theme: '#1D1B16',
  text: '#E8E2D9',
  textSoft: '#FFFFFF',
  textInput: '#1D1B16',
  border: '#979080',
  borderLight: '#454545',
  borderDark: '#A1A1A1',
  semiwhite: '#353535',
};

export const useColor = isRoot => {
  const theme = isRoot
    ? store.getState()['theme'].theme
    : useSelector(state => state['theme'].theme);

  const Color = theme === 'dark' ? darkModeColors : lightModeColors;
  return {Color};
};

export default lightModeColors;
