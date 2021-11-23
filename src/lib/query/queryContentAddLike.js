import gql from 'graphql-tag';

export const queryAddLike = gql`
    query(
        $productId: Int
    ){
        contentAddLike(
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