import gql from 'graphql-tag';

export const queryDelComment = gql`
    query(
        $id: Int
        $productId: Int
    ){
        contentDelComment(
            id: $id
            productId: $productId
        ) {
            success
            message
        }
    }
`;