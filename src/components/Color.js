import {store} from '@src/state/redux';
import {useSelector} from 'react-redux';

const staticColors = {
  primary: '#96C63B',
  primaryDark: '#033F59',
  primarySoft: '#DAEBF2',
  primaryYellow: '#FAC255',
  primaryBlack: '#999999',
  secondary: '#FB9850',
  disabled: '#A1A1A1',
  success: '#0BBC2E',
  info: '#0787D7',
  warning: '#F5B72C',
  error: '#D83030',
  green: '#59A12F',
  gray: '#666666',
  black: '#252525',
  blackContent: '#363636',
  red: '#D83030',
  yellow: '#FFD35B',
  timer: '#F94918',
  icon: '#667786',
  bid: '#E6E9EA',
  white: '#FFFFFF',
  text: '#FFFFFF',
  infosecond: '#DAE9F2',
};

export const lightModeColors = {
  ...staticColors,
  overflow: 'rgba(0, 0, 0, 0.3)',
  reverseOverflow: 'rgba(f, f, f, 0.3)',
  colorDominant: 'light',
  theme: '#EEF2E6', // '#F4F4F4',
  text: '#0D0006',
  textInput: '#FFFFFF',
  border: '#DDDDDD',
};

export const darkModeColors = {
  ...staticColors,
  overflow: 'rgba(f, f, f, 0.3)',
  reverseOverflow: 'rgba(0, 0, 0, 0.3)',
  colorDominant: 'dark',
  theme: '#161c00',
  text: '#FFFFFF',
  textInput: '#0D0006',
  border: '#707070',
};

export const useColor = isRoot => {
  const theme = isRoot
    ? store.getState()['theme'].theme
    : useSelector(state => state['theme'].theme);

  const Color = theme === 'dark' ? darkModeColors : lightModeColors;
  return {Color};
};

export default lightModeColors;
