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
