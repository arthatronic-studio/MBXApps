import gql from 'graphql-tag';

export const queryProductSave = gql`
  mutation ($productId: Int!) {
    productSave(productId: $productId) {
      success
      message
    }
  }
`;
