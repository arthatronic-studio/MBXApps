import gql from 'graphql-tag';

export const queryproductTopicList = gql`
    query(
  
        $page: Int
        $limit: Int,
        $id: Int
        
    ){
        productTopicList(
            page: $page
            limit: $limit
            id: $id
            
        ) {
            id
            name,
            description,
            imageIcon,
            status,
            ownerId
            data{
                id,
                name,
                image,
                imageCover,
                description,
                status,
                createdAt
            }
        }
    }
`;