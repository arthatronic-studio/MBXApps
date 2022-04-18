import gql from 'graphql-tag';

export const queryCheckIsUlasan = gql`
  query(
    $productId: Int
  ){
    checkIsUlasan(
      productId: $productId
    ){
      isUlasan
      status
    }
  }
`;