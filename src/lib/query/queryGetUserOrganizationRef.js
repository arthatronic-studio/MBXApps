import gql from 'graphql-tag';

export const queryGetUserOrganizationRef = gql`
query(
  $page: Int
  $limit: Int
  $name: String
  $organizationId: Int
  $isAdmin: Boolean
) {
  getUserOrganizationRef(
    page: $page
    limit: $limit
    name: $name
    organizationId: $organizationId
    isAdmin: $isAdmin
  ) {
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
    idCardNumber
    idNumber
    isDirector
    image
    photoProfile
    birthDate
    blockedUsers
  }
}
`;