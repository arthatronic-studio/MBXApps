import gql from 'graphql-tag';

export const queryLike = gql`
    query(
        $page: Int
        $itemPerPage: Int
        $productId: Int
    ){
        contentLike(
            page: $page
            itemPerPage: $itemPerPage
            productId: $productId
        ) {
            id
            userId
            fullname
            image
            likeDate
            productId
            status
        }
    }
`;