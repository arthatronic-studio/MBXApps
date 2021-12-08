import gql from 'graphql-tag';

export const queryProductManage = gql`
    query(
        $products: [ContentProductManageInput]
    ) {
        contentProductManage(
            products: $products
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
        }
    }
`;