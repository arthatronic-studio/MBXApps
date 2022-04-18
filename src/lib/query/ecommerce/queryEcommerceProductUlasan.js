import gql from 'graphql-tag';

export const queryEcommerceProductUlasan = gql`
  query(
    $page: Int
    $itemPerPage: Int
    $productId: Int
  ) {
    ecommerceProductUlasan(
      page: $page
      itemPerPage: $itemPerPage
      productId: $productId
    ) {
      id
      firstName
      lastName
      image
      ulasan
      rating
      createdAt
    }
  }
`;