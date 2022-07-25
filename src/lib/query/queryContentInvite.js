import gql from 'graphql-tag';

export const queryContentInvite = gql`
  query(
    $fullname: String
    $email: String
    $message: String
    $parentProductId: Int
  ) {
    contentInvite(
      fullname: $fullname
      email: $email
      message: $message
      parentProductId: $parentProductId
    ){
      success
      message
      url
    }
  }
`;
