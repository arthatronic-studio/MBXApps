import gql from 'graphql-tag';

export const queryUserBlock = gql`
mutation(
  $blockUserId: Int
){
  userBlock(
    blockUserId: $blockUserId
  ) {
    success
    message
  }
}
`;
