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
    mutation shipperCreateOrder(
      $input: ShipperCreateOrderInputType
    ) {
      shipperCreateOrder(
        input: $input
      ) {
        order_id
        courier{ 
          rate_id
          amount
        }
        external_id
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

export const queryGetShipper = gql`
  mutation shipperGetPriceDomestic(
    $input: ShipperGetDomesticInput
  ) {
      shipperGetPriceDomestic(
      input: $input
    ) {
      pricings{ logistic { id name company_name code logo_url } final_price min_day max_day must_use_insurance discounted_price rate { id name type } }
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

export const queryGetAddress = gql`
  query(
    $userId: Int!
    $page: Int!
    $itemPerPage: Int!
  ) {
    userAddressList(
      userId: $userId
      page: $page
      itemPerPage: $itemPerPage
   ) {
    id userId address provinceId cityId suburbId postalCode
   }
  }
`;


export const queryEditAddress = gql`
  mutation userAddressEdit(
    $addresses: [UserAddressInput]
    ) {
      userAddressAdd(
      addresses: $addresses
    ) {
      id userId address provinceId cityId suburbId postalCode
    }
  }
`;

export const queryAddAddress = gql`
  mutation userAddressAdd(
    $addresses: [UserAddressInput]
    ) {
      userAddressAdd(
      addresses: $addresses
    ) {
      id userId address provinceId cityId suburbId postalCode
    }
  }
`;

export const queryGetProvince = gql`
  query(
    $countryCode: Int!
  ) {
    shipperGetProvinceList(
     countryCode: $countryCode
   ) {
      id name
   }
  }
`;


export const queryGetCity = gql`
  query(
    $provinceId: Int!
  ) {
    shipperGetCitiesList(
     provinceId: $provinceId
   ) {
      id name
   }
  }
`;

export const queryGetSub = gql`
  query(
    $cityId: Int!
  ) {
    shipperGetSuburbList(
     cityId: $cityId
   ) {
      id name
   }
  }
`;