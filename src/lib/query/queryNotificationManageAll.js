import gql from 'graphql-tag';

export const queryNotificationManageAll = gql`
mutation(
  $status: StatusManageEnum
){
  notificationManageAll(
      status: $status
  ) {
    success
    message
  }
}
`;