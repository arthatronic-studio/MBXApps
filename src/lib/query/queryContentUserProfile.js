import gql from 'graphql-tag';

export const queryContentUserProfile = gql`
    query(
        $userProfileId: Int
    ){
        contentUserProfile(
            userProfileId: $userProfileId
        ){
            userId
            userName
            firstName
            lastName
            email
            phoneCountryCode
            phoneNumber
            address
            city
            postalCode
            country
            organizationId
            organizationName
            userCode
            isDirector
            image
        }
    }
`;