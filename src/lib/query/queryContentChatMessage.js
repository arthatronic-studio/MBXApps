import gql from 'graphql-tag';

export const queryContentChatMessage = gql`
    query(
        $method: ContentProductMethod
        $id: Int
        $roomId: Int
        $message: String
        $image: String
    ){
        contentChatMessage(
            method: $method
            id: $id
            roomId: $roomId
            message: $message
            image: $image
        ) {
            id
            roomId
            userId
            message
            image
            messageDate
            current
            color
            name
        }
    }
`;