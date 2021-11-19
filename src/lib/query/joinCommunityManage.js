import gql from 'graphql-tag';

export const joinCommunityManage = gql`
  query($status: Int!, $id: Int!) {
    joinCommunityManage(status: $status, id: $id) {
      id
    }
  }
`;
