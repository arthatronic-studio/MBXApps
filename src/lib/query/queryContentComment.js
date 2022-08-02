import gql from 'graphql-tag';

export const queryComment = gql`
    query(
        $page: Int
        $itemPerPage: Int
        $productId: Int
    ){
        contentComment(
            page: $page
            itemPerPage: $itemPerPage
            productId: $productId
        ){
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
            status
            likeCount
            replies{
                id
                userId
                fullname
                commentDate
                comment
                isDirector
                isPinned
                status
                image
                parentCommentId
                imageVideo
                videoFilename
            }
            commentQuoteId
            commentQuote{
                id
                userId
                fullname
                commentDate
                comment
                isDirector
                isPinned
                status
                image
                image
                parentCommentId
                imageVideo
                videoFilename
                likeCount
                im_like
            }
            refCommentId
            im_like
        }
    }
`;