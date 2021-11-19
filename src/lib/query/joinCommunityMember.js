import gql from 'graphql-tag';

export const joinCommunityMember = gql`
  query($status: Int!) {
    joinCommunityMember(status: $status) {
      id
      userDetail {
        firstName
      }
    }
  }
`;
