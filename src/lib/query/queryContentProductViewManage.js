import gql from 'graphql-tag';

export const queryContentProductViewManage = gql`
  mutation(
    $productId: Int!
  ){
    contentProductViewManage(
      productId: $productId
    ) {
      success
      message
    }
  }
`;
