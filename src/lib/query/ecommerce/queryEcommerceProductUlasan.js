import gql from 'graphql-tag';

export const queryEcommerceProductUlasan = gql`
  query(
    $page: Int
    $itemPerPage: Int
    $productId: Int
    $type: EcommerceProductUlasanType
  ) {
    ecommerceProductUlasan(
      page: $page
      itemPerPage: $itemPerPage
      productId: $productId
      type:$type
    ) {
      id
      firstName
      lastName
      nameProduct
      imageProduct
      image
      ulasan
      rating
      createdAt
    }
  }
`;