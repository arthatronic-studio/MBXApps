import gql from 'graphql-tag';

export const queryMaudiComment = gql`
    query(
        $page: Int
        $itemPerPage: Int
        $productId: Int
    ){
        maudiComment(
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