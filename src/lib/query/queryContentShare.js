import gql from 'graphql-tag';

export const queryContentShare = gql`
mutation(
  $code: String
) {
    productShareCount(
      code: $code
    ){
    success
    message
  }
}
`;
