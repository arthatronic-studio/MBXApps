import gql from 'graphql-tag';

export const mutationAddEvent = gql`
mutation(
  $type: EventManageEnum!
  $newEvent: EventInput
){
eventManage(
    type: $type
    newEvent: $newEvent
  ){
    message
    success
  }
}
`;