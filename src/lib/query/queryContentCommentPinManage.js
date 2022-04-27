import gql from 'graphql-tag';

export const queryContentCommentPinManage = gql`
    query(
        $commentId: Int
    ){
        contentCommentPinManage(
            commentId: $commentId
        ) {
            success
            message
        }
    }
`;