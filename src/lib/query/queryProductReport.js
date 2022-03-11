import gql from 'graphql-tag';

export const queryProductReport = gql`
mutation ($productId: Int) {
  productReport(productId: $productId) {
    productId
    }
  }
`;
