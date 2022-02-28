import gql from 'graphql-tag';

export const queryGetAuction = gql`
query(
  $page: Int!
  $limit: Int!
) {
   auctionProduct(
    page: $page
    limit: $limit
 ) {
    data { id product_id date_start time_start time_end description start_price buy_now_price quantity image_url is_open is_winner_check } total
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

