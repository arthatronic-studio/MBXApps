import gql from 'graphql-tag';

export const queryOrganizationMemberManage = gql`
mutation (
    $userId: Int!
    $organizationInitialCode: String!
    $type: OrganizationMemberTypeManage!
  ){
    organizationMemberManage (
      userId: $userId,
      organizationInitialCode: $organizationInitialCode
      type: $type
    ) {
      userId
      organizationId
      organization {
        id
        name
        logo
        phone
        status
      }
    }
  }
`;