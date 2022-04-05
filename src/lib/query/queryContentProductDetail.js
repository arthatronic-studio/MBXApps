import gql from 'graphql-tag';

export const queryContentProductDetail = gql`
query(
    $productCode: String
  ) {
    contentProductDetail(
      productCode: $productCode
    ){
      id
      productName
      im_like
      comment
      view
    }
  }
`;