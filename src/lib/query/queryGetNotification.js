import gql from "graphql-tag";

export const queryGetNotification = gql`
  query(
    $page: Int
    $itemPerPage:Int
  ) {
    getNotification(page: $page
      itemPerPage:$itemPerPage) {
      id
      userId
      title
      text
      date
      image
      status
     
    }
  }
`;