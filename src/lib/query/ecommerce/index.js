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
      $productIds: [EcommerceOrderProductInput]
      $isFromCart: Boolean
    ) {
      ecommerceCreateNewOrder(
        productIds: $productIds
        isFromCart: $isFromCart
      ) {
        id userId 
      }
    }
`;

  export const queryDeleteItemCart = gql`
  mutation ecommerceCartDelete(
    $productId: Int!
  ) {
      ecommerceCartDelete(
      productId: $productId
    ) {
      id
      product_id
      cart_id
      quantity
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
      id totalProducts productCartInfo { productId quantity } products { id name categoryId description price initialPrice imageUrl stock }
   }
  }
`;

export const queryGetCategory = gql`
  query(
    $page: Int!
    $itemPerPage: Int!
  ) {
    ecommerceProductCategoryList(
     page: $page
     itemPerPage: $itemPerPage
   ) {
      id name
   }
  }
`;


export const queryUpdateItemCart = gql`
  mutation ecommerceCartUpdate(
    $productId: Int!
    $quantity: Int!
  ) {
    ecommerceCartUpdate(
     productId: $productId
     quantity: $quantity
   ) {
    id
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