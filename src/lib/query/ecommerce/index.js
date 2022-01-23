import gql from 'graphql-tag';

export const queryGetCart = gql`
  query(
    $page: Int!
    $limit: Int!
  ) {
    ecommerceCartList(
     page: $page
     limit: $limit
   ) {
      id totalProducts productCartInfo { productId quantity } products { name categoryId description price initialPrice imageUrl stock }
   }
  }
`;

export const queryDeleteItemCart = gql`
  query(
    $id: Int!
  ) {
    ecommerceProductDelete(
     id: $id
   ) {
    success
   }
  }
`;