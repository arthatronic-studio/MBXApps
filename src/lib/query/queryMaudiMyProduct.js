import gql from 'graphql-tag';

export const queryMaudiMyProduct = gql`
    query(
        $productCode: String
        $productName: String
        $page: Int
        $itemPerPage: Int
    ){
        maudiMyProduct(
            productCode: $productCode,
            productName: $productName,
            page: $page,
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
        }
    }
`;