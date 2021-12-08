import gql from 'graphql-tag';

export const queryContentChatMessage = gql`
    query(
        $method: ContentProductMethod
        $id: Int
        $roomId: Int
        $message: String
    ){
        contentChatMessage(
            method: $method
            id: $id
            roomId: $roomId
            message: $message
        ) {
            id
            roomId
            userId
            message
            messageDate
            current
            color
            name
        }
    }
`;