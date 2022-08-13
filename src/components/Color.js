import {store} from '@src/state/redux';
import {useSelector} from 'react-redux';

const staticColors = {
  primary: '#FCD100',
  primaryDark: '#B88B32',
  primaryMoreDark: '#574800',
  primarySoft: '#FFEB8A',
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
  text: '#1D1D1B',
  textSoft: '#575651',
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
  textSoft: '#FFFFFF',
  textInput: '#1D1B16',
  border: '#979080',
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
