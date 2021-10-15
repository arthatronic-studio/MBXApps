import gql from 'graphql-tag';

export const queryMaudiLike = gql`
    query(
        $page: Int
        $itemPerPage: Int
        $productId: Int
    ){
        maudiLike(
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