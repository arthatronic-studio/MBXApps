import gql from 'graphql-tag';

export const queryCarTypeListing = gql`
    query($initialCode: String) {
        carTypeListing(initialCode: $initialCode) {
            id
            car_type_name
            initialCode
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