import gql from "graphql-tag";

export const queryGetNotificationHistory = gql`
  query($category: ContentProductCategory) {
    getNotificationHistory(category: $category) {
      id
      userId
      notification_title
      notification_text
      notification_image
      notification_date
      notification_jump_link
      notification_category
      is_looked
    }
  }
`;