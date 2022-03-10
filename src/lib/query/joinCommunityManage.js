import gql from 'graphql-tag';

export const queryJoinCommunityManage = gql`
query(
  $status: Int!,
  $id: Int!,
  $customIdNumber: String
  $organizationInitialCode: String!
) {
    joinCommunityManage(
      status: $status,
      id: $id,
      customIdNumber: $customIdNumber
      organizationInitialCode: $organizationInitialCode
    ) {
      id
      status
      customIdNumber
      organizationInitionalCode
    }
  }
`;
