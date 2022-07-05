import {store} from '@src/state/redux';
import {useSelector} from 'react-redux';

const staticColors = {
  primary: '#3C58C1',
  primaryDark: '#5D41C9',
  primarySoft: '#4579E6',
  secondary: '#6A7479',
  textButtonInline: '#FFFFFF',
  oldGreen: '#557D09',
  disabled: '#A1A1A1',
  success: '#0BBC2E',
  info: '#0787D7',
  warning: '#F5B72C',
  error: '#D83030',
  green: '#59A12F',
  gray: '#666666',
  grayLight: '#CDD1D2',
  red: '#D83030',
  yellow: '#FFD35B',
  black: '#000000',
  white: '#FFFFFF',
  blue: '#027BC9',
  timer: '#F94918',
  icon: '#667786',
  bid: '#E6E9EA',
  infosecond: '#DAE9F2',
  placeholder: '#6A7479',
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
  theme: '#232323',
  text: '#FFFFFF',
  textInput: '#232323',
  border: '#404040',
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
