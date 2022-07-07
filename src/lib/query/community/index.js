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
    query(
        $initialCode: String
    ){
        joinCommunityMemberCheck(
            initialCode: $initialCode
        ){
            status
            message
        }
    }
`;

export const queryJoinCommunityUpdate = gql`
    query($joinCommunityId: Int!, $body: JoinCommunityInput!) {
        joinCommunityUpdate(joinCommunityId: $joinCommunityId, body: $body) {
            success
            message
        }
    }
`;