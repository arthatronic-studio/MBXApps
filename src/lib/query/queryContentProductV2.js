import gql from 'graphql-tag';

export const queryContentProductV2 = gql`
  query (
    $productCode: String
    $productName: String
    $page: Int
    $itemPerPage: Int
    $productType: String
    $productCategory: String
    $productSubCategory: String
    $parentProductId: Int
    $timeRange: [String]
    $publishDate: String
    $orderBy: String
    $timeStart: String
  ) {
    contentProductv2(
      productCode: $productCode
      productName: $productName
      page: $page
      itemPerPage: $itemPerPage
      productType: $productType
      productCategory: $productCategory
      productSubCategory: $productSubCategory
      parentProductId: $parentProductId
      timeRange: $timeRange
      publishDate: $publishDate
      orderBy: $orderBy
      timeStart: $timeStart
    ) {
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
