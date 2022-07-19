import gql from 'graphql-tag';

export const queryNotificationManage = gql`
  mutation(
    $notificationId: Int!
    $status: Int!
  ){
    notificationManage(
        notificationId: $notificationId
        status: $status
    ) {
      success
      message
    }
  }
`;