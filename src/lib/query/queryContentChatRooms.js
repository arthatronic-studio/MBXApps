import gql from 'graphql-tag';

export const queryContentChatRooms = gql`
    query(
        $itemPerPage: Int
        $page: Int
        $query: String
    ){
        contentChatRooms(
            itemPerPage: $itemPerPage
            page: $page
            query: $query
        ) {
            id
            roomId
            name
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