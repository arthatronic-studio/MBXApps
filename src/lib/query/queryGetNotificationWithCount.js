import gql from "graphql-tag";

export const queryGetNotificationWithCount = gql`
  query(
    $page: Int
    $itemPerPage:Int
  ) {
    getNotificationWithCount(page: $page
      itemPerPage:$itemPerPage) {
        notificationCountNotRead
     
    }
  }
`;