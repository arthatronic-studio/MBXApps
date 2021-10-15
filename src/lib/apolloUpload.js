import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import Config from 'react-native-config';
import { store } from '../state/redux';

const defaultOptions = {
    query: { fetchPolicy: 'no-cache' },
    mutate: { fetchPolicy: 'no-cache' },
};

const httpLink = createHttpLink({
  uri: Config.APP_API_URL,
  headers: {
    'content-type': 'application/json',
    'Accept-Encoding': 'gzip',
  },
  fetchOptions: { method: 'POST' }
});

const authLink = setContext((_, { headers }) => {
  const token = store.getState()['user.auth'];
  
  return {
    headers: {
      ...headers,
      Authorization: `${token.data.token_type} ${token.data.access_token}`,
    }
  }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions,
});

export default client;