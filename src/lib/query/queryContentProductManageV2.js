import gql from 'graphql-tag';

export const queryProductManageV2 = gql`
  mutation ($products: [ContentProductManageInputV2]) {
    contentProductManageV2(products: $products) {
      id
      code
      productName
      image
      unit
      price
      created_date
      updated_date
      status
      hasStock
      stock
      quantity
      videoFilename
      productDescription
      productType
      productCategory
      productSubCategory
      parentProductId
      like
      view
      director_like
      comment
      im_like
      iconLink
      share_link
      ownerId
      fullname
      avatar
      latitude
      longitude
      mainImage
      createdDate
      organizationId
      sendStatus
      eventDate
      publishDate
      commentCount
      commentUpdatedDate
      tag
      imageSource
    }
  }
`;
