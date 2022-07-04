import gql from 'graphql-tag';

export const queryAddLike = gql`
    query(
        $productId: Int
        $status: Int
    ){
        contentAddLike(
            productId: $productId
            status: $status
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