import { CommonActions } from '@react-navigation/native';
import { navigationRef } from 'App';

export function loginRequired(navFrom, navTo, params) {
  navigationRef.current.navigate('LoginScreen', {
    loginFrom: navFrom,
    afterLogin: () => navigationRef.current.navigate(navTo, params)
  });
}

export function redirectTo(nav, params) {
  navigationRef.current.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        { name: nav, params },
      ],
    })
  );

  return;
}