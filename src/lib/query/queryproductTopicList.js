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
        status
        createdAt
        moderator
        createdAt
        updatedAt
        moderatorInfo{
            userId
            userName
            firstName
            lastName
            email
            phoneCountryCode
            phoneNumber
            address
            city
            postalCode
            country
            organizationId
            organizationName
            userCode
            idCardNumber
            idNumber
            isDirector
            image
            photoProfile
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