import gql from 'graphql-tag';

export const queryListOrder = gql`
  query(
    $page: Int!
    $itemPerPage: Int!
    $status: EcommerceOrderManageType
  ) {
    ecommerceProductCategoryList(
     page: $page
     itemPerPage: $itemPerPage
     status: $status
   ) {
    userId
    orderNumber
    expiredDate
    status
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
    products {
      id
      orderId
      productId
      quantity
      price
    }
    address {
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