import gql from 'graphql-tag';

export const queryproductTopicList = gql`
query($page: Int, $limit: Int, $id: Int) {
    productTopicList(
      page: $page, limit: $limit, id: $id
    ) {
      id
      name
      description
      imageIcon
      status
      createdAt
      updatedAt
      ownerId
      data {
        id
        name
        imageCover
        image
        description
        productCategory
        productType
        productTopicId
        moderator
        threadCount
        statusMe
        status
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
      }
    }
  }
`;