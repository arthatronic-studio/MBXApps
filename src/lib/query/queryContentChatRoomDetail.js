import gql from 'graphql-tag';

export const queryContentChatRoomDetail = gql`
    query(
        $roomId: Int
        $itemPerPage: Int
        $page: Int
        $query: String
    ){
        contentChatRoomDetail (
            roomId: $roomId
            itemPerPage: $itemPerPage
            page: $page
            query: $query
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