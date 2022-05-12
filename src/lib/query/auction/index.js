import gql from 'graphql-tag';

export const queryGetCartAuction = gql`
  query (
     $page: Int, 
     $limit: Int,
     $cartType: AuctionCartTypeEnum,
     $orderDirection: AuctionOrderDirection,
     $orderBy: AuctionOrderBy) {
   auctionCartList(
      page: $page 
      limit: $limit
      cartType: $cartType
      orderDirection: $orderDirection
      orderBy: $orderBy
   ) {
      id
      items {
         auctionId
         productId
         name
         image
         total
         quantity
         checked
         status
      }
    }
  }
`;

export const mutationCheckoutAuction = gql`
  mutation (
    $type: AuctionOrderManageType!
    $auctionProductId: Int
    $courier: ShipperCreateOrderCourierInputType
    $destinationAddressId: Int
    $winningPrice: Float
    $orderId: Int
    $shippingNumber: String
  ) {
   auctionOrderManage(
      type: $type
      auctionProductId: $auctionProductId
      courier: $courier
      winningPrice: $winningPrice
      destinationAddressId: $destinationAddressId
      orderId: $orderId
      shippingNumber: $shippingNumber
    ) {
      success
      message
      data {
        id
        vat
        bookingId
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

export const queryGetAuction = gql`
query(
   $page: Int
    $limit: Int
    $auctionId: Int
    $productName: String
    $type: AuctionTypeScreen!
    $status: AuctionSearchStatus
 ) {
    auctionProduct(
     page: $page
     limit: $limit
     type: $type
     auctionId: $auctionId
     productName: $productName
     status: $status
  ) {
   id
   productId
   dateStart
   dateEnd
   quantity
   description
   startPrice
   buyNowPrice
   isOpen
   status
   product {
     id
     name
     categoryId
     description
     price
     initialPrice
     imageUrl
     imageProducts
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
     rating
     sold
   }
  }
 }
`;

export const mutationCrateAuction = gql`
  mutation auctionCreateProduct(
      $productId: Int
      $date_start: String
      $time_start: String
      $time_end: String
      $description: String
      $start_price: Float
      $buy_now_price: Float
      $quantity: Int
  ) {
   auctionCreateProduct(
      productId: $productId
      date_start: $date_start
      time_start: $time_start
      time_end: $time_end
      description: $description
      start_price: $start_price
      buy_now_price: $buy_now_price
      quantity: $quantity
   ) {
    id
   }
  }
`;

