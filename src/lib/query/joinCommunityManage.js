import gql from 'graphql-tag';

export const joinCommunityManage = gql`
  query($status: Int!, $id: Int!, $customIdNumber: String,organizationalCode:String!) {
    joinCommunityManage(status: $status, id: $id, customIdNumber: $customIdNumber,organizationInitionalCode:$accessClient.InitialCode) {
      id
      status
      customIdNumber
      organizationInitionalCode
    }
  }
`;
