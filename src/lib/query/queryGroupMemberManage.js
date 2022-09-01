import gql from 'graphql-tag';

export const queryGroupMemberManage = gql`
  mutation(
    $userId: Int!
    $status: Int!
    $groupId: Int!
    $type: String
  ){
    groupMemberManage(
      userId: $userId
      status: $status
      groupId: $groupId
      type: $type
    ){
      success
      message
    }
  }
`;
