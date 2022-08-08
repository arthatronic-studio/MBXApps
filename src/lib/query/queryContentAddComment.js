import gql from 'graphql-tag';

export const queryAddComment = gql`
    query(
        $comment: String
        $productId: Int
        $parentCommentId: Int
        $stream: String
        $image: String
        $commentQuoteId: Int
    ){
        contentAddComment(
            comment: $comment
            productId: $productId
            parentCommentId: $parentCommentId
            stream: $stream
            image: $image
            commentQuoteId: $commentQuoteId
        ) {
            id
            userId
            fullname
            current
            image
            comment
            isDirector
            commentDate
            productId
            parentCommentId
            imageVideo
            isPinned
            videoFilename
        }
    }
`;