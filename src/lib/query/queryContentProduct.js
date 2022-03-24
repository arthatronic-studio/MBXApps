import gql from 'graphql-tag';

export const queryContentProduct = gql`
    query(
        $productCode: String
        $productName: String
        $page: Int
        $itemPerPage: Int
        $productType: ContentProductType
        $productCategory: ContentProductCategory
        $productSubCategory: ContentProductSubCategory
        $parentProductId: Int
    ){
        contentProduct(
            productCode: $productCode
            productName: $productName
            page: $page
            itemPerPage: $itemPerPage
            productType: $productType
            productCategory: $productCategory
            productSubCategory: $productSubCategory
            parentProductId: $parentProductId
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
            eventDate
        }
    }
`;