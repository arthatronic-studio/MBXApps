import gql from 'graphql-tag';

export  const queryDetailOrder = gql`
query(
  $orderId: Int!
) {
  ecommerceOrderDetail(
   orderId: $orderId
 ) {
  userId
  bookingId
  orderNumber
  expiredDate
  status
  payment{
    name
  }
  adminFee
  shippingAddressId
  shippingIsCod
  shippingRateId
  shippingUseInsurance
  shipperOrderNumber
  shipperBody {
    consignee {
      name
      phone_number
    }
    consigner {
      name
      phone_number
    }
    origin {
      address
      area_id
      lat
      lng
    }
    destination {
      address
      area_id
      lat
      lng
    }
    external_id
    package {
      weight
      length
      width
      height
      package_type
      items {
        name
        qty
        price
      }
    }
    payment_type
  }
  shipperResponse {
    consignee {
      name
      phone_number
    }
    consigner {
      name
      phone_number
    }
    origin {
      address
      postcode
      area_id
      area_name
      suburb_id
      city_id
      city_name
      province_id
      province_name
      country_id
      country_name
      lat
      lng
    }
    destination {
      address
      postcode
      area_id
      area_name
      suburb_id
      city_id
      city_name
      province_id
      province_name
      country_id
      country_name
      lat
      lng
    }
    external_id
    order_id
    package {
      weight
      length
      width
      height
      volume_weight
      package_type
      items {
        id
        name
        qty
        price
      }
    }
    payment_type
  }
  paymentId
  shippingCost
  totalProductPrice
  totalPrice
  checkoutAt
  createdAt
  updatedAt
  deletedAt
  items {
    id
    name
    noTelp
    socialMedia {
      instagram
    }
    products {
      id
      name
      description
      width
      height
      length
      width
      price
      imageUrl
      stock
      quantity
    }
  }
  
  address {
    id
    penerimaName
    userId
    address
    postalCode
    latitude
    longitude
    country {
      id
      name
    }
    province {
      id
      name
    }
    city {
      id
      name
    }
    suburb {
      id
      name
    }
    area {
      id
      name
    }
  }
}
}
`;

export const queryListOrder = gql`
query (
  $page: Int
	$itemPerPage: Int
	$status: EcommerceOrderStatusEnum ,
  $userId: Int
  $merchantId: Int
){
  ecommerceOrderList(
    page: $page,
    itemPerPage: $itemPerPage,
    status: $status,
    userId: $userId,
    merchantId: $merchantId
	) {
    id
    userId
    bookingId
    orderNumber
    expiredDate
    status
    shippingAddressId
    shippingIsCod
    shippingRateId
    shippingUseInsurance
    shipperOrderNumber
    paymentId
    shippingCost
    totalProductPrice
    totalPrice
    checkoutAt
    createdAt
    updatedAt
    deletedAt
    shipperBody{
      consignee{
        name
      }
    }
     items {
      id
      name
      noTelp
      socialMedia {
        instagram
      }
      products {
        name
        description
        width
        height
        length
        width
        price
        imageUrl
        stock
        quantity
      }
    }
    address {
      penerimaName
      id
      userId
      address
      postalCode
      latitude
      longitude
      country {
        id
        name
      }
      province {
        id
        name
      }
      city {
        id
        name
      }
      suburb {
        id
        name
      }
      area {
        id
        name
      }
    }
  }
}
`;

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

  export const queryCreateMerchant = gql `
  mutation ecommerceCreateMerchant(
    $body: ecommerceMerchantInput
  ) {
    ecommerceCreateMerchant(
      body: $body
    ) {
      id
      name
      noTelp
      alamat
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
        coverage
        external_id
        order_id
        payment_type
        package {
          items {
            name
            qty
            price
          }
        }
        consignee{
          name
          phone_number
        }
        consigner{
          name
          phone_number
        }
        courier{
          cod
          rate_id
          use_insurance
        }
      }    
    }
`;


export const mutationCheckout = gql`
mutation(
  $type: EcommerceOrderManageType!
	$products: [EcommerceOrderProductInput]
	$courier: ShipperCreateOrderCourierInputType
  $destinationAddressId: Int
) {
  ecommerceOrderManage(
    type: $type
    products: $products
    destinationAddressId: $destinationAddressId
    courier: $courier
  ) {
    success
    message
    data { 
      vat
      amount
      discount
      adminFee
      invoiceNumber
      bookingId 
      orderNumber
      expiredDate
      status
      totalProductPrice
      shippingCost
      totalPrice
    }

  }
}
`;

export const mutationCancel = gql`
mutation(
  $type: EcommerceOrderManageType!
  $orderId: Int
) {
  ecommerceOrderManage(
    type: $type
    orderId: $orderId
  ) {
    success
    message
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
      origin{
        area_id
      }
      groupListing{
        Express{
          logisticName
          rateId
          rateName
          rateType
          price
          estimation
        }
        Regular{
          logisticName
          rateId
          rateName
          rateType
          price
          estimation
        }
        Trucking{
          logisticName
          rateId
          rateName
          rateType
          price
          estimation
        }
        SameDay{
          logisticName
          rateId
          rateName
          rateType
          price
          estimation
        }
        Instant{
          logisticName
          rateId
          rateName
          rateType
          price
          estimation
        }
      }
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
      id
      items{
        name
        alamat
        products{
          id
          name
          price
          quantity
          description
          imageUrl
        }
      }
      totalProducts
    }
  }
`;

export const queryGetMyShop = gql`
  query{
    ecommerceGetMerchant {
      id userId name noTelp alamat profileImg isVerified isOfficial createdAt
   }
  }
`;

export const queryGetListMerchant = gql`
  query(
    $merchantName: String
    $page: Int
    $limit: Int
  ) {
    ecommerceGetListMerchant(
     page: $page
     limit: $limit
     merchantName: $merchantName
   ) {
    id userId name noTelp alamat profileImg isVerified isOfficial createdAt
   }
  }
`;

export const queryCreateCart = gql`
  mutation ecommerceCartCreate{
    ecommerceCartCreate {
      id user_id  productCartInfo { productId quantity } products { id name categoryId description price initialPrice imageUrl stock } totalProducts
   }
  }
`;

export const queryGetMyProduct = gql`
query(
  $merchantId: Int
){
  ecommerceGetMerchant(
    merchantId: $merchantId
  )
  {
    id
    userId
    name
    noTelp
    alamat
    profileImg
    isVerified
    isOfficial
    createdAt
    updatedAt
    productList{
    	id
      name
      categoryId
      description
      price
      initialPrice
      imageUrl
      stock
      height
      width
      length
      weight
      merchantId
      productUnit
      minimumBuy
      productMassa
      status
  	}
    socialMedia{
      instagram
    }
  }
}

`;
export const mutationMerchant = gql`
mutation(
  $type: ecommerceMerchantTypeInput
  $merchantId: Int!
	$body: ecommerceMerchantManageInput
) {
  ecommerceMerchantManage(
    type: $type
    merchantId : $merchantId
    body: $body
  ) {
    id
    userId
    name
    noTelp
    alamat
    profileImg
    isVerified
    isOfficial
    createdAt
    updatedAt
    user
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
    $checked: Boolean!
  ) {
    ecommerceCartUpdate(
     productId: $productId
     quantity: $quantity
     checked: $checked
   ) {
    id
   }
  }
`;

export const queryGetProduct = gql`
  query(
    $page: Int
    $itemPerPage: Int
    $name: String
    $categoryId: Int
  ) {
    ecommerceProductList(
     page: $page
     itemPerPage: $itemPerPage
     name: $name
     categoryId: $categoryId
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
    id userId address provinceId cityId suburbId areaId postalCode penerimaName noTelp city { id name } province { id name } suburb { id name } area { id name }
   }
  }
`;


export const queryEditAddress = gql`
  mutation userAddressEdit(
    $addresses: [UserAddressInput]
    ) {
      userAddressEdit(
      addresses: $addresses
    ) {
      id userId address provinceId cityId suburbId areaId postalCode penerimaName noTelp 
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
      id userId address provinceId cityId suburbId areaId postalCode penerimaName noTelp
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

export const queryGetArea = gql`
  query(
    $suburbId: Int!
  ) {
    shipperGetAreaList(
     suburbId: $suburbId
   ) {
      id name
   }
  }
`;
export const queryAddProduct = gql`
  mutation ecommerceProductAdd($products: [EcommerceProductInput]) {
    ecommerceProductAdd(products: $products) {
      name
      categoryId
      description
      price
      initialPrice
      imageUrl
      stock
      weight
      height
      width
      length
      productUnit
      minimumBuy
      productMassa
      status
    }
  }
`;
