import gql from 'graphql-tag';

export const queryMaudiAddComment = gql`
    query(
        $comment: String
        $productId: Int
        $stream: String
        $image: String
    ){
        maudiAddComment(
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