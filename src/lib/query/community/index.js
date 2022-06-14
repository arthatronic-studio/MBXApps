import gql from 'graphql-tag';

export const queryCarTypeListing = gql`
    query{
        carTypeListing{
            id
            car_type_name
        }
    }
`;

export const queryCommunityMemberCheck = gql`
    query{
        joinCommunityMemberCheck{
            status
            message
        }
    }
`;