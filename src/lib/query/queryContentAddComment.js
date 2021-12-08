import gql from 'graphql-tag';

export const queryAddComment = gql`
    query(
        $comment: String
        $productId: Int
        $stream: String
        $image: String
    ){
        contentAddComment(
            productId: $productId
            comment: $comment
            stream: $stream
            image: $image
        ) {
            id
            userId
            fullname
            image
            comment
            commentDate
            productId
            parentCommentId
            imageVideo
            videoFilename
        }
    }
`;