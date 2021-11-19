import gql from 'graphql-tag';

export const queryGetChapterList = gql`
    query{
        getChapterList {
            id
            name
            community_id
            code      
        }
    }
`