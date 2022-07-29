import gql from 'graphql-tag';

export const queryproductGroupList = gql`
    query(
        $page: Int
        $limit: Int
        $id: Int
    ){
        productGroupList(
            page: $page
            limit: $limit
            id: $id
        ) {
            id
            name
            description
            status
        }
    }
`;