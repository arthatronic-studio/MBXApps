import gql from 'graphql-tag';

export const queryContentChatRoomManage = gql`
  query (
    $method: ContentProductMethod
    $roomId: Int
    $name: String
    $image: String
    $type: ContentRoomTypeMethod
    $userId: [Int]
    $description: String
    $userManage: ContentRoomUserManage
  ) {
    contentChatRoomManage(
      method: $method
      roomId: $roomId
      name: $name
      image: $image
      type: $type
      userId: $userId
      description: $description
      userManage: $userManage
    ) {
      id
      roomId
      name
      description
      image
      roomDate
      type
      lastChatCount
      lastChat {
        id
        roomId
        userId
        message
        messageDate
        current
      }
      member {
        userId
        firstName
        lastName
        image
        joinDate
      }
    }
  }
`;