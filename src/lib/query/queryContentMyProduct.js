import gql from 'graphql-tag';

export const queryContentMyProduct = gql`
    query(
        $productCode: String
        $productName: String
        $productType: ContentProductType
        $productCategory: ContentProductCategory
        $productSubCategory: ContentProductSubCategory
        $page: Int
        $itemPerPage: Int
    ){
        contentMyProduct(
            productCode: $productCode
            productName: $productName
            productType: $productType
            productCategory: $productCategory
            productSubCategory: $productSubCategory
            page: $page
            itemPerPage: $itemPerPage
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
            eventDate
        }
    }
`;