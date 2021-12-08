import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import Config from 'react-native-config';

import { getToken } from '../state/actions/user/auth';
import { store } from '../state/redux';
import { redirectTo } from '@src/utils';

function forceRedirect(screen, params) {
  redirectTo(screen, params);
  return;
}

const httpLink = new HttpLink({
  uri: Config.APP_API_URL,
  headers: {
      'content-type': 'application/json',
      'Accept-Encoding': 'gzip',
  },
  fetchOptions: { method: 'POST' }
});

const withToken = setContext(async (request, { headers }) => {
  await store.dispatch(getToken());
  const auth = await store.getState()['user.auth'];
  return { headers: { ...headers, Authorization: `${auth.data.token_type} ${auth.data.access_token}` } };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  // console.log(graphQLErrors, 'graph', networkError,'network');

  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.message === `Cannot read property 'user' of null` || err.message === 'User not logged in') {
        store.dispatch({ type: 'USER.LOGOUT' });
        forceRedirect('LoginScreen', { logout: true });
      }

      switch (err.extensions.code) {
        case 'CLIENT_AUTH_ERROR':
          const user = store.getState()['user.auth'].login.user;
          if (user !== null) {
            store.dispatch({ type: 'USER.LOGOUT' });
            forceRedirect('LoginScreen', { logout: true });
          }

          // store.dispatch({
          //   type: 'USER.REMOVE_AUTH_TOKEN',
          // });

          // callAuthApi()
          //   .then(accessToken => {
          //     const future_time = Moment.utc().add(
          //       accessToken.data.expires_in - 360,
          //       'seconds',
          //     );
          //     store.dispatch({
          //       type: 'USER.ADD_AUTH_TOKEN',
          //       data: accessToken.data,
          //       future_time: future_time,
          //     });
          //     const oldHeaders = operation.getContext().headers;
          //     operation.setContext({
          //       headers: {
          //         ...oldHeaders,
          //         authorization: 'Bearer ' + accessToken.data.access_token,
          //       },
          //     });
          //   })
          //   .catch(error => {
          //     store.dispatch({
          //       type: 'USER.LOGIN_ERROR',
          //       error: error,
          //     });
          //     store.dispatch({
          //       type: 'USER.REMOVE_AUTH_TOKEN',
          //     });
          //   });

          // retry the request, returning the new observable
          // return forward(operation);
      }
    }
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    // if you would also like to retry automatically on
    // network errors, we recommend that you use
    // apollo-link-retry
  }
});

const defaultOptions = {
  query: { fetchPolicy: 'no-cache' },
  mutate: { fetchPolicy: 'no-cache' }
};

const authLink = withToken.concat(httpLink);
const client = new ApolloClient({ link: errorLink.concat(authLink), cache: new InMemoryCache(), defaultOptions });

export default client;
