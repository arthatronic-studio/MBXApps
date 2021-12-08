import gql from 'graphql-tag';

export const queryJoinCommunity = gql`
    query(
        $body: JoinCommunityInput!
    ) {
        joinCommunity(
            body: $body
        ) {
            id
            car_type
            car_color
            car_year
            car_identity
            reason
            chapter_id
            car_photo_main
            car_photo_front
            car_photo_side
            car_photo_back
            transaction_proof
            status
        }
    }
`;
