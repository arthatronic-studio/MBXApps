import gql from 'graphql-tag';

export const queryGetUserOrganizationRef = gql`
    query (
        $page: Int,
        $limit: Int,
        $name: String
      ) {
        getUserOrganizationRef(
          page: $page,
          limit: $limit,
          name: $name
      ) {
          userId
          userName
          firstName
          lastName
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
          idCardNumber
          idNumber
          isDirector
          image
          photoProfile
          birthDate
        }
    }
`;