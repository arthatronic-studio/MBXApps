import gql from 'graphql-tag';

export const queryEcommerceUlasanManage = gql`
  mutation(
    $productId: Int!
    $ulasan: String
    $rating: Int!
    $manageType: EcommerceUlasanTypeInput
    $ulasanId: Int
    $orderId: Int
  ){
    ecommerceUlasanManage(
      productId: $productId
      ulasan: $ulasan
      rating: $rating
      manageType: $manageType
      ulasanId: $ulasanId
      orderId: $orderId
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