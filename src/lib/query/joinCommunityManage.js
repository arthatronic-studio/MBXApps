import gql from 'graphql-tag';

export const joinCommunityManage = gql`
  query($status: Int!, $id: Int!, $customIdNumber: String) {
    joinCommunityManage(status: $status, id: $id, customIdNumber: $customIdNumber) {
      id
      status
    }
  }
`;
