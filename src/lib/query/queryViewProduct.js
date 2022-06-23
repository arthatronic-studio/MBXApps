import gql from 'graphql-tag';

export const queryViewProduct = gql`
  mutation ($productId: Int!) {
    contentProductViewManage(productId: $productId) {
      success
      message
    }
  }
`;
