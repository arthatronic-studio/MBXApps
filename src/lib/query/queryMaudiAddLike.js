import gql from 'graphql-tag';

export const queryMaudiAddLike = gql`
    query(
        $productId: Int
    ){
        maudiAddLike(
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