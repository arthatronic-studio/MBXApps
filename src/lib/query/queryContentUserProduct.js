import gql from 'graphql-tag';

export const queryContentUserProduct = gql`
query(
    $productCode: String
    $productName: String
    $userProfileId: Int
    $productType: ContentProductType
    $productCategory: ContentProductCategory
    $productSubCategory: ContentProductSubCategory
    $page: Int
    $itemPerPage: Int
){
    contentUserProduct(
        productCode: $productCode
        productName: $productName
        userProfileId: $userProfileId
        productType: $productType
        productCategory: $productCategory
        productSubCategory: $productSubCategory
        page: $page
        itemPerPage: $itemPerPage
    ){
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
        comment
        im_like
        iconLink
        share_link
        ownerId
        fullname
        avatar
    }
}
`;