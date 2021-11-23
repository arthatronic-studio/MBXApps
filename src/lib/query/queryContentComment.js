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