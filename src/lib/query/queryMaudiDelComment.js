import gql from 'graphql-tag';

export const queryMaudiDelComment = gql`
    query(
        $id: Int
        $productId: Int
    ){
        maudiDelComment(
            id: $id
            productId: $productId
        ) {
            success
            message
        }
    }
`;