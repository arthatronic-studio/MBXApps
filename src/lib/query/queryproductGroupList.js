import gql from 'graphql-tag';

export const queryproductGroupList = gql`
    query($page: Int, $limit: Int, $id: Int) {
        productGroupList(page: $page, limit: $limit, id: $id) {
        id
        name
        imageCover
        image
        description
        productCategory
        productType
        productTopicId
        status
        moderator
        createdAt
        updatedAt
        memberModerator{
            userId
            fullname
            image
            status
            status_name
            type
        }
        member{
            userId
            fullname
            image
            status_name
            type
        }
        topic{
            id
            name
            description
            imageIcon
            status
            createdAt
            updatedAt
            ownerId
        }
        threadCount
        statusMe
        }
    }
`;