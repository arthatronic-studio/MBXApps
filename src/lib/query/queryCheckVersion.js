import gql from 'graphql-tag';

export const queryCheckVersion = gql`
  query {
    version
  }
`;
