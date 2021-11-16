import gql from 'graphql-tag';

export const joinCommunityMember = gql`
  {
    joinCommunityMember(status: 0) {
      id
    }
  }
`;
