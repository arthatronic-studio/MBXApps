import gql from 'graphql-tag';

export const queryAddCart = gql`
  mutation ecommerceCartAdd(
    $productId: Int!
    $quantity: Int!
  ){
    ecommerceCartAdd(
      productId: $productId
      quantity: $quantity
    ) {
      id cart_id 
    }
  }
  `;

export const queryCheckout = gql`
  mutation ecommerceCreateNewOrder(
    $productId: Int!
  ){
    ecommerceCreateNewOrder(
      productId: $productId
    ) {
      orderId orderNumber totalPrice
    }
  }
  `;

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

export const queryGetProduct = gql`
  query(
    $page: Int!
    $itemPerPage: Int!
  ) {
    ecommerceProductList(
     page: $page
     itemPerPage: $itemPerPage
   ) {
    id name categoryId description price initialPrice imageUrl stock
   }
  }
`;

export const queryDetailProduct = gql`
  query(
    $id: Int!
  ) {
    ecommerceProductDetail(
     id: $id
   ) {
    id name categoryId description price initialPrice imageUrl stock
   }
  }
`;